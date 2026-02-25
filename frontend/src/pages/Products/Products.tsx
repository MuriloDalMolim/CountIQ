import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus, ChevronLeft, Filter } from "lucide-react";

import { productsService } from "../../features/products/services";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/PageHeader";
import { SearchBar } from "../../components/SearchBar";

import { ProductTable, type Product } from "./ProductTable";
import { ProductModal } from "./ProductModal";

type FilterStatus = 'all' | 'active' | 'inactive'

export function Products() {
    const navigate = useNavigate()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true)
            let response
            if (filterStatus === 'all') {
                response = await productsService.list()
            } else {
                const isInactiveValue = filterStatus === 'inactive'
                response = await productsService.list(isInactiveValue)
            }

            setProducts(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error("Erro ao carregar produtos:", error)
        } finally {
            setLoading(false)
        }
    }, [filterStatus])

    useEffect(() => {
        loadProducts()
    }, [loadProducts])

    const handleEdit = (product: Product) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    const filteredProducts = products.filter(p => {
        const term = search.toLowerCase()
        return (
            (p.description?.toLowerCase().includes(term) ?? false) ||
            (p.barcode?.toLowerCase().includes(term) ?? false)
        )
    })

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <button 
                onClick={() => navigate("/home")}
                className="flex items-center gap-2 text-gray-500 hover:text-brand-600 mb-6 font-medium"
            >
                <ChevronLeft className="w-4 h-4" />
                Voltar ao Dashboard
            </button>

            <PageHeader 
                title="Gerenciamento de Produtos"
                subtitle={loading ? "Carregando..." : `Total de ${filteredProducts.length} produtos`}
                icon={<Package className="w-6 h-6 text-white" />}
                iconBgColor="bg-blue-600"
                action={
                    <Button onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }} className="gap-2">
                        <Plus className="w-5 h-5" />
                        Novo Produto
                    </Button>
                }
            />

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <SearchBar value={search} onChange={setSearch} placeholder="Buscar por descrição ou código..." />
                </div>
                
                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex items-center h-[66px] px-4 gap-2">
                    <Filter className="w-4 h-4 text-gray-400 mr-2" />
                    <button
                        type="button"
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filterStatus === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Todos
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterStatus('active')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filterStatus === 'active' ? 'bg-green-50 text-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Ativos
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterStatus('inactive')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filterStatus === 'inactive' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Inativos
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    Sincronizando...
                </div>
            ) : (
                <ProductTable products={filteredProducts} onEdit={handleEdit} />
            )}

            <ProductModal 
                key={`${selectedProduct?.productId || 'new'}-${isModalOpen}`}
                isOpen={isModalOpen} 
                onClose={() => { setIsModalOpen(false); setSelectedProduct(null); }} 
                productToEdit={selectedProduct}
                title={selectedProduct ? "Editar Produto" : "Novo Produto"}
                onSuccess={loadProducts}
            />
        </div>
    )
}