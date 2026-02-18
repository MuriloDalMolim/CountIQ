import api from "../../services/api"; 

export interface User {
    userId: number
    name: string
    email: string
    companyId: number
    isAdmin: string
    isInactive: string
    company:{
        name: string
        cnpj: string
    }
}

export interface SignInData {
    email: string
    password: string
}

export interface SignUpData {
    companyName: string
    companyCnpj: string
    userName: string
    userEmail: string
    userPassword: string
}

interface AuthResponse {
    token: string
    user: User
}

export async function loginRequest(data: SignInData): Promise<AuthResponse>{
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
}

export async function signUpRequest(data: SignUpData): Promise<AuthResponse>{
    const response = await api.post<AuthResponse>('/auth/signup', data)
    return response.data
}