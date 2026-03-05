import api from "../../services/api";

export interface RegisterItemParams {
    productId: number
    quantity: number
    mode: 'increment' | 'set'
}

export const countListService = {

    fetchProductsByList: (listId: number) => 
        api.get(`/productlist/${listId}`),

    registerItem: (listCountId: number, params: RegisterItemParams) =>
        api.post(`/countitems/${listCountId}`, params),

    deleteItem: (listCountId: number, productId: number) =>
        api.delete(`/countitems/${listCountId}`, { 
            data: { productId } 
        }),
};