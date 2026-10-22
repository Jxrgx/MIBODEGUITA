import React from 'react';
import { ShoppingBasket, BookmarkPlus, Tag } from 'lucide-react';
import { Button, Card, EmptyState, PriceSummary } from '../ui';
import { CartItem } from './CartItem';
import { SaveListForm, SavedLists } from './SavedLists';
import { formatMoney } from '../../lib/format';

/**
 * Contenido del carrito compartido por la página /cart y el drawer de escritorio:
 * conteo, "Guardar lista", productos, desglose de precios y listas guardadas.
 * La barra con "Realizar pedido" (CheckoutBar) la coloca cada contenedor.
 *
 * split: desde lg, productos a la izquierda y resumen fijo a la derecha (página /cart).
 * summaryFooter: contenido extra dentro de la tarjeta del resumen (p. ej. el botón en escritorio).
 */
export function CartContents({
    cart,
    cartTotal,
    finalTotal,
    totalSavings,
    isSavingList,
    startSaveList,
    newListName,
    setNewListName,
    onConfirmSaveList,
    cancelSaveList,
    removeFromCart,
    updateQuantity,
    savedLists,
    loadList,
    deleteList,
    onGoShopping,
    bleedClass,
    split = false,
    summaryFooter = null
}) {
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const isEmpty = cart.length === 0;

    return (
        <div className="font-sans">
            {!isEmpty && (
                <div className="mb-4 flex items-center justify-between gap-2">
                    <p className="text-sm text-subtle">
                        {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
                    </p>
                    {!isSavingList && (
                        <Button variant="outline" size="sm" leftIcon={BookmarkPlus} onClick={startSaveList}>
                            Guardar lista
                        </Button>
                    )}
                </div>
            )}

            {isSavingList && (
                <SaveListForm
                    newListName={newListName}
                    setNewListName={setNewListName}
                    onConfirmSaveList={onConfirmSaveList}
                    cancelSaveList={cancelSaveList}
                />
            )}

            {isEmpty ? (
                <EmptyState
                    icon={ShoppingBasket}
                    title="Tu carrito está vacío"
                    message="Agrega productos para empezar tu pedido."
                    actionLabel="Ir a comprar"
                    onAction={onGoShopping}
                />
            ) : (
                <div className={split ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-x-6' : undefined}>
                    <ul className="flex list-none flex-col gap-3 lg:col-start-1">
                        {cart.map((item, index) => (
                            <CartItem
                                key={`${item.id}-${index}`}
                                item={item}
                                index={index}
                                removeFromCart={removeFromCart}
                                updateQuantity={updateQuantity}
                            />
                        ))}
                    </ul>

                    <Card className={split ? 'mt-6 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0' : 'mt-6'}>
                        {totalSavings > 0 && (
                            <p className="mb-4 flex items-center gap-2 rounded-sm bg-danger-soft px-3 py-2 text-sm font-semibold text-accent">
                                <Tag size={16} aria-hidden="true" />
                                Ahorras {formatMoney(totalSavings)} con las ofertas de hoy
                            </p>
                        )}
                        <PriceSummary
                            lines={[
                                { label: 'Subtotal', value: cartTotal },
                                { label: 'Envío', value: 'Por confirmar', tone: 'muted' }
                            ]}
                            total={finalTotal ?? cartTotal}
                        />
                        {summaryFooter}
                    </Card>

                    {savedLists.length > 0 && (
                        <div className="lg:col-start-1">
                            <SavedLists savedLists={savedLists} loadList={loadList} deleteList={deleteList} bleedClass={bleedClass} />
                        </div>
                    )}
                </div>
            )}

            {isEmpty && savedLists.length > 0 && (
                <SavedLists savedLists={savedLists} loadList={loadList} deleteList={deleteList} bleedClass={bleedClass} />
            )}
        </div>
    );
}
