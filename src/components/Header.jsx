import React, { useCallback } from 'react';
import { SearchBox } from './header/SearchBox';
import { CategoryChips } from './header/CategoryChips';
import { cn } from '../lib/cn';
import { formatMoney } from '../lib/format';
import { isBulkProduct } from '../lib/cart';
import { navItems, formatCartCount } from '../layouts/navItems';

function DesktopNav({ activeTab, onTabChange, cartCount, cartTotal }) {
    return (
        <nav aria-label="Navegación principal" className="hidden md:block">
            <ul className="flex list-none items-center gap-1">
                {navItems.map(({ tab, label, icon: Icon }) => {
                    const isActive = activeTab === tab;
                    const showCartSummary = tab === 'cart' && cartCount > 0;
                    return (
                        <li key={tab}>
                            <button
                                type="button"
                                onClick={() => onTabChange(tab)}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    'relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill border-0 px-3 font-sans text-sm font-semibold whitespace-nowrap text-white transition-colors',
                                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                                    isActive ? 'bg-white/20' : 'bg-transparent hover:bg-white/10',
                                    showCartSummary && 'bg-white text-primary hover:bg-white/90'
                                )}
                            >
                                <span className="relative">
                                    <Icon size={20} aria-hidden="true" className={tab === 'cart' ? 'bottom-nav-cart-icon' : undefined} />
                                    {showCartSummary && (
                                        <span className="absolute -top-2 -right-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-pill bg-secondary px-1 text-[0.65rem] font-bold text-ink">
                                            {formatCartCount(cartCount)}
                                        </span>
                                    )}
                                </span>
                                {/* Entre md y lg solo ícono; el texto sigue disponible para lectores de pantalla */}
                                <span className={showCartSummary ? 'sr-only' : 'sr-only lg:not-sr-only'}>{label}</span>
                                {/* En escritorio el botón del carrito es la "barra de estado": muestra el total */}
                                {showCartSummary && (
                                    <>
                                        <span className="tabular-nums" aria-hidden="true">{formatMoney(cartTotal)}</span>
                                        <span className="sr-only">: {cartCount} artículos, total {formatMoney(cartTotal)}</span>
                                    </>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export function Header({
    searchQuery,
    onSearchCommit,
    onSearchClear,
    products,
    categories,
    selectedCategory,
    onCategorySelect,
    showCategories,
    onProductSelect,
    addToCart,
    showToast,
    searchHistory,
    onHistoryRemove,
    activeTab,
    onTabChange,
    cartCount,
    cartTotal
}) {
    const notify = useCallback((message, type) => {
        if (showToast) showToast(message, type);
        else alert(message);
    }, [showToast]);

    const addAndNotify = useCallback((product) => {
        addToCart(product);
        // Los productos a granel solo abren su modal; el aviso llega hasta que se agregan de verdad
        if (!isBulkProduct(product)) notify(`Agregado: ${product.name}`, 'success');
    }, [addToCart, notify]);

    const handleVoiceSearch = useCallback((term) => {
        import('../services/smartSearch').then(({ SmartSearchService }) => {
            const result = SmartSearchService.parseCommand(term, products || []);

            if (result.type !== 'addToCart') {
                onSearchCommit(term);
                return;
            }

            if (result.items.length === 0) {
                notify('No entendí qué productos agregar. Intenta decir el nombre exacto.', 'error');
                return;
            }

            // Add to cart multiple times based on quantity
            result.items.forEach(item => {
                for (let i = 0; i < item.quantity; i++) {
                    addToCart(item.product);
                }
            });
            notify(`Agregado: ${result.items.map(item => `${item.quantity} ${item.product.name}`).join(', ')}`, 'success');
        }).catch(err => console.error("Error loading SmartSearchService:", err));
    }, [products, addToCart, onSearchCommit, notify]);

    return (
        <header className="sticky top-0 z-[100] font-sans shadow-sm">
            <div className="bg-primary">
                {/* relative: en móvil el desplegable del buscador se posiciona respecto a esta fila */}
                <div className="relative mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                    <button
                        type="button"
                        onClick={() => onTabChange?.('home')}
                        aria-label="Abarrotes Alex, ir al inicio"
                        className="shrink-0 cursor-pointer rounded-pill border-0 bg-white p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <img src="/logo.png" alt="" width="40" height="40" className="block size-10 rounded-pill object-cover" />
                    </button>

                    <SearchBox
                        committedQuery={searchQuery}
                        onCommit={onSearchCommit}
                        onClear={onSearchClear}
                        products={products}
                        onProductSelect={onProductSelect}
                        onAddToCart={addAndNotify}
                        searchHistory={searchHistory}
                        onHistoryRemove={onHistoryRemove}
                        onVoiceSearch={handleVoiceSearch}
                    />

                    <DesktopNav activeTab={activeTab} onTabChange={onTabChange} cartCount={cartCount} cartTotal={cartTotal} />
                </div>
            </div>

            {showCategories && (
                <CategoryChips
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={onCategorySelect}
                    onSelectAll={() => onTabChange?.('home')}
                />
            )}
        </header>
    );
}
