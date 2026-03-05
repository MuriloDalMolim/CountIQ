import { Play, Trash2, User, Clock, Box, CheckCircle, Eye } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { useNavigate } from "react-router-dom";

export interface Count {
    id: number
    listName: string
    status: 'in_progress' | 'completed'
    totalProducts: number
    countedProducts: number
    createdBy: string
    updatedAt: string
}

interface CountCardProps {
    count: Count
    onAction: (count: Count) => void
    onDelete: (id: number) => void
    onCloseCount: (id: number) => void
}

export function CountCard({ count, onAction, onDelete, onCloseCount }: CountCardProps) {
    const navigate = useNavigate()

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">Contagem #{count.id}</h3>
                    <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                            <Box className="w-4 h-4 text-brand-500" />
                            <span>Lista: {count.listName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                            <User className="w-3.5 h-3.5" />
                            <span>{count.createdBy}</span>
                            <span className="mx-1">•</span>
                            <Clock className="w-3.5 h-3.5" />
                            <span>{count.updatedAt}</span>
                        </div>
                    </div>
                </div>
                <Badge variant={count.status === 'completed' ? 'success' : 'info'}>
                    {count.status === 'completed' ? 'Encerrada' : 'Aberta'}
                </Badge>
            </div>

            <div className="flex flex-col gap-3 mt-2">
                <div className="flex gap-3">
                    {count.status === 'in_progress' ? (
                        <>
                        <button 
                        onClick={() => onAction(count)} 
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-500 text-white rounded-2xl font-bold hover:bg-brand-600 transition-all"
                        >
                            <Play className="w-4 h-4 fill-current" /> Contar
                        </button>
                        <button 
                        onClick={() => onCloseCount(count.id)} 
                        title="Encerrar Sessão"
                        className="p-3 border-2 border-green-50 text-green-600 rounded-2xl hover:bg-green-50 transition-all"
                        >
                            <CheckCircle className="w-5 h-5" />
                        </button>
                        </>
                    ) : (
                        <button 
                        onClick={() => onAction(count)}
                        className="flex-1 text-center py-3 bg-gray-50 text-gray-400 rounded-2xl font-bold text-sm hover:bg-gray-100 hover:text-gray-600 transition-all"
                        >
                            Sessão Finalizada
                        </button>
                    )}
                    
                    <button 
                    onClick={() => onDelete(count.id)} 
                    className="p-3 border-2 border-red-50 text-red-500 rounded-2xl hover:bg-red-50 transition-all"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                <button 
                onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/counts/view/${count.id}`)
                }}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 hover:text-brand-500 transition-all text-sm"
                >
                    <Eye className="w-4 h-4" /> Visualizar Relatório
                </button>
            </div>
        </div>
    )
}