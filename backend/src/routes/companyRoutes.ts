import express from "express"
import { companyController } from "../controller/companyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

router.put("/:companyId", authMiddleware, companyController.updateCompany)
router.get("/", authMiddleware, companyController.getCompany)

export const companyRoutes = router

