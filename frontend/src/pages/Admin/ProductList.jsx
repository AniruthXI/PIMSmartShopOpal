import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useCreateProductMutation,
    useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [brand, setBrand] = useState("");
    const [stock, setStock] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    const [uploadProductImage] = useUploadProductImageMutation();
    const [createProduct] = useCreateProductMutation();
    const { data: categories } = useFetchCategoriesQuery();
    const [loading, setLoading] = useState(false); // Added loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true during form submission

        try {
            const productData = new FormData();
            productData.append("image", image);
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("category", category);
            productData.append("quantity", quantity);
            productData.append("brand", brand);
            productData.append("countInStock", stock);

            const { data } = await createProduct(productData);

            if (data.error) {
                toast.error("Product create failed. Try Again.");
            } else {
                toast.success(`${data.name} is created`);
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            toast.error("Product create failed. Try Again.");
        } finally {
            setLoading(false); // Reset loading state after form submission completes
        }
    };

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);

        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
            setImageUrl(res.image);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };

    return (
        <div className="container xl:mx-[9rem] sm:mx-[0]">
            <div className="flex flex-col md:flex-row">
                {/* <AdminMenu /> */}
                <div className="md:w-3/4 p-3">
                    <div className="h-12">Create Product</div>

                    {imageUrl && (
                        <div className="text-center">
                            <img
                                src={imageUrl}
                                alt="product"
                                className="block mx-auto max-h-[200px]"
                            />
                        </div>
                    )}
                    <div className="mb-3">
                        <label className="border bg-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-3 text-black" style={{ borderColor: 'black' }}>
                            {image ? image.name : "Upload Image"}
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={uploadFileHandler}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <form onSubmit={handleSubmit} className="p-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name">Name</label> <br />
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-input p-3 border rounded-lg bg-white text-black w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="price">Price</label> <br />
                                <input
                                    type="number"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="form-input p-3 border rounded-lg bg-white text-black w-full"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="quantity">Quantity</label> <br />
                                <input
                                    type="number"
                                    id="quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="form-input p-3 border rounded-lg bg-white text-black w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="brand">Brand</label> <br />
                                <input
                                    type="text"
                                    id="brand"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="form-input p-3 border rounded-lg bg-white text-black w-full"
                                    required
                                />
                            </div>
                        </div>

                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-textarea p-3 border rounded-lg bg-white text-black w-full"
                            required
                        ></textarea>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                            <div>
                                <label htmlFor="stock">Count In Stock</label> <br />
                                <input
                                    type="number"
                                    id="stock"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    className="form-input p-3 border rounded-lg bg-white text-black w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="category">Category</label> <br />
                                <select
                                    id="category"
                                    className="form-select p-3 border rounded-lg bg-white text-black w-full"
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Choose Category</option>
                                    {categories?.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-[#04AA6D] text-white focus:outline-none focus:ring-2 focus:ring-[#04AA6D] focus:ring-opacity-50"
                            disabled={loading} // Disable the button during form submission
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
