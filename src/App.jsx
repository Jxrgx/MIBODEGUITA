import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ProductActionModal } from './components/ProductActionModal';
import { CheckoutModal } from './components/CheckoutModal';
import { LoginModal } from './components/LoginModal';
import { Toast } from './components/Toast';
import { StoreMap } from './components/StoreMap';
// Lazy loaded components

const Account = React.lazy(() => import('./components/Account').then(module => ({ default: module.Account })));
const CombosGrid = React.lazy(() => import('./components/CombosGrid').then(module => ({ default: module.CombosGrid })));
const CategoriesView = React.lazy(() => import('./components/CategoriesView').then(module => ({ default: module.CategoriesView })));
const CartView = React.lazy(() => import('./components/CartView').then(module => ({ default: module.CartView })));

import { HomeView } from './components/HomeView';
import { AuthProvider, useAuth } from './context/auth.jsx';
import { CartProvider, useCart } from './context/cart.jsx';

import { OrderService } from './services/orders';
import { UserService } from './services/users';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { MainLayout } from './layouts/MainLayout';
import { useAppData } from './hooks/useAppData';
import { useProductSearch } from './hooks/useProductSearch';
import { paymentLabel } from './lib/orders';

function FullScreenLoader({ label }) {
  return (
    <div role="status" className="flex min-h-screen flex-col items-center justify-center gap-3 font-sans text-muted">
      <span aria-hidden="true" className="size-10 animate-spin rounded-pill border-4 border-gray-200 border-t-primary" />
      {label}
    </div>
  );
}

function App() {
  // Custom Hooks
  const {
    products,
    categories,
    isDataLoaded,
    isLoading,
    storeSettings
  } = useAppData();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    sortOrder,
    setSortOrder,
    visibleCount,
    setVisibleCount,
    filteredProducts,
    filteredCategories,
    visibleProducts,
    clearFilters,
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    suggestions
  } = useProductSearch(products, categories);

  // Cart Context
  const {
    cart,
    setCart,
    cartTotal,
    addToCart,
    addComboToCart,
    removeFromCart,
    updateQuantity
  } = useCart();

  // Auth Context
  const { user, logout, setUser } = useAuth();

  // Local State
  const [favorites, setFavorites] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [orders, setOrders] = useState([]);

  // Saved Lists State
  const [savedLists, setSavedLists] = useState([]);
  const [isSavingList, setIsSavingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [listName, setListName] = useState('');

  const [showCheckout, setShowCheckout] = useState(false);
  const [flyingItem, setFlyingItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    if (user?.email) {
      // Cargar datos del usuario desde Firebase usando Email como ID
      UserService.getUserData(user.email).then(userData => {
        if (userData) {
          if (userData.favorites) setFavorites(userData.favorites);
          if (userData.savedLists) setSavedLists(userData.savedLists);
        }
      });
      UserService.getOrders(user.email).then(userOrders => {
        setOrders(userOrders);
      });
    }
  }, [user?.email]);

  // Handlers
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const finalTotal = cartTotal;

  const totalSavings = cart.reduce((acc, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return acc + ((item.originalPrice - item.price) * item.quantity);
    }
    return acc;
  }, 0);

  const handleConfirmOrder = (details) => {
    const subtotal = cart.reduce((acc, item) => acc + (item.isBulkSelection ? item.totalPrice : (item.price * item.quantity)), 0);

    const newOrder = {
      id: Math.floor(Math.random() * 1000000),
      date: new Date().toLocaleDateString(),
      createdAt: new Date().toISOString(),
      items: [...cart],
      total: subtotal,
      subtotal: subtotal,
      customerName: user?.name || '',
      deliveryMethod: details.deliveryMethod,
      address: details.address,
      paymentMethod: details.paymentMethod,
      status: 'En camino'
    };

    showToast('Guardando pedido en la nube...', 'info');

    // Guardar en la colección general de pedidos (si existe)
    OrderService.createOrder(newOrder)
      .then(id => {
        console.log("Order saved to Firebase with ID:", id);
        // Guardar en el historial del usuario
        if (user?.email) {
          UserService.addOrder(user.email, newOrder).then(() => {
            showToast('¡Pedido guardado en tu historial!', 'success');
          });
        }
      })
      .catch(err => {
        console.error("Failed to save order to Firebase:", err);
        showToast('Error al guardar en la nube', 'error');
      });

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setShowCheckout(false);
    setShowOrderSuccess(true);

    const savedSettings = JSON.parse(localStorage.getItem('storeSettings') || '{}');
    const phoneNumber = savedSettings.whatsappNumber || "529821041154";

    const itemsList = newOrder.items.map(item => {
      let desc = `- ${item.name}`;
      if (item.isBulkSelection) {
        desc += ` (${item.cartQuantity} ${item.cartUnit})`;
        if (item.notes) desc += ` [Nota: ${item.notes}]`;
        desc += ` ($${item.totalPrice.toFixed(2)})`;
      } else {
        desc += ` x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`;
      }
      return desc;
    }).join('\n');

    const message = `¡Hola! Quiero realizar un pedido en Abarrotes Alex.\n\n*Pedido #${newOrder.id}*\n\n*Productos:*\n${itemsList}\n\n*Total: $${newOrder.total.toFixed(2)}*\n\n*Dirección de Entrega:*\n${details.address}\n\n*Método de Pago:*\n${paymentLabel(details.paymentMethod)}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    // La URL va en el modal de éxito por si el navegador bloquea la pestaña nueva
    setLastOrder({ ...newOrder, whatsappUrl });

    try {
      window.open(whatsappUrl, '_blank');
    } catch (e) {
      console.error("Error opening WhatsApp:", e);
      window.location.href = whatsappUrl;
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedSubcategory(null);
    setSearchQuery('');
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (product) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.id === product.id);
      let newFavorites;
      if (exists) {
        newFavorites = prev.filter(p => p.id !== product.id);
        showToast('Eliminado de favoritos');
      } else {
        newFavorites = [...prev, product];
        showToast('Agregado a favoritos');
      }

      if (user?.email) {
        UserService.updateFavorites(user.email, newFavorites);
      }
      return newFavorites;
    });
  };

  const startSaveList = () => {
    setIsSavingList(true);
    setListName('');
  };

  const saveList = () => {
    if (!listName.trim()) {
      showToast('Ingresa un nombre para la lista', 'error');
      return;
    }
    const newList = {
      id: Date.now(),
      name: listName,
      items: cart,
      date: new Date().toLocaleDateString()
    };
    const updatedLists = [...savedLists, newList];
    setSavedLists(updatedLists);

    if (user?.email) {
      UserService.updateSavedLists(user.email, updatedLists);
    }

    setIsSavingList(false);
    showToast('Lista guardada correctamente');
  };

  const cancelSaveList = () => {
    setIsSavingList(false);
    setListName('');
  };

  const deleteList = (id) => {
    const updatedLists = savedLists.filter(l => l.id !== id);
    setSavedLists(updatedLists);

    if (user?.email) {
      UserService.updateSavedLists(user.email, updatedLists);
    }
    showToast('Lista eliminada');
  };

  const loadList = (list) => {
    if (cart.length > 0) {
      if (!window.confirm('¿Reemplazar el carrito actual con esta lista?')) return;
    }
    setCart(list.items);
    showToast('Lista cargada al carrito');
  };

  const goToTab = (tab) => navigate(tab === 'home' ? '/' : `/${tab}`);

  const handleLogout = () => {
    logout();
    navigate('/');
    showToast('Sesión cerrada correctamente');
  };

  const handleScan = (code) => {
    const product = products.find(p => p.barcode === code || p.id === code);
    if (product) {
      addToCart(product);
      showToast(`Agregado: ${product.name}`);
    } else {
      showToast('Producto no encontrado', 'error');
    }
  };

  const bestSellers = products.slice(0, 4);

  if (!isDataLoaded) {
    return <FullScreenLoader label="Cargando la tienda…" />;
  }

  if (!user) {
    return <LoginModal />;
  }



  const handleAddToCartWithAnimation = (product, event) => {
    addToCart(product);

    if (event) {
      const imgElement = event.currentTarget.closest('.product-card')?.querySelector('img');
      const startRect = imgElement ? imgElement.getBoundingClientRect() : event.target.getBoundingClientRect();

      // Target: Bottom Nav Cart Icon (approximate position if not found)
      const cartIcon = document.querySelector('.bottom-nav-cart-icon');
      const targetRect = cartIcon ? cartIcon.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight - 50 };

      // Calculate relative distance
      const deltaX = targetRect.left - startRect.left + (targetRect.width / 2) - (startRect.width / 2);
      const deltaY = targetRect.top - startRect.top + (targetRect.height / 2) - (startRect.height / 2);

      setFlyingItem({
        image: product.image,
        x: startRect.left,
        y: startRect.top,
        width: startRect.width,
        height: startRect.height,
        style: {
          '--target-x': `${deltaX}px`,
          '--target-y': `${deltaY}px`
        }
      });

      setTimeout(() => setFlyingItem(null), 800); // Match animation duration
    }
  };

  return (
    <>
      <Suspense fallback={<FullScreenLoader label="Cargando…" />}>
        <Routes>
          <Route path="/" element={
            <MainLayout
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isScanning={isScanning}
              setIsScanning={setIsScanning}
              handleScan={handleScan}
              products={products}
              categories={categories}
              selectedCategory={selectedCategory}
              handleCategoryClick={handleCategoryClick}
              handleOpenProduct={setSelectedProduct}
              clearFilters={clearFilters}
              showToast={showToast}
              searchHistory={searchHistory}
              addToHistory={addToHistory}
              removeFromHistory={removeFromHistory}
            />
          }>
            <Route index element={
              <HomeView
                categories={categories}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                searchQuery={searchQuery}
                filteredProducts={filteredProducts}
                filteredCategories={filteredCategories}
                visibleProducts={visibleProducts}
                isLoading={isLoading}
                visibleCount={visibleCount}
                setVisibleCount={setVisibleCount}
                handleCategoryClick={handleCategoryClick}
                setSelectedSubcategory={setSelectedSubcategory}
                handleTabChange={goToTab}
                addToCart={(product) => {
                  addToCart(product);
                  showToast(`Agregado: ${product.name}`);
                }}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                handleOpenProduct={setSelectedProduct}
                clearFilters={clearFilters}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                bestSellers={bestSellers}
                handleAddCombo={addComboToCart}
                storeSettings={storeSettings}
                searchHistory={searchHistory}
                onHistorySelect={(term) => {
                  setSearchQuery(term);
                  addToHistory(term);
                }}
                onHistoryRemove={removeFromHistory}
                onHistoryClear={clearHistory}
                suggestions={suggestions}
              />
            } />
            <Route path="cart" element={
              <CartView
                cart={cart}
                cartTotal={cartTotal}
                isSavingList={isSavingList}
                startSaveList={startSaveList}
                newListName={newListName}
                setNewListName={setNewListName}
                onConfirmSaveList={saveList}
                cancelSaveList={cancelSaveList}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                totalSavings={totalSavings}
                finalTotal={finalTotal}
                setShowCheckout={setShowCheckout}
                savedLists={savedLists}
                loadList={loadList}
                deleteList={deleteList}
                setActiveTab={goToTab}
              />
            } />
            <Route path="combos" element={
              <CombosGrid onAddCombo={addComboToCart} onBack={() => navigate('/')} />
            } />
            <Route path="categories" element={
              <CategoriesView
                filteredCategories={filteredCategories}
                handleCategoryClick={handleCategoryClick}
                searchQuery={searchQuery}
                filteredProducts={filteredProducts}
                addToCart={(product) => {
                  addToCart(product);
                  showToast(`Agregado: ${product.name}`);
                }}
                handleOpenProduct={setSelectedProduct}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            } />
            <Route path="profile" element={
              <Account
                user={user}
                orders={orders}
                favorites={favorites}
                onLogout={handleLogout}
                onUpdateUser={(updatedUser) => {
                  setUser(updatedUser);
                  localStorage.setItem('user', JSON.stringify(updatedUser));
                }}
                onToggleFavorite={toggleFavorite}
                onAddToCart={addToCart}
                onProductSelect={setSelectedProduct}

              />
            } />
          </Route>


        </Routes>
      </Suspense>

      {/* Global Modals */}
      {selectedProduct && (
        <ProductActionModal
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={addToCart}
          products={products}
          onProductSelect={setSelectedProduct}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          total={finalTotal}
          onClose={() => setShowCheckout(false)}
          onConfirm={handleConfirmOrder}
          deliveryCost={storeSettings.deliveryCost || 15}
        />
      )}

      {showOrderSuccess && lastOrder && (
        <OrderSuccessModal
          order={lastOrder}
          onClose={() => {
            setShowOrderSuccess(false);
            setLastOrder(null);
            setSearchQuery('');
            navigate('/');
          }}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={2000}
        />
      )}

      {showMap && (
        <StoreMap onClose={() => setShowMap(false)} />
      )}
    </>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <App />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default AppWrapper;
