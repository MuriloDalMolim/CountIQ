import { Users, Package, ClipboardList, Calculator, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ModuleCard } from "../../components/ModuleCard";

export function Home() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const modules = [
        {
            title: "Gerenciamento de Usuários",
            description: "Cadastre, edite e gerencie os usuários do sistema",
            icon: Users,
            action: () => navigate("/users")
        },
        {
            title: "Gerenciamento de Produtos",
            description: "Controle o catálogo de produtos e informações",
            icon: Package,
            action: () => navigate("/products")
        },
        {
            title: "Gerenciamento de Listas",
            description: "Crie e organize listas de contagem de estoque",
            icon: ClipboardList,
            action: () => navigate("/lists")
        },
        {
            title: "Gerenciamento de Contagens",
            description: "Realize e acompanhe contagens de inventário",
            icon: Calculator,
            action: () => navigate("/counts"),
        },
        {
            title: "Gerenciamento da Empresa",
            description: "Configure informações e preferências da empresa",
            icon: Building2,
            action: () => navigate("/company"),
            iconColor: "text-orange-600",
            bgColor: "bg-orange-50"
        },
    ]

    return (
        <main className="max-w-7xl mx-auto px-8 py-12">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Bem-vindo, {user?.name?.split(" ")[0] || "Admin"}!
                </h2>
                <p className="text-gray-500 font-medium">
                    Selecione um módulo para começar a gerenciar seu estoque.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module, index) => (
                    <ModuleCard 
                        key={index} 
                        {...module} 
                    />
                ))}
            </div>
        </main>
    )
}