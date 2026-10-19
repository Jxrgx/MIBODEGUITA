import React, { useEffect, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { CartStatusBar } from '../components/CartStatusBar';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { BulkProductModal } from '../components/BulkProductModal';
import { useCart } from '../context/cart';
import { cn } from '../lib/cn';

export const MainLayout = ({
    searchQuery,
    setSearchQuery,
    isScanning,
    setIsScanning,
    handleScan,
    products,
    categories,
    selectedCategory,
    handleCategoryClick,
    handleOpenProduct,
    clearFilters,
    showToast,
    searchHistory,
    addToHistory,
    removeFromHistory,
    onOpenCartDrawer
}) => {
    const {
        selectedBulkProduct,
        closeBulkModal,
        addBulkToCart,
        addToCart,
        cartCount,
        cartTotal,
        isCartAnimating
    } = useCart();

    const location = useLocation();
    const navigate = useNavigate();
    const isHomeRoute = location.pathname === '/';

    // Clear search when location changes (except when going to home)
    useEffect(() => {
        if (location.pathname !== '/' && searchQuery) {
            setSearchQuery('');
        }
    }, [location.pathname]);

    // Determine active tab based on path
    let activeTab = 'home';
    if (location.pathname === '/cart') activeTab = 'cart';
    else if (location.pathname === '/combos') activeTab = 'combos';
    else if (location.pathname === '/categories') activeTab = 'categories';
    else if (location.pathname === '/profile') activeTab = 'profile';
    else if (location.pathname.startsWith('/admin')) activeTab = 'admin';

    const handleTabChange = useCallback((tab) => {
        if (tab === 'home') {
            if (clearFilters) clearFilters();
            navigate('/');
        } else if (tab === 'admin') {
            navigate('/admin');
        } else {
            navigate(`/${tab}`);
        }
    }, [clearFilters, navigate]);

    // Enter, "Ver todos", historial o voz: la búsqueda se confirma y llena la cuadrícula del Inicio
    const handleSearchCommit = useCallback((query) => {
        clearFilters?.(); // Una búsqueda nueva no hereda la categoría ni el orden anteriores
        setSearchQuery(query);
        addToHistory?.(query);
        if (location.pathname !== '/') navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [clearFilters, setSearchQuery, addToHistory, location.pathname, navigate]);

    const handleSearchClear = useCallback(() => setSearchQuery(''), [setSearchQuery]);

    // El header solo existe como navegación desde md: ahí el carrito abre el drawer en vez de navegar.
    // En /cart no tiene sentido abrir un panel con el mismo contenido.
    const handleHeaderTabChange = useCallback((tab) => {
        if (tab === 'cart' && onOpenCartDrawer && location.pathname !== '/cart') onOpenCartDrawer();
        else handleTabChange(tab);
    }, [onOpenCartDrawer, location.pathname, handleTabChange]);

    const showCartStatus = cartCount > 0 && location.pathname !== '/cart';

    return (
        <div className="app-container">
            {selectedBulkProduct && (
                <BulkProductModal
                    product={selectedBulkProduct}
                    onClose={closeBulkModal}
                    onAdd={addBulkToCart}
                />
            )}

            {isScanning && (
                <BarcodeScanner
                    onScan={handleScan}
                    onClose={() => setIsScanning(false)}
                />
            )}

            <Header
                searchQuery={searchQuery}
                onSearchCommit={handleSearchCommit}
                onSearchClear={handleSearchClear}
                // onOpenScanner se omite: BarcodeScanner aún es una simulación (elige un producto al azar)
                products={products}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategoryClick}
                showCategories={isHomeRoute}
                onProductSelect={handleOpenProduct}
                addToCart={addToCart}
                showToast={showToast}
                searchHistory={searchHistory}
                onHistoryRemove={removeFromHistory}
                activeTab={activeTab}
                onTabChange={handleHeaderTabChange}
                cartCount={cartCount}
                cartTotal={cartTotal}
            />

            {/* Espacio inferior para la barra de navegación (y la del carrito) en móvil; en escritorio no hay barras abajo */}
            <main className={cn('mx-auto w-full max-w-6xl flex-1 px-4 pt-4 md:pb-10', showCartStatus ? 'pb-44' : 'pb-28')}>
                <div key={location.pathname} className="animate-page-enter">
                    <Outlet />
                </div>
            </main>

            <BottomNav
                activeTab={activeTab}
                onTabChange={handleTabChange}
                cartCount={cartCount}
                isAnimating={isCartAnimating}
            >
                {showCartStatus && (
                    <CartStatusBar count={cartCount} total={cartTotal} onOpen={() => navigate('/cart')} />
                )}
            </BottomNav>
        </div>
    );
};
