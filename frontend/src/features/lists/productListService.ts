import api from "../../services/api";

export const productListService = {
    getProducts: (listId: number) => 
        api.get(`/productlist/${listId}`),

    insert: (listId: number, barcode: string) => 
        api.post(`/productlist/${listId}`, { barcode }),

    remove: (listId: number, productId: number, forceDelete = false) => 
        api.delete(`/productlist/${listId}`, { data: { productId, forceDelete } })
};
