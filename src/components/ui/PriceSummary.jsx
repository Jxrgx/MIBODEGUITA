import React from 'react';
import { cn } from '../../lib/cn';
import { formatMoney } from '../../lib/format';

const toneClasses = {
    default: 'text-ink',
    savings: 'font-semibold text-accent',
    muted: 'text-muted'
};

/**
 * Resumen de precios reutilizable (carrito, checkout, detalle de pedido).
 * lines: [{ label, value, tone }]
 *   - value numérico se formatea como moneda; un texto ("Por confirmar") se muestra tal cual.
 *   - tone "savings" muestra el valor como descuento (-$x.xx).
 */
export function PriceSummary({ lines = [], total, totalLabel = 'Total', className, children }) {
    return (
        <div className={className}>
            <dl className="flex flex-col gap-2 text-[0.95rem]">
                {lines.map(({ label, value, tone = 'default' }) => (
                    <div key={label} className={cn('flex items-center justify-between', toneClasses[tone])}>
                        <dt className={tone === 'default' ? 'text-muted' : undefined}>{label}</dt>
                        <dd>
                            {typeof value === 'number'
                                ? `${tone === 'savings' ? '-' : ''}${formatMoney(value)}`
                                : value}
                        </dd>
                    </div>
                ))}
                <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-xl font-bold text-ink">
                    <dt>{totalLabel}</dt>
                    <dd>{formatMoney(total)}</dd>
                </div>
            </dl>
            {children && <div className="mt-4">{children}</div>}
        </div>
    );
}
