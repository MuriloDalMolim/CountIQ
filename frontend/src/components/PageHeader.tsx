import { type ReactNode } from "react";

interface PageHeaderProps {
    title: string
    subtitle: string
    icon: ReactNode
    iconBgColor?: string
    action?: ReactNode
}

export function PageHeader({ 
    title, 
    subtitle, 
    icon, 
    iconBgColor = "bg-brand-500", 
    action 
}: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
                <div className={`${iconBgColor} p-3 rounded-xl shadow-lg shadow-brand-500/20 text-white`}>
                    {icon}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h2>
                    <p className="text-gray-500 text-sm font-medium">{subtitle}</p>
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
  )
}   