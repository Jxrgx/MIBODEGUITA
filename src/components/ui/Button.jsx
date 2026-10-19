import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

const variants = {
    // Amarillo de marca: acción principal (pagar, agregar)
    primary: 'bg-secondary text-ink border-secondary hover:bg-secondary-hover hover:border-secondary-hover',
    // Azul de marca: acción destacada secundaria
    brand: 'bg-primary text-white border-primary hover:bg-primary-dark hover:border-primary-dark',
    outline: 'bg-surface text-ink border-border hover:bg-gray-50',
    ghost: 'bg-transparent text-primary border-transparent hover:bg-primary-soft',
    danger: 'bg-danger-soft text-danger border-danger-soft hover:bg-red-100 hover:border-red-100'
};

const sizes = {
    sm: 'min-h-9 px-3 text-sm',
    md: 'min-h-11 px-5 text-[0.95rem]',
    lg: 'min-h-13 px-6 text-base'
};

export function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    type = 'button',
    disabled,
    className,
    children,
    ...props
}) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={cn(
                'inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-pill border font-sans font-semibold leading-tight',
                'transition-[transform,background-color,border-color] duration-150 active:scale-[0.98]',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className
            )}
            {...props}
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            ) : (
                LeftIcon && <LeftIcon size={18} aria-hidden="true" />
            )}
            {children}
            {!loading && RightIcon && <RightIcon size={18} aria-hidden="true" />}
        </button>
    );
}
