import React from 'react';
import { cn } from '../../lib/cn';

const variants = {
    ghost: 'bg-transparent text-muted hover:bg-gray-100',
    surface: 'bg-surface text-ink shadow-sm hover:bg-gray-50',
    danger: 'bg-transparent text-danger hover:bg-danger-soft'
};

// Botón de solo ícono. `label` es obligatorio: es lo que leen los lectores de pantalla.
export function IconButton({
    icon: Icon,
    label,
    variant = 'ghost',
    size = 20,
    type = 'button',
    className,
    ...props
}) {
    return (
        <button
            type={type}
            aria-label={label}
            title={label}
            className={cn(
                'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-pill border-0 transition-colors',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                'disabled:cursor-not-allowed disabled:opacity-50',
                variants[variant],
                className
            )}
            {...props}
        >
            <Icon size={size} aria-hidden="true" />
        </button>
    );
}
