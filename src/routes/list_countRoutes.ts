import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { listCountController } from "../controller/list_countController.js";

const router = express.Router()

router.post("/:listid", authMiddleware, listCountController.startCount)
router.put("/:listid/:countid", authMiddleware, listCountController.closeCount)

export const listCountRoutes = router