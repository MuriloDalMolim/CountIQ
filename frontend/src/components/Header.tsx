import { LogOut, Box } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function Header() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    function handleSignOut() {
        signOut()
        navigate("/")
    }

    return (
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="bg-orange-600 p-2 rounded-lg">
                    <Box className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-lg text-gray-900 leading-tight">CountIQ</h1>
                    <p className="text-xs text-gray-500 font-medium">
                        {user?.company?.name || "Carregando empresa..."}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold border border-orange-200">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                </div>

                <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Sair
                </button>
            </div>
        </header>
    )
}