import express from "express";
const router = express.Router();
import multer from "multer"; // เพิ่ม import multer
import path from "path"; // เพิ่ม import path

import {
    createOrder,
    getAllOrders,
    getUserOrders,
    countTotalOrders,
    calculateTotalSales,
    calcualteTotalSalesByDate,
    findOrderById,
    markOrderAsPaid,
    markOrderAsDelivered,
    uploadPaymentProof, // เพิ่ม controller function
    sendOrderConfirmation,
} from "../controller/orderController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// เพิ่ม multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `payment-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // จำกัดขนาด 2MB
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('ต้องเป็นไฟล์รูปภาพเท่านั้น!'));
    }
});

// เพิ่ม routes ที่มีอยู่เดิม
router
    .route("/")
    .post(authenticate, createOrder)
    .get(authenticate, authorizeAdmin, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.route("/:id").get(authenticate, findOrderById);
router.route("/:id/pay").put(authenticate, markOrderAsPaid);
router
    .route("/:id/deliver")
    .put(authenticate, authorizeAdmin, markOrderAsDelivered);

// เพิ่ม route สำหรับอัพโหลดหลักฐานการชำระเงิน
router.route("/:id/upload-payment-proof")
    .post(authenticate, upload.single('paymentProof'), uploadPaymentProof);

    router.post('/:id/send-confirmation', authenticate, sendOrderConfirmation);

export default router;