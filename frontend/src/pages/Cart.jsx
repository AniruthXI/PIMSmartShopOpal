import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate("/login?redirect=/shipping");
    };

    return (
        <div className="container flex justify-around items-start flex-wrap mx-auto mt-8">
            {cartItems.length === 0 ? (
                <div>
                    Your cart is empty <Link to="/shop" className="text-blue-500">Go To Shop</Link>
                </div>
            ) : (
                <div className="flex flex-col w-full md:w-4/5">
                    <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

                    {cartItems.map((item) => (
                        <div key={item._id} className="flex items-center mb-4 pb-2 border border-gray-300 shadow-lg p-4 rounded-lg">
                            <div className="w-20 h-20">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>

                            <div className="flex-1 ml-4">
                                <Link to={`/product/${item._id}`} className="text-green-500">
                                    {item.name}
                                </Link>

                                <div className="mt-2">{item.brand}</div>
                                <div className="mt-2 font-bold">
                                    ฿ {item.price}
                                </div>
                            </div>

                            <div className="w-24">
                                <select
                                    className="w-full p-1 border rounded"
                                    value={item.qty}
                                    onChange={(e) =>
                                        addToCartHandler(item, Number(e.target.value))
                                    }
                                >
                                    {[...Array(item.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="ml-4">
                                <button
                                    className="text-red-500"
                                    onClick={() => removeFromCartHandler(item._id)}
                                    aria-label={`Remove ${item.name} from cart`}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="mt-8 w-full md:w-1/2 lg:w-1/3 mx-auto">
                        <div className="p-4 rounded-lg border border-gray-300 shadow-lg">
                            <h2 className="text-xl font-semibold mb-2">
                                Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                            </h2>

                            <div className="text-2xl font-bold">
                                ฿ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                            </div>

                            <button
                                className="bg-green-500 mt-4 py-2 px-4 rounded-full text-lg w-full text-white"
                                disabled={cartItems.length === 0}
                                onClick={checkoutHandler}
                            >
                                Proceed To Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
