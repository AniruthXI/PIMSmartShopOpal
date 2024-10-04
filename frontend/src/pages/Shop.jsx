import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
    setCategories,
    setProducts,
    setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
    const dispatch = useDispatch();
    const { categories, products, checked, radio } = useSelector(
        (state) => state.shop
    );

    const categoriesQuery = useFetchCategoriesQuery();
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
        if (!checked.length || !radio.length) {
            if (!filteredProductsQuery.isLoading) {
                const filteredProducts = filteredProductsQuery.data.filter(
                    (product) => {
                        const matchesPrice = product.price.toString().includes(priceFilter) ||
                            product.price === parseInt(priceFilter, 10);
                        const matchesName = product.name.toLowerCase().includes(nameFilter.toLowerCase());
                        return matchesPrice && matchesName;
                    }
                );

                dispatch(setProducts(filteredProducts));
            }
        }
    }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter, nameFilter]);

    const handleBrandClick = (brand) => {
        const productsByBrand = filteredProductsQuery.data?.filter(
            (product) => product.brand === brand
        );
        dispatch(setProducts(productsByBrand));
    };

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

    return (
        <>
            <div className="container mx-auto ">
                <div className="flex md:flex-row">
                    <div className="bg-[#151515] p-3 mt-2 mb-2 ">
                        <h2 className="h4 text-center py-3 bg-white rounded-full mb-2">
                            Filter by Categories
                        </h2>

                        <div className="p-5 w-[15rem]">
                            {categories?.map((c) => (
                                <div key={c._id} className="mb-2">
                                    <div className="flex items-center mr-4">
                                        <input
                                            type="checkbox"
                                            id={c._id}
                                            onChange={(e) => handleCheck(e.target.checked, c._id)}
                                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />

                                        <label
                                            htmlFor={c._id}
                                            className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                                        >
                                            {c.name}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="relative">
                            <h2 className="h4 text-center py-2 bg-white rounded-full mb-2 cursor-pointer flex justify-center items-center" onClick={() => setShowBrandsMenu(!showBrandsMenu)}>
                                Filter by Brands
                                <span className="ml-2 text-xl">&#9776;</span> {/* เพิ่มไอคอน Hamburgur */}
                            </h2>
                            {showBrandsMenu && (
                                <div className="absolute bg-white mt-2 w-[15rem] rounded-lg shadow-lg">
                                    <div className="p-4">
                                        {uniqueBrands?.map((brand) => (
                                            <div
                                                key={brand}
                                                onClick={() => {
                                                    handleBrandClick(brand);
                                                    setShowBrandsMenu(false);
                                                }}
                                                className="cursor-pointer py-2 hover:bg-gray-100"
                                            >
                                                {brand}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <h2 className="h4 text-center py-2 bg-green-800 rounded-full mb-2">
                            Filter by Price
                        </h2>

                        <div className="p-5 w-[15rem]">
                            <input
                                type="text"
                                placeholder="Enter Price"
                                value={priceFilter}
                                onChange={handlePriceChange}
                                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-gray-300 text-black"
                            />
                        </div>

                        <h2 className="h4 text-center py-2 bg-blue-800 rounded-full mb-2">
                            Search by Name
                        </h2>

                        <div className="p-5 w-[15rem]">
                            <input
                                type="text"
                                placeholder="Enter Product Name"
                                value={nameFilter}
                                onChange={handleNameChange}
                                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-gray-300 text-black"
                            />
                        </div>

                        <div className="p-5 pt-0">
                            <button
                                className="w-full border border-white bg-green-600 text-black py-2 px-4 rounded"
                                onClick={() => window.location.reload()}
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="p-3" style={{ marginTop: '6rem' }}>
                        <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
                        <div className="flex flex-wrap">
                            {products.length === 0 ? (
                                <Loader />
                            ) : (
                                products?.map((p) => (
                                    <div className="p-3" key={p._id}>
                                        <ProductCard p={p} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shop;
