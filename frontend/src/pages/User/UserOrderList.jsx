import React from "react";
import { Link } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrderList = () => {
    const { data: orders, isLoading, error,} = useGetMyOrdersQuery({}, {
        // เพิ่ม polling options
        pollingInterval: 5000, // refetch ทุก 5 วินาที
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    // Sort orders by date
    const sortedOrders = orders
        ? [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

    const PaymentStatusBadge = ({ status }) => {
        switch (status) {
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
            default:
                return (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        รอชำระเงิน
                    </span>
                );
        }
    };

    const DeliveryStatusBadge = ({ status }) => {
        switch (status) {
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
            default:
                return (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        กำลังจัดเตรียมสินค้า
                    </span>
                );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6">ประวัติการสั่งซื้อของฉัน</h2>

                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="danger">
                            {error?.data?.message || error.error}
                        </Message>
                    ) : sortedOrders.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">ยังไม่มีประวัติการสั่งซื้อ</p>
                        </div>
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
                                            วันที่สั่งซื้อ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ยอดรวม
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            สถานะการชำระเงิน
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            สถานะการจัดส่ง
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
                                                    {new Date(order.createdAt).toLocaleDateString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    ฿{order.totalPrice.toLocaleString()}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <PaymentStatusBadge status={order.paymentStatus} />
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <DeliveryStatusBadge status={order.deliveryStatus} />
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
        </div>
    );
};

export default UserOrderList;