/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import * as QRCode from "qrcode.react";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useUploadPaymentProofMutation,
  useSendOrderConfirmationEmailMutation,
  useUpdateOrderStatusMutation,
} from "../../redux/api/orderApiSlice";
import PaymentSuccessPopup from './PaymentSuccessPopup'
import { log } from "handlebars";


const Order = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId, {
    // เพิ่ม options สำหรับ polling
    pollingInterval: 5000, // refetch ทุก 5 วินาที
    refetchOnMountOrArgChange: true, // refetch เมื่อ component mount หรือ orderId เปลี่ยน
    refetchOnFocus: true, // refetch เมื่อ user กลับมาที่แท็บนี้
  });

  useEffect(() => {
    if (orderId) {
      refetch();
    }
  }, [orderId, refetch]);

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [uploadPaymentProof, { isLoading: loadingUpload }] = useUploadPaymentProofMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [paymentProof, setPaymentProof] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDeliveryConfirm, setShowDeliveryConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [sendOrderConfirmationEmail] = useSendOrderConfirmationEmailMutation();

  console.log('Current orderId from params:', orderId);


  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // ตรวจสอบว่ามีไฟล์ถูกเลือกหรือไม่
    if (!file) return;

    // ตรวจสอบขนาดไฟล์
    if (file.size > 2 * 1024 * 1024) {
      toast.error("ขนาดไฟล์เกิน 2MB กรุณาเลือกไฟล์ใหม่");
      e.target.value = ''; // reset input
      return;
    }

    // ตรวจสอบประเภทไฟล์ที่อนุญาต
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("กรุณาอัพโหลดเฉพาะไฟล์รูปภาพ (JPEG, PNG, JPG, WEBP)");
      e.target.value = ''; // reset input
      return;
    }

    setPaymentProof(file);
  };

  const sendConfirmationEmail = async (orderData) => {
    try {
      await sendOrderConfirmationEmail({
        email: orderData.user.email,
        orderId: orderData._id,
        totalPrice: orderData.totalPrice,
        items: orderData.orderItems,
      }).unwrap();
      console.log('Confirmation email sent successfully');
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      toast.error('ไม่สามารถส่งอีเมลยืนยันการสั่งซื้อได้');
    }
  };

  const handleUpload = async () => {
    if (!paymentProof || !orderId) {
      toast.error("กรุณาอัพโหลดหลักฐานการชำระเงินและตรวจสอบ orderId");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('paymentProof', paymentProof);

      // อัปโหลดและรับ response
      const response = await uploadPaymentProof({
        orderId,
        formData,
      }).unwrap();

      // รีเฟรชข้อมูล order เพื่อให้ได้ URL ของ paymentProof ที่อัปเดตแล้ว
      await refetch();

      setPaymentProof(null);
      setShowSuccessPopup(true);
      toast.success("อัพโหลดหลักฐานการชำระเงินสำเร็จ");
      sendConfirmationEmail(order);

      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error in handleUpload:', error);
      toast.error(error?.data?.message || 'เกิดข้อผิดพลาดในการอัพโหลด');
    }
  };



  const deliverHandler = async () => {
    try {
      if (!orderId) {
        console.error('OrderId is missing');
        toast.error('ไม่พบ Order ID');
        return;
      }

      console.log('Delivering order with ID:', orderId);

      // แก้ไข status ให้ตรงกับ backend
      const result = await updateOrderStatus({
        orderId: orderId,
        type: "delivery",
        status: "delivered"  // ใช้ค่าที่ backend รองรับ
      }).unwrap();

      console.log('Delivery result:', result);

      const updatedData = await refetch();
      console.log('Updated orders after refetch:', updatedData);

      toast.success("จัดส่งสินค้าเรียบร้อยแล้ว");
      setShowDeliveryConfirm(false);

    } catch (error) {
      console.error('Full error object:', error);
      const errorMessage =
        error?.data?.message ||
        error?.data?.error ||
        'เกิดข้อผิดพลาดในการอัพเดทสถานะการจัดส่ง';

      toast.error(errorMessage);
    }
  };

  // เพิ่มการตรวจสอบ URL ก่อนแสดง Modal
  const handleShowProof = () => {
    console.log('Payment Proof URL:', order.paymentProof);
    if (!order.paymentProof) {
      toast.error('ไม่พบหลักฐานการชำระเงิน');
      return;
    }
    setShowProofModal(true);
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || error.message}</Message>;

  console.log('Order data:', order);
  console.log('isPaid:', order?.isPaid);
  console.log('paymentProof:', order?.paymentProof);
  console.log('deliver status', order?.deliveryStatus);
  console.log('isDeliver', order?.isDelivered);


  console.log(order.user.email);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ส่วนแสดงรายการสินค้า */}
        <div className="lg:w-2/3">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {order.orderItems.length === 0 ? (
              <Message>ไม่มีรายการสินค้า</Message>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">รูปภาพ</th>
                      <th className="px-6 py-3 text-left">สินค้า</th>
                      <th className="px-6 py-3 text-center">จำนวน</th>
                      <th className="px-6 py-3 text-right">ราคาต่อชิ้น</th>
                      <th className="px-6 py-3 text-right">รวม</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.orderItems.map((item, index) => (
                      <tr key={item._id || index}>
                        <td className="px-6 py-4">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/product/${item.product}`} className="text-blue-600 hover:underline">
                            {item.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-center">{item.qty}</td>
                        <td className="px-6 py-4 text-right">฿{item.price}</td>
                        <td className="px-6 py-4 text-right">฿{(item.qty * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ส่วนสรุปคำสั่งซื้อ */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">สรุปคำสั่งซื้อ</h2>

            {/* สถานะการชำระเงิน */}
            <div className="mb-6">
              <div className={`p-3 rounded-lg ${order.paymentStatus ? 'bg-green-100' : 'bg-yellow-100'} mb-2`}>
                <p>
                  สถานะการชำระเงิน: {order.paymentStatus === 'paid'
                    ? `ชำระเงินสำเร็จเมื่อ ${new Date(order.paidAt).toLocaleDateString('th-TH')}`
                    : order.paymentStatus === 'failed'
                      ? 'การชำระเงินล้มเหลว'
                      : 'รอการชำระเงิน'}
                </p>
                {/* เพิ่มปุ่มดูหลักฐานการชำระเงิน */}
                {order.paymentProof?.url && ( // เช็ค url property
                  <button
                    onClick={() => setShowProofModal(true)}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    ดูหลักฐานการชำระเงิน
                  </button>
                )}
              </div>


              {/* สถานะการจัดส่ง */}
              <div className={`p-3 rounded-lg ${order.deliveryStatus === 'delivered' ? 'bg-green-100' :
                order.deliveryStatus === 'processing' ? 'bg-blue-100' :
                  'bg-yellow-100'
                }`}>
                <p>
                  สถานะการจัดส่ง: {order.deliveryStatus === 'delivered'
                    ? 'จัดส่งสำเร็จ'
                    : order.deliveryStatus === 'processing'
                      ? 'กำลังจัดส่ง'
                      : 'รอจัดส่ง'}
                </p>
                {order.deliveredAt && (
                  <p>อัพเดตล่าสุด: {new Date(order.deliveredAt).toLocaleDateString('th-TH')}</p>
                )}
              </div>
            </div>

            {/* รายละเอียดราคา */}
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>ราคาสินค้า:</span>
                <span>฿{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>ค่าจัดส่ง:</span>
                <span>฿{order.shippingPrice}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>ภาษี:</span>
                <span>฿{order.taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>ยอดรวมทั้งสิ้น:</span>
                <span>฿{order.totalPrice}</span>
              </div>
            </div>

            {!order.isPaid && (
              <>
                <button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg mb-4"
                  onClick={() => setShowQRModal(true)}
                >
                  แสดง QR Code การชำระเงิน
                </button>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">อัพโหลดหลักฐานการชำระเงิน</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {paymentProof ? paymentProof.name : 'คลิกเพื่ออัพโหลดหลักฐานการชำระเงิน'}
                        </span>
                      </div>
                    </label>
                  </div>
                  <button
                    type="button"
                    className={`w-full py-2 rounded-lg ${loadingUpload || !paymentProof
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-pink-500 hover:bg-pink-600'
                      } text-white flex items-center justify-center`}
                    onClick={handleUpload}
                    disabled={loadingUpload || !paymentProof}
                  >
                    {loadingUpload ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        กำลังอัพโหลด...
                      </>
                    ) : (
                      "อัพโหลดหลักฐานการชำระเงิน"
                    )}
                  </button>
                </div>
              </>
            )}

            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                type="button"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg mt-4"
                onClick={() => setShowDeliveryConfirm(true)}
              >
                ยืนยันการจัดส่งสินค้า
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {
        showQRModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">สแกน QR Code เพื่อชำระเงิน</h3>
              <img
                src="https://shorturl.asia/WXmAl"
                alt="Payment QR Code"
                className="mx-auto w-full max-w-xs"
              />
              <button
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg mt-4"
                onClick={() => setShowQRModal(false)}
              >
                ปิด
              </button>
            </div>
          </div>
        )
      }

      {
        showDeliveryConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">ยืนยันการจัดส่ง</h3>
              <p className="mb-4">คุณต้องการยืนยันการจัดส่งสินค้าใช่หรือไม่?</p>
              <div className="flex gap-4">
                <button
                  className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
                  onClick={() => setShowDeliveryConfirm(false)}
                >
                  ยกเลิก
                </button>
                <button
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                  onClick={deliverHandler}
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Modal สำหรับแสดงหลักฐานการชำระเงิน */}
      {showProofModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">หลักฐานการชำระเงิน</h3>
            {console.log('Payment Proof URL:', order.paymentProof)}
            {order.paymentProof?.url ? ( // เปลี่ยนเป็น order.paymentProof.url
              <img
                src={order.paymentProof.url} // ใช้ .url เพื่อเข้าถึง URL จริง
                alt="หลักฐานการชำระเงิน"
                className="mx-auto w-full max-w-xs"
                onError={(e) => {
                  console.error('Image load error:', e);
                  toast.error('ไม่สามารถโหลดรูปภาพได้');
                }}
              />
            ) : (
              <p className="text-center text-gray-500">ไม่พบรูปภาพหลักฐานการชำระเงิน</p>
            )}
            <button
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg mt-4"
              onClick={() => setShowProofModal(false)}
            >
              ปิด
            </button>
          </div>
        </div>
      )}



      {/* PaymentSuccessPopup */}
      <PaymentSuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        orderNumber={orderId}
        totalAmount={order?.totalPrice}
        email={order?.user?.email}
      />
    </div >
  );
};

export default Order;
