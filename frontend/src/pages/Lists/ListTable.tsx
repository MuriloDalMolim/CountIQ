import { Pencil, ClipboardList } from "lucide-react";
import { Badge } from "../../components/ui/Badge";

export interface List {
    listId: number
    description: string
    companyId: number
    isInactive: boolean
    productsCount?: number
}

interface ListTableProps {
    lists: List[]
    onEdit: (list: List) => void
}

export function ListTable({ lists, onEdit }: ListTableProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Lista</th>
                        <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Status</th>
                        <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {lists.map((list) => (
                        <tr key={list.listId} className="hover:bg-gray-50/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <ClipboardList className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <span className="font-semibold text-gray-700">{list.description}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <Badge variant={!list.isInactive ? 'success' : 'neutral'}>
                                    {!list.isInactive ? 'Ativa' : 'Inativa'}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => onEdit(list)} className="p-2 text-blue-400 hover:text-blue-600 transition-colors">
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
