/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
    const truncateName = (text, isName = true) => {
        let maxLength;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = "16px Arial";
    
        const width = window.innerWidth;
        
        if (width < 640) {
            maxLength = isName? 120: 240; 
        } else{
            maxLength = isName? 175: 350; 
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
        <div
            key={product._id}
            className="group bg-white border border-gray-300 shadow-lg rounded-lg p-2 sm:p-4 hover:shadow-xl transition-shadow duration-300">

            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
                <Link to={`/product/${product._id}`}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full" />
                </Link>
                <HeartIcon product={product} className="absolute z-20 cursor-pointer" />
            </div>

            {/* Text Section */}
            <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-base sm:text-sm text-gray-700">
                        <Link to={`/product/${product._id}`}>
                            {truncateName(product.name)}
                        </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{truncateName(product.description, false)}</p>
                </div>
                <p className="text-base sm:text-sm font-medium text-green-600">฿{product.price}</p>
            </div>
        </div>

    );
};

export default Product;
