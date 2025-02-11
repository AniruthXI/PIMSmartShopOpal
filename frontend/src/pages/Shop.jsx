/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { AiOutlineFilter, AiOutlineClose, AiOutlineSearch } from "react-icons/ai";

import {
    setCategories,
    setProducts,
    setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import { motion, AnimatePresence } from "framer-motion";


const Shop = () => {
    const dispatch = useDispatch();
    const { categories, products, checked, radio } = useSelector(
        (state) => state.shop
    );
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const categoriesQuery = useFetchCategoriesQuery();
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [priceFilter, setPriceFilter] = useState("");
    const [nameFilter, setNameFilter] = useState(""); // State for product name filter
    const [showBrandsMenu, setShowBrandsMenu] = useState(false);
    const filteredProductsQuery = useGetFilteredProductsQuery({
        checked,
        radio,
    });

    useEffect(() => {
        if (!categoriesQuery.isLoading) {
            dispatch(setCategories(categoriesQuery.data));
        }
    }, [categoriesQuery.data, dispatch]);

    useEffect(() => {
        if (!filteredProductsQuery.isLoading) {
            const filteredProducts = filteredProductsQuery.data?.filter((product) => {
                const matchesPrice = (!priceRange.min || product.price >= Number(priceRange.min)) &&
                    (!priceRange.max || product.price <= Number(priceRange.max));
                const matchesName = product.name.toLowerCase().includes(nameFilter.toLowerCase());
                const matchesBrand = !selectedBrand || product.brand === selectedBrand;
                return matchesPrice && matchesName && matchesBrand;
            });
            dispatch(setProducts(filteredProducts || []));
        }
    }, [filteredProductsQuery.data, priceRange, nameFilter, selectedBrand, dispatch]);

    const handleBrandClick = (brand) => {
        const productsByBrand = filteredProductsQuery.data?.filter(
            (product) => product.brand === brand
        );
        dispatch(setProducts(productsByBrand));
    };

    // เพิ่มฟังก์ชัน handleCheck
    const handleCheck = (value, id) => {
        const updatedChecked = value
            ? [...checked, id]
            : checked.filter((c) => c !== id);
        dispatch(setChecked(updatedChecked));
    };


    const uniqueBrands = [
        ...Array.from(
            new Set(
                filteredProductsQuery.data
                    ?.map((product) => product.brand)
                    .filter((brand) => brand !== undefined)
            )
        ),
    ];

    const handlePriceChange = (e) => {
        setPriceFilter(e.target.value);
    };

    const handleNameChange = (e) => {
        setNameFilter(e.target.value);
    };

    const toggleFilterClick = () => {
        setIsOpenFilter(!isOpenFilter)
    }

    const handleReset = () => {
        setPriceRange({ min: "", max: "" });
        setNameFilter("");
        setSelectedBrand(null);
        dispatch(setChecked([]));
        window.location.reload();
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Filter */}
                    <AnimatePresence>
                        {(isOpenFilter || window.innerWidth >= 768) && (
                            <motion.div
                                initial={{ x: -300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                className={`bg-white rounded-xl shadow-lg p-6 md:w-80 ${isOpenFilter ? "fixed inset-0 z-50 m-4 overflow-y-auto" : "md:sticky md:top-4"
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Filters</h2>
                                    {isOpenFilter && (
                                        <button
                                            onClick={() => setIsOpenFilter(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full"
                                        >
                                            <AiOutlineClose size={24} />
                                        </button>
                                    )}
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">Categories</h3>
                                    <div className="space-y-2">
                                        {categories?.map((c) => (
                                            <label key={c._id} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={checked.includes(c._id)}
                                                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                                />
                                                <span className="text-gray-700">{c.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Brand Filter */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">Brands</h3>
                                    <div className="space-y-2">
                                        {uniqueBrands.map((brand) => (
                                            <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    checked={selectedBrand === brand}
                                                    onChange={() => setSelectedBrand(brand)}
                                                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                                                />
                                                <span className="text-gray-700">{brand}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">Price Range</h3>
                                    <div className="flex space-x-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-black"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-black"
                                        />
                                    </div>
                                </div>

                                {/* Search */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">Search Products</h3>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search by name..."
                                            value={nameFilter}
                                            onChange={(e) => setNameFilter(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-black"
                                        />
                                        <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    </div>
                                </div>

                                {/* Reset Button */}
                                <button
                                    onClick={handleReset}
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
                                >
                                    Reset Filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Products ({products?.length})</h2>
                            <button
                                onClick={() => setIsOpenFilter(!isOpenFilter)}
                                className="md:hidden p-2 bg-green-600 text-white rounded-full shadow-lg"
                            >
                                <AiOutlineFilter size={24} />
                            </button>
                        </div>

                        {filteredProductsQuery.isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader />
                            </div>
                        ) : (
                            <motion.div
                                layout
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {products?.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Shop;
