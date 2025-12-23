import express from "express"
import { companyController } from "../controller/companyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

/*router.post("/", companyController.createCompany);*/
router.put("/:companyid", authMiddleware, companyController.updateCompany)

export const companyRoutes = router

