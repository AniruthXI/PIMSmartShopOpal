/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { ToastContainer, toast } from "react-toastify"; // นำเข้า Toastify
import "react-toastify/dist/ReactToastify.css"; // นำเข้า CSS สำหรับ Toastify

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    // ฟังก์ชันเพิ่มสินค้าในตะกร้าพร้อมแสดงแจ้งเตือน
    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
        toast.success(`เพิ่มสินค้า "${product.name}" ลงในตะกร้าแล้ว!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
        toast.info("ลบสินค้าออกจากตะกร้าแล้ว!", {
            position: "top-right",
            autoClose: 3000,
        });
    };
    const checkoutHandler = () => {
        navigate("/login?redirect=/shipping");
    };

    return (
        <div className="container flex justify-around items-start flex-wrap mx-auto mt-8">
            {cartItems.length === 0 ? (
                <div>
                    ตะกร้าของคุณว่างเปล่า <Link to="/shop" className="text-blue-500">ไปที่ร้านค้า</Link>
                </div>
            ) : (
                <div className="flex flex-col w-full md:w-4/5">
                    <h1 className="text-2xl font-semibold mb-4">ตะกร้าสินค้า</h1>
    
                    {cartItems.map((item) => (
                        <div key={item._id} className="flex justify-between items-center border-b py-4">
                            <div className="flex items-center">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover mr-4" />
                                <div>
                                    <h2 className="text-lg font-medium">{item.name}</h2>
                                    <p className="text-gray-600">ราคา: ฿{item.price}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={() => removeFromCartHandler(item._id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
    
                    <button
                        onClick={checkoutHandler}
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        ดำเนินการชำระเงิน
                    </button>
                </div>
            )}
        </div>
    );
}    

export default Cart;
