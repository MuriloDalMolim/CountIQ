import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users as UsersIcon, Plus, ChevronLeft, Filter } from "lucide-react";

import api from "../../services/api";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/PageHeader";
import { SearchBar } from "../../components/SearchBar";

import { UserTable, type User } from "./UserTable";
import { UserModal } from "./UserModal";

type FilterStatus = 'all' | 'active' | 'inactive'

export function Users() {
    const navigate = useNavigate()
    const [users, setUsers] = useState<User[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

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

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())

        const matchesStatus =
            filterStatus === 'all' ? true :
            filterStatus === 'active' ? !user.isInactive :
            user.isInactive; 

        return matchesSearch && matchesStatus;
    })

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

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <SearchBar 
                        value={search} 
                        onChange={setSearch} 
                        placeholder="Buscar por nome ou email..." 
                    />
                </div>

                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex items-center h-[66px] px-4 gap-2">
                    <Filter className="w-4 h-4 text-gray-400 mr-2" />
                    <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                        filterStatus === 'all' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                    >
                        Todos
                    </button>
                    <button
                    onClick={() => setFilterStatus('active')}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                        filterStatus === 'active' 
                        ? 'bg-green-50 text-green-600' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                    >
                        Ativos
                    </button>
                    <button
                        onClick={() => setFilterStatus('inactive')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                            filterStatus === 'inactive' 
                            ? 'bg-red-50 text-red-600' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        Inativos
                    </button>
                </div>
            </div>    

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