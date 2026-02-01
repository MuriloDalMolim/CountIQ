import express, { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { countItemController } from "../controller/count_ItemController.js";

const router = express.Router()

router.post("/:listcountid", authMiddleware, countItemController.registerItemCount)
router.delete("/:listcountid", authMiddleware, countItemController.deleteItemCount)

export const countItemRoutes = router