import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { usersService } from "../../features/users/services";
import { type User } from "./UserTable";

interface UserModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    onSuccess: () => void
    userToEdit?: User | null
}

export function UserModal({ isOpen, onClose, title, onSuccess, userToEdit }: UserModalProps) {
    const [formData, setFormData] = useState({
        name: userToEdit?.name ?? "",
        email: userToEdit?.email ?? "",
        password: "",
        isAdmin: userToEdit?.isAdmin ?? false,
        isInactive: userToEdit?.isInactive ?? false
    })

    if (!isOpen) return null

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            if (userToEdit) {
                await usersService.update(userToEdit.userId, formData)
            } else {
                await usersService.create(formData)
            }
            onSuccess()
            onClose()
        } catch (error) {
        console.error("Erro ao salvar:", error)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <Input 
                        label="Nome Completo" 
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input 
                        label="E-mail" 
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    
                    {!userToEdit && (
                        <Input 
                            label="Senha" 
                            type="password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    )}
                    
                    <div className="flex flex-col gap-3 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={formData.isAdmin}
                                onChange={e => setFormData({ ...formData, isAdmin: e.target.checked })}
                                className="w-4 h-4 accent-brand-500 rounded" 
                            />
                            <span className="text-sm text-gray-600 font-medium">Administrador</span>
                        </label>

                        {userToEdit && (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isInactive}
                                    onChange={e => setFormData({ ...formData, isInactive: e.target.checked })}
                                    className="w-4 h-4 accent-red-500 rounded border-gray-300" 
                                />
                                <span className="text-sm font-bold text-red-600">
                                    Usuário Inativo
                                </span>
                            </label>
                            )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" type="button" onClick={onClose} className="flex-1 py-3">Cancelar</Button>
                        <Button type="submit" className="flex-1 py-3">Salvar</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}