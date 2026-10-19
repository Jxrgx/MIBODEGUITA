import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

export function SectionHeader({ title, id, actionLabel, onAction, className, children }) {
    return (
        <div className={cn('mb-3 flex items-center justify-between gap-2', className)}>
            <h2 id={id} className="text-lg font-bold text-ink">{title}</h2>
            {children}
            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="-mr-2 inline-flex min-h-11 cursor-pointer items-center gap-0.5 rounded-pill border-0 bg-transparent px-2 font-sans text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-primary"
                >
                    {actionLabel}
                    <ChevronRight size={16} aria-hidden="true" />
                </button>
            )}
        </div>
    );
}
