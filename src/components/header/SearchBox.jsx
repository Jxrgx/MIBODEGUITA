import React, { useEffect, useId, useRef, useState } from 'react';
import { Search, X, Clock, Plus, ArrowRight, SearchX } from 'lucide-react';
import { VoiceSearch } from '../VoiceSearch';
import { ProductImage } from '../ui';
import { useQuickSearch } from '../../hooks/useQuickSearch';
import { cn } from '../../lib/cn';
import { formatMoney, getDiscountPercent } from '../../lib/format';

const MAX_HISTORY = 5;

const iconButtonClass = 'inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-pill border-0 bg-transparent text-subtle hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-primary';

/**
 * Buscador con resultados instantáneos (patrón combobox de ARIA).
 * Escribir solo muestra el desplegable; Enter o "Ver todos" confirma la búsqueda
 * y llena la cuadrícula de resultados del Inicio.
 */
export function SearchBox({
    committedQuery,
    onCommit,
    onClear,
    products,
    onProductSelect,
    onAddToCart,
    searchHistory = [],
    onHistoryRemove,
    onVoiceSearch
}) {
    const [query, setQuery] = useState(committedQuery);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [prevCommitted, setPrevCommitted] = useState(committedQuery);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const listboxId = useId();

    // Si la búsqueda confirmada cambia desde fuera (limpiar filtros, cambio de ruta), se refleja aquí
    if (committedQuery !== prevCommitted) {
        setPrevCommitted(committedQuery);
        setQuery(committedQuery);
    }

    const results = useQuickSearch(products, query);
    const trimmed = query.trim();
    const showHistory = trimmed.length === 0 && searchHistory.length > 0;
    const showResults = trimmed.length >= 2;

    // Opciones navegables con teclado, en el orden en que se muestran
    const options = showHistory
        ? searchHistory.slice(0, MAX_HISTORY).map(term => ({ type: 'history', term }))
        : showResults
            ? [...results.map(product => ({ type: 'product', product })), { type: 'all' }]
            : [];

    const panelVisible = isOpen && (showHistory || showResults);

    useEffect(() => {
        if (!isOpen) return;
        const handlePointerDown = (e) => {
            if (!containerRef.current?.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [isOpen]);

    const close = () => {
        setIsOpen(false);
        setActiveIndex(-1);
    };

    const commit = (term) => {
        const value = term.trim();
        setQuery(value);
        close();
        inputRef.current?.blur(); // Oculta el teclado en móvil
        if (value) onCommit(value);
    };

    const selectOption = (option) => {
        if (option.type === 'history') commit(option.term);
        else if (option.type === 'all') commit(query);
        else {
            close();
            onProductSelect(option.product);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            if (!options.length) return;
            e.preventDefault();
            setIsOpen(true);
            const step = e.key === 'ArrowDown' ? 1 : -1;
            setActiveIndex(i => (i + step + options.length) % options.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (panelVisible && activeIndex >= 0 && options[activeIndex]) selectOption(options[activeIndex]);
            else commit(query);
        } else if (e.key === 'Escape') {
            if (panelVisible) close();
            else inputRef.current?.blur();
        }
    };

    const optionId = (index) => `${listboxId}-option-${index}`;

    return (
        <div ref={containerRef} className="min-w-0 flex-1 md:relative">
            <form
                role="search"
                onSubmit={(e) => {
                    e.preventDefault();
                    commit(query);
                }}
                className="flex items-center rounded-pill bg-surface pl-3 shadow-sm focus-within:ring-2 focus-within:ring-secondary"
            >
                <Search size={20} className="shrink-0 text-subtle" aria-hidden="true" />
                <input
                    ref={inputRef}
                    type="search"
                    role="combobox"
                    aria-label="Buscar productos"
                    aria-autocomplete="list"
                    aria-expanded={panelVisible}
                    aria-controls={listboxId}
                    aria-activedescendant={panelVisible && activeIndex >= 0 ? optionId(activeIndex) : undefined}
                    placeholder="Buscar productos…"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setActiveIndex(-1);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                    enterKeyHint="search"
                    // text-base (16px): con menos, iOS hace zoom al enfocar
                    className="h-11 min-w-0 flex-1 border-0 bg-transparent px-2 font-sans text-base text-ink outline-none placeholder:text-subtle [&::-webkit-search-cancel-button]:hidden"
                />
                <div className="flex shrink-0 items-center pr-1">
                    {query && (
                        <button
                            type="button"
                            aria-label="Borrar búsqueda"
                            className={iconButtonClass}
                            onClick={() => {
                                setQuery('');
                                setActiveIndex(-1);
                                onClear();
                                inputRef.current?.focus();
                            }}
                        >
                            <X size={18} aria-hidden="true" />
                        </button>
                    )}
                    <VoiceSearch onSearch={onVoiceSearch} />
                </div>
            </form>

            {panelVisible && (
                <div className="absolute inset-x-3 top-full z-10 mt-1 overflow-hidden rounded-lg border border-border bg-surface shadow-lg animate-dialog-in md:inset-x-0 md:mt-2">
                    {showHistory && (
                        <p className="px-4 pt-3 pb-1 text-xs font-semibold text-subtle uppercase">Búsquedas recientes</p>
                    )}

                    {showResults && results.length === 0 && (
                        <p className="flex items-center gap-2 px-4 pt-3 pb-1 text-sm text-muted">
                            <SearchX size={16} className="shrink-0" aria-hidden="true" />
                            Sin coincidencias rápidas. Presiona Enter para ver sugerencias.
                        </p>
                    )}

                    <ul id={listboxId} role="listbox" aria-label={showHistory ? 'Búsquedas recientes' : 'Productos sugeridos'} className="max-h-[60vh] list-none overflow-y-auto py-1">
                        {options.map((option, index) => {
                            const isActive = index === activeIndex;
                            const rowClass = cn(
                                'flex w-full cursor-pointer items-center gap-3 px-4 text-left',
                                isActive ? 'bg-primary-soft' : 'hover:bg-gray-50'
                            );

                            if (option.type === 'history') {
                                return (
                                    <li
                                        key={option.term}
                                        id={optionId(index)}
                                        role="option"
                                        aria-selected={isActive}
                                        className={cn(rowClass, 'min-h-11 pr-1')}
                                        onClick={() => selectOption(option)}
                                    >
                                        <Clock size={16} className="shrink-0 text-subtle" aria-hidden="true" />
                                        <span className="flex-1 truncate text-ink">{option.term}</span>
                                        {onHistoryRemove && (
                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                aria-label={`Quitar "${option.term}" del historial`}
                                                className={iconButtonClass}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onHistoryRemove(option.term);
                                                }}
                                            >
                                                <X size={16} aria-hidden="true" />
                                            </button>
                                        )}
                                    </li>
                                );
                            }

                            if (option.type === 'all') {
                                return (
                                    <li
                                        key="all"
                                        id={optionId(index)}
                                        role="option"
                                        aria-selected={isActive}
                                        className={cn(rowClass, 'min-h-12 border-t border-border font-semibold text-primary')}
                                        onClick={() => selectOption(option)}
                                    >
                                        <Search size={16} className="shrink-0" aria-hidden="true" />
                                        <span className="flex-1 truncate">Ver todos los resultados para "{trimmed}"</span>
                                        <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
                                    </li>
                                );
                            }

                            const { product } = option;
                            const discount = getDiscountPercent(product);
                            return (
                                <li
                                    key={product.id}
                                    id={optionId(index)}
                                    role="option"
                                    aria-selected={isActive}
                                    className={cn(rowClass, 'py-2 pr-2')}
                                    onClick={() => selectOption(option)}
                                >
                                    <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-gray-50">
                                        <ProductImage src={product.image} iconSize={22} loading="lazy" className="max-h-full max-w-full" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-semibold text-ink">{product.name}</span>
                                        <span className="flex items-baseline gap-1.5 text-sm">
                                            <span className="font-bold text-primary">{formatMoney(product.price)}</span>
                                            {discount > 0 && <span className="text-xs font-semibold text-accent">-{discount}%</span>}
                                            {product.category && <span className="truncate text-xs text-subtle">· {product.category}</span>}
                                        </span>
                                    </span>
                                    {/* Atajo táctil; con teclado se agrega desde el detalle del producto */}
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        aria-label={`Agregar ${product.name} al carrito`}
                                        className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-pill border-0 bg-primary text-white hover:bg-primary-dark"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddToCart(product);
                                        }}
                                    >
                                        <Plus size={18} strokeWidth={3} aria-hidden="true" />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            <p className="sr-only" aria-live="polite">
                {showResults ? `${results.length} ${results.length === 1 ? 'producto sugerido' : 'productos sugeridos'}` : ''}
            </p>
        </div>
    );
}
