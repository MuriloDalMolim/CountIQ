import { type ComponentProps } from "react";

interface ButtonProps extends ComponentProps<'button'> {
    variant?: 'primary' | 'ghost' | 'outline';
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  
    const baseStyles = "rounded-xl font-bold transition-all active:scale-[0.98] flex items-center justify-center";
  
    const variants = {
        primary: "bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 hover:shadow-brand-500/40",
        ghost: "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50",
        outline: "border border-gray-200 text-gray-700 hover:bg-gray-50"
    };

    const padding = variant === 'primary' ? 'py-3.5 px-6' : 'py-2 px-4';

    return (
        <button 
        className={`${baseStyles} ${variants[variant]} ${padding} ${className || ''}`} 
        {...props}
        >
        {children}
        </button>
    );
}