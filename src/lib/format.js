const moneyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
});

// 35.5 -> "$35.50"
export function formatMoney(value) {
    return moneyFormatter.format(Number(value) || 0);
}

// Porcentaje de descuento entero, o 0 si el producto no está en oferta
export function getDiscountPercent(product) {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round((1 - product.price / product.originalPrice) * 100);
}
