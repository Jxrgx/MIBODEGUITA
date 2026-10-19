import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductSkeleton } from './ProductSkeleton';
import { cn } from '../lib/cn';

/**
 * Cuadrícula única del catálogo (Inicio, sugerencias, Departamentos, Favoritos).
 * Mobile-first: 2 columnas en celular y hasta 5 en escritorio.
 */
export function ProductGrid({
    products,
    isLoading = false,
    skeletonCount = 6,
    favorites = [],
    onToggleFavorite,
    onAdd,
    onOpenProduct,
    priorityCount = 4,
    animateEntrance = false,
    emptyState = null,
    label,
    className
}) {
    if (!isLoading && products.length === 0) return emptyState;

    const favoriteIds = new Set(favorites.map(fav => fav.id));

    return (
        <ul
            aria-label={label}
            aria-busy={isLoading || undefined}
            className={cn('grid list-none grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5', className)}
        >
            {isLoading
                ? Array.from({ length: skeletonCount }).map((_, index) => (
                    <li key={index}><ProductSkeleton /></li>
                ))
                : products.map((product, index) => (
                    <li
                        key={product.id}
                        // Entrada escalonada (delay-* vive en animations.css, máx. 300 ms)
                        className={animateEntrance ? `animate-slide-up delay-${Math.min(index * 50, 300)} [animation-fill-mode:both]` : undefined}
                    >
                        <ProductCard
                            product={product}
                            onAdd={onAdd}
                            isFavorite={favoriteIds.has(product.id)}
                            onToggleFavorite={() => onToggleFavorite(product)}
                            onClick={() => onOpenProduct(product)}
                            priority={index < priorityCount}
                        />
                    </li>
                ))}
        </ul>
    );
}
