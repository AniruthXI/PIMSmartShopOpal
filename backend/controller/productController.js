import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
    try {
        const { name, description, price, category, quantity, brand } = req.fields;

        // Validation
        switch (true) {
            case !name:
                return res.json({ error: "Name is required" });
            case !brand:
                return res.json({ error: "Brand is required" });
            case !description:
                return res.json({ error: "Description is required" });
            case !price:
                return res.json({ error: "Price is required" });
            case !category:
                return res.json({ error: "Category is required" });
            case !quantity:
                return res.json({ error: "Quantity is required" });
        }

        const product = new Product({ ...req.fields });
        await product.save();
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
});

const updateProductDetails = asyncHandler(async (req, res) => {
    try {
        // เพิ่ม console.log เพื่อดูข้อมูลที่ส่งมา
        console.log('Request Body:', req.body);
        console.log('Product ID:', req.params.id);

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // อัพเดทแบบแยกฟิลด์
        product.name = req.body.name || product.name;
        product.price = Number(req.body.price) || product.price;
        product.description = req.body.description || product.description;
        // อัพเดทฟิลด์อื่นๆ ตามต้องการ

        const updatedProduct = await product.save();
        
        res.json(updatedProduct);
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ message: error.message });
    }
});

const removeProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

const fetchProducts = asyncHandler(async (req, res) => {
    try {
        const pageSize = 20;

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: "i",
                },
            }
            : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.aggregate([
            { $match: { ...keyword } },
            { $sample: { size: pageSize } }
        ]);

        res.json({
            products,
            page: 1,
            pages: Math.ceil(count / pageSize),
            hasMore: false,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});


const fetchProductById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        
        // ตรวจสอบว่ามี id หรือไม่
        if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        const product = await Product.findById(id);
        
        if (product) {
            return res.json(product);
        } 

        return res.status(404).json({ error: "Product not found" });
        
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ 
            error: "Error fetching product",
            details: error.message 
        });
    }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({})
            .populate("category")
            .limit(100)
            .sort({ createAt: -1 });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});


const fetchTopProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).sort({ rating: -1 }).limit(30);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 }).limit(10);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
});

const filterProducts = asyncHandler(async (req, res) => {
    try {
        const { checked, radio } = req.body;

        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

        const products = await Product.find(args);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

export {
    addProduct,
    updateProductDetails,
    removeProduct,
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    fetchTopProducts,
    fetchNewProducts,
    filterProducts,
};
