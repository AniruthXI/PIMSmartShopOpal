import { useState } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery, useDeliverOrderMutation, useUpdatePaymentStatusMutation } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";

const OrderList = () => {
    const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
    const [deliverOrder] = useDeliverOrderMutation();
    const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [modalType, setModalType] = useState("");

    // Sort orders by date
    const sortedOrders = orders
        ? [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

    const handleStatusUpdate = async () => {
        try {
            const payload = {
                orderId: selectedOrder._id,
                status: selectedStatus
            };

            let result;
            if (modalType === "delivery") {
                result = await deliverOrder(payload).unwrap();
            } else {
                result = await updatePaymentStatus(payload).unwrap();
            }

            // Update the local state immediately
            const updatedOrders = orders.map(order => {
                if (order._id === selectedOrder._id) {
                    return {
                        ...order,
                        [modalType === "delivery" ? "deliveryStatus" : "paymentStatus"]: selectedStatus,
                        // Update isPaid and isDelivered based on status
                        isPaid: modalType === "payment" ? selectedStatus === "paid" : order.isPaid,
                        isDelivered: modalType === "delivery" ? selectedStatus === "delivered" : order.isDelivered
                    };
                }
                return order;
            });

            // Force a refetch to ensure sync with backend
            await refetch();

            setShowStatusModal(false);
            toast.success(`อัพเดตสถานะ${modalType === "delivery" ? "การจัดส่ง" : "การชำระเงิน"}เรียบร้อย`);
        } catch (err) {
            console.error("Error updating status:", err);
            toast.error(err?.data?.message || err.error);
        }
    };

    const openStatusModal = (order, type) => {
        setSelectedOrder(order);
        setModalType(type);
        setSelectedStatus(type === "delivery" ? order.deliveryStatus : order.paymentStatus);
        setShowStatusModal(true);
    };

    // Status options remain the same
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

    // Status badge logic updated to handle both status types correctly
    const getStatusBadge = (status, type) => {
        const colors = {
            pending: "yellow",
            processing: "blue",
            delivered: "green",
            paid: "green",
            failed: "red",
            cancelled: "red"
        };

        const color = colors[status] || "gray";

        return (
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${color}-100 text-${color}-800`}>
                {type === "delivery"
                    ? deliveryStatuses.find(s => s.value === status)?.label
                    : paymentStatuses.find(s => s.value === status)?.label
                }
            </span>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6">รายการคำสั่งซื้อทั้งหมด</h2>

                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="danger">
                            {error?.data?.message || error.error}
                        </Message>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            สินค้า
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            รหัสคำสั่งซื้อ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ผู้สั่งซื้อ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            วันที่สั่งซื้อ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ยอดรวม
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ชำระเงิน
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            จัดส่ง
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ดำเนินการ
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img
                                                        src={order.orderItems[0].image}
                                                        alt={order._id}
                                                        className="h-16 w-16 object-cover rounded"
                                                    />
                                                    {order.orderItems.length > 1 && (
                                                        <span className="ml-2 text-sm text-gray-500">
                                                            +{order.orderItems.length - 1} รายการ
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{order._id}</div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {order.user ? order.user.username : "N/A"}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {order.createdAt
                                                        ? new Date(order.createdAt).toLocaleDateString('th-TH', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })
                                                        : "N/A"}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    ฿{order.totalPrice.toLocaleString()}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {(() => {
                                                        // เลือกสีและข้อความตาม paymentStatus
                                                        switch (order.paymentStatus) {
                                                            case 'paid':
                                                                return (
                                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                        ชำระแล้ว
                                                                    </span>
                                                                );
                                                            case 'processing':
                                                                return (
                                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                        กำลังตรวจสอบ
                                                                    </span>
                                                                );
                                                            case 'failed':
                                                                return (
                                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                        การชำระเงินล้มเหลว
                                                                    </span>
                                                                );
                                                            default: // case 'pending'
                                                                return (
                                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                    ชำระแล้ว
                                                                </span>
                                                                );
                                                        }
                                                    })()}
                                                    <button
                                                        onClick={() => openStatusModal(order, "payment")}
                                                        className="text-sm text-blue-600 hover:text-blue-900"
                                                    >
                                                        แก้ไข
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {(() => {
                                                        // เลือกสีและข้อความตาม deliveryStatus
                                                        switch (order.deliveryStatus) {
                                                            case 'delivered':
                                                                return (
                                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                        จัดส่งแล้ว
                                                                    </span>
                                                                );
                                                            case 'processing':
                                                                return (
                                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                        กำลังจัดส่ง
                                                                    </span>
                                                                );
                                                            case 'cancelled':
                                                                return (
                                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                        ยกเลิก
                                                                    </span>
                                                                );
                                                            default: // case 'pending'
                                                                return (
                                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                                        กำลังจัดเตรียมสินค้า
                                                                    </span>
                                                                );
                                                        }
                                                    })()}
                                                    <button
                                                        onClick={() => openStatusModal(order, "delivery")}
                                                        className="text-sm text-blue-600 hover:text-blue-900"
                                                    >
                                                        แก้ไข
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    to={`/order/${order._id}`}
                                                    className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                                                >
                                                    ดูรายละเอียด
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            {showStatusModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-md w-80">
                        <h3 className="text-lg font-bold mb-4 text-center">แก้ไขสถานะ {modalType === "delivery" ? "การจัดส่ง" : "การชำระเงิน"}</h3>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="border p-2 rounded w-full"
                        >
                            {(modalType === "delivery" ? deliveryStatuses : paymentStatuses).map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setShowStatusModal(false)}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleStatusUpdate}
                            >
                                ยืนยัน
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;