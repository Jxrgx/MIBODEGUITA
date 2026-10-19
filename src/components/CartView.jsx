import React from 'react';
import { ShoppingBasket, Trash2, Plus, Minus, BookmarkPlus, X, Tag } from 'lucide-react';
import { Button, Card, EmptyState, IconButton, Input, PriceSummary, ProductImage } from './ui';
import { formatMoney } from '../lib/format';

function CartItem({ item, index, removeFromCart, updateQuantity }) {
    const lineTotal = item.isBulkSelection ? (item.totalPrice || 0) : Number(item.price || 0) * item.quantity;

    return (
        <Card as="li" padding="sm" className="flex gap-3">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-gray-50">
                <ProductImage src={item.image} loading="lazy" iconSize={32} className="size-full" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-1">
                    <h3 className="line-clamp-2 pt-1 text-[0.95rem] leading-snug font-semibold text-ink">{item.name}</h3>
                    <IconButton
                        icon={Trash2}
                        size={18}
                        variant="danger"
                        label={`Eliminar ${item.name}`}
                        onClick={() => removeFromCart(item.id, index)}
                        className="-mt-1 -mr-1"
                    />
                </div>

                {item.isBulkSelection ? (
                    <div className="text-sm text-muted">
                        <p>
                            {item.cartQuantity} {item.cartUnit}
                            {item.cartUnit === 'pz' && item.averageWeight && ` (~${(item.cartQuantity * item.averageWeight).toFixed(3)} kg)`}
                        </p>
                        {item.notes && <p className="mt-0.5 italic text-subtle">Nota: "{item.notes}"</p>}
                    </div>
                ) : (
                    <p className="text-sm text-muted">{formatMoney(item.price)} c/u</p>
                )}

                <div className="mt-auto flex items-center justify-between pt-2">
                    {item.isBulkSelection ? (
                        <span />
                    ) : (
                        <div className="flex items-center rounded-pill border border-border">
                            <IconButton
                                icon={Minus}
                                size={16}
                                label={`Quitar uno de ${item.name}`}
                                onClick={() => updateQuantity(index, -1)}
                                disabled={item.quantity <= 1}
                                className="size-9"
                            />
                            <span className="min-w-7 text-center font-semibold text-ink" aria-live="polite">
                                {item.quantity}
                            </span>
                            <IconButton
                                icon={Plus}
                                size={16}
                                label={`Agregar uno de ${item.name}`}
                                onClick={() => updateQuantity(index, 1)}
                                className="size-9"
                            />
                        </div>
                    )}
                    <span className="font-bold text-primary">{formatMoney(lineTotal)}</span>
                </div>
            </div>
        </Card>
    );
}

function SaveListForm({ newListName, setNewListName, onConfirmSaveList, cancelSaveList }) {
    return (
        <Card className="mb-4 animate-dialog-in">
            <form
                className="flex items-end gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    onConfirmSaveList();
                }}
            >
                <Input
                    label="Nombre de la lista"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Ej. Despensa semanal"
                    autoFocus
                    className="flex-1"
                />
                <Button type="submit" variant="brand">Guardar</Button>
                <IconButton icon={X} label="Cancelar" onClick={cancelSaveList} />
            </form>
        </Card>
    );
}

function SavedLists({ savedLists, loadList, deleteList }) {
    return (
        <section className="mt-8 border-t border-border pt-6" aria-labelledby="saved-lists-title">
            <h2 id="saved-lists-title" className="mb-3 text-base font-bold text-ink">Mis listas guardadas</h2>
            <ul className="hide-scrollbar -mx-4 flex list-none gap-3 overflow-x-auto px-4 pb-2">
                {savedLists.map(list => (
                    <Card as="li" key={list.id} className="flex min-w-52 flex-col gap-3 border border-border">
                        <div>
                            <p className="font-semibold text-ink">{list.name}</p>
                            <p className="text-sm text-subtle">{list.items.length} artículos · {list.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="brand" size="sm" fullWidth onClick={() => loadList(list)}>
                                Cargar
                            </Button>
                            <IconButton
                                icon={Trash2}
                                size={18}
                                variant="danger"
                                label={`Eliminar lista ${list.name}`}
                                onClick={() => deleteList(list.id)}
                            />
                        </div>
                    </Card>
                ))}
            </ul>
        </section>
    );
}

export function CartView({
    cart,
    cartTotal,
    isSavingList,
    startSaveList,
    newListName,
    setNewListName,
    onConfirmSaveList,
    cancelSaveList,
    removeFromCart,
    updateQuantity,
    totalSavings,
    finalTotal,
    setShowCheckout,
    savedLists,
    loadList,
    deleteList,
    setActiveTab
}) {
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="font-sans">
            <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-ink">Tu carrito</h1>
                    {cart.length > 0 && (
                        <p className="text-sm text-subtle">
                            {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
                        </p>
                    )}
                </div>
                {cart.length > 0 && !isSavingList && (
                    <Button variant="outline" size="sm" leftIcon={BookmarkPlus} onClick={startSaveList}>
                        Guardar lista
                    </Button>
                )}
            </div>

            {isSavingList && (
                <SaveListForm
                    newListName={newListName}
                    setNewListName={setNewListName}
                    onConfirmSaveList={onConfirmSaveList}
                    cancelSaveList={cancelSaveList}
                />
            )}

            {cart.length === 0 ? (
                <EmptyState
                    icon={ShoppingBasket}
                    title="Tu carrito está vacío"
                    message="Agrega productos para empezar tu pedido."
                    actionLabel="Ir a comprar"
                    onAction={() => setActiveTab('home')}
                />
            ) : (
                <>
                    <ul className="flex list-none flex-col gap-3">
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

                    <Card className="mt-6">
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
                            total={finalTotal}
                        >
                            <Button size="lg" fullWidth onClick={() => setShowCheckout(true)}>
                                Realizar pedido
                            </Button>
                        </PriceSummary>
                    </Card>
                </>
            )}

            {savedLists.length > 0 && (
                <SavedLists savedLists={savedLists} loadList={loadList} deleteList={deleteList} />
            )}
        </div>
    );
}
