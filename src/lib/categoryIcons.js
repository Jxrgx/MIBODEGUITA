import {
    Apple, Baby, Beef, Beer, Cookie, Croissant, CupSoda, Dog, Fish, Milk,
    PawPrint, Pill, Popcorn, ShoppingBasket, Sparkles, SprayCan, Wheat
} from 'lucide-react';

// Íconos que el admin puede asignar en el campo `icon` de la categoría
const namedIcons = { Apple, Milk, SprayCan, Dog, Pill, Croissant, Baby };

// Palabra clave (sin acentos, minúsculas) -> ícono
const keywordIcons = [
    ['fruta', Apple],
    ['verdura', Apple],
    ['lacteo', Milk],
    ['leche', Milk],
    ['galleta', Cookie],
    ['dulce', Cookie],
    ['limpieza', SprayCan],
    ['mascota', PawPrint],
    ['farmacia', Pill],
    ['panal', Baby],
    ['pan', Croissant],
    ['bebe', Baby],
    ['bebida', CupSoda],
    ['refresco', CupSoda],
    ['cerveza', Beer],
    ['vino', Beer],
    ['botana', Popcorn],
    ['carne', Beef],
    ['pescado', Fish],
    ['higiene', Sparkles],
    ['cuidado', Sparkles],
    ['abarrote', Wheat]
];

const normalize = (text = '') =>
    text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function getCategoryIcon(categoryName, iconName) {
    if (namedIcons[iconName]) return namedIcons[iconName];
    const name = normalize(categoryName);
    const match = keywordIcons.find(([keyword]) => name.includes(keyword));
    return match ? match[1] : ShoppingBasket;
}
