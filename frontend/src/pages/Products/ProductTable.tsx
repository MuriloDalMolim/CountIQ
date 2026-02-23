import { Pencil, Box, Tag, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "../../components/ui/Badge";

export interface Product {
    productId: number
    description: string
    barcode: string
    companyId: number
    isInactive: boolean
}

interface ProductTableProps {
    products: Product[]
    onEdit: (product: Product) => void
}

export function ProductTable({ products, onEdit }: ProductTableProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Produto</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Código de Barras</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                                Nenhum produto cadastrado ou encontrado.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.productId} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 group-hover:bg-white transition-colors">
                                            <Box className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <span className="font-bold text-gray-900">{product.description}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md w-fit">
                                        <Tag className="w-3 h-3 text-gray-400" />
                                        {product.barcode}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge 
                                    variant={!product.isInactive ? 'success' : 'neutral'}
                                    icon={!product.isInactive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                    >
                                        {!product.isInactive ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                    onClick={() => onEdit(product)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}