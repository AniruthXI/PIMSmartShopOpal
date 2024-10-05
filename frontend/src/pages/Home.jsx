import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
    const { keyword } = useParams();
    const { data, isLoading, isError } = useGetProductsQuery({ keyword });

    if (data) {
        console.log("Products data:", data.products); // ตรวจสอบข้อมูลที่ถูกดึงมา
    }

    return (
        <>
            {!keyword && (
                <Header />
            )}

            <div className="text-center mt-8">
                <h2 className="text-xl sm:text-4xl font-bold mb-4">🔥 สินค้ายอดฮิต 🔥</h2>
                <Link
                    to="/shop"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-full py-2 px-6 text-lg mb-8 transition duration-300"
                >
                    Shop Now
                </Link>
            </div>

            {isLoading ? (
                <Loader />
            ) : isError ? (
                <Message variant="danger">
                    {isError?.data.message || isError.error}
                </Message>
            ) : (
                <div className="container max-w-screen-xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                        {data.products.map((product) => (
                                <Product product={product} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;
