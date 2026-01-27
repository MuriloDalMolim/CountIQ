import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { productListController } from "../controller/product_listController.js";

 
const router = express.Router()

router.get("/:listid", authMiddleware, productListController.getListProducts)
router.post("/:listid", authMiddleware, productListController.insertIntoList)
router.delete("/:listid", authMiddleware,  productListController.deleteFromList)

export const productListRoutes = router