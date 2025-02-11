import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <ProgressSteps step1 step2 step3 />

        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          {cart.cartItems.length === 0 ? (
            <div className="p-4">
              <Message>ไม่มีสินค้าในตะกร้า</Message>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">รายการสินค้า</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">รูปภาพ</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">สินค้า</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">จำนวน</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ราคา</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">รวม</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {cart.cartItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/product/${item.product}`} className="text-green-600 hover:text-green-800">
                            {item.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{item.qty}</td>
                        <td className="px-4 py-3">฿{item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 font-medium">฿{(item.qty * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">ที่อยู่จัดส่ง</h3>
                    <p className="text-gray-700">
                      {cart.shippingAddress.address && (
                        <>
                          {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                          {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </>
                      )}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">วิธีการชำระเงิน</h3>
                    <p className="text-gray-700">QR PromptPay</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">สรุปคำสั่งซื้อ</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>ราคาสินค้า</span>
                      <span>฿{cart.itemsPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ค่าจัดส่ง</span>
                      <span>฿{cart.shippingPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT 7%</span>
                      <span>฿{cart.taxPrice}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-3 border-t">
                      <span>ยอดรวมทั้งหมด</span>
                      <span>฿{cart.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4">
                  <Message variant="danger">{error.data.message}</Message>
                </div>
              )}

              <button
                type="button"
                className="mt-8 w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                disabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                ยืนยันการสั่งซื้อ
              </button>
            </div>
          )}
        </div>

        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default PlaceOrder;