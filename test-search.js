
import Fuse from 'fuse.js';

const SYNONYMS = {
    'leche': 'lacteos',
    // ... copy relevant parts
};

const processSearchQuery = (query) => {
    if (!query) return '';
    const lowerQuery = query.toLowerCase();
    // Revert to simple replacement
    return lowerQuery.split(' ').map(word => SYNONYMS[word] || word).join(' ');
};

const products = [
    { id: 1, name: 'Leche Alpura Clásica', category: 'Lácteos', brand: 'Alpura', description: 'Leche entera pasteurizada' },
    { id: 2, name: 'Leche Lala Entera', category: 'Lácteos', brand: 'Lala', description: 'Leche fresca' },
    { id: 3, name: 'Coca Cola', category: 'Bebidas', brand: 'Coca Cola', description: 'Refresco de cola' },
];

const createFuseInstance = (products) => {
    return new Fuse(products, {
        keys: [
            { name: 'name', weight: 0.6 },
            { name: 'category', weight: 0.2 },
            { name: 'brand', weight: 0.1 },
            { name: 'description', weight: 0.1 }
        ],
        threshold: 0.3, // Revert to 0.3
        distance: 100,
        minMatchCharLength: 2,
        includeScore: true,
        ignoreLocation: true,
        ignoreDiacritics: true
    });
};

const query = 'leche';
const processed = processSearchQuery(query);
console.log('Processed Query:', processed);

const fuse = createFuseInstance(products);
const results = fuse.search(processed);

console.log('Results:', JSON.stringify(results, null, 2));
