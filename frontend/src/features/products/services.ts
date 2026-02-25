import api from "../../services/api";

export const productsService = {

    list: (isInactive?: boolean) => 
        api.get("/product", { params: { isInactive } }),

    
    create: (data: { description: string; barcode: string; isInactive?: boolean }) => 
        api.post("/product", data),
    
    update: (productId: number, data: { description?: string; barcode?: string }) => 
        api.put(`/product/${productId}`, data),

    toggleStatus: (productId: number, isInactive: boolean) =>
        api.delete(`/product/${productId}`, { data: { isInactive } })
}