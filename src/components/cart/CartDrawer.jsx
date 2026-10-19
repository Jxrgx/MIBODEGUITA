import React from 'react';
import { Modal } from '../ui';
import { CartContents } from './CartContents';
import { CheckoutBar } from './CheckoutBar';

// Carrito lateral de escritorio (≥ 768 px). Mismo contenido que la página /cart.
export function CartDrawer({ open, onClose, onCheckout, onGoShopping, ...contentProps }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Tu carrito"
            variant="drawer"
            closeLabel="Cerrar carrito"
            footer={contentProps.cart.length > 0 && (
                <CheckoutBar total={contentProps.finalTotal} onCheckout={onCheckout} />
            )}
        >
            <CartContents {...contentProps} onGoShopping={onGoShopping} bleedClass="-mx-5 px-5" />
        </Modal>
    );
}
