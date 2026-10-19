import React from 'react';
import { CartContents } from './cart/CartContents';
import { CheckoutBar } from './cart/CheckoutBar';

// Página /cart (móvil y acceso directo). En escritorio el header abre CartDrawer con el mismo contenido.
export function CartView({ setShowCheckout, setActiveTab, ...contentProps }) {
    const hasItems = contentProps.cart.length > 0;

    return (
        <div className="font-sans">
            <h1 className="mb-1 text-2xl font-bold text-ink">Tu carrito</h1>

            <CartContents {...contentProps} onGoShopping={() => setActiveTab('home')} />

            {hasItems && (
                // Fija sobre la barra inferior en móvil; en escritorio, pegada al borde de la ventana
                <div className="sticky bottom-[calc(var(--spacing-nav)+env(safe-area-inset-bottom)+0.75rem)] z-10 mt-4 md:bottom-4">
                    <CheckoutBar
                        total={contentProps.finalTotal}
                        onCheckout={() => setShowCheckout(true)}
                        className="rounded-lg border border-border bg-surface p-3 shadow-lg"
                    />
                </div>
            )}
        </div>
    );
}
