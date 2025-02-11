import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import { motion } from "framer-motion";

const Home = () => {
    const { keyword } = useParams();
    const { data, isLoading, isError } = useGetProductsQuery({ keyword });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {!keyword && <Header />}

            <main className="container mx-auto px-4 py-8">
                <section className="text-center mt-4 mb-12">
                    <h1 className="text-2xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        🔥 สินค้ายอดฮิต 🔥
                    </h1>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        ค้นพบสินค้าคุณภาพที่คัดสรรมาเพื่อคุณโดยเฉพาะ
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold rounded-full py-3 px-8 text-lg transition duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                        <span>Shop Now</span>
                        <svg 
                            className="w-5 h-5 ml-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                </section>

                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <Loader />
                    </div>
                ) : isError ? (
                    <div className="max-w-2xl mx-auto">
                        <Message variant="danger">
                            {isError?.data?.message || isError.error}
                        </Message>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
                    >
                        {data.products.map((product) => (
                            <motion.div
                                key={product._id}
                                variants={itemVariants}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <Product product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default Home;