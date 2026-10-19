import React from 'react';
import { cn } from '../../lib/cn';

const tones = {
    neutral: 'bg-gray-100 text-muted',
    primary: 'bg-primary-soft text-primary',
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-warning',
    danger: 'bg-danger-soft text-danger',
    // Etiqueta sólida de oferta (sobre imágenes)
    sale: 'bg-accent text-white'
};

export function Badge({ tone = 'neutral', icon: Icon, className, children, ...props }) {
    return (
        <span
            className={cn(
                'inline-flex w-fit items-center gap-1 rounded-pill px-2 py-0.5 text-xs font-semibold',
                tones[tone],
                className
            )}
            {...props}
        >
            {Icon && <Icon size={12} aria-hidden="true" />}
            {children}
        </span>
    );
}
