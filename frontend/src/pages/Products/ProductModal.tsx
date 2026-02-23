import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { productsService } from "../../features/products/services";
import { type Product } from "./ProductTable";

interface ProductModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    onSuccess: () => void
    productToEdit?: Product | null
}

export function ProductModal({ isOpen, onClose, title, onSuccess, productToEdit }: ProductModalProps) {
    const [formData, setFormData] = useState({
        description: productToEdit?.description ?? "",
        barcode: productToEdit?.barcode ?? "",
        isInactive: productToEdit?.isInactive ?? false
    })

    if (!isOpen) return null

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            if (productToEdit) {
                if (formData.isInactive !== productToEdit.isInactive) {
                await productsService.toggleStatus(productToEdit.productId, formData.isInactive)
                }
                await productsService.update(productToEdit.productId, {
                description: formData.description,
                barcode: formData.barcode
                })
            } else {
                await productsService.create(formData)
            }
            onSuccess()
            onClose()
        } catch (error: unknown) {
            const errorMessage = error instanceof Error 
                ? error.message 
                : "Erro ao processar produto"
                
            alert(errorMessage)
            console.error(error)
        }
    }

    return(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <Input 
                        label="Descrição" 
                        placeholder="Ex: Teclado Mecânico RGB"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                    
                    <Input 
                        label="Código de Barras" 
                        placeholder="Ex: 789123456789"
                        value={formData.barcode}
                        onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                        required
                    />
                    
                    {productToEdit && (
                        <div className="pt-2 border-t border-gray-50 mt-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isInactive}
                                    onChange={e => setFormData({ ...formData, isInactive: e.target.checked })}
                                    className="w-4 h-4 accent-red-500 rounded border-gray-300" 
                                />
                                <span className="text-sm font-bold text-red-600">
                                    Produto Inativo
                                </span>
                            </label>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" type="button" onClick={onClose} className="flex-1 py-3">
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1 py-3 bg-orange-700 hover:bg-orange-800 border-none">
                            {productToEdit ? "Salvar Alterações" : "Cadastrar Produto"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}