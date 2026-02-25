import { useState, useEffect, useCallback, useMemo } from "react";
import { X, Box, Search } from "lucide-react";
import { productListService } from "../../features/lists/productListService";
import { Button } from "../../components/ui/Button";
import type { List } from "./ListTable";
import type { Product } from "../Products/ProductTable";

interface ViewProductsModalProps {
    isOpen: boolean
    onClose: () => void
    list: List | null
}

export function ViewProductsModal({ isOpen, onClose, list }: ViewProductsModalProps) {
    const [listProducts, setListProducts] = useState<Product[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            document.documentElement.style.overflow = 'hidden'
            document.body.style.overflow = 'hidden'
        } else {
            document.documentElement.style.overflow = ''
            document.body.style.overflow = ''
        }
        return () => {
            document.documentElement.style.overflow = ''
            document.body.style.overflow = ''
        }
    }, [isOpen])

    const fetchData = useCallback(async () => {
        if (!list) return
        try {
            setLoading(true)
            const response = await productListService.getProducts(list.listId)
            
            const currentItems = Array.isArray(response.data) 
                ? response.data.map((item: { product: Product }) => item.product) 
                : []

            const sortedItems = [...currentItems].sort((a, b) => 
                a.description.localeCompare(b.description)
            )

            setListProducts(sortedItems)
        } catch (error) {
            console.error("Erro ao carregar produtos da lista:", error)
        } finally {
            setLoading(false)
        }
    }, [list])

    useEffect(() => {
        if (isOpen && list) fetchData()
    }, [isOpen, list, fetchData])

    const filteredProducts = useMemo(() => {
        const term = search.toLowerCase()
        return listProducts.filter(p => 
        p.description.toLowerCase().includes(term) || 
        p.barcode.includes(term)
        )
    }, [listProducts, search])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[70vh] border-none">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Produtos na Lista</h2>
                        <p className="text-gray-500 font-medium">{list?.description}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="px-8 py-4 border-b border-gray-50 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 text-sm" 
                            placeholder="Buscar por nome ou código..." 
                        />
                    </div>
                </div>

                <div 
                    className="flex-1 overflow-y-auto p-8 overscroll-contain"
                    style={{ 
                        transform: 'translateZ(0)', 
                        WebkitOverflowScrolling: 'touch' 
                    }}
                    >
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                            {filteredProducts.map((p) => (
                                <div key={p.productId} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center transition-none">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800">{p.description}</span>
                                        <span className="text-xs text-brand-600 font-mono mt-1 font-semibold">
                                        Cód: {p.barcode}
                                        </span>
                                    </div>
                                    <Box className="w-5 h-5 text-gray-300" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            <Box className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Nenhum produto encontrado.</p>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-white border-t border-gray-100 flex justify-end shrink-0">
                <Button 
                onClick={onClose} 
                className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-2.5 rounded-xl font-bold border-none transition-none"
                >
                    Fechar Visualização
                </Button>
                </div>
            </div>
        </div>
    )
}