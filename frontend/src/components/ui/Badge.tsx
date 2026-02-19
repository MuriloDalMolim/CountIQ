interface BadgeProps {
    variant: 'success' | 'danger' | 'info' | 'neutral'
    children: React.ReactNode
    icon?: React.ReactNode
}

export function Badge({ variant, children, icon }: BadgeProps) {
    const styles = {
        success: "bg-green-50 text-green-600 border-green-100",
        danger: "bg-red-50 text-red-600 border-red-100",
        info: "bg-blue-50 text-blue-600 border-blue-100",
        neutral: "bg-gray-100 text-gray-500 border-gray-200"
}

return (
    <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold border ${styles[variant]}`}>
        {icon}
        {children}
        </span>
    )
}