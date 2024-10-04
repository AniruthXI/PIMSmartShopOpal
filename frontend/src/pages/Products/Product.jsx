/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
    return (
        <div className="max-w-xs bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
                <HeartIcon product={product} className="absolute top-2 right-2"/>
            </div>
            <div className="p-4">
                <Link to={`/product/${product._id}`}>
                    <h2 className="text-lg font-semibold flex justify-between items-center mb-2">
                        <div>{product.name}</div>
                        <span className="bg-green-100 text-green-500 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                            ฿{product.price}
                        </span>
                    </h2>
                </Link>
                <div className="text-gray-700 text-sm">{product.description}</div>
            </div>
        </div>
    );
};

export default Product;
