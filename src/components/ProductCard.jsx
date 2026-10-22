import React, { useEffect, useRef } from 'react';
import { Heart, Plus, Minus, Trash2 } from 'lucide-react';
import { Badge, ProductImage } from './ui';
import { useCart } from '../context/cart';
import { cn } from '../lib/cn';
import { isBulkProduct, findCartLineIndex } from '../lib/cart';
import { formatMoney, getDiscountPercent } from '../lib/format';

const stepperButtonClass = 'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-white transition-colors hover:bg-white/15 active:scale-95 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white';

/**
 * Selector − n + que reemplaza al botón "Agregar" cuando el producto ya está en el carrito.
 * En 1, el botón izquierdo quita el producto (ícono de bote) en lugar de restar.
 */
function CartStepper({ product, quantity, onIncrement, onDecrement, incrementRef }) {
    const isLast = quantity <= 1;
    return (
        <div className="mt-3 flex min-h-11 items-center justify-between rounded-md bg-primary text-white" role="group" aria-label={`Cantidad de ${product.name} en el carrito`}>
            <button
                type="button"
                onClick={onDecrement}
                aria-label={isLast ? `Quitar ${product.name} del carrito` : `Quitar uno de ${product.name}`}
                className={stepperButtonClass}
            >
                {isLast ? <Trash2 size={18} aria-hidden="true" /> : <Minus size={18} strokeWidth={3} aria-hidden="true" />}
            </button>
            <span className="min-w-6 text-center font-bold tabular-nums" aria-live="polite">
                {quantity}
                <span className="sr-only"> en el carrito</span>
            </span>
            <button
                ref={incrementRef}
                type="button"
                onClick={onIncrement}
                aria-label={`Agregar uno de ${product.name}`}
                className={stepperButtonClass}
            >
                <Plus size={18} strokeWidth={3} aria-hidden="true" />
            </button>
        </div>
    );
}

export function ProductCard({ product, onAdd, isFavorite, onToggleFavorite, onClick, priority = false }) {
    const { cart, updateQuantity, removeFromCart } = useCart();
    const discount = getDiscountPercent(product);

    // Los productos a granel siempre abren su modal: no tienen una sola "cantidad"
    const lineIndex = isBulkProduct(product) ? -1 : findCartLineIndex(cart, product.id);
    const quantity = lineIndex >= 0 ? cart[lineIndex].quantity : 0;
    const inCart = quantity > 0;

    // Al cambiar entre "Agregar" y el selector, el foco pasa al control nuevo (teclado y lector de pantalla)
    const addButtonRef = useRef(null);
    const incrementRef = useRef(null);
    const pendingFocus = useRef(null);
    useEffect(() => {
        if (pendingFocus.current === 'stepper' && inCart) incrementRef.current?.focus();
        if (pendingFocus.current === 'add' && !inCart) addButtonRef.current?.focus();
        pendingFocus.current = null;
    }, [inCart]);

    const handleAdd = (e) => {
        if (e.detail === 0) pendingFocus.current = 'stepper'; // detail 0 = activado con teclado
        onAdd(product);
    };

    const handleDecrement = (e) => {
        if (quantity <= 1) {
            if (e.detail === 0) pendingFocus.current = 'add';
            removeFromCart(product.id, lineIndex);
        } else {
            updateQuantity(lineIndex, -1);
        }
    };

    return (
        // "product-card" se conserva como gancho para la animación de "volar al carrito"
        <article className="product-card group relative flex h-full flex-col rounded-lg border border-transparent bg-surface p-3 font-sans shadow-sm transition-[box-shadow,border-color] duration-200 animate-scale-in hover:border-black/5 hover:shadow-md">
            <button
                type="button"
                onClick={onClick}
                className="flex flex-1 cursor-pointer flex-col rounded-md border-0 bg-transparent p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
                {/* Contenedor cuadrado con fondo suave: fotos con fondo blanco y PNG transparentes se ven iguales */}
                <div className="mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-gray-50 p-3">
                    <ProductImage
                        src={product.image}
                        iconSize={48}
                        loading={priority ? 'eager' : 'lazy'}
                        decoding="async"
                        width="160"
                        height="160"
                        className="max-h-full max-w-full mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
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
                    <p className="text-lg font-extrabold tracking-tight text-primary min-[375px]:text-xl">{formatMoney(product.price)}</p>
                </div>
            </button>

            {discount > 0 && (
                <Badge tone="sale" className="absolute top-4 right-4">
                    -{discount}%
                </Badge>
            )}

            <button
                type="button"
                aria-label={isFavorite ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}
                aria-pressed={isFavorite}
                onClick={onToggleFavorite}
                className={cn(
                    'absolute top-3 left-3 inline-flex size-10 cursor-pointer items-center justify-center rounded-pill border-0 bg-white/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-110',
                    'focus-visible:outline-2 focus-visible:outline-primary',
                    isFavorite ? 'text-accent' : 'text-subtle'
                )}
            >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
            </button>

            {inCart ? (
                <CartStepper
                    product={product}
                    quantity={quantity}
                    onIncrement={() => updateQuantity(lineIndex, 1)}
                    onDecrement={handleDecrement}
                    incrementRef={incrementRef}
                />
            ) : (
                <button
                    ref={addButtonRef}
                    type="button"
                    onClick={handleAdd}
                    aria-label={`Agregar ${product.name} al carrito`}
                    className="mt-3 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border-0 bg-primary font-sans text-sm font-semibold text-white transition-colors hover:bg-primary-dark active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    <Plus size={16} strokeWidth={3} aria-hidden="true" />
                    Agregar
                </button>
            )}
        </article>
    );
}
