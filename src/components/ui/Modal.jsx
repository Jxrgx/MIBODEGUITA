import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { IconButton } from './IconButton';

/**
 * variant="dialog": ventana centrada.
 * variant="sheet": hoja que sube desde abajo en móvil y se centra en pantallas grandes.
 * variant="drawer": panel lateral derecho de alto completo (carrito en escritorio).
 */

const overlayLayout = {
    dialog: 'items-center justify-center p-4',
    sheet: 'items-end justify-center sm:items-center sm:p-4',
    drawer: 'items-stretch justify-end'
};

const panelLayout = {
    dialog: 'max-h-[90vh] max-w-md rounded-lg animate-dialog-in',
    sheet: 'max-h-[90vh] max-w-lg rounded-t-xl pb-[env(safe-area-inset-bottom)] animate-sheet-in sm:rounded-lg sm:pb-0 sm:animate-dialog-in',
    drawer: 'h-full max-w-md pb-[env(safe-area-inset-bottom)] animate-drawer-in'
};
export function Modal({
    open,
    onClose,
    title,
    variant = 'dialog',
    footer,
    closeLabel = 'Cerrar',
    className,
    children
}) {
    const panelRef = useRef(null);
    const titleId = useId();

    // Ref para que un onClose nuevo en cada render no reinicie el foco ni el bloqueo de scroll
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!open) return;

        const previouslyFocused = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        panelRef.current?.focus();

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onCloseRef.current?.();
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.();
        };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div
            className={cn(
                'fixed inset-0 z-[3000] flex bg-black/50 animate-overlay-in',
                overlayLayout[variant] || overlayLayout.dialog
            )}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose?.();
            }}
        >
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                tabIndex={-1}
                className={cn(
                    'relative flex w-full flex-col bg-surface shadow-lg outline-none motion-reduce:animate-none',
                    panelLayout[variant] || panelLayout.dialog,
                    className
                )}
            >
                <div className="flex items-center justify-between gap-2 py-2 pr-2 pl-5">
                    {title ? (
                        <h2 id={titleId} className="text-lg font-bold text-ink">
                            {title}
                        </h2>
                    ) : <span />}
                    <IconButton icon={X} label={closeLabel} onClick={onClose} />
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-5">{children}</div>

                {footer && (
                    <div className="border-t border-border px-5 py-4">{footer}</div>
                )}
            </div>
        </div>,
        document.body
    );
}
