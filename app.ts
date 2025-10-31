import express from "express";
import { companyRoutes } from "./src/routes/companyRoutes.js";

const app=express()
app.use(express.json())
 
app.use("/company", companyRoutes)

export default app