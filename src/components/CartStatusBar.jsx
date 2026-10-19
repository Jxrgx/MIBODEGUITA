import React from 'react';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { formatMoney } from '../lib/format';
import { formatCartCount } from '../layouts/navItems';

// Barra fija con el resumen del carrito (solo móvil, sobre la barra inferior)
export function CartStatusBar({ count, total, onOpen }) {
    const label = `Ver carrito: ${count} ${count === 1 ? 'artículo' : 'artículos'}, total ${formatMoney(total)}`;

    return (
        <div className="px-3 pb-2">
            <button
                type="button"
                onClick={onOpen}
                aria-label={label}
                className="flex min-h-13 w-full cursor-pointer items-center gap-3 rounded-lg border-0 bg-primary px-3 font-sans text-white shadow-lg animate-sheet-in transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
                <span className="relative flex size-9 shrink-0 items-center justify-center rounded-pill bg-white/15" aria-hidden="true">
                    <ShoppingCart size={18} />
                    <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-pill bg-secondary px-1 text-[0.65rem] font-bold text-ink">
                        {formatCartCount(count)}
                    </span>
                </span>
                <span className="flex-1 text-left font-semibold" aria-hidden="true">Ver carrito</span>
                <span className="font-bold tabular-nums" aria-hidden="true">{formatMoney(total)}</span>
                <ChevronRight size={18} className="-ml-1 shrink-0 opacity-80" aria-hidden="true" />
            </button>
        </div>
    );
}
