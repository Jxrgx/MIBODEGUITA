import React from 'react';
import { cn } from '../../lib/cn';

const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
};

export function Card({ as: Component = 'div', padding = 'md', className, children, ...props }) {
    return (
        <Component
            className={cn('rounded-lg bg-surface shadow-sm', paddings[padding], className)}
            {...props}
        >
            {children}
        </Component>
    );
}
