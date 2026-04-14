import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { listsService } from '../../features/lists/services';
import { type List } from './ListTable';

interface ListModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSuccess: () => void;
    listToEdit?: List | null;
}

export function ListModal({
    isOpen,
    onClose,
    title,
    onSuccess,
    listToEdit,
}: ListModalProps) {
    const [formData, setFormData] = useState({
        description: listToEdit?.description ?? '',
        isInactive: listToEdit?.isInactive ?? false,
    });

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (listToEdit) {
                await listsService.update(listToEdit.listId, formData);
            } else {
                await listsService.create(formData);
            }
            onSuccess();
            onClose();
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Erro desconhecido ao salvar lista';

            alert(errorMessage);
            console.error(error);
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <Input
                        label="Descrição da Lista"
                        placeholder="Ex: Lista de Inventário 2026"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        required
                    />

                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                        <input
                            type="checkbox"
                            checked={formData.isInactive}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    isInactive: e.target.checked,
                                })
                            }
                            className="w-4 h-4 accent-red-500 rounded border-gray-300"
                        />
                        <span className="text-sm font-bold text-red-600">
                            Inativar Lista
                        </span>
                    </label>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-gray-600"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 py-3 bg-orange-700 hover:bg-orange-800 border-none"
                        >
                            {listToEdit ? 'Salvar Alterações' : 'Criar Lista'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
