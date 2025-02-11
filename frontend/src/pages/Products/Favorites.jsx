import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";
import { Heart } from "lucide-react";

const Favorites = () => {
    const favorites = useSelector(selectFavoriteProduct);

    if (favorites.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <div className="text-center">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">ยังไม่มีสินค้าที่ชื่นชอบ</h2>
                    <p className="text-gray-500">เมื่อคุณเพิ่มสินค้าที่ชื่นชอบ สินค้าจะปรากฏที่นี่</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    สินค้าที่ชื่นชอบ ({favorites.length})
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((product) => (
                    <Product key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Favorites;