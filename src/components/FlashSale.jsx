import React, { useState, useEffect, memo } from 'react';
import { Zap, Plus } from 'lucide-react';
import { ProductService } from '../services/products';
import { ProductImage } from './ui';
import { formatMoney, getDiscountPercent } from '../lib/format';

const calculateTimeLeft = () => {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const difference = endOfDay.getTime() - now.getTime();

    if (difference > 0) {
        return {
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }
    return { hours: 0, minutes: 0, seconds: 0 };
};

const CountdownTimer = memo(() => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const pad = (n) => String(n).padStart(2, '0');

    return (
        <div className="flex items-center gap-1 font-mono text-sm font-bold tabular-nums" aria-label={`Termina en ${timeLeft.hours} horas y ${timeLeft.minutes} minutos`} role="timer">
            {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((value, i) => (
                <React.Fragment key={i}>
                    {i > 0 && <span aria-hidden="true">:</span>}
                    <span className="rounded-sm bg-black/25 px-1.5 py-1" aria-hidden="true">{pad(value)}</span>
                </React.Fragment>
            ))}
        </div>
    );
});

export function FlashSale({ onAdd }) {
    const [flashProduct, setFlashProduct] = useState(null);

    useEffect(() => {
        const loadFlashProduct = async () => {
            try {
                const flashId = localStorage.getItem('flashSaleId');
                const products = await ProductService.getAllProducts();

                let product = null;
                if (flashId) {
                    product = products.find(p => String(p.id) === String(flashId));
                }

                // Fallback to first product if no flash sale set or product not found
                if (!product && products.length > 0) {
                    product = products[0];
                }

                // Solo se muestra precio anterior si el producto lo tiene registrado
                if (product) setFlashProduct(product);
            } catch (error) {
                console.error("Error loading flash product", error);
            }
        };

        loadFlashProduct();

        // Listen for updates from Admin Panel
        const handleStorageChange = () => loadFlashProduct();
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    if (!flashProduct) return null;

    const discount = getDiscountPercent(flashProduct);

    return (
        <section
            aria-labelledby="flash-sale-title"
            className="relative mb-6 overflow-hidden rounded-lg bg-linear-135 from-orange-500 to-red-600 p-4 font-sans text-white shadow-md"
        >
            <div aria-hidden="true" className="absolute -top-6 -right-6 size-28 rounded-pill bg-white/10" />

            <div className="relative mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 id="flash-sale-title" className="flex items-center gap-2 text-lg font-extrabold tracking-wide uppercase">
                        <Zap size={20} className="fill-yellow-300 text-yellow-300" aria-hidden="true" />
                        Pasillo Sorpresa
                    </h2>
                    <p className="text-sm opacity-90">Oferta relámpago · termina hoy</p>
                </div>
                <CountdownTimer />
            </div>

            <div className="relative flex items-center gap-4 rounded-md bg-surface p-3 text-ink">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-sm bg-gray-50">
                    <ProductImage src={flashProduct.image} iconSize={32} className="max-h-full max-w-full" />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 font-semibold">{flashProduct.name}</h3>
                    <div className="mt-1 flex flex-wrap items-baseline gap-2">
                        <span className="text-xl font-extrabold text-accent">{formatMoney(flashProduct.price)}</span>
                        {discount > 0 && (
                            <>
                                <span className="text-sm text-subtle line-through">{formatMoney(flashProduct.originalPrice)}</span>
                                <span className="rounded-pill bg-danger-soft px-2 py-0.5 text-xs font-bold text-accent">-{discount}%</span>
                            </>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => onAdd(flashProduct)}
                    aria-label={`Agregar ${flashProduct.name} al carrito`}
                    className="inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-pill border-0 bg-accent text-white shadow-md transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                    <Plus size={22} strokeWidth={3} aria-hidden="true" />
                </button>
            </div>
        </section>
    );
}
