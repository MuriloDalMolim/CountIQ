import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ClipboardList,
    Plus,
    ChevronLeft,
    Filter,
    Loader2,
} from 'lucide-react';

import { listsService } from '../../features/lists/services';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/PageHeader';
import { SearchBar } from '../../components/SearchBar';

import { ListCard } from './ListCard';
import { ListModal } from './ListModal';
import { ManageProductsModal } from './ManageProductsModal';
import { ViewProductsModal } from './ViewProductsModal';
import { type List } from './ListTable';

type FilterStatus = 'all' | 'active' | 'inactive';

interface ListFromBackend extends List {
    _count?: {
        product_list: number;
    };
}

export function Lists() {
    const navigate = useNavigate();
    const [lists, setLists] = useState<List[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedList, setSelectedList] = useState<List | null>(null);

    const loadLists = useCallback(async () => {
        try {
            setLoading(true);
            const response = await listsService.list();
            const backendData = response.data as ListFromBackend[];
            const formattedLists: List[] = backendData.map((item) => ({
                ...item,
                productsCount: item._count?.product_list || 0,
            }));

            setLists(formattedLists);
        } catch (error) {
            console.error('Erro ao carregar listas:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLists();
    }, [loadLists]);

    const handleEdit = (list: List) => {
        setSelectedList(list);
        setIsModalOpen(true);
    };

    const handleManageProducts = (list: List) => {
        setSelectedList(list);
        setIsManageModalOpen(true);
    };

    const handleViewProducts = (list: List) => {
        setSelectedList(list);
        setIsViewModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedList(null);
        setIsModalOpen(true);
    };

    const filteredAndSortedLists = lists
        .filter((l) => {
            const term = search.toLowerCase();
            const matchesSearch = l.description?.toLowerCase().includes(term);
            const matchesStatus =
                filterStatus === 'all'
                    ? true
                    : filterStatus === 'active'
                      ? !l.isInactive
                      : l.isInactive;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (a.isInactive !== b.isInactive) return a.isInactive ? 1 : -1;
            return a.description.localeCompare(b.description);
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
                title="Gerenciamento de Listas"
                subtitle={
                    loading
                        ? 'Carregando...'
                        : `Total de ${filteredAndSortedLists.length} listas`
                }
                icon={<ClipboardList className="w-6 h-6 text-white" />}
                iconBgColor="bg-orange-600"
                action={
                    <Button
                        onClick={handleCreate}
                        className="gap-2 bg-brand-500 hover:bg-brand-600 shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        Nova Lista
                    </Button>
                }
            />

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Buscar listas por descrição..."
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
            ) : filteredAndSortedLists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedLists.map((list) => (
                        <ListCard
                            key={list.listId}
                            list={list}
                            onEdit={handleEdit}
                            onManageProducts={handleManageProducts}
                            onViewProducts={handleViewProducts}
                        />
                    ))}
                </div>
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

            <ListModal
                key={selectedList?.listId || 'new-list'}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedList(null);
                }}
                title={selectedList ? 'Editar Lista' : 'Nova Lista'}
                onSuccess={loadLists}
                listToEdit={selectedList}
            />

            <ManageProductsModal
                key={`manage-${selectedList?.listId || 'none'}`}
                isOpen={isManageModalOpen}
                onClose={() => {
                    setIsManageModalOpen(false);
                    setSelectedList(null);
                }}
                list={selectedList}
                onSuccess={loadLists}
            />

            <ViewProductsModal
                key={`view-${selectedList?.listId || 'none'}`}
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedList(null);
                }}
                list={selectedList}
            />
        </div>
    );
}
