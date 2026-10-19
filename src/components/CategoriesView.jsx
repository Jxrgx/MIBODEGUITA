import React from 'react';
import { SearchX } from 'lucide-react';
import { ProductGrid } from './ProductGrid';
import { EmptyState } from './ui';
import { getCategoryIcon } from '../lib/categoryIcons';

export function CategoriesView({
    filteredCategories,
    handleCategoryClick,
    searchQuery,
    filteredProducts,
    addToCart,
    handleOpenProduct,
    favorites,
    toggleFavorite
}) {
    return (
        <div className="font-sans">
            <h1 className="mb-4 text-2xl font-bold text-ink">Departamentos</h1>

            <ul className="grid list-none grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {filteredCategories.map(category => {
                    const Icon = getCategoryIcon(category.name, category.icon);
                    return (
                        <li key={category.id}>
                            <button
                                type="button"
                                onClick={() => handleCategoryClick(category.name)}
                                className="flex w-full cursor-pointer flex-col items-center gap-3 rounded-lg border border-transparent bg-surface p-5 font-sans shadow-sm transition-[box-shadow,border-color] hover:border-black/5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                                <span
                                    className="flex size-14 items-center justify-center rounded-pill bg-primary-soft text-primary"
                                    style={category.color ? { backgroundColor: category.color } : undefined}
                                >
                                    <Icon size={26} aria-hidden="true" />
                                </span>
                                <span className="text-center font-semibold text-ink">{category.name}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            {searchQuery && (
                <section className="mt-8" aria-label={`Productos que coinciden con ${searchQuery}`}>
                    <ProductGrid
                        products={filteredProducts}
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                        onAdd={addToCart}
                        onOpenProduct={handleOpenProduct}
                        emptyState={
                            <EmptyState
                                icon={SearchX}
                                title="Sin resultados"
                                message={`No se encontraron productos que coincidan con "${searchQuery}".`}
                            />
                        }
                    />
                </section>
            )}
        </div>
    );
}
