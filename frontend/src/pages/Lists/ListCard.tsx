import { Pencil, Eye, Box } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import type { List } from "./ListTable";

interface ListCardProps {
    list: List
    onEdit: (list: List) => void
    onManageProducts: (list: List) => void
    onViewProducts: (list: List) => void
}

export function ListCard({ list, onEdit, onManageProducts, onViewProducts }: ListCardProps) {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                        {list.description}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-1 font-medium">
                        <Box className="w-4 h-4" />
                        <span>{list.productsCount ?? 0} produtos vinculados</span>
                    </div>
                </div>
                <Badge variant={!list.isInactive ? 'success' : 'neutral'}>
                    {!list.isInactive ? 'Ativa' : 'Inativa'}
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button 
                type="button"
                onClick={() => onManageProducts(list)}
                className="flex items-center justify-center gap-2 py-3 bg-brand-500 text-white rounded-2xl font-bold hover:bg-brand-600 transition-all active:scale-95 shadow-sm shadow-brand-200"
                >
                    <Box className="w-4 h-4" /> 
                    Produtos
                </button>
                <button 
                type="button"
                onClick={() => onViewProducts(list)}
                className="flex items-center justify-center gap-2 py-3 border-2 border-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95"
                >
                    <Eye className="w-4 h-4" /> Ver
                </button>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-center">
                <button 
                type="button"
                onClick={() => onEdit(list)}
                className="flex items-center justify-center gap-2 text-gray-400 font-bold text-sm hover:text-blue-600 transition-colors group/edit"
                >
                    <Pencil className="w-4 h-4 group-hover/edit:scale-110 transition-transform" /> 
                    Editar Informações
                </button>
            </div>
        </div>
    )
}
