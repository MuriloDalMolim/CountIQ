import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Loader2,
    FileText,
    Printer,
    AlertCircle,
} from 'lucide-react';
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

interface CountItemData {
    productId: number;
    quantity: number;
}

interface CountingSession {
    listCountId: number;
    status: string;
    updatedAt: string;
    count_item: CountItemData[];
    list: {
        name: string;
        product_list: ProductDetail[];
    };
}

export function CountView() {
    const params = useParams();
    const id = params.id || params.listId;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<CountingSession | null>(null);
    const [search, setSearch] = useState('');

    const loadData = useCallback(async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get(`/listcount/${id}`);
            setSession(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(
                    error.response?.data?.error ||
                        'Erro ao carregar relatório.',
                );
            }
            navigate('/counts');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredItems =
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

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }).format(date);
        } catch {
            return 'Data não disponível';
        }
    };

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-brand-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="font-medium">Carregando relatório...</p>
            </div>
        );

    if (!session)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
                <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
                <p className="font-bold">Sessão não encontrada.</p>
                <Button onClick={() => navigate('/counts')} className="mt-4">
                    Voltar
                </Button>
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
                title={`Relatório de Contagem #${id}`}
                subtitle={`Lista: ${session.list?.name} | Atualizado em: ${formatDate(session.updatedAt)}`}
                icon={<FileText className="w-6 h-6 text-white" />}
                iconBgColor="bg-orange-600"
                action={
                    <Button
                        onClick={() => window.print()}
                        className="bg-gray-800 hover:bg-black gap-2"
                    >
                        <Printer className="w-4 h-4" /> Imprimir PDF
                    </Button>
                }
            />

            <div className="mb-6 mt-8">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Filtrar por descrição ou código de barras..."
                />
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">
                                Produto
                            </th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">
                                Cód. Barras
                            </th>
                            <th className="px-6 py-4 text-sm font-bold text-center text-gray-600">
                                Qtd Contada
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredItems.map((item) => {
                            const qty =
                                session.count_item.find(
                                    (ci: CountItemData) =>
                                        ci.productId === item.productId,
                                )?.quantity || 0;
                            return (
                                <tr
                                    key={item.productId}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">
                                            {item.product?.description ||
                                                item.description ||
                                                'Sem descrição'}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            ID: {item.productId}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-gray-500">
                                        {item.product?.barcode ||
                                            item.barcode ||
                                            '---'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-lg font-black text-lg ${qty > 0 ? 'text-brand-600' : 'text-gray-300'}`}
                                        >
                                            {qty}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
