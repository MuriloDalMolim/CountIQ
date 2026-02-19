import { Outlet, Navigate } from "react-router-dom";
import { Header } from "./Header"; // Verifique se este caminho está correto
import { useAuth } from "../contexts/AuthContext";

export function Layout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header /> 
        
            <main className="flex-1">
                <Outlet /> 
            </main>
        </div>
    )
}