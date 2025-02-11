import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
    useGetProductDetailsQuery,
    useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
    FaBox,
    FaClock,
    FaShoppingCart,
    FaStar,
    FaStore,
    FaArrowLeft,
    FaShare
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogAction, AlertDialogTitle } from '../../components/alert-dialog';
import AddToCartButton from './addToCartButton';

const ProductDetails = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [activeImage, setActiveImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsQuery(productId);

    const { userInfo } = useSelector((state) => state.auth);

    const [createReview] = useCreateReviewMutation();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await createReview({
                productId,
                rating,
                comment,
            }).unwrap();
            refetch();
            toast.success("รีวิวถูกเพิ่มเรียบร้อยแล้ว");
            setRating(0);
            setComment("");
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    };

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, qty }));
        toast.success(`เพิ่ม "${product.name}" ลงในตะกร้าแล้ว`);
        navigate("/cart");
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("คัดลอกลิงก์แล้ว");
        }
    };

    if (isLoading) return <Loader />;
    if (error) return <Message variant="danger">{error?.data?.message || error.message}</Message>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" />
                        <span>กลับไปหน้าหลัก</span>
                    </Link>

                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Product Images */}
                            <div className="space-y-4">
                                <div className="relative overflow-hidden rounded-lg bg-gray-100">
                                    <motion.img
                                        src={product.image}
                                        alt={product.name}
                                        className={`w-full h-[400px] object-cover cursor-zoom-in transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'
                                            }`}
                                        onClick={() => setIsZoomed(!isZoomed)}
                                        onMouseMove={(e) => {
                                            if (isZoomed) {
                                                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                                                const x = (e.clientX - left) / width * 100;
                                                const y = (e.clientY - top) / height * 100;
                                                e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleShare}
                                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                    >
                                        <FaShare className="text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                        {product.name}
                                    </h1>
                                    <Ratings
                                        value={product.rating}
                                        text={`${product.numReviews} รีวิว`}
                                    />
                                </div>

                                <div className="border-t border-b py-4">
                                    <div className="text-4xl font-bold text-green-600">
                                        ฿{product.price.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {product.countInStock > 0 ? 'มีสินค้า' : 'สินค้าหมด'}
                                    </div>
                                </div>

                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-600">
                                            <FaStore className="mr-2" />
                                            <span>แบรนด์: {product.brand}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <FaBox className="mr-2" />
                                            <span>คงเหลือ: {product.countInStock}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-600">
                                            <FaClock className="mr-2" />
                                            <span>เพิ่มเมื่อ: {moment(product.createdAt).fromNow()}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <FaStar className="mr-2" />
                                            <span>คะแนน: {product.rating}/5</span>
                                        </div>
                                    </div>
                                </div>

                                {product.countInStock > 0 && (
                                    <div className="flex items-center space-x-4">
                                        <select
                                            value={qty}
                                            onChange={(e) => setQty(Number(e.target.value))}
                                            className="p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500"
                                        >
                                            {[...Array(product.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </select>
                                        <AddToCartButton
                                            product={product}
                                            qty={qty}
                                            dispatch={dispatch}
                                            addToCart={addToCart}
                                            navigate={navigate}
                                        />
                                        <HeartIcon product={product} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Tabs */}
                        <div className="mt-12">
                            <ProductTabs
                                userInfo={userInfo}
                                submitHandler={submitHandler}
                                rating={rating}
                                setRating={setRating}
                                comment={comment}
                                setComment={setComment}
                                product={product}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetails;