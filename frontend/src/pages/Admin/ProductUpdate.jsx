import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetProductByIdQuery,
    useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
    const params = useParams();

    const { data: productData } = useGetProductByIdQuery(params._id);

    const [image, setImage] = useState(productData?.image || "");
    const [name, setName] = useState(productData?.name || "");
    const [description, setDescription] = useState(
        productData?.description || ""
    );
    const [price, setPrice] = useState(productData?.price || "");
    const [category, setCategory] = useState(productData?.category || "");
    const [quantity, setQuantity] = useState(productData?.quantity || "");
    const [brand, setBrand] = useState(productData?.brand || "");
    const [stock, setStock] = useState(productData?.countInStock);

    const navigate = useNavigate();

    const { data: categories = [] } = useFetchCategoriesQuery();

    const [uploadProductImage] = useUploadProductImageMutation();

    const [updateProduct] = useUpdateProductMutation();

    const [deleteProduct] = useDeleteProductMutation();

    useEffect(() => {
        if (productData && productData._id) {
            setName(productData.name);
            setDescription(productData.description);
            setPrice(productData.price);
            setCategory(productData.category?._id);
            setQuantity(productData.quantity);
            setBrand(productData.brand);
            setImage(productData.image);
        }
    }, [productData]);

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success("Item added successfully", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
            setImage(res.image);
        } catch (err) {
            toast.error("Image upload failed", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("quantity", quantity);
            formData.append("brand", brand);
            formData.append("countInStock", stock);

            const data = await updateProduct({ productId: params._id, formData });

            if (data?.error) {
                toast.error(data.error, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
            } else {
                toast.success("Product successfully updated", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                navigate("/admin/allproductslist");
            }
        } catch (err) {
            console.log(err);
            toast.error("Product update failed. Try again.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    };

    const handleDelete = async () => {
        try {
            let answer = window.confirm(
                "Are you sure you want to delete this product?"
            );
            if (!answer) return;

            const { data } = await deleteProduct(params._id);
            toast.success(`"${data.name}" is deleted`, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
            navigate("/admin/allproductslist");
        } catch (err) {
            console.log(err);
            toast.error("Delete failed. Try again.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    };

    return (
        <div className="container xl:mx-[9rem] sm:mx-[0]">
            <div className="flex flex-col md:flex-row">
                <AdminMenu />
                <div className="md:w-3/4 p-6">
                    <h2 className="text-2xl font-bold mb-6">Update / Delete Product</h2>
                    {image && (
                        <div className="text-center mb-6">
                            <div className="inline-block border p-2 rounded-lg overflow-hidden">
                                <img
                                    src={image}
                                    alt="product"
                                    className="block mx-auto max-w-xs h-auto"
                                />
                            </div>
                        </div>
                    )}
                    <div className="mb-6">
                        <label className="block text-center text-white py-2 px-4 bg-[#151515] rounded-lg cursor-pointer font-bold mb-3">
                            {image ? image.name : "Upload image"}
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={uploadFileHandler}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="p-4 mb-3 w-full border rounded-lg bg-white text-black"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="price" className="block mb-2">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    className="p-4 mb-3 w-full border rounded-lg bg-white text-black"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="quantity" className="block mb-2">Quantity</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="1"
                                    className="p-4 mb-3 w-full border rounded-lg bg-white text-black"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="brand" className="block mb-2">Brand</label>
                                <input
                                    type="text"
                                    id="brand"
                                    className="p-4 mb-3 w-full border rounded-lg bg-white text-black"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="description" className="block mb-2">Description</label>
                                <textarea
                                    id="description"
                                    className="p-4 mb-3 w-full border rounded-lg bg-white text-black"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="stock" className="block mb-2">Count In Stock</label>
                                <input
                                    type="number"
                                    id="stock"
                                    className="p-4 mb-3 w-full border rounded-lg bg-white text-black"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className="block mb-2">Category</label>
                                <select
                                    id="category"
                                    className="p-4 mb-3 w-full border rounded-lg bg-white text-black"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Choose Category</option>
                                    {categories.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-start mt-6">
                            <button
                                type="submit"
                                className="py-4 px-10 rounded-lg text-lg font-bold bg-green-600 mr-6"
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="py-4 px-10 rounded-lg text-lg font-bold bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProductUpdate;
