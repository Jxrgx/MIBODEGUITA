import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, ScanBarcode } from 'lucide-react';
import { VoiceSearch } from './VoiceSearch';
import { cn } from '../lib/cn';
import { navItems, formatCartCount } from '../layouts/navItems';

const searchIconButtonClass = 'inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-pill border-0 bg-transparent text-subtle hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-primary';

function DesktopNav({ activeTab, onTabChange, cartCount }) {
    return (
        <nav aria-label="Navegación principal" className="hidden md:block">
            <ul className="flex list-none items-center gap-1">
                {navItems.map(({ tab, label, icon: Icon }) => {
                    const isActive = activeTab === tab;
                    const isCart = tab === 'cart';
                    return (
                        <li key={tab}>
                            <button
                                type="button"
                                onClick={() => onTabChange(tab)}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    'relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill border-0 px-3 font-sans text-sm font-semibold text-white transition-colors',
                                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                                    isActive ? 'bg-white/20' : 'bg-transparent hover:bg-white/10'
                                )}
                            >
                                <Icon size={20} aria-hidden="true" />
                                {label}
                                {isCart && cartCount > 0 && (
                                    <span className="rounded-pill bg-secondary px-1.5 text-xs font-bold text-ink">
                                        {formatCartCount(cartCount)}
                                        <span className="sr-only"> artículos</span>
                                    </span>
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
    setSearchQuery,
    onSearchSubmit,
    onOpenScanner,
    products,
    addToCart,
    showToast,
    activeTab,
    onTabChange,
    cartCount
}) {
    const [localSearch, setLocalSearch] = useState(searchQuery);

    // Sync local state if external searchQuery changes (e.g. clearing filter)
    useEffect(() => {
        setLocalSearch(searchQuery);
    }, [searchQuery]);

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== searchQuery) {
                setSearchQuery(localSearch);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [localSearch, setSearchQuery, searchQuery]);

    const notify = useCallback((message, type) => {
        if (showToast) showToast(message, type);
        else alert(message);
    }, [showToast]);

    const handleVoiceSearch = useCallback((term) => {
        import('../services/smartSearch').then(({ SmartSearchService }) => {
            const result = SmartSearchService.parseCommand(term, products || []);

            if (result.type !== 'addToCart') {
                setLocalSearch(term);
                setSearchQuery(term);
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
            setLocalSearch('');
            setSearchQuery('');
            notify(`Agregado: ${result.items.map(item => `${item.quantity} ${item.product.name}`).join(', ')}`, 'success');
        }).catch(err => console.error("Error loading SmartSearchService:", err));
    }, [products, addToCart, setSearchQuery, notify]);

    const clearSearch = () => {
        setLocalSearch('');
        setSearchQuery('');
    };

    return (
        <header className="sticky top-0 z-[100] bg-primary font-sans shadow-md">
            <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                <button
                    type="button"
                    onClick={() => onTabChange?.('home')}
                    aria-label="Abarrotes Alex, ir al inicio"
                    className="shrink-0 cursor-pointer rounded-pill border-0 bg-white p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    <img src="/logo.png" alt="" width="40" height="40" className="block size-10 rounded-pill object-cover" />
                </button>

                <form
                    role="search"
                    className="flex min-w-0 flex-1 items-center rounded-pill bg-surface pl-3 shadow-sm focus-within:ring-2 focus-within:ring-secondary"
                    onSubmit={(e) => {
                        e.preventDefault();
                        document.activeElement?.blur(); // Hide keyboard on mobile
                        onSearchSubmit?.(localSearch);
                    }}
                >
                    <Search size={20} className="shrink-0 text-subtle" aria-hidden="true" />
                    <input
                        type="search"
                        aria-label="Buscar productos"
                        placeholder="Buscar productos…"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck="false"
                        enterKeyHint="search"
                        // text-base (16px): con menos, iOS hace zoom al enfocar
                        className="h-11 min-w-0 flex-1 border-0 bg-transparent px-2 font-sans text-base text-ink outline-none placeholder:text-subtle [&::-webkit-search-cancel-button]:hidden"
                    />
                    <div className="flex shrink-0 items-center pr-1">
                        {localSearch && (
                            <button type="button" onClick={clearSearch} aria-label="Borrar búsqueda" className={searchIconButtonClass}>
                                <X size={18} aria-hidden="true" />
                            </button>
                        )}
                        <VoiceSearch onSearch={handleVoiceSearch} />
                        {onOpenScanner && (
                            <button type="button" onClick={onOpenScanner} aria-label="Escanear código de barras" title="Escanear código de barras" className={searchIconButtonClass}>
                                <ScanBarcode size={20} aria-hidden="true" />
                            </button>
                        )}
                    </div>
                </form>

                <DesktopNav activeTab={activeTab} onTabChange={onTabChange} cartCount={cartCount} />
            </div>
        </header>
    );
}
