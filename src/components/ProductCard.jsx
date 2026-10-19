import React from 'react';
import { Heart, Plus } from 'lucide-react';
import { Badge, ProductImage } from './ui';
import { cn } from '../lib/cn';
import { formatMoney, getDiscountPercent } from '../lib/format';

export function ProductCard({ product, onAdd, isFavorite, onToggleFavorite, onClick, priority = false }) {
    const discount = getDiscountPercent(product);

    return (
        // "product-card" se conserva como gancho para la animación de "volar al carrito"
        <article className="product-card group relative flex h-full flex-col rounded-lg border border-transparent bg-surface p-3 font-sans shadow-sm transition-[box-shadow,border-color] duration-200 animate-scale-in hover:border-black/5 hover:shadow-md">
            <button
                type="button"
                onClick={onClick}
                className="flex flex-1 cursor-pointer flex-col rounded-md border-0 bg-transparent p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
                <div className="mb-3 flex h-36 w-full items-center justify-center">
                    <ProductImage
                        src={product.image}
                        iconSize={48}
                        loading={priority ? 'eager' : 'lazy'}
                        decoding="async"
                        width="140"
                        height="140"
                        className="max-h-full max-w-full transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                <h3 className="mb-1 line-clamp-2 text-[0.95rem] leading-snug font-semibold text-ink">
                    {product.name}
                </h3>

                {product.unitPrice && <p className="text-xs text-subtle">{product.unitPrice}</p>}

                <div className="mt-auto pt-2">
                    {discount > 0 && (
                        <p className="text-xs text-subtle line-through">{formatMoney(product.originalPrice)}</p>
                    )}
                    <p className="text-xl font-extrabold tracking-tight text-primary">{formatMoney(product.price)}</p>
                </div>
            </button>

            {discount > 0 && (
                <Badge tone="sale" className="absolute top-3 right-3">
                    -{discount}%
                </Badge>
            )}

            <button
                type="button"
                aria-label={isFavorite ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}
                aria-pressed={isFavorite}
                onClick={onToggleFavorite}
                className={cn(
                    'absolute top-2 left-2 inline-flex size-10 cursor-pointer items-center justify-center rounded-pill border-0 bg-white/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-110',
                    'focus-visible:outline-2 focus-visible:outline-primary',
                    isFavorite ? 'text-accent' : 'text-subtle'
                )}
            >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
            </button>

            <button
                type="button"
                onClick={() => onAdd(product)}
                aria-label={`Agregar ${product.name} al carrito`}
                className="mt-3 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border-0 bg-primary font-sans text-sm font-semibold text-white transition-colors hover:bg-primary-dark active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
                <Plus size={16} strokeWidth={3} aria-hidden="true" />
                Agregar
            </button>
        </article>
    );
}
