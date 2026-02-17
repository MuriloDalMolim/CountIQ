import express from "express";
import { userController } from "../controller/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

router.get("/:userId", authMiddleware, userController.getUserById)
router.get("/", authMiddleware, userController.getAllUsers)
router.post("/", authMiddleware, userController.createUser)
router.put("/:userId", authMiddleware, userController.updateUser)

export const userRoutes = router