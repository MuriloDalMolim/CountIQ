import express from "express";
import { companyRoutes } from "./src/routes/companyRoutes.js";
import { userRoutes } from "./src/routes/userRoutes.js";
import { authRoutes } from "./src/routes/authRoutes.js";
import { productRoutes } from "./src/routes/productRoutes.js";
import { listRoutes } from "./src/routes/listRoutes.js";
import { productListRoutes } from "./src/routes/product_listRoutes.js";
import { listCountRoutes } from "./src/routes/list_countRoutes.js";

const app=express()
app.use(express.json())
 
app.use("/company", companyRoutes)
app.use("/users", userRoutes)
app.use("/product", productRoutes)
app.use("/auth", authRoutes)
app.use("/list", listRoutes)
app.use("/productlist", productListRoutes)
app.use("/listcount", listCountRoutes)

export default app