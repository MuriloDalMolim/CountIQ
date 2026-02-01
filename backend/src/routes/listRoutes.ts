import express from "express";
import { listController } from "../controller/listController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

router.get("/", authMiddleware, listController.getAllList)
router.post("/", authMiddleware, listController.createList)
router.put("/:listid", authMiddleware, listController.updateList)

export const listRoutes = router
