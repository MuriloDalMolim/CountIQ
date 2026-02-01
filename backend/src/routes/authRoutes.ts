import express from "express"
import { authController } from "../controller/authController.js"

const router = express.Router()

router.post("/login", authController.login)
router.post("/signup", authController.signUp)

export const authRoutes = router