import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users as UsersIcon, Plus, ChevronLeft } from "lucide-react";

import api from "../../services/api";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/PageHeader";
import { SearchBar } from "../../components/SearchBar";

import { UserTable, type User } from "./UserTable";
import { UserModal } from "./UserModal";

export function Users() {
    const navigate = useNavigate()
    const [users, setUsers] = useState<User[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    async function loadUsers() {
        try {
            setLoading(true)
            const response = await api.get("/users")
            setUsers(response.data)
        } catch (error) {
            console.error("Erro ao carregar usuários:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    function handleEdit(user: User) {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    function handleCloseModal() {
        setIsModalOpen(false)
        setSelectedUser(null)
    }

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <button 
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-gray-500 hover:text-brand-600 transition-colors mb-6 font-medium"
            >
                <ChevronLeft className="w-4 h-4" />
                Voltar ao Dashboard
            </button>

            <PageHeader 
                title="Gerenciamento de Usuários"
                subtitle={loading ? "Carregando..." : `Total de ${filteredUsers.length} usuários`}
                icon={<UsersIcon className="w-6 h-6 text-white" />}
                iconBgColor="bg-blue-600"
                action={
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                        <Plus className="w-5 h-5" />
                        Novo Usuário
                    </Button>
                }
            />

            <SearchBar 
                value={search} 
                onChange={setSearch} 
                placeholder="Buscar por nome ou email..." 
            />

            {loading ? (
                <div className="text-center py-20 text-gray-400">Carregando lista...</div>
            ) : (
                <UserTable users={filteredUsers} onEdit={handleEdit} />
            )}

            <UserModal 
                key={selectedUser?.userId || 'new'}
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                userToEdit={selectedUser}
                title={selectedUser ? "Editar Usuário" : "Novo Usuário"}
                onSuccess={loadUsers}
            />
        </div>
    )
}