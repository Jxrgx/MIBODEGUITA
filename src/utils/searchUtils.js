import Fuse from 'fuse.js';

// Diccionario de sinónimos para mejorar la búsqueda
export const SYNONYMS = {
    'chesco': 'refresco',
    'soda': 'refresco',
    'coca': 'coca-cola',
    'pepsi': 'pepsi',
    'papas': 'sabritas',
    'fruta': 'frutas',
    'verdura': 'verduras',
    'carne': 'carniceria',
    'pollo': 'carniceria',
    'bistec': 'carniceria',
    'milanesa': 'carniceria',
    'jabon': 'limpieza',
    'detergente': 'limpieza',
    'cloro': 'limpieza',
    'suavitel': 'limpieza',
    'fabuloso': 'limpieza',
    'papel': 'higienico',
    'leche': 'lacteos',
    'queso': 'lacteos',
    'yogurt': 'lacteos',
    'crema': 'lacteos',
    'mantequilla': 'lacteos',
    'pan': 'panaderia',
    'bolillo': 'panaderia',
    'dulce': 'dulces',
    'golosina': 'dulces',
    'cerveza': 'alcohol',
    'caguama': 'alcohol',
    'pisto': 'alcohol',
    'chupe': 'alcohol',
    'botana': 'sabritas',
    'galletas': 'galleta',
    'jugo': 'bebidas',
    'agua': 'bebidas',
    'jitomate': 'tomate',
    'tomate': 'jitomate',
    'platano': 'frutas',
    'banana': 'frutas',
    'frijol': 'granos',
    'arroz': 'granos',
    'pasta': 'sopas',
    'sopa': 'pastas',
    'jamon': 'embutidos',
    'salchicha': 'embutidos',
    'cigarros': 'tabaco'
};

/**
 * Procesa la consulta de búsqueda reemplazando sinónimos conocidos.
 * @param {string} query - La consulta original del usuario.
 * @returns {string} - La consulta procesada con sinónimos reemplazados.
 */
export const processSearchQuery = (query) => {
    if (!query) return '';

    const lowerQuery = query.toLowerCase();

    // Verificar palabra por palabra (simple)
    return lowerQuery.split(' ').map(word => SYNONYMS[word] || word).join(' ');
};

/**
 * Crea una instancia configurada de Fuse.js.
 * @param {Array} products - Lista de productos a buscar.
 * @returns {Fuse} - Instancia de Fuse.
 */
export const createFuseInstance = (products) => {
    return new Fuse(products, {
        keys: [
            { name: 'name', weight: 0.6 },
            { name: 'category', weight: 0.2 },
            { name: 'brand', weight: 0.1 },
            { name: 'description', weight: 0.1 }
        ],
        threshold: 0.3, // 0.0 = coincidencia exacta, 1.0 = coincidencia muy laxa
        distance: 100,
        minMatchCharLength: 2, // Ignorar búsquedas de 1 letra
        includeScore: true,
        ignoreLocation: true, // Buscar en cualquier parte del string
        ignoreDiacritics: true // Ignorar acentos (Lácteos == lacteos)
    });
};
