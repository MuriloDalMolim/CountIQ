import express from "express";
import { productListController } from "../controller/productListController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
 
const router = express.Router()

router.get("/:listid", authMiddleware, productListController.getListProducts)
router.post("/:listid", authMiddleware, productListController.insertIntoList)

export const productListRoutes = router