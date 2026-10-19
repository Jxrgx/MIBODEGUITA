import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, MessageCircle, ShoppingBag } from 'lucide-react';
import { Button, Modal } from './ui';
import { formatMoney } from '../lib/format';

export function OrderSuccessModal({ order, onClose }) {
    useEffect(() => {
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 4000 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    if (!order) return null;

    return (
        <Modal open onClose={onClose} title="¡Pedido enviado!">
            <div className="flex flex-col items-center gap-5 font-sans text-center">
                <div className="flex size-20 items-center justify-center rounded-pill bg-success-soft">
                    <CheckCircle size={44} strokeWidth={2.5} className="text-success" aria-hidden="true" />
                </div>

                <p className="text-muted">
                    Te abrimos WhatsApp para confirmar tu pedido con la tienda.
                    <strong className="block font-semibold text-ink">Envía el mensaje para que lo recibamos.</strong>
                </p>

                <dl className="w-full rounded-lg bg-gray-50 p-4 text-left">
                    <div className="flex justify-between py-1">
                        <dt className="text-muted">Pedido</dt>
                        <dd className="font-semibold text-ink">#{order.id}</dd>
                    </div>
                    <div className="flex justify-between py-1">
                        <dt className="text-muted">Total</dt>
                        <dd className="text-lg font-bold text-primary">{formatMoney(order.total)}</dd>
                    </div>
                </dl>

                <div className="flex w-full flex-col gap-2">
                    {order.whatsappUrl && (
                        <a
                            href={order.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-pill bg-[#128c4a] px-6 font-semibold text-white no-underline hover:bg-[#0e7a40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128c4a]"
                        >
                            <MessageCircle size={20} aria-hidden="true" />
                            Abrir WhatsApp de nuevo
                        </a>
                    )}
                    <Button variant="outline" size="lg" fullWidth leftIcon={ShoppingBag} onClick={onClose}>
                        Seguir comprando
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
