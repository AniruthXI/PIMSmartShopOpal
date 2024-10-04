import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
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
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsQuery(productId);

    const { userInfo } = useSelector((state) => state.auth);

    const [createReview, { isLoading: loadingProductReview }] =
        useCreateReviewMutation();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await createReview({
                productId,
                rating,
                comment,
            }).unwrap();
            refetch();
            toast.success("Review created successfully");
        } catch (error) {
            toast.error(error?.data || error.message);
        }
    };

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate("/cart");
    };

    return (
        <>
            <div>
                <Link
                    to="/"
                    className="text-white font-semibold hover:underline ml-[10rem]"
                >
                    Go Back
                </Link>
            </div>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.message}
                </Message>
            ) : (
                <>
                    <div className="container flex flex-col items-center mt-[2rem] border border-gray-300 bg-white shadow-lg rounded-lg p-8 mx-auto max-w-screen-lg">
                        <div className="flex flex-col lg:flex-row items-center">
                            <div>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full xl:w-[32rem] lg:w-[25rem] md:w-[20rem] sm:w-[15rem] mb-4 lg:mb-0"
                                />

                                <HeartIcon product={product} />
                            </div>

                            <div className="flex flex-col justify-between lg:ml-8">
                                <h2 className="text-2xl font-semibold">{product.name}</h2>
                                <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
                                    {product.description}
                                </p>

                                <p className="text-5xl my-4 font-extrabold">฿ {product.price}</p>

                                <div className="flex flex-wrap items-start justify-between w-full">
                                    <div className="mr-8">
                                        <h1 className="flex items-center mb-6">
                                            <FaStore className="mr-2 text-white" /> Brand:{" "}
                                            {product.brand}
                                        </h1>
                                        <h1 className="flex items-center mb-6">
                                            <FaClock className="mr-2 text-white" /> Added:{" "}
                                            {moment(product.createAt).fromNow()}
                                        </h1>
                                        <h1 className="flex items-center mb-6">
                                            <FaStar className="mr-2 text-white" /> Reviews:{" "}
                                            {product.numReviews}
                                        </h1>
                                    </div>

                                    <div>
                                        <h1 className="flex items-center mb-6">
                                            <FaStar className="mr-2 text-white" /> Ratings: {rating}
                                        </h1>
                                        <h1 className="flex items-center mb-6">
                                            <FaShoppingCart className="mr-2 text-white" /> Quantity:{" "}
                                            {product.quantity}
                                        </h1>
                                        <h1 className="flex items-center mb-6">
                                            <FaBox className="mr-2 text-white" /> In Stock:{" "}
                                            {product.countInStock}
                                        </h1>
                                    </div>
                                </div>

                                <div className="flex justify-between flex-wrap mt-4">
                                    <Ratings
                                        value={product.rating}
                                        text={`${product.numReviews} reviews`}
                                    />

                                    {product.countInStock > 0 && (
                                        <div>
                                            <select
                                                value={qty}
                                                onChange={(e) => setQty(e.target.value)}
                                                className="p-2 w-[6rem] rounded-lg text-black"
                                            >
                                                {[...Array(product.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="btn-container mt-4">
                                    <button
                                        onClick={addToCartHandler}
                                        disabled={product.countInStock === 0}
                                        className="bg-green-600 text-white py-2 px-4 rounded-lg"
                                    >
                                        Add To Cart
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-[5rem] w-full">
                            <ProductTabs
                                loadingProductReview={loadingProductReview}
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
                </>
            )}
        </>
    );
};

export default ProductDetails;