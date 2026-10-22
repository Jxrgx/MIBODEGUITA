import React, { useState } from 'react';
import { ChevronRight, Package, User, Heart, LogOut, ArrowLeft } from 'lucide-react';
import { ProductGrid } from './ProductGrid';
import { OrderDetailsModal } from './common/OrderDetailsModal';
import { Badge, Button, Card, EmptyState, IconButton } from './ui';
import { formatMoney } from '../lib/format';
import { formatOrderDate, orderStatus } from '../lib/orders';

function MenuItem({ icon: Icon, title, subtitle, onClick }) {
    return (
        <li>
            <button
                type="button"
                onClick={onClick}
                className="flex w-full cursor-pointer items-center gap-4 border-0 bg-surface p-4 text-left font-sans hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
            >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-primary-soft text-primary">
                    <Icon size={20} aria-hidden="true" />
                </span>
                <span className="flex-1">
                    <span className="block font-semibold text-ink">{title}</span>
                    {subtitle && <span className="mt-0.5 block text-sm text-subtle">{subtitle}</span>}
                </span>
                <ChevronRight size={20} className="text-gray-300" aria-hidden="true" />
            </button>
        </li>
    );
}

function MenuGroup({ title, children }) {
    return (
        <section>
            {title && <h2 className="mb-2 ml-1 text-sm font-semibold text-subtle uppercase">{title}</h2>}
            <Card as="ul" padding="none" className="list-none divide-y divide-border overflow-hidden">
                {children}
            </Card>
        </section>
    );
}

function SubViewHeader({ title, onBack }) {
    return (
        <div className="mb-4 flex items-center gap-2">
            <IconButton icon={ArrowLeft} label="Volver a Mi cuenta" onClick={onBack} className="-ml-2 text-ink" />
            <h1 className="text-xl font-bold text-ink">{title}</h1>
        </div>
    );
}

function OrderCard({ order, onOpen }) {
    const status = orderStatus(order.status);
    const itemCount = order.items?.length || 0;

    return (
        <Card as="li" className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="font-semibold text-ink">Pedido #{order.id}</p>
                    <p className="text-sm text-subtle">{formatOrderDate(order)}</p>
                </div>
                <Badge tone={status.tone}>{status.label}</Badge>
            </div>
            <p className="text-sm text-muted">
                {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'} · <span className="font-semibold text-ink">{formatMoney(order.total)}</span>
            </p>
            <Button variant="outline" size="sm" fullWidth onClick={() => onOpen(order)}>
                Ver detalles
            </Button>
        </Card>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="py-3">
            <dt className="text-sm text-subtle">{label}</dt>
            <dd className="text-ink">{value}</dd>
        </div>
    );
}

export function Account({ user, orders, favorites, onLogout, onToggleFavorite, onAddToCart, onProductSelect }) {
    const [currentView, setCurrentView] = useState('menu'); // menu, orders, personal, favorites
    const [selectedOrder, setSelectedOrder] = useState(null);
    const backToMenu = () => setCurrentView('menu');

    if (currentView === 'orders') {
        return (
            <div className="font-sans">
                <SubViewHeader title="Mis pedidos" onBack={backToMenu} />
                {orders.length === 0 ? (
                    <EmptyState icon={Package} title="Aún no tienes pedidos" message="Cuando hagas tu primer pedido aparecerá aquí." />
                ) : (
                    <ul className="grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {orders.map(order => (
                            <OrderCard key={order.id} order={order} onOpen={setSelectedOrder} />
                        ))}
                    </ul>
                )}

                {selectedOrder && (
                    <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
                )}
            </div>
        );
    }

    if (currentView === 'personal') {
        return (
            <div className="mx-auto max-w-2xl font-sans">
                <SubViewHeader title="Información personal" onBack={backToMenu} />
                <Card>
                    <dl className="divide-y divide-border">
                        <InfoRow label="Nombre" value={user.name || 'Sin registrar'} />
                        <InfoRow label="Correo electrónico" value={user.email} />
                        <InfoRow label="Número telefónico" value={user.phone || 'Sin registrar'} />
                    </dl>
                </Card>
                <p className="mt-3 text-sm text-subtle">Tus datos vienen de tu cuenta de Google.</p>
            </div>
        );
    }

    if (currentView === 'favorites') {
        return (
            <div className="font-sans">
                <SubViewHeader title="Favoritos" onBack={backToMenu} />
                <ProductGrid
                    products={favorites}
                    favorites={favorites}
                    onToggleFavorite={onToggleFavorite}
                    onAdd={onAddToCart}
                    onOpenProduct={onProductSelect}
                    label="Mis favoritos"
                    emptyState={
                        <EmptyState icon={Heart} title="Aún no tienes favoritos" message="Toca el corazón de un producto para guardarlo aquí." />
                    }
                />
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-5 font-sans">
            <div className="flex items-center gap-4 rounded-lg bg-primary p-4 text-white shadow-sm">
                {user.photoURL ? (
                    <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="size-14 rounded-pill border-2 border-white/40 object-cover" />
                ) : (
                    <span className="flex size-14 items-center justify-center rounded-pill bg-white/20">
                        <User size={28} aria-hidden="true" />
                    </span>
                )}
                <div className="min-w-0">
                    <h1 className="truncate text-xl font-bold">{user.name || 'Mi cuenta'}</h1>
                    <p className="truncate text-sm opacity-80">{user.email}</p>
                </div>
            </div>

            <MenuGroup>
                <MenuItem
                    icon={Package}
                    title="Mis pedidos"
                    subtitle={orders.length > 0 ? `${orders.length} ${orders.length === 1 ? 'pedido' : 'pedidos'}` : 'Revisa el estado de tus pedidos'}
                    onClick={() => setCurrentView('orders')}
                />
                <MenuItem
                    icon={Heart}
                    title="Favoritos"
                    subtitle={favorites.length > 0 ? `${favorites.length} guardados` : 'Los productos que más compras'}
                    onClick={() => setCurrentView('favorites')}
                />
            </MenuGroup>

            <MenuGroup title="Administrar cuenta">
                <MenuItem
                    icon={User}
                    title="Información personal"
                    subtitle="Nombre, correo y teléfono"
                    onClick={() => setCurrentView('personal')}
                />
            </MenuGroup>

            <Button variant="danger" fullWidth leftIcon={LogOut} onClick={onLogout} className="mb-4">
                Cerrar sesión
            </Button>
        </div>
    );
}
