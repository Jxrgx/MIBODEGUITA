import React from 'react';
import { cn } from '../../lib/cn';

// Pastilla seleccionable (filtros, subcategorías)
export function Chip({ selected = false, icon: Icon, className, children, ...props }) {
    return (
        <button
            type="button"
            aria-pressed={selected}
            className={cn(
                'inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-pill border px-4 font-sans text-sm font-semibold whitespace-nowrap transition-colors',
                // Se ve de 36 px pero el área táctil llega a 44 px
                'relative after:absolute after:inset-x-0 after:-inset-y-1 after:content-[\'\']',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                selected
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-surface text-muted hover:bg-gray-50',
                className
            )}
            {...props}
        >
            {Icon && <Icon size={16} aria-hidden="true" />}
            {children}
        </button>
    );
}
