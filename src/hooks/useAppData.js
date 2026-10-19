import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useAppData() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [storeSettings, setStoreSettings] = useState({});
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Dynamic import to avoid circular dependencies if any, though not strictly necessary here
            const { ContentService } = await import('../services/content');

            const [productsData, categoriesData, settingsData] = await Promise.all([
                api.products.getAll(),
                api.products.getCategories(),
                ContentService.getSettings()
            ]);

            if (settingsData) {
                setStoreSettings(settingsData);
            }

            // Deduplicate products by ID
            const uniqueProducts = Array.from(new Map(productsData.map(item => [item.id, item])).values());

            // Deduplicate categories by ID
            const uniqueCategories = Array.from(new Map(categoriesData.map(item => [item.id, item])).values());

            setProducts(uniqueProducts);
            setCategories(uniqueCategories);
            setError(null);
        } catch (err) {
            console.error("Error loading data:", err);
            setError(err);
        } finally {
            setIsDataLoaded(true);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        products,
        categories,
        isDataLoaded,
        isLoading,
        storeSettings,
        error,
        refreshData: loadData
    };
}
