/* eslint-disable no-unused-vars */
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
    const { data, isLoading, error } = useGetTopProductsQuery();

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <h1>ERROR</h1>;
    }

    return (
        <header className="flex justify-center py-2 w-full">
            <div className="w-full max-w-7xl px-2">
                <ProductCarousel />
            </div>
        </header>
    );
};

export default Header;
