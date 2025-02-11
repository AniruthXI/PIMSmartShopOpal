import nodemailer from "nodemailer";
import handlebars from "handlebars";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from 'url';

// ใช้เพื่อจำลอง __dirname ใน ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EmailService {
  constructor() {
    this.transporter = null;
  }

  // สร้างตัวส่งอีเมล
  createTransporter() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });
  }

  // โหลดไฟล์เทมเพลต HTML
  async loadTemplate(templateName) {
    const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.html`);
    console.log("Template path:", templatePath);  // ตรวจสอบ path

    try {
      const template = await fs.readFile(templatePath, 'utf-8');
      return handlebars.compile(template);
    } catch (error) {
      console.error(`❌ Failed to load template ${templateName}:`, error);
      return null;
    }
  }

  // ฟังก์ชันส่งอีเมลหลัก
  async sendEmail({ from, to, subject, template, context }) {
    try {
      this.createTransporter();
  
      // ใช้ EMAIL_USER เป็นค่าเริ่มต้นถ้า from ไม่มีค่า
      const senderEmail = from || process.env.EMAIL_USER;
  
      const compiledTemplate = await this.loadTemplate(template);
      if (!compiledTemplate) {
        throw new Error(`Template ${template} not found`);
      }
  
      const html = compiledTemplate(context, {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
      });
  
      const result = await this.transporter.sendMail({
        from: `${context.shopName} <${senderEmail}>`,  // ✅ แก้ไขตรงนี้
        to,
        subject,
        html,
        attachments: [
          {
            filename: 'pimlogo.png',
            path: path.join(__dirname, '..', 'templates', 'emails', 'pimlogo.png'),
            cid: 'logo_pim'
          }
        ]
      });

      console.log('✅ Email sent successfully to:', to);
      console.log('📤 Sender:', senderEmail);
      console.log('📥 Recipient:', to);

      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      return { success: false, error: error.message };
    }
  }

  // ส่งอีเมลยืนยันการสั่งซื้อ
  async sendOrderConfirmation(order, user) {
    const context = {
      orderNumber: order._id,
      orderDate: new Date(order.createdAt).toLocaleDateString('th-TH'),
      paidDate: order.paidAt ? new Date(order.paidAt).toLocaleDateString('th-TH') : null,
      shopName: user.username,
      username: user.username,
      totalPrice: order.totalPrice.toLocaleString('th-TH'),
      items: order.orderItems.map(item => ({
        name: item.name,
        quantity: item.qty,
        price: item.price.toLocaleString('th-TH'),
        total: (item.price * item.qty).toLocaleString('th-TH')
      })),
      shippingAddress: {
        name: order.shippingAddress.fullName,
        address: order.shippingAddress.address,
        phone: order.shippingAddress.phoneNumber
      },
      paymentMethod: order.paymentMethod
    };

    return this.sendEmail({
      from: user.email,
      to: order.user.email,
      subject: `[${user.username}] ยืนยันการสั่งซื้อ #${order._id}`,
      template: 'orderConfirmation',
      context
    });
  }

  // ส่งอีเมลอัพเดทสถานะการจัดส่ง
  async sendDeliveryUpdate(order, user) {
    const context = {
      orderNumber: order._id,
      shopName: user.username,
      username: order.user.username,
      status: order.deliveryStatus,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      shippingAddress: {
        name: order.shippingAddress.fullName,
        address: order.shippingAddress.address,
        phone: order.shippingAddress.phoneNumber
      }
    };

    return this.sendEmail({
      from: user.email,
      to: order.user.email,
      subject: `[${user.username}] อัพเดทสถานะการจัดส่ง #${order._id}`,
      template: 'deliveryUpdate',
      context
    });
  }

  // ส่งอีเมลยืนยันการชำระเงิน
  async sendPaymentConfirmation(order, user) {
    const context = {
      orderNumber: order._id,
      shopName: user.username,
      username: order.user.username,
      totalAmount: order.totalPrice.toLocaleString('th-TH'),
      paymentMethod: order.paymentMethod,
      paymentDate: new Date(order.paidAt).toLocaleDateString('th-TH'),
      transactionId: order.paymentResult?.id
    };

    return this.sendEmail({
      from: user.email,
      to: order.user.email,
      subject: `[${user.username}] ยืนยันการชำระเงิน #${order._id}`,
      template: 'paymentConfirmation',
      context
    });
  }
}

export default new EmailService();
