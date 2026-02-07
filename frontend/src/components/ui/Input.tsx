import { type ComponentProps, type ReactNode } from "react";

interface InputProps extends ComponentProps<'input'> {
    label?: string;
    icon?: ReactNode; 
}

export function Input({ label, className, ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
        {label && (
            <label className="text-sm font-medium text-gray-700">
            {label}
            </label>
        )}
        <input 
            className={`
            w-full rounded-lg border border-gray-200 bg-white px-4 py-3 
            text-gray-900 outline-none transition-all
            placeholder:text-gray-400 
            focus:border-brand-500 focus:ring-1 focus:ring-brand-500
            ${className}
            `}
            {...props}
        />
        </div>
    );
}