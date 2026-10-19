import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Card, IconButton, ProductImage } from '../ui';
import { formatMoney } from '../../lib/format';

export function CartItem({ item, index, removeFromCart, updateQuantity }) {
    const lineTotal = item.isBulkSelection ? (item.totalPrice || 0) : Number(item.price || 0) * item.quantity;

    return (
        <Card as="li" padding="sm" className="flex gap-3">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-gray-50 p-1">
                <ProductImage src={item.image} loading="lazy" iconSize={32} className="max-h-full max-w-full mix-blend-multiply" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-1">
                    <h3 className="line-clamp-2 pt-1 text-[0.95rem] leading-snug font-semibold text-ink">{item.name}</h3>
                    <IconButton
                        icon={Trash2}
                        size={18}
                        variant="danger"
                        label={`Eliminar ${item.name}`}
                        onClick={() => removeFromCart(item.id, index)}
                        className="-mt-1 -mr-1"
                    />
                </div>

                {item.isBulkSelection ? (
                    <div className="text-sm text-muted">
                        <p>
                            {item.cartQuantity} {item.cartUnit}
                            {item.cartUnit === 'pz' && item.averageWeight && ` (~${(item.cartQuantity * item.averageWeight).toFixed(3)} kg)`}
                        </p>
                        {item.notes && <p className="mt-0.5 italic text-subtle">Nota: "{item.notes}"</p>}
                    </div>
                ) : (
                    <p className="text-sm text-muted">{formatMoney(item.price)} c/u</p>
                )}

                <div className="mt-auto flex items-center justify-between pt-2">
                    {item.isBulkSelection ? (
                        <span />
                    ) : (
                        <div className="flex items-center rounded-pill border border-border">
                            <IconButton
                                icon={Minus}
                                size={16}
                                label={`Quitar uno de ${item.name}`}
                                onClick={() => updateQuantity(index, -1)}
                                disabled={item.quantity <= 1}
                                className="size-9"
                            />
                            <span className="min-w-7 text-center font-semibold text-ink tabular-nums" aria-live="polite">
                                {item.quantity}
                            </span>
                            <IconButton
                                icon={Plus}
                                size={16}
                                label={`Agregar uno de ${item.name}`}
                                onClick={() => updateQuantity(index, 1)}
                                className="size-9"
                            />
                        </div>
                    )}
                    <span className="font-bold text-primary tabular-nums">{formatMoney(lineTotal)}</span>
                </div>
            </div>
        </Card>
    );
}
