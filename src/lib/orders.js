// Utilidades de presentación para pedidos (historial, detalle, mensaje de WhatsApp)

const paymentLabels = {
    cash: 'Efectivo',
    card: 'Tarjeta'
};

export function paymentLabel(method) {
    return paymentLabels[method] || method || 'A coordinar';
}

const statusStyles = {
    pending: { label: 'Pendiente', tone: 'warning' },
    pendiente: { label: 'Pendiente', tone: 'warning' },
    'en camino': { label: 'En camino', tone: 'primary' },
    delivered: { label: 'Entregado', tone: 'success' },
    entregado: { label: 'Entregado', tone: 'success' },
    cancelled: { label: 'Cancelado', tone: 'danger' },
    cancelado: { label: 'Cancelado', tone: 'danger' }
};

export function orderStatus(status) {
    return statusStyles[String(status || 'pending').toLowerCase()] || { label: status, tone: 'neutral' };
}

// Los pedidos antiguos guardan `date` como "dd/mm/aaaa"; los nuevos traen `createdAt` (ISO o Timestamp)
function toDate(order) {
    const { createdAt, date } = order;
    if (createdAt?.toDate) return createdAt.toDate();
    if (createdAt) {
        const parsed = new Date(createdAt);
        if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    if (date instanceof Date) return date;
    if (typeof date === 'string') {
        const match = date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (match) return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
    }
    return null;
}

export function formatOrderDate(order, { withTime = false } = {}) {
    const parsed = toDate(order);
    if (!parsed) return typeof order.date === 'string' ? order.date : '';
    return parsed.toLocaleString('es-MX', withTime
        ? { dateStyle: 'medium', timeStyle: 'short' }
        : { dateStyle: 'medium' });
}

export function deliveryLabel(order) {
    if (order.deliveryMethod === 'pickup') return 'Recoger en tienda';
    if (order.deliveryMethod === 'delivery') return 'Envío a domicilio';
    return 'A coordinar';
}
