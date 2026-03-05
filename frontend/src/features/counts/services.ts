import api from "../../services/api";

export const countsService = {
    list: () => api.get("/listcount"),

    start: (listId: number) => 
        api.post(`/listcount/${listId}`),

    close: (listCountId: number) => 
        api.patch(`/listcount/${listCountId}/close`),

    delete: (listCountId: number) => 
        api.delete(`/listcount/${listCountId}`)
};