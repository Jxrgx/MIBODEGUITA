import React, { useState } from 'react';
import { Truck, Store, MessageCircle } from 'lucide-react';
import { Button, Modal, PriceSummary } from './ui';
import { cn } from '../lib/cn';

const deliveryOptions = [
    { value: 'delivery', label: 'Envío a domicilio', icon: Truck },
    { value: 'pickup', label: 'Recoger en tienda', icon: Store }
];

export function CheckoutModal({ onClose, onConfirm, total, ...props }) {
    const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery', 'pickup'
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsProcessing(true);
        onConfirm({
            receiverName: 'Cliente', // Default name since input is removed
            deliveryMethod,
            address: deliveryMethod === 'delivery' ? 'A coordinar por WhatsApp' : 'Recoger en Tienda',
            paymentMethod: 'A coordinar', // Default payment method
            deliverySchedule: 'asap' // Default
        });
        setIsProcessing(false);
    };

    // Calculate totals
    const shippingCost = deliveryMethod === 'delivery' ? (props.deliveryCost || 0) : 0;
    const finalPayable = total + shippingCost;

    return (
        <Modal
            open
            onClose={onClose}
            title="Finalizar compra"
            variant="sheet"
            footer={
                <Button type="submit" form="checkout-form" size="lg" fullWidth loading={isProcessing}>
                    {isProcessing ? 'Procesando…' : 'Confirmar pedido'}
                </Button>
            }
        >
            <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col gap-5 font-sans">
                <fieldset className="border-0">
                    <legend className="mb-2 font-semibold text-ink">Método de entrega</legend>
                    <div className="grid grid-cols-2 gap-3">
                        {deliveryOptions.map(({ value, label, icon: Icon }) => {
                            const isSelected = deliveryMethod === value;
                            return (
                                <label
                                    key={value}
                                    className={cn(
                                        'flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 p-3 text-center text-sm font-semibold transition-colors',
                                        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary',
                                        isSelected
                                            ? 'border-primary bg-primary-soft text-primary'
                                            : 'border-border bg-surface text-muted hover:bg-gray-50'
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="deliveryMethod"
                                        value={value}
                                        checked={isSelected}
                                        onChange={() => setDeliveryMethod(value)}
                                        className="sr-only"
                                    />
                                    <Icon size={24} aria-hidden="true" />
                                    {label}
                                </label>
                            );
                        })}
                    </div>
                </fieldset>

                <p className="flex items-start gap-2 rounded-sm bg-gray-50 p-3 text-sm text-muted">
                    <MessageCircle size={18} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                    {deliveryMethod === 'delivery'
                        ? 'Al confirmar te enviaremos a WhatsApp para coordinar la dirección y el pago.'
                        : 'Al confirmar te enviaremos a WhatsApp para coordinar la hora de recogida y el pago.'}
                </p>

                <PriceSummary
                    lines={[
                        { label: 'Productos', value: total },
                        ...(shippingCost > 0 ? [{ label: 'Envío', value: shippingCost }] : [])
                    ]}
                    total={finalPayable}
                    totalLabel="Total a pagar"
                />
            </form>
        </Modal>
    );
}
