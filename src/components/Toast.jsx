import React, { useEffect, useState } from 'react';
import { Check, X, Info } from 'lucide-react';
import { cn } from '../lib/cn';

const toneClasses = {
    success: 'bg-success',
    error: 'bg-danger',
    info: 'bg-primary'
};

const icons = {
    success: Check,
    error: X,
    info: Info
};

export function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!message) return null;

    const Icon = icons[type] || Check;

    return (
        <div
            role={type === 'error' ? 'alert' : 'status'}
            aria-live={type === 'error' ? 'assertive' : 'polite'}
            className={cn(
                // bottom-24 en móvil para quedar sobre la barra inferior; en escritorio no hay barra
                'fixed bottom-24 left-1/2 z-[3600] flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-pill py-3 pr-5 pl-3 font-sans text-white shadow-lg transition-all duration-300 md:bottom-8',
                toneClasses[type] || toneClasses.success,
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            )}
        >
            <span className="flex shrink-0 rounded-pill bg-white/20 p-1">
                <Icon size={16} aria-hidden="true" />
            </span>
            <span className="text-[0.95rem] font-medium">{message}</span>
        </div>
    );
}
