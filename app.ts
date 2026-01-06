import express from "express";
import { companyRoutes } from "./src/routes/companyRoutes.js";
import { userRoutes } from "./src/routes/userRoutes.js";
import { authRoutes } from "./src/routes/authRoutes.js";
import { productRoutes } from "./src/routes/productRoutes.js";
import { listRoutes } from "./src/routes/listRoutes.js";

const app=express()
app.use(express.json())
 
app.use("/company", companyRoutes)
app.use("/users", userRoutes)
app.use("/product", productRoutes)
app.use("/auth", authRoutes)
app.use("/list", listRoutes)

export default app