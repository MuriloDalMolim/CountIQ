import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { listCountController } from "../controller/list_countController.js";

const router = express.Router()

router.post("/:listId", authMiddleware, listCountController.startCount)
router.patch("/:listCountId/close", authMiddleware, listCountController.closeCount)
router.delete("/:listCountId", authMiddleware, listCountController.deleteCount)

export const listCountRoutes = router