import { Pencil, ShieldCheck, User as UserIcon, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "../../components/ui/Badge";

export interface User {
    userId: number
    name: string
    email: string
    isAdmin: boolean
    isInactive: boolean
    companyId: number
}

interface UserTableProps {
    users: User[]
    onEdit: (user: User) => void
}

export function UserTable({ users, onEdit }: UserTableProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Usuário</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Função</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user.userId} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-900">{user.name}</span>
                                    <span className="text-sm text-gray-500">{user.email}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <Badge 
                                variant={user.isAdmin ? 'danger' : 'info'} 
                                icon={user.isAdmin ? <ShieldCheck className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                                >
                                    {user.isAdmin ? 'Admin' : 'Padrão'}
                                </Badge>
                            </td>
                            <td className="px-6 py-4">
                                <Badge 
                                variant={!user.isInactive ? 'success' : 'neutral'}
                                icon={!user.isInactive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                >
                                    {!user.isInactive ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                    onClick={() => onEdit(user)} 
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Editar usuário"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}