import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Package,
    Plus,
    ChevronLeft,
    Filter,
    Loader2,
    ClipboardList,
} from 'lucide-react';

import { productsService } from '../../features/products/services';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/PageHeader';
import { SearchBar } from '../../components/SearchBar';

import { ProductTable, type Product } from './ProductTable';
import { ProductModal } from './ProductModal';

type FilterStatus = 'all' | 'active' | 'inactive';

export function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            let response;
            if (filterStatus === 'all') {
                response = await productsService.list();
            } else {
                const isInactiveValue = filterStatus === 'inactive';
                response = await productsService.list(isInactiveValue);
            }

            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        } finally {
            setLoading(false);
        }
    }, [filterStatus]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    function handleCloseModal() {
        setIsModalOpen(false);
        setSelectedProduct(null);
    }

    const filteredProducts = products
        .filter((p) => {
            const term = search.toLowerCase();
            const matchesSearch =
                (p.description?.toLowerCase().includes(term) ?? false) ||
                (p.barcode?.toLowerCase().includes(term) ?? false);

            const matchesStatus =
                filterStatus === 'all'
                    ? true
                    : filterStatus === 'active'
                      ? !p.isInactive
                      : p.isInactive;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (a.isInactive !== b.isInactive) {
                return a.isInactive ? 1 : -1;
            }
            return (a.description || '').localeCompare(b.description || '');
        });

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-2 text-gray-500 hover:text-brand-600 mb-6 font-medium group transition-colors"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-base">Voltar ao Dashboard</span>
            </button>

            <PageHeader
                title="Gerenciamento de Produtos"
                subtitle={
                    loading
                        ? 'Carregando...'
                        : `Total de ${filteredProducts.length} produtos`
                }
                icon={<Package className="w-6 h-6 text-white" />}
                iconBgColor="bg-orange-600"
                action={
                    <Button
                        onClick={() => {
                            setSelectedProduct(null);
                            setIsModalOpen(true);
                        }}
                        className="gap-2 bg-brand-500 hover:bg-brand-600 shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        Novo Produto
                    </Button>
                }
            />

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Buscar por descrição ou código..."
                    />
                </div>

                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex items-center h-[66px] px-4 gap-2">
                    <Filter className="w-4 h-4 text-gray-400 mr-2" />
                    {(['all', 'active', 'inactive'] as const).map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setFilterStatus(opt)}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                                filterStatus === opt
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {opt === 'all'
                                ? 'Todas'
                                : opt === 'active'
                                  ? 'Ativas'
                                  : 'Inativas'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
                    <p className="text-gray-500 font-medium">
                        Buscando dados no servidor...
                    </p>
                </div>
            ) : filteredProducts.length > 0 ? (
                <ProductTable products={filteredProducts} onEdit={handleEdit} />
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">
                        Nenhuma lista encontrada
                    </h3>
                    <p className="text-gray-500">
                        Tente ajustar sua busca ou filtros.
                    </p>
                </div>
            )}

            <ProductModal
                key={`${selectedProduct?.productId || 'new'}-${isModalOpen}`}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                productToEdit={selectedProduct}
                title={selectedProduct ? 'Editar Produto' : 'Novo Produto'}
                onSuccess={loadProducts}
            />
        </div>
    );
}
