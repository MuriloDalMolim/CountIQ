import { ChevronRight, type LucideIcon } from "lucide-react";

interface ModuleCardProps {
    title: string
    description: string
    icon: LucideIcon
    action: () => void
    iconColor?: string
    bgColor?: string
}

export function ModuleCard({ 
    title, 
    description, 
    icon: Icon, 
    action, 
    iconColor = "text-gray-700", 
    bgColor = "bg-gray-50" 
}: ModuleCardProps) {
    return (
        <button
            onClick={action}
            className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 text-left flex flex-col justify-between h-48"
        >
            <div className="flex justify-between items-start w-full">
                <div className={`p-3 rounded-lg ${bgColor} group-hover:bg-orange-50 transition-colors`}>
                    <Icon className={`w-6 h-6 ${iconColor} group-hover:text-orange-600 transition-colors`} />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-400 transition-colors" />
            </div>

            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                    {description}
                </p>
            </div>
        </button>
    )
}