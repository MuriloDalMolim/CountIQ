import api from "../../services/api";
import { type List } from "../../pages/Lists/ListTable";

export const listsService = {
    list: () => api.get<List[]>("/list"),
    
    create: (data: { description: string; isInactive?: boolean }) => 
        api.post("/list", data),
    
    update: (listId: number, data: { description?: string; isInactive?: boolean }) => 
        api.put(`/list/${listId}`, data),

    getProducts: (listId: number) =>
        api.get(`/product_list/${listId}`)
}
