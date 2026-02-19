import { Search } from "lucide-react";
import { Input } from "./ui/Input";

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                    placeholder={placeholder || "Buscar..."} 
                    className="pl-11" 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    )
}