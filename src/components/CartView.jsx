import React from 'react';
import { CartContents } from './cart/CartContents';
import { CheckoutBar } from './cart/CheckoutBar';
import { Button } from './ui';

// Página /cart (móvil y acceso directo). En escritorio el header abre CartDrawer con el mismo contenido.
export function CartView({ setShowCheckout, setActiveTab, ...contentProps }) {
    const hasItems = contentProps.cart.length > 0;
    const openCheckout = () => setShowCheckout(true);

    return (
        <div className="font-sans">
            <h1 className="mb-1 text-2xl font-bold text-ink">Tu carrito</h1>

            <CartContents
                {...contentProps}
                split
                onGoShopping={() => setActiveTab('home')}
                // Desde lg el resumen es una columna fija con su propio botón
                summaryFooter={
                    <Button size="lg" fullWidth onClick={openCheckout} className="mt-4 hidden lg:inline-flex">
                        Realizar pedido
                    </Button>
                }
            />

            {hasItems && (
                // Móvil y tablet: fija sobre la barra inferior; en escritorio (lg) la reemplaza el botón del resumen
                <div className="sticky bottom-[calc(var(--spacing-nav)+env(safe-area-inset-bottom)+0.75rem)] z-10 mt-4 md:bottom-4 lg:hidden">
                    <CheckoutBar
                        total={contentProps.finalTotal}
                        onCheckout={openCheckout}
                        className="rounded-lg border border-border bg-surface p-3 shadow-lg"
                    />
                </div>
            )}
        </div>
    );
}
