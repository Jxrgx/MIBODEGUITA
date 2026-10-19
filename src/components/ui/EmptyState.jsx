import React from 'react';
import { PackageOpen } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from './Button';

export function EmptyState({
    icon: Icon = PackageOpen,
    title,
    message,
    actionLabel,
    onAction,
    className
}) {
    return (
        <div className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
            <div className="mb-4 rounded-pill bg-gray-100 p-5">
                <Icon size={40} className="text-subtle" aria-hidden="true" />
            </div>
            {title && <h3 className="mb-1 text-lg font-semibold text-ink">{title}</h3>}
            {message && <p className="mb-6 max-w-sm text-muted">{message}</p>}
            {actionLabel && onAction && (
                <Button onClick={onAction}>{actionLabel}</Button>
            )}
        </div>
    );
}
