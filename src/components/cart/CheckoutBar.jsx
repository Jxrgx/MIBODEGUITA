import React from 'react';
import { Button } from '../ui';
import { cn } from '../../lib/cn';
import { formatMoney } from '../../lib/format';

// Total + botón amarillo "Realizar pedido": la acción principal del carrito, siempre al alcance del pulgar
export function CheckoutBar({ total, onCheckout, className }) {
    return (
        <div className={cn('flex items-center gap-3', className)}>
            <div className="shrink-0">
                <p className="text-xs text-subtle">Total</p>
                <p className="text-xl font-extrabold text-ink tabular-nums">{formatMoney(total)}</p>
            </div>
            <Button size="lg" fullWidth onClick={onCheckout}>
                Realizar pedido
            </Button>
        </div>
    );
}
