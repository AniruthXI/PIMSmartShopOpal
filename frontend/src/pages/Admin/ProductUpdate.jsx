import { useState, useEffect } from "react";
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
    const productId = params.id;
    const navigate = useNavigate();

    // Queries & Mutations
    const { data: product, isLoading, error } = useGetProductByIdQuery(params.id);
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [uploadProductImage] = useUploadProductImageMutation();
    const { data: categories = [] } = useFetchCategoriesQuery();

    // State
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        price: '',
        category: '',
        quantity: '',
        description: '',
        image: '',
        countInStock: ''
    });

    // Update formData when product data is loaded
    useEffect(() => {
        console.log('params:', params);
        console.log('productId:', params.id);
        if (product) {
            console.log('product data:', product);
            setFormData({
                name: product.name,
                brand: product.brand,
                price: product.price,
                category: product.category,
                quantity: product.quantity,
                description: product.description,
                image: product.image,
                countInStock: product.countInStock
            });
        }
    }, [product, params]);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            setFormData(prev => ({ ...prev, image: res.image }));
            toast.success("Image uploaded successfully");
        } catch (err) {
            toast.error("Image upload failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!params.id) {
            toast.error("Product ID is missing");
            return;
        }
    
        try {
            const updatedData = {
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                countInStock: Number(formData.countInStock)
            };
    
            await updateProduct({
                productId: params.id,  // ใช้ params.id แทน productId
                formData: updatedData
            }).unwrap();
    
            toast.success("Product updated successfully");
            navigate('/admin/productlist');
        } catch (err) {
            toast.error("Failed to update product");
            console.error('Update error:', err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            await deleteProduct(productId).unwrap();
            toast.success("Product deleted successfully");
            navigate("/admin/allproductslist");
        } catch (err) {
            toast.error("Delete failed. Try again.");
            console.error('Delete error:', err);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container xl:mx-[9rem] sm:mx-[0]">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-3/4 p-6">
                    <h2 className="text-2xl font-bold mb-6">Update / Delete Product</h2>

                    {formData.image && (
                        <div className="text-center mb-6">
                            <div className="inline-block border p-2 rounded-lg overflow-hidden">
                                <img
                                    src={formData.image}
                                    alt="product"
                                    className="block mx-auto max-w-xs h-auto"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block text-center text-white py-2 px-4 bg-[#151515] rounded-lg cursor-pointer font-bold mb-3">
                            Upload image
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
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="p-4 mb-3 w-full border rounded-lg bg-white text-black"
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className="block mb-2">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="p-4 mb-3 w-full border rounded-lg bg-white text-black"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label htmlFor="quantity" className="block mb-2">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="p-4 mb-3 w-full border rounded-lg bg-white text-black"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label htmlFor="brand" className="block mb-2">Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="p-4 mb-3 w-full border rounded-lg bg-white text-black"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="description" className="block mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="p-4 mb-3 w-full border rounded-lg bg-white text-black"
                                />
                            </div>

                            <div>
                                <label htmlFor="countInStock" className="block mb-2">Count In Stock</label>
                                <input
                                    type="number"
                                    name="countInStock"
                                    value={formData.countInStock}
                                    onChange={handleChange}
                                    className="p-4 mb-3 w-full border rounded-lg bg-white text-black"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="p-4 mb-3 w-full border rounded-lg bg-white text-black"
                                    required
                                >
                                    <option value="">เลือกหมวดหมู่</option>
                                    {categories?.map((c) => (
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
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Updating...' : 'Update'}
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