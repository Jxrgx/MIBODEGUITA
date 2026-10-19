import React from 'react';
import { cn } from '../../lib/cn';

// El tamaño se define con clases: <Skeleton className="h-4 w-24" />
export function Skeleton({ className }) {
    return <div aria-hidden="true" className={cn('animate-pulse rounded-sm bg-gray-200', className)} />;
}
