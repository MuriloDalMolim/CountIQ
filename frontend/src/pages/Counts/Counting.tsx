import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Save, Plus, Minus, Package } from 'lucide-react';
import axios from 'axios';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/PageHeader';
import { SearchBar } from '../../components/SearchBar';
import api from '../../services/api';

interface ProductDetail {
    productId: number;
    product?: {
        description: string;
        barcode: string;
    };
    description?: string;
    barcode?: string;
}

interface CountItem {
    productId: number;
    quantity: number;
}

interface CountingSession {
    listCountId: number;
    status: string;
    count_item: CountItem[];
    list: {
        name: string;
        product_list: ProductDetail[];
    };
}

interface ProductItemProps {
    item: ProductDetail;
    initialQty: number;
    onUpdate: (
        productId: number,
        qty: number,
        mode: 'increment' | 'set',
    ) => Promise<void>;
}

function ProductItem({ item, initialQty, onUpdate }: ProductItemProps) {
    const [localQty, setLocalQty] = useState(initialQty.toString());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLocalQty(initialQty.toString());
    }, [initialQty]);

    const productName =
        item.product?.description ||
        item.description ||
        'Produto sem descrição';
    const productBarcode = item.product?.barcode || item.barcode || '---';

    const handleBlur = async () => {
        const val = Number(localQty);
        if (val === initialQty) return;
        setLoading(true);
        await onUpdate(item.productId, val, 'set');
        setLoading(false);
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
            <div>
                <h4 className="font-bold text-gray-900 text-lg">
                    {productName}
                </h4>
                <p className="text-sm font-mono text-brand-500">
                    {productBarcode}
                </p>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                <button
                    disabled={loading || Number(localQty) <= 0}
                    onClick={async (e) => {
                        e.preventDefault();
                        setLoading(true);
                        await onUpdate(item.productId, -1, 'increment');
                        setLoading(false);
                    }}
                    className="p-2 bg-white text-gray-600 rounded-lg shadow-sm hover:text-red-600 disabled:opacity-50 transition-colors"
                >
                    <Minus className="w-5 h-5" />
                </button>

                <div className="w-20 text-center">
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto text-brand-500" />
                    ) : (
                        <input
                            type="number"
                            value={localQty}
                            onChange={(e) => setLocalQty(e.target.value)}
                            onBlur={handleBlur}
                            className="w-full text-center bg-transparent font-bold text-xl text-brand-600 focus:outline-none"
                        />
                    )}
                </div>

                <button
                    disabled={loading}
                    onClick={async (e) => {
                        e.preventDefault();
                        setLoading(true);
                        await onUpdate(item.productId, 1, 'increment');
                        setLoading(false);
                    }}
                    className="p-2 bg-white text-gray-600 rounded-lg shadow-sm hover:text-green-600 disabled:opacity-50 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export function Counting() {
    const { listId } = useParams<{ listId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<CountingSession | null>(null);
    const [search, setSearch] = useState('');

    const loadData = useCallback(async () => {
        if (!listId) return;
        try {
            setLoading(true);
            const response = await api.get(`/listcount/${listId}`);
            setSession(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(
                    error.response?.data?.error || 'Erro ao carregar sessão.',
                );
            }
            navigate('/counts');
        } finally {
            setLoading(false);
        }
    }, [listId, navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleUpdateQuantity = async (
        productId: number,
        quantity: number,
        mode: 'increment' | 'set',
    ) => {
        if (!listId || !session) return;
        try {
            await api.post(`/countitem/${listId}`, {
                productId,
                quantity,
                mode,
            });

            setSession((prev) => {
                if (!prev) return null;
                const existingIndex = prev.count_item.findIndex(
                    (i) => i.productId === productId,
                );
                const newCountItems = [...prev.count_item];

                if (existingIndex > -1) {
                    const currentQty = newCountItems[existingIndex].quantity;
                    const newQty =
                        mode === 'increment' ? currentQty + quantity : quantity;
                    newCountItems[existingIndex] = {
                        ...newCountItems[existingIndex],
                        quantity: Math.max(0, newQty),
                    };
                } else {
                    newCountItems.push({
                        productId,
                        quantity: Math.max(0, quantity),
                    });
                }

                return { ...prev, count_item: newCountItems };
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(
                    error.response?.data?.error ||
                        'Erro ao atualizar quantidade.',
                );
            }
        }
    };

    const filteredProducts =
        session?.list?.product_list?.filter((p) => {
            const desc = (
                p.product?.description ||
                p.description ||
                ''
            ).toLowerCase();
            const code = (p.product?.barcode || p.barcode || '').toLowerCase();
            const term = search.toLowerCase();
            return desc.includes(term) || code.includes(term);
        }) || [];

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-brand-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="font-medium">Carregando auditoria...</p>
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
            <button
                onClick={() => navigate('/counts')}
                className="flex items-center gap-2 text-gray-500 hover:text-brand-600 mb-6 font-medium transition-colors"
            >
                <ChevronLeft className="w-4 h-4" /> Voltar
            </button>

            <PageHeader
                title={session?.list?.name || 'Contagem'}
                subtitle={`Sessão #${listId}`}
                icon={<Package className="w-6 h-6 text-white" />}
                iconBgColor="bg-orange-500"
                action={
                    <Button
                        onClick={() => navigate('/counts')}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Save className="w-4 h-4 mr-2" /> Finalizar
                    </Button>
                }
            />

            <div className="mb-8 mt-8">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Bipar código ou pesquisar descrição..."
                />
            </div>

            <div className="grid gap-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((item) => (
                        <ProductItem
                            key={item.productId}
                            item={item}
                            initialQty={
                                session?.count_item.find(
                                    (i) => i.productId === item.productId,
                                )?.quantity || 0
                            }
                            onUpdate={handleUpdateQuantity}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400">
                            Nenhum produto listado ou encontrado.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
