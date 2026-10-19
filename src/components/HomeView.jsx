import React from 'react';
import { ArrowUpDown, SearchX } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductSkeleton } from './ProductSkeleton';
import { OffersCarousel } from './OffersCarousel';
import { FlashSale } from './FlashSale';
import { ComboSection } from './ComboSection';
import { Flyer } from './Flyer';
import { Button, Chip, EmptyState, SectionHeader } from './ui';
import { getCategoryIcon } from '../lib/categoryIcons';

const productGridClass = 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';

const sortLabels = {
    asc: 'Menor precio',
    desc: 'Mayor precio'
};

function DepartmentsRow({ categories, handleCategoryClick, onSeeAll }) {
    return (
        <section className="mb-6" aria-labelledby="departments-title">
            <SectionHeader id="departments-title" title="Departamentos" actionLabel="Ver todos" onAction={onSeeAll} />
            <ul className="hide-scrollbar -mx-4 flex snap-x list-none gap-2 overflow-x-auto px-4 pb-1">
                {categories.map((cat, index) => {
                    const Icon = getCategoryIcon(cat.name, cat.icon);
                    return (
                        <li key={`${cat.id}-${index}`} className="w-20 shrink-0 snap-start">
                            <button
                                type="button"
                                onClick={() => handleCategoryClick(cat.name)}
                                className="group flex w-full cursor-pointer flex-col items-center gap-1.5 rounded-md border-0 bg-transparent p-1 font-sans focus-visible:outline-2 focus-visible:outline-primary"
                            >
                                <span
                                    className="flex size-14 items-center justify-center rounded-lg bg-primary-soft text-primary-dark shadow-sm transition-transform group-hover:scale-105"
                                    style={cat.color ? { backgroundColor: cat.color } : undefined}
                                >
                                    <Icon size={24} aria-hidden="true" />
                                </span>
                                <span className="line-clamp-2 text-center text-xs leading-tight font-medium text-muted">
                                    {cat.name}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

function ProductTile({ product, index, priority, addToCart, favorites, toggleFavorite, handleOpenProduct }) {
    return (
        <ProductCard
            product={product}
            onAdd={addToCart}
            isFavorite={favorites.some(fav => fav.id === product.id)}
            onToggleFavorite={() => toggleFavorite(product)}
            onClick={() => handleOpenProduct(product)}
            priority={priority ?? index < 4}
        />
    );
}

export function HomeView({
    categories,
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    filteredProducts,
    visibleProducts,
    isLoading,
    visibleCount,
    setVisibleCount,
    handleCategoryClick,
    setSelectedSubcategory,
    handleTabChange,
    addToCart,
    favorites,
    toggleFavorite,
    handleOpenProduct,
    clearFilters,
    sortOrder,
    setSortOrder,
    bestSellers,
    handleAddCombo,
    storeSettings,
    suggestions
}) {
    const isHome = !selectedCategory && !searchQuery;
    const tileProps = { addToCart, favorites, toggleFavorite, handleOpenProduct };
    const subcategories = categories.find(c => c.name === selectedCategory)?.subcategories || [];
    const remaining = filteredProducts.length - visibleCount;

    const cycleSort = () => setSortOrder(prev => {
        if (prev === null) return 'asc';
        if (prev === 'asc') return 'desc';
        return null;
    });

    return (
        <div className="font-sans">
            {isHome && (
                <DepartmentsRow
                    categories={categories}
                    handleCategoryClick={handleCategoryClick}
                    onSeeAll={() => handleTabChange('categories')}
                />
            )}

            {selectedCategory && subcategories.length > 0 && (
                <div className="hide-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Subcategorías">
                    <Chip selected={!selectedSubcategory} onClick={() => setSelectedSubcategory(null)}>Todo</Chip>
                    {subcategories.map(sub => (
                        <Chip key={sub} selected={selectedSubcategory === sub} onClick={() => setSelectedSubcategory(sub)}>
                            {sub}
                        </Chip>
                    ))}
                </div>
            )}

            {isHome && (
                <>
                    <OffersCarousel />

                    {bestSellers.length > 0 && (
                        <section className="mb-6" aria-labelledby="best-sellers-title">
                            <SectionHeader id="best-sellers-title" title="Más vendidos" />
                            <ul className="hide-scrollbar -mx-4 flex snap-x snap-mandatory list-none gap-3 overflow-x-auto px-4 pb-2">
                                {bestSellers.map(product => (
                                    <li key={product.id} className="w-40 shrink-0 snap-start sm:w-44">
                                        <ProductTile product={product} priority {...tileProps} />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {(storeSettings?.visibility?.flashSale ?? true) && <FlashSale onAdd={addToCart} />}
                    {(storeSettings?.visibility?.combos ?? true) && (
                        <ComboSection onAddCombo={handleAddCombo} onSeeAll={() => handleTabChange('combos')} />
                    )}
                    {(storeSettings?.visibility?.flyer ?? true) && <Flyer />}
                </>
            )}

            <section aria-labelledby="products-title">
                <SectionHeader
                    id="products-title"
                    title={selectedCategory || (searchQuery ? 'Resultados' : 'Recomendados')}
                >
                    <Chip selected={Boolean(sortOrder)} icon={ArrowUpDown} onClick={cycleSort}>
                        {sortLabels[sortOrder] || 'Ordenar'}
                    </Chip>
                </SectionHeader>

                {filteredProducts.length === 0 ? (
                    <>
                        <EmptyState
                            icon={SearchX}
                            title="No encontramos productos"
                            message={searchQuery ? `No hay coincidencias exactas para "${searchQuery}".` : 'Esta sección no tiene productos por ahora.'}
                            actionLabel="Ver todos los productos"
                            onAction={clearFilters}
                        />
                        {suggestions && suggestions.length > 0 && (
                            <div className="mb-8">
                                <h3 className="mb-3 font-semibold text-ink">¿Quizás quisiste decir…?</h3>
                                <div className={productGridClass}>
                                    {suggestions.map((product, index) => (
                                        <ProductTile key={product.id} product={product} index={index} {...tileProps} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className={`${productGridClass} mb-6`}>
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, idx) => <ProductSkeleton key={idx} />)
                            ) : (
                                visibleProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className={`animate-slide-up delay-${Math.min(index * 50, 300)}`}
                                        style={{ animationFillMode: 'both' }}
                                    >
                                        <ProductTile product={product} index={index} {...tileProps} />
                                    </div>
                                ))
                            )}
                        </div>

                        {remaining > 0 && (
                            <div className="mb-8 flex justify-center">
                                <Button variant="outline" onClick={() => setVisibleCount(prev => prev + 20)}>
                                    Ver más productos ({remaining} restantes)
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
