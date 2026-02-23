import api from "../../services/api";
import { type Product } from "../../pages/Products/ProductTable";

export const productsService = {
    list: () => api.get<Product[]>("/product"),
    
    create: (data: { description: string; barcode: string; isInactive?: boolean }) => 
        api.post("/product", data),
    
    update: (productId: number, data: { description?: string; barcode?: string }) => 
        api.put(`/product/${productId}`, data),

    toggleStatus: (productId: number, isInactive: boolean) =>
        api.delete(`/product/${productId}`, { data: { isInactive } })
}