import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import emailService from "../services/emailService.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import mongoose from 'mongoose';

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 0 ? 0 : 0;
  const taxRate = 0;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = parseFloat(
    (itemsPrice + shippingPrice + parseFloat(taxPrice)).toFixed(2)
  );

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce(
      (sum, order) => sum + parseFloat(order.totalPrice || 0),
      0
    );
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          paidAt: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log ข้อมูลที่ส่งมา
    const order = await Order.findById(req.params.id);

    if (order) {
      console.log("Order Found:", order); // Log คำสั่งซื้อที่พบ
      order.isPaid = true;
      order.paidAt = new Date();
      order.deliveryStatus = "กำลังเตรียม Order";

      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer?.email_address
      };

      const updatedOrder = await order.save();
      console.log("Updated Order:", updatedOrder); // Log คำสั่งซื้อที่อัปเดต
      res.status(200).json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    console.error("Error in markOrderAsPaid:", error); // Log error
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log('Received orderId:', orderId);

    if (!orderId || orderId === 'undefined') {
      res.status(400);
      throw new Error("ไม่พบ ID ของคำสั่งซื้อ");
    }

    // ตรวจสอบว่า ID ถูกต้องตามรูปแบบ MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.status(400);
      throw new Error("รูปแบบ ID ไม่ถูกต้อง");
    }

    const order = await Order.findById(orderId);
    
    if (!order) {
      res.status(404);
      throw new Error("ไม่พบคำสั่งซื้อ");
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.deliveryStatus = "จัดส่งสำเร็จ";

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "อัพเดทสถานะการจัดส่งสำเร็จ",
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error in markOrderAsDelivered:', error);
    res.status(error.status || 500).json({ 
      error: error.message,
      details: error.toString() 
    });
  }
});

// backend/controllers/orderController.js
const uploadPaymentProof = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("ไม่พบคำสั่งซื้อ");
  }

  // ตรวจสอบว่าอัปโหลดไฟล์มาหรือไม่
  if (!req.file) {
    res.status(400);
    throw new Error("กรุณาอัพโหลดไฟล์หลักฐานการชำระเงิน");
  }

  // ตรวจสอบนามสกุลไฟล์ว่าเป็นรูปภาพ
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    res.status(400);
    throw new Error("อนุญาตให้อัพโหลดเฉพาะไฟล์รูปภาพเท่านั้น (JPEG, PNG, JPG, WEBP)");
  }

  try {
    // สร้าง URL แบบเต็มรูปแบบ
    const proofUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    // อัพเดทข้อมูล order
    order.paymentProof = {
      url: proofUrl,
      uploadedAt: new Date()
    };
    
    // อัพเดทสถานะการชำระเงิน
    order.isPaid = true;
    order.paidAt = new Date();
    
    const updatedOrder = await order.save();

    res.status(200).json({
      message: "อัพโหลดหลักฐานการชำระเงินสำเร็จ",
      paymentProof: updatedOrder.paymentProof.url,
      uploadedAt: updatedOrder.paymentProof.uploadedAt,
      isPaid: updatedOrder.isPaid,
      paidAt: updatedOrder.paidAt
    });
  } catch (error) {
    // ลบไฟล์ที่อัพโหลดหากเกิดข้อผิดพลาด
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500);
    throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  }
});

// Payment status enum
const PaymentStatus = {
  PENDING: "รอชำระ",
  VERIFYING: "ระหว่างตรวจสอบ",
  COMPLETED: "ชำระเงินแล้ว",
  FAILED: "ชำระล้มเหลว"
};

// Delivery status enum
const DeliveryStatus = {
  PREPARING: "กำลังเตรียมของ",
  SHIPPING: "กำลังจัดส่ง",
  DELIVERED: "จัดส่งสำเร็จ",
  FAILED: "จัดส่งล้มเหลว"
};

// Update payment status
const updatePaymentStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
    }

    // Validate status
    if (!Object.values(PaymentStatus).includes(status)) {
      return res.status(400).json({ message: "สถานะการชำระเงินไม่ถูกต้อง" });
    }

    order.paymentStatus = status;

    // Update additional fields based on status
    if (status === PaymentStatus.COMPLETED) {
      order.isPaid = true;
      order.paidAt = new Date();
    } else if (status === PaymentStatus.FAILED) {
      order.isPaid = false;
      order.paidAt = null;
    }

    const updatedOrder = await order.save();
    res.status(200).json({
      success: true,
      message: "อัพเดตสถานะการชำระเงินสำเร็จ",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update delivery status
const updateDeliveryStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
    }

    // Validate status
    if (!Object.values(DeliveryStatus).includes(status)) {
      return res.status(400).json({ message: "สถานะการจัดส่งไม่ถูกต้อง" });
    }

    order.deliveryStatus = status;

    // Update additional fields based on status
    if (status === DeliveryStatus.DELIVERED) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    } else if (status === DeliveryStatus.FAILED) {
      order.isDelivered = false;
      order.deliveredAt = null;
    }

    const updatedOrder = await order.save();
    res.status(200).json({
      success: true,
      message: "อัพเดตสถานะการจัดส่งสำเร็จ",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status and send notification
const updateOrderStatusAndNotify = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "email username");

    if (!order) {
      res.status(404);
      throw new Error("ไม่พบคำสั่งซื้อ");
    }

    // อัพเดทสถานะการชำระเงิน
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentStatus = PaymentStatus.COMPLETED;
    order.deliveryStatus = DeliveryStatus.PREPARING;

    order.paymentResult = {
      id: req.body.transactionId || order._id,
      status: "completed",
      update_time: new Date().toISOString(),
      email_address: order.user.email
    };

    const updatedOrder = await order.save();

    // ส่งอีเมลแจ้งเตือน
    try {
      const emailData = {
        to: order.user.email,
        subject: "ยืนยันการสั่งซื้อสำเร็จ",
        template: "orderConfirmation", // template ที่จะใช้
        context: {
          orderNumber: order._id,
          username: order.user.username,
          totalAmount: order.totalPrice,
          items: order.orderItems.map(item => ({
            name: item.name,
            quantity: item.qty,
            price: item.price
          })),
          shippingAddress: order.shippingAddress
        }
      };

      await emailService.sendEmail(emailData);

      res.status(200).json({
        success: true,
        message: "อัพเดทสถานะและส่งอีเมลแจ้งเตือนสำเร็จ",
        order: updatedOrder
      });
    } catch (emailError) {
      // ถ้าส่งอีเมลไม่สำเร็จ จะยังคง return success แต่แจ้ง error ในการส่งอีเมล
      console.error("Error sending email:", emailError);
      res.status(200).json({
        success: true,
        message: "อัพเดทสถานะสำเร็จ แต่ไม่สามารถส่งอีเมลแจ้งเตือนได้",
        order: updatedOrder
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const sendOrderConfirmation = asyncHandler(async (req, res) => {
  try {
    console.log('Starting sendOrderConfirmation...');
    const order = await Order.findById(req.params.id).populate('user', 'email username');
    console.log('Order found:', order);

    if (!order) {
      console.log('Order not found');
      res.status(404);
      throw new Error('ไม่พบคำสั่งซื้อ');
    }

    const emailData = {
      to: order.user.email,
      subject: 'ยืนยันการสั่งซื้อสำเร็จ',
      template: 'orderConfirmation',
      context: {
        orderNumber: order._id,
        username: order.user.username,
        totalAmount: order.totalPrice,
        items: order.orderItems,
        shippingAddress: order.shippingAddress
      }
    };
    console.log('Email data prepared:', emailData);

    await emailService.sendEmail(emailData);
    console.log('Email sent successfully');

    order.emailSent = true;
    order.emailSentAt = new Date();
    await order.save();
    console.log('Order updated with email status');

    res.status(200).json({
      success: true,
      message: 'ส่งอีเมลยืนยันการสั่งซื้อสำเร็จ'
    });
  } catch (error) {
    console.error('Error in sendOrderConfirmation:', error);
    res.status(500).json({ success: false, error: 'ไม่สามารถส่งอีเมลยืนยันได้' });
  }
});

// backend/controllers/orderController.js
const deliveryStatuses = [
  { value: "pending", label: "รอจัดส่ง" },
  { value: "processing", label: "กำลังจัดส่ง" },
  { value: "delivered", label: "จัดส่งแล้ว" },
  { value: "cancelled", label: "ยกเลิก" }
];

const paymentStatuses = [
  { value: "pending", label: "รอชำระเงิน" },
  { value: "processing", label: "กำลังตรวจสอบ" },
  { value: "paid", label: "ชำระแล้ว" },
  { value: "failed", label: "การชำระเงินล้มเหลว" }
];

const updateStatus = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;
    const { type, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error("ไม่พบคำสั่งซื้อ");
    }

    // ตรวจสอบสถานะที่ส่งเข้ามา
    let isValidStatus = false;
    if (type === 'payment') {
      isValidStatus = paymentStatuses.some(s => s.value === status);
    } else if (type === 'delivery') {
      isValidStatus = deliveryStatuses.some(s => s.value === status);
    }

    if (!isValidStatus) {
      res.status(400);
      throw new Error("สถานะไม่ถูกต้อง");
    }

    // อัปเดตสถานะ
    if (type === 'payment') {
      order.paymentStatus = status;
      if (status === 'paid') {
        order.isPaid = true;
        order.paidAt = Date.now();
      } else if (status === 'failed') {
        order.isPaid = false;
        order.paidAt = null;
      }
    } else if (type === 'delivery') {
      order.deliveryStatus = status;
      if (status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      } else if (status === 'cancelled') {
        order.isDelivered = false;
        order.deliveredAt = null;
      }
    }

    const updatedOrder = await order.save();

    // เพิ่มการ populate ข้อมูลที่จำเป็น
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate('user', 'id username')
      .lean();  // ใช้ lean() เพื่อให้ได้ plain JavaScript object

    res.json({
      success: true,
      message: `อัพเดทสถานะ${type === 'payment' ? 'การชำระเงิน' : 'การจัดส่ง'}สำเร็จ`,
      order: populatedOrder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  uploadPaymentProof,
  updateOrderStatusAndNotify,
  updateDeliveryStatus,
  PaymentStatus,
  DeliveryStatus,
  updatePaymentStatus,
  sendOrderConfirmation,
  updateStatus,
};
