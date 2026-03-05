import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutList, Plus, ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/PageHeader";
import { SearchBar } from "../../components/SearchBar";
import { CountCard, type Count } from "./CountCard";
import { CountModal } from "./CountModal";
import { type List } from "../Lists/ListTable";
import { countsService } from "../../features/counts/services";
import { listsService } from "../../features/lists/services";

type FilterOption = 'all' | 'open' | 'closed'

interface ListCountBackend {
    listCountId: number
    status: string
    updateAt?: string
    list?: {
        description: string
    }
    user?: {
        name: string
    }
}

export function Counts() {
    const navigate = useNavigate()
    const [counts, setCounts] = useState<Count[]>([])
    const [availableLists, setAvailableLists] = useState<List[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterOption, setFilterOption] = useState<FilterOption>("all")
    const [isModalOpen, setIsModalOpen] = useState(false)

    const loadData = useCallback(async () => {
        try {
            setLoading(true)
            const [listsRes, countsRes] = await Promise.all([
                listsService.list(),
                countsService.list()
            ])
            
            const activeLists = (listsRes.data as List[]).filter(l => !l.isInactive)
            setAvailableLists(activeLists)

            const backendData = countsRes.data as ListCountBackend[]
            
            const formattedCounts: Count[] = backendData.map((c) => ({
                id: c.listCountId,
                listName: c.list?.description || "Lista não identificada",
                status: c.status === "Aberta" ? "in_progress" : "completed",
                totalProducts: 0, 
                countedProducts: 0,
                createdBy: c.user?.name || "Usuário",
                updatedAt: c.updateAt 
                    ? new Date(c.updateAt).toLocaleString('pt-BR', { 
                        day: '2-digit', month: '2-digit', year: 'numeric', 
                        hour: '2-digit', minute: '2-digit' 
                      }) 
                    : "Data indisponível"
            }))

            formattedCounts.sort((a, b) => b.id - a.id)
            setCounts(formattedCounts)
        } catch (error: unknown) {
            console.error("Erro ao carregar dados:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadData()
    }, [loadData])

    const handleStartCount = async (listId: number) => {
        try {
            const response = await countsService.start(listId)
            navigate(`/counting/${response.data.listCountId}`)
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error || "Erro ao iniciar contagem.")
            }
        }
    }

    const handleClose = async (id: number) => {
        if (!window.confirm("Deseja encerrar esta contagem definitivamente?")) return
        try {
            await countsService.close(id)
            await loadData()
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error || "Erro ao encerrar contagem.")
            }
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja excluir esta contagem?")) return
        try {
            await countsService.delete(id)
            setCounts(prev => prev.filter(c => c.id !== id))
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error || "Erro ao excluir contagem.")
            }
        }
    }

    const filteredCounts = useMemo(() => {
        return counts.filter(c => {
            const term = search.toLowerCase()
            const matches = c.listName.toLowerCase().includes(term) || c.id.toString().includes(term)
            
            if (filterOption === 'open') return matches && c.status === 'in_progress'
            if (filterOption === 'closed') return matches && c.status === 'completed'
            return matches
        })
    }, [counts, search, filterOption])

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <button 
                onClick={() => navigate("/home")} 
                className="flex items-center gap-2 text-gray-500 hover:text-brand-600 mb-6 font-medium group transition-colors text-sm"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Voltar ao Dashboard
            </button>

            <PageHeader 
                title="Gerenciamento de Contagens"
                subtitle={loading ? "Carregando..." : `Total de ${filteredCounts.length} sessões`}
                icon={<LayoutList className="w-6 h-6 text-white" />}
                iconBgColor="bg-orange-600"
                action={
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-brand-500 hover:bg-brand-600 shadow-md">
                        <Plus className="w-5 h-5" /> Nova Contagem
                    </Button>
                }
            />

            <div className="flex flex-col md:flex-row gap-4 mb-8 mt-6">
                <div className="flex-1">
                    <SearchBar value={search} onChange={setSearch} placeholder="Buscar por ID ou nome da lista..." />
                </div>
                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex items-center h-[66px] px-4 gap-2">
                    {(['all', 'open', 'closed'] as const).map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setFilterOption(opt)}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                                filterOption === opt ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {opt === 'all' ? 'Todas' : opt === 'open' ? 'Abertas' : 'Fechadas'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
                    <p className="text-gray-500 font-medium">Buscando dados no servidor...</p>
                </div>
            ) : filteredCounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCounts.map((count) => (
                        <CountCard 
                            key={count.id} 
                            count={count} 
                            onAction={(c) => {
                                if (c.status === 'in_progress') {
                                    navigate(`/counting/${c.id}`)
                                } else {
                                    navigate(`/counts/view/${c.id}`)
                                }
                            }}
                            onDelete={handleDelete}
                            onCloseCount={handleClose} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">Nenhuma contagem encontrada</h3>
                </div>
            )}

            <CountModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Iniciar Nova Contagem" 
                onSuccess={loadData}
                availableLists={availableLists.map((l) => ({ 
                    listId: l.listId, 
                    description: l.description 
                }))}
                onConfirmSelect={handleStartCount}
            />
        </div>
    )
}