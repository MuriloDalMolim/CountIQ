import express from "express";
import { companyRoutes } from "./src/routes/companyRoutes.js";
import { userRoutes } from "./src/routes/userRoutes.js";
import { authRoutes } from "./src/routes/authRoutes.js";
import { productRoutes } from "./src/routes/productRoutes.js";

const app=express()
app.use(express.json())
 
app.use("/company", companyRoutes)
app.use("/users", userRoutes)
app.use("/product", productRoutes)
app.use("/auth", authRoutes)

export default app