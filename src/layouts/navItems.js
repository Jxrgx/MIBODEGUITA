import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';

// Pestañas principales: las usan la barra inferior (móvil) y el header (escritorio)
export const navItems = [
    { tab: 'home', label: 'Inicio', icon: Home },
    { tab: 'categories', label: 'Departamentos', shortLabel: 'Deptos', icon: LayoutGrid },
    { tab: 'cart', label: 'Carrito', icon: ShoppingCart },
    { tab: 'profile', label: 'Cuenta', icon: User }
];

export const formatCartCount = (count) => (count > 99 ? '99+' : String(count));
