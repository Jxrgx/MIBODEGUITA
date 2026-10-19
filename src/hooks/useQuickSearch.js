import { useDeferredValue, useMemo } from 'react';
import { createFuseInstance, processSearchQuery } from '../utils/searchUtils';

const MIN_QUERY_LENGTH = 2;

/**
 * Resultados instantáneos para el desplegable del buscador.
 * Usa el mismo motor (Fuse + sinónimos) que la búsqueda completa, con el índice memorizado
 * para no reconstruirlo en cada tecla.
 */
export function useQuickSearch(products, query, limit = 6) {
    const fuse = useMemo(() => createFuseInstance(products || []), [products]);
    const deferredQuery = useDeferredValue(query);

    return useMemo(() => {
        const trimmed = deferredQuery.trim();
        if (trimmed.length < MIN_QUERY_LENGTH) return [];
        return fuse.search(processSearchQuery(trimmed), { limit }).map(result => result.item);
    }, [fuse, deferredQuery, limit]);
}
