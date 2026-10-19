import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Badge, Button, IconButton, Modal, ProductImage } from './ui';
import { formatMoney, getDiscountPercent } from '../lib/format';

function RelatedProducts({ product, products, onProductSelect }) {
    const related = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    if (related.length === 0) return null;

    return (
        <section className="mt-6" aria-labelledby="related-title">
            <h3 id="related-title" className="mb-3 text-sm font-semibold text-muted">También te podría interesar</h3>
            <ul className="hide-scrollbar -mx-5 flex list-none gap-3 overflow-x-auto px-5 pb-1">
                {related.map(item => (
                    <li key={item.id} className="w-36 shrink-0">
                        <button
                            type="button"
                            onClick={() => onProductSelect?.(item)}
                            className="flex w-full cursor-pointer flex-col gap-2 rounded-md border border-border bg-surface p-3 text-left font-sans hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-primary"
                        >
                            <div className="flex h-20 items-center justify-center">
                                <ProductImage src={item.image} loading="lazy" iconSize={32} className="max-h-full max-w-full" />
                            </div>
                            <span className="truncate text-sm font-medium text-ink">{item.name}</span>
                            <span className="text-sm font-bold text-primary">{formatMoney(item.price)}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export function ProductActionModal({ product, onClose, onAdd, products, onProductSelect }) {
    const [quantity, setQuantity] = useState(1);

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => Math.max(1, q - 1));

    const totalPrice = product.price * quantity;
    const discount = getDiscountPercent(product);

    return (
        <Modal
            open
            onClose={onClose}
            title={product.name}
            variant="sheet"
            footer={
                <div className="flex items-center gap-4">
                    <div className="shrink-0">
                        <p className="text-xs text-subtle">Total</p>
                        <p className="text-xl font-extrabold text-primary">{formatMoney(totalPrice)}</p>
                    </div>
                    <Button
                        size="lg"
                        variant="brand"
                        fullWidth
                        leftIcon={ShoppingCart}
                        onClick={() => {
                            onAdd(product, quantity);
                            onClose();
                        }}
                    >
                        Agregar al carrito
                    </Button>
                </div>
            }
        >
            <div className="font-sans">
                <div className="flex gap-4">
                    <div className="flex size-28 shrink-0 items-center justify-center rounded-md bg-gray-50">
                        <ProductImage src={product.image} className="max-h-[90%] max-w-[90%]" />
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                        {discount > 0 && <Badge tone="danger">-{discount}% de descuento</Badge>}
                        <p className="text-2xl font-extrabold text-primary">{formatMoney(product.price)}</p>
                        {discount > 0 && (
                            <p className="text-sm text-subtle line-through">{formatMoney(product.originalPrice)}</p>
                        )}
                        {product.unitPrice && <p className="text-sm text-subtle">{product.unitPrice}</p>}
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 p-3 pl-4">
                    <span className="font-medium text-ink" id="quantity-label">Cantidad</span>
                    <div className="flex items-center gap-2" role="group" aria-labelledby="quantity-label">
                        <IconButton
                            icon={Minus}
                            label="Quitar uno"
                            variant="surface"
                            onClick={decrement}
                            disabled={quantity <= 1}
                        />
                        <span className="w-8 text-center text-xl font-bold text-ink" aria-live="polite">
                            {quantity}
                        </span>
                        <IconButton
                            icon={Plus}
                            label="Agregar uno"
                            variant="surface"
                            onClick={increment}
                            className="text-primary"
                        />
                    </div>
                </div>

                {products && (
                    <RelatedProducts product={product} products={products} onProductSelect={onProductSelect} />
                )}
            </div>
        </Modal>
    );
}
