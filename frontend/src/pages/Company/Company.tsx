import { useState, useEffect } from "react";
import { ChevronLeft, Building2, Edit3, Save, X, Info, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; 

interface CompanyData {
    companyId: number
    name: string
    cnpj: string
}

export function Company() {
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    
    const [companyData, setCompanyData] = useState<CompanyData | null>(null)
    const [formData, setFormData] = useState({
        name: ""
    })

    useEffect(() => {
        async function loadCompany() {
        try {
            setLoading(true)
            const response = await api.get("/company")
            const data = response.data
            
            setCompanyData(data)
            setFormData({
            name: data.name || ""
            })
        } catch (error) {
            console.error("Erro ao carregar dados da empresa:", error)
        } finally {
            setLoading(false)
        }
        }
        loadCompany()
    }, [])

    const handleSave = async () => {
        if (!companyData) return
        
        try {
            setSaving(true)
            const response = await api.put(`/company/${companyData.companyId}`, formData)
            
            setCompanyData(response.data)
            setIsEditing(false)
        } catch (error: unknown) {
            let errorMessage = "Erro ao atualizar dados."
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response: { data: { error: string } } }
                errorMessage = axiosError.response?.data?.error || errorMessage
            }
            alert(errorMessage)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
        <button 
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-600 mb-6 font-medium transition-colors text-sm group"
        >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Dashboard
        </button>

        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
                <div className="bg-brand-500 p-3 rounded-2xl shadow-lg shadow-brand-100">
                    <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Informações da Empresa</h1>
                    <p className="text-gray-500 text-sm">Gerencie os dados cadastrais</p>
                </div>
            </div>

            {!isEditing && (
            <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#9A4312] text-white rounded-2xl font-bold hover:bg-[#7d360f] transition-all shadow-md"
            >
                <Edit3 className="w-5 h-5" /> Editar Informações
            </button>
            )}
        </div>

        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-brand-600 p-8 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">{companyData?.name}</h2>
                    <p className="text-brand-100 text-sm mt-1 font-medium tracking-wide">
                        CNPJ: {companyData?.cnpj}
                    </p>
                </div>
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Empresa Ativa
                </span>
            </div>

            <div className="p-8">
                <div className="flex items-center gap-2 mb-8 text-gray-900 font-bold border-b border-gray-50 pb-4">
                    <div className="p-1.5 bg-blue-50 text-brand-500 rounded-lg">
                        <Info className="w-5 h-5" />
                    </div>
                    <h3>Dados Cadastrais</h3>
                </div>

                {isEditing ? (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Razão Social *</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                value={formData.name}
                                onChange={e => setFormData({ name: e.target.value })}
                            />
                            <p className="text-xs text-gray-400 mt-2 italic">O CNPJ não pode ser alterado através desta interface.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-400 uppercase">Nome Fantasia / Razão Social</span>
                            <p className="text-lg font-bold text-gray-800">{companyData?.name}</p>
                        </div>
                    </div>
                )}
            </div>

            {isEditing && (
                <div className="p-8 pt-4 flex flex-col md:flex-row gap-4 border-t border-gray-50">
                    <button 
                        onClick={() => setIsEditing(false)}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                    >
                        <X className="w-5 h-5" /> Cancelar
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#9A4312] text-white rounded-2xl font-bold hover:bg-[#7d360f] transition-all shadow-lg shadow-orange-100 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Salvar Alterações
                    </button>
                </div>
            )}
        </div>

        {!isEditing && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-[24px] flex gap-4 items-start text-blue-700">
                <Info className="w-6 h-6 shrink-0" />
                <div>
                    <h4 className="font-bold">Informação do Sistema</h4>
                    <p className="text-sm opacity-80">
                        Estes dados são partilhados por todos os utilizadores desta empresa no sistema.
                    </p>
                </div>
            </div>
        )}
        </div>
    )
}