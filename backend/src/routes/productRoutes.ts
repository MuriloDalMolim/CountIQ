import express from "express";
import { productController } from "../controller/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

router.get("/:productId", authMiddleware, productController.getProductById)
router.get("/", authMiddleware, productController.getAllProducts)
router.post("/", authMiddleware, productController.createProduct)
router.put("/:productId", authMiddleware, productController.updateProduct)
router.delete("/:productId", authMiddleware, productController.deleteProduct)

export const productRoutes = router