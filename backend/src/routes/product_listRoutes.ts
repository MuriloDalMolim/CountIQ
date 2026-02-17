import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { productListController } from "../controller/product_listController.js";

 
const router = express.Router()

router.get("/:listId", authMiddleware, productListController.getListProducts)
router.post("/:listId", authMiddleware, productListController.insertIntoList)
router.delete("/:listId", authMiddleware,  productListController.deleteFromList)

export const productListRoutes = router