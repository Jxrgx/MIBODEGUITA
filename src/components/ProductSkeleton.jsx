import React from 'react';
import { Skeleton } from './ui';

export function ProductSkeleton() {
    return (
        <div className="flex h-full flex-col rounded-lg bg-surface p-3 shadow-sm" aria-hidden="true">
            <Skeleton className="mb-3 h-36 w-full rounded-md" />
            <Skeleton className="mb-2 h-4 w-11/12" />
            <Skeleton className="mb-4 h-4 w-3/5" />
            <Skeleton className="mb-3 h-6 w-2/5" />
            <Skeleton className="mt-auto h-11 w-full rounded-md" />
        </div>
    );
}
