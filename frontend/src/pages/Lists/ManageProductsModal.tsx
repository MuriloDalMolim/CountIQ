import { useState, useEffect, useCallback, useMemo } from "react";
import { X, Search, Plus, Trash2 } from "lucide-react";
import { productListService } from "../../features/lists/productListService";
import { productsService } from "../../features/products/services";
import { Button } from "../../components/ui/Button";
import type { List } from "./ListTable";
import type { Product } from "../Products/ProductTable";
import { AxiosError } from "axios";

interface ManageProductsModalProps {
    isOpen: boolean
    onClose: () => void
    list: List | null
    onSuccess: () => void
}

export function ManageProductsModal({ isOpen, onClose, list, onSuccess }: ManageProductsModalProps) {
    const [availableProducts, setAvailableProducts] = useState<Product[]>([])
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
            const [allRes, listRes] = await Promise.all([
                productsService.list(false), 
                productListService.getProducts(list.listId)
            ])

            const sortFn = (a: Product, b: Product) => a.description.localeCompare(b.description)

            setAvailableProducts(Array.isArray(allRes.data) ? [...allRes.data].sort(sortFn) : [])
            setListProducts(Array.isArray(listRes.data) 
                ? listRes.data.map((item: { product: Product }) => item.product).sort(sortFn) 
                : [])
        } catch (error) {
            console.error("Erro ao carregar produtos:", error)
        } finally {
            setLoading(false)
        }
    }, [list])

    useEffect(() => {
        if (isOpen && list) fetchData()
    }, [isOpen, list, fetchData])

    const filteredAvailable = useMemo(() => {
        const term = search.toLowerCase()
        return availableProducts.filter(p => 
            (p.description.toLowerCase().includes(term) || p.barcode.includes(term)) &&
            !listProducts.some(lp => lp.productId === p.productId)
        )
    }, [availableProducts, listProducts, search])

    async function handleAdd(barcode: string) {
        if (!list) return
        try {
            await productListService.insert(list.listId, barcode)
            await fetchData()
            onSuccess()
        } catch (error: unknown) {
            if (error instanceof AxiosError) alert(error.response?.data?.error || "Erro.")
        }
    }

    async function handleRemove(productId: number) {
        if (!list) return
        try {
            await productListService.remove(list.listId, productId)
            await fetchData()
            onSuccess()
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.status === 409) {
                if (confirm(`${error.response.data.error}\n\nDeseja forçar a exclusão?`)) {
                await productListService.remove(list.listId, productId, true)
                await fetchData()
                onSuccess()
                }
            }
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border-none">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Gerenciar Produtos</h2>
                        <p className="text-gray-500 font-medium">{list?.description}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2">
                
                    <div className="p-6 border-r border-gray-100 flex flex-col gap-4 overflow-hidden">
                        <h3 className="font-bold text-gray-800 text-lg shrink-0">Produtos Disponíveis</h3>
                        <div className="relative shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500" 
                                placeholder="Buscar..." 
                            />
                        </div>

                        <div 
                            className="flex-1 overflow-y-auto space-y-3 pr-2"
                            style={{ 
                                overscrollBehavior: 'contain',
                                transform: 'translateZ(0)',
                                WebkitOverflowScrolling: 'touch'
                            }}
                            >
                            {loading ? <div className="text-center py-10">Buscando...</div> : 
                                filteredAvailable.map(p => (
                                <div key={p.productId} className="p-4 border border-gray-100 rounded-2xl flex justify-between items-center bg-white hover:border-brand-200">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800">{p.description}</span>
                                        <span className="text-xs text-gray-400"># {p.barcode}</span>
                                    </div>
                                    <button onClick={() => handleAdd(p.barcode)} className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50/30 flex flex-col gap-4 overflow-hidden">
                        <h3 className="font-bold text-gray-800 text-lg shrink-0">Produtos na Lista</h3>
                        <div 
                            className="flex-1 overflow-y-auto space-y-3 pr-2"
                            style={{ 
                                overscrollBehavior: 'contain',
                                transform: 'translateZ(0)'
                            }}
                            >
                            {listProducts.map(p => (
                                <div key={p.productId} className="p-4 bg-white border border-gray-100 rounded-2xl flex justify-between items-center shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-700">{p.description}</span>
                                        <span className="text-xs text-gray-400"># {p.barcode}</span>
                                        </div>
                                    <button onClick={() => handleRemove(p.productId)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="p-6 bg-white border-t border-gray-100 flex justify-end shrink-0">
                    <Button onClick={onClose} className="bg-orange-700 text-white px-12 py-3 rounded-xl font-bold border-none transition-none">
                        Concluir Gerenciamento
                    </Button>
                </div>
            </div>
        </div>
    )
}