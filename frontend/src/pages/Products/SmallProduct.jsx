/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
    return (
        <div className="w-[15rem] p-3 border rounded-lg shadow-md"> 
            <div className="relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-auto rounded"
                />
                <HeartIcon product={product} />
            </div>

            <div className="p-4">
                <Link to={`/product/${product._id}`}>
                    <h2 className="flex justify-between items-center">
                        <div>{product.name}</div>
                        <span className="bg-green-100 text-green-500 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                            ฿{product.price}
                        </span>
                    </h2>
                </Link>
            </div>
        </div>
    );
};

export default SmallProduct;
