import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
        toast.success("Item added successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
        });
    };

    const truncateName = (text, isName = true) => {
        let maxLength;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = "16px Arial";
    
        const width = window.innerWidth;
        
        if (width < 640) {
            maxLength = isName? 100: 150; 
        } else{
            maxLength = isName? 180: 250; 
        }
    
        // Check the visual length of the name
        let truncatedName = text;
        
        while (context.measureText(truncatedName).width > maxLength && truncatedName.length > 0) { // Change 200 to the maximum width you want
            truncatedName = truncatedName.substring(0, truncatedName.length - 1); // Remove the last character
        }
    
        // Add ellipsis if truncated
        return truncatedName.length < text.length ? truncatedName + "..." : text;
    };

    return (
        <div key={product._id} className="h-auto relative bg-[#1a1a1a] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-1 overflow-hidden">
            <section className="relative">
                <Link to={`/product/${product._id}`}>
                    <span className="absolute bottom-3 right-3 bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                        {product?.brand}
                    </span>
                    <img
                        className="cursor-pointer aspect-square object-cover w-full h-full"
                        src={product.image}
                        alt={product.name}
                    />
                </Link>
                <HeartIcon product={product} />
            </section>

            <div className="p-2 md:p-4 flex flex-col justify-between h-auto">
                <div className="flex justify-between">
                    <p className="text-sm md:text-lg dark:text-white">{truncateName(product?.name)}</p>
                    <p className="text-xs md:text-lg font-semibold text-green-500">
                        {product?.price?.toLocaleString("th-TH", {
                            style: "currency",
                            currency: "THB",
                        })}
                    </p>
                </div>

                <p className="text-xs font-normal text-[#CFCFCF]">
                    {truncateName(product?.description, false)}
                </p>

                <section className="flex justify-between items-center mt-2">
                    <Link
                        to={`/product/${product._id}`}
                        className="inline-flex items-center p-1 md:px-3 md:py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Read More
                        <svg
                            className="w-3.5 h-3.5 ml-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>
                    </Link>

                    <button
                        className="p-2 rounded-full"
                        onClick={() => addToCartHandler(product, 1)}
                    >
                        <AiOutlineShoppingCart size={25} className="text-green-500" />
                    </button>
                </section>
            </div>
        </div>
    );
};

export default ProductCard;
