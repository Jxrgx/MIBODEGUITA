// Reglas del carrito compartidas entre el contexto y la UI

// Los productos a granel se piden por peso o pieza desde BulkProductModal
export function isBulkProduct(product) {
    return product.category === 'Frutas y Verduras' || Boolean(product.averageWeight) || Boolean(product.isBulk);
}

// Índice de la línea "normal" de un producto (sin selecciones a granel ni combos), o -1
export function findCartLineIndex(cart, productId) {
    return cart.findIndex(item => item.id === productId && !item.isBulkSelection && !item.isCombo);
}
