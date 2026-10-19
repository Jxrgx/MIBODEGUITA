import React from 'react';
import { Package, MapPin, CreditCard, User, Calendar } from 'lucide-react';
import { Badge, Modal, PriceSummary } from '../ui';
import { formatMoney } from '../../lib/format';
import { deliveryLabel, formatOrderDate, orderStatus, paymentLabel } from '../../lib/orders';

function InfoTile({ icon: Icon, label, value, className }) {
    return (
        <div className={`rounded-md bg-gray-50 p-3 ${className || ''}`}>
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-subtle uppercase">
                <Icon size={14} aria-hidden="true" />
                {label}
            </p>
            <p className="text-sm text-ink">{value}</p>
        </div>
    );
}

export function OrderDetailsModal({ order, onClose }) {
    if (!order) return null;

    const status = orderStatus(order.status);
    const isPickup = order.deliveryMethod === 'pickup';

    // Pedidos antiguos pueden traer cupón o puntos; se muestran para que el total cuadre
    const legacyDiscounts = [];
    if (order.coupon) {
        legacyDiscounts.push({
            label: `Cupón (${order.coupon.code})`,
            value: order.discountAmount || order.coupon.discount || 0,
            tone: 'savings'
        });
    }
    if (order.pointsUsed > 0) {
        legacyDiscounts.push({ label: `Puntos usados (${order.pointsUsed})`, value: order.pointsUsed * 0.10, tone: 'savings' });
    }

    return (
        <Modal open onClose={onClose} title={`Pedido #${order.id}`} variant="sheet" className="sm:max-w-xl">
            <div className="flex flex-col gap-5 font-sans">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                    <Badge tone={status.tone}>{status.label}</Badge>
                    <span className="flex items-center gap-1">
                        <Calendar size={14} aria-hidden="true" />
                        {formatOrderDate(order, { withTime: true })}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <InfoTile icon={User} label="Cliente" value={order.customerName || 'Cliente'} />
                    <InfoTile icon={CreditCard} label="Pago" value={paymentLabel(order.paymentMethod)} />
                    <InfoTile
                        icon={MapPin}
                        label={isPickup ? 'Entrega' : 'Dirección'}
                        value={
                            isPickup
                                ? deliveryLabel(order)
                                : order.deliveryMethod
                                    ? `${deliveryLabel(order)} · ${order.address || 'A coordinar'}`
                                    : (order.address || 'A coordinar por WhatsApp')
                        }
                        className="col-span-2"
                    />
                </div>

                <section aria-labelledby="order-items-title">
                    <h3 id="order-items-title" className="mb-2 flex items-center gap-2 font-semibold text-ink">
                        <Package size={18} aria-hidden="true" />
                        Productos ({order.items.length})
                    </h3>
                    <ul className="list-none divide-y divide-border rounded-md border border-border">
                        {order.items.map((item, idx) => (
                            <li key={idx} className="flex items-start justify-between gap-3 p-3 text-sm">
                                <div className="min-w-0">
                                    <p className="font-medium text-ink">{item.name}</p>
                                    <p className="text-subtle">
                                        {item.isBulkSelection
                                            ? `${item.cartQuantity} ${item.cartUnit}`
                                            : `${item.quantity} × ${formatMoney(item.price)}`}
                                    </p>
                                    {item.notes && <p className="mt-0.5 text-warning italic">Nota: {item.notes}</p>}
                                </div>
                                <span className="shrink-0 font-semibold text-ink">
                                    {formatMoney(item.totalPrice || (item.price * item.quantity))}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>

                <PriceSummary
                    lines={[
                        { label: 'Subtotal', value: order.subtotal || order.total },
                        ...legacyDiscounts
                    ]}
                    total={order.total}
                />
            </div>
        </Modal>
    );
}
