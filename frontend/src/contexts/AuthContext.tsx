/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useState, useContext, type ReactNode } from "react";
import api from "../services/api";
import { loginRequest, signUpRequest, type SignInData, type SignUpData, type User } from "../features/auth/services";

interface AuthContextData {
    user: User | null
    isAuthenticated: boolean
    signIn: (credentials: SignInData) => Promise<void>
    signUp: (data: SignUpData) => Promise<void>
    signOut: () => void
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const storagedToken = localStorage.getItem('@CountIQ:token')
        const storagedUser = localStorage.getItem('@CountIQ:user')

        if (storagedToken && storagedUser) {
            api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
        return JSON.parse(storagedUser)
        }

        return null
    })

    const signIn = useCallback(async ({ email, password }: SignInData) => {
        const response = await loginRequest({ email, password })
        const { token, user } = response

        localStorage.setItem('@CountIQ:token', token)
        localStorage.setItem('@CountIQ:user', JSON.stringify(user))

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        setUser(user)
    }, []);

    const signUp = useCallback(async (data: SignUpData) => {
        const response = await signUpRequest(data)
        const { token, user } = response

        localStorage.setItem('@CountIQ:token', token)
        localStorage.setItem('@CountIQ:user', JSON.stringify(user))

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        setUser(user)
    }, []);

    const signOut = useCallback(() => {
        localStorage.removeItem('@CountIQ:token')
        localStorage.removeItem('@CountIQ:user')
        
        api.defaults.headers.common['Authorization'] = undefined
        
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signUp, signOut }}>
        {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}