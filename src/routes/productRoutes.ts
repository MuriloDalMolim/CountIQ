import express from "express";
import { productController } from "../controller/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

router.get("/", authMiddleware, productController.getAllProducts)
router.post("/", authMiddleware, productController.createProduct)
router.put("/:productid", authMiddleware, productController.updateProduct)
router.delete("/:productid", authMiddleware, productController.deleteProduct)

export const productRoutes = router