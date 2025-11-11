import express from "express"
import { companyController } from "../controller/companyController.js";

const router = express.Router()

/*router.post("/", companyController.createCompany);*/
router.put("/:companyid", companyController.updateCompany)
router.delete("/:companyid", companyController.deleteCompany)

export const companyRoutes = router

