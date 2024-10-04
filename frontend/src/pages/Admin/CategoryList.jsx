import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

const CategoryList = () => {
    const { data: categories } = useFetchCategoriesQuery();
    const [name, setName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [updatingName, setUpdatingName] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const handleCreateCategory = async (e) => {
        e.preventDefault();

        if (!name) {
            toast.error("Category name is required");
            return;
        }

        try {
            const result = await createCategory({ name }).unwrap();
            if (result.error) {
                toast.error(result.error);
            } else {
                setName("");
                toast.success(`${result.name} is created.`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Creating category failed, try again.");
        }
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();

        if (!updatingName) {
            toast.error("Category name is required");
            return;
        }

        try {
            const result = await updateCategory({
                categoryId: selectedCategory._id,
                updatedCategory: {
                    name: updatingName,
                },
            }).unwrap();

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`${result.name} is updated`);
                setSelectedCategory(null);
                setUpdatingName("");
                setModalVisible(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            const result = await deleteCategory(selectedCategory._id).unwrap();

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`${result.name} is deleted.`);
                setSelectedCategory(null);
                setModalVisible(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Category deletion failed. Try again.");
        }
    };

    return (
        <div className="ml-[10rem] flex flex-col md:flex-row">
            <AdminMenu />
            <div className="md:w-3/4 p-3">
                <h1 className="text-2xl font-semibold mb-4">Manage Categories</h1>
                <form onSubmit={handleCreateCategory} className="mb-6">
                    <div className="flex flex-col mb-3">
                        <label htmlFor="categoryName" className="text-black mb-1">Category Name</label>
                        <input
                            type="text"
                            id="categoryName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter category name"
                            className="form-input p-3 rounded-md border border-gray-300 shadow-md focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-green-500 w-full text-black"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-black py-2 px-4 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Create Category
                    </button>
                </form>

                <hr className="my-6" />
                <div className="flex flex-wrap">
                    {categories?.map((category) => (
                        <button
                            key={category._id}
                            className="bg-black text-green-500 py-2 px-4 rounded-md m-3 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            onClick={() => {
                                setModalVisible(true);
                                setSelectedCategory(category);
                                setUpdatingName(category.name);
                            }}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
                <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                    <form onSubmit={handleUpdateCategory} className="mb-6">
                        <input
                            type="text"
                            value={updatingName}
                            onChange={(e) => setUpdatingName(e.target.value)}
                            placeholder="Enter category name"
                            className="form-input p-3 rounded-md w-full mb-3 text-black"
                        />
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="bg-green-500 text-black py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteCategory}
                                className="bg-red-500 text-black py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                Delete
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default CategoryList;
