import { X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { type Count } from "./CountCard";

interface CountModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    onSuccess: () => void
    countToEdit?: Count | null
    availableLists?: { listId: number; description: string }[]
    onConfirmSelect: (listId: number) => Promise<void>
}

export function CountModal({ 
    isOpen, 
    onClose, 
    title, 
    availableLists = [], 
    onConfirmSelect 
    }: CountModalProps) {
    const [selectedListId, setSelectedListId] = useState<string>("")
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedListId) return

        try {
        setLoading(true)
        await onConfirmSelect(Number(selectedListId))
        onClose()
        } catch (error) {
        console.error(error)
        } finally {
        setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">Vincular a qual Lista?</label>
                        <div className="relative">
                            <select 
                                value={selectedListId}
                                onChange={(e) => setSelectedListId(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-brand-500 focus:border-brand-500 block p-3 appearance-none font-medium outline-none"
                                required
                            >
                                <option value="">Selecione uma lista disponível...</option>
                                {availableLists.map(list => (
                                    <option key={list.listId} value={list.listId}>{list.description}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" type="button" onClick={onClose} className="flex-1 py-3 text-gray-600">
                            Cancelar
                        </Button>
                        <Button 
                        type="submit" 
                        disabled={loading || !selectedListId}
                        className="flex-1 py-3 bg-orange-700 hover:bg-orange-800 border-none"
                        >
                            {loading ? "Iniciando..." : "Gerar Nova Contagem"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}