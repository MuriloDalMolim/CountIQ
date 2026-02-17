import express, { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { countItemController } from "../controller/count_ItemController.js";

const router = express.Router()

router.post("/:listCountId", authMiddleware, countItemController.registerItemCount)
router.delete("/:listCountId", authMiddleware, countItemController.deleteItemCount)

export const countItemRoutes = router