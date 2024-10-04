import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(409).json({ error: "Category already exists" });
        }

        const category = await new Category({ name }).save();
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        const { categoryId } = req.params;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        category.name = name;
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const removeCategory = asyncHandler(async (req, res) => {
    try {
        const removed = await Category.findByIdAndDelete(req.params.categoryId);
        if (!removed) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(removed);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const listCategory = asyncHandler(async (req, res) => {
    try {
        const all = await Category.find({});
        res.json(all);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const readCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export {
    createCategory,
    updateCategory,
    removeCategory,
    listCategory,
    readCategory,
};
