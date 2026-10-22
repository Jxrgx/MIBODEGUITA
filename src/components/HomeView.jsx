import React from 'react';
import { ArrowUpDown, SearchX } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductGrid } from './ProductGrid';
import { ComboSection } from './ComboSection';
import { Flyer } from './Flyer';
import { Button, Chip, EmptyState, SectionHeader } from './ui';

const sortLabels = {
    asc: 'Menor precio',
    desc: 'Mayor precio'
};

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
    const gridProps = { favorites, onToggleFavorite: toggleFavorite, onAdd: addToCart, onOpenProduct: handleOpenProduct };
    const subcategories = categories.find(c => c.name === selectedCategory)?.subcategories || [];
    const remaining = filteredProducts.length - visibleCount;

    const cycleSort = () => setSortOrder(prev => {
        if (prev === null) return 'asc';
        if (prev === 'asc') return 'desc';
        return null;
    });

    return (
        <div className="font-sans">
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
                    {bestSellers.length > 0 && (
                        <section className="mb-6" aria-labelledby="best-sellers-title">
                            <SectionHeader id="best-sellers-title" title="Más vendidos" />
                            <ul className="hide-scrollbar -mx-4 flex snap-x snap-mandatory list-none gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0 md:grid-cols-4">
                                {bestSellers.map(product => (
                                    <li key={product.id} className="w-40 shrink-0 snap-start sm:w-44 md:w-auto">
                                        <ProductCard
                                            product={product}
                                            onAdd={addToCart}
                                            isFavorite={favorites.some(fav => fav.id === product.id)}
                                            onToggleFavorite={() => toggleFavorite(product)}
                                            onClick={() => handleOpenProduct(product)}
                                            priority
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

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

                {/* Mientras carga se muestran skeletons, no el estado vacío */}
                {isLoading || filteredProducts.length > 0 ? (
                    <>
                        <ProductGrid
                            products={visibleProducts}
                            isLoading={isLoading}
                            animateEntrance
                            label={selectedCategory || (searchQuery ? `Resultados para ${searchQuery}` : 'Productos recomendados')}
                            className="mb-6"
                            {...gridProps}
                        />

                        {!isLoading && remaining > 0 && (
                            <div className="mb-8 flex justify-center">
                                <Button variant="outline" onClick={() => setVisibleCount(prev => prev + 20)}>
                                    Ver más productos ({remaining} restantes)
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
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
                                <ProductGrid products={suggestions} label="Productos sugeridos" {...gridProps} />
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
