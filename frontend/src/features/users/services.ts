import api from "../../services/api";
import { type User } from "../../pages/Users/UserTable";

export const usersService = {
    list: () => api.get<User[]>("/users"),
  
    create: (data: Omit<User, "userId" | "companyId"> & { password?: string }) => 
        api.post("/users", data),
    
    update: (userId: number, data: Partial<User>) => 
        api.put(`/users/${userId}`, data),
}