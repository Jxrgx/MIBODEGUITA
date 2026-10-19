import Fuse from 'fuse.js';

// Dictionary of common spoken synonyms to store terms
const SYNONYMS = {
    'chesco': 'refresco',
    'soda': 'refresco',
    'coca': 'coca cola',
    'pepsi': 'pepsi',
    'papas': 'sabritas',
    'fruta': 'frutas y verduras',
    'verdura': 'frutas y verduras',
    'tomate': 'jitomate',
    'birria': 'cerveza', // Common slang in some regions, or just example
    'cheve': 'cerveza',
    'leche': 'lacteos',
    'yogur': 'yogurt',
    'jamon': 'salchichoneria',
    'queso': 'salchichoneria',
    'papel': 'papel higienico',
    'jabon': 'limpieza',
    'suavitel': 'suavizante',
    'cloro': 'blanqueador'
};

// Categories for intent detection
const CATEGORIES = [
    'abarrotes',
    'frutas y verduras',
    'lacteos',
    'salchichoneria',
    'bebidas',
    'botanas',
    'limpieza',
    'higiene personal',
    'farmacia',
    'mascotas',
    'bebes',
    'panaderia',
    'tortilleria',
    'carniceria',
    'pescaderia',
    'congelados',
    'dulces',
    'vinos y licores',
    'hogar',
    'electronica'
];

export const SmartSearchService = {
    normalize: (text) => {
        return text
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
            .trim();
    },

    getSynonym: (term) => {
        const normalized = SmartSearchService.normalize(term);
        return SYNONYMS[normalized] || normalized;
    },

    detectIntent: (query, categories) => {
        const normalizedQuery = SmartSearchService.normalize(query);

        // Check if query matches a category directly or via fuzzy match
        const categoryFuse = new Fuse(categories.map(c => ({ name: c })), {
            keys: ['name'],
            threshold: 0.3, // Strict enough to avoid false positives
            includeScore: true
        });

        const categoryMatch = categoryFuse.search(normalizedQuery);

        if (categoryMatch.length > 0 && categoryMatch[0].score < 0.3) {
            return {
                type: 'category',
                value: categoryMatch[0].item.name
            };
        }

        return {
            type: 'product',
            value: SmartSearchService.getSynonym(normalizedQuery)
        };
    },

    searchProducts: (query, products) => {
        const normalizedQuery = SmartSearchService.getSynonym(query);

        const fuse = new Fuse(products, {
            keys: ['name', 'description', 'category', 'brand'],
            threshold: 0.4,
            includeScore: true
        });

        return fuse.search(normalizedQuery).map(result => result.item);
    },

    parseCommand: (transcript, products) => {
        const normalized = SmartSearchService.normalize(transcript);

        // 1. Detect Intent
        const addKeywords = ['agrega', 'agregar', 'pon', 'poner', 'quiero', 'dame', 'necesito', 'anade', 'añade'];
        const isAddIntent = addKeywords.some(keyword => normalized.startsWith(keyword) || normalized.includes(` ${keyword} `));

        if (!isAddIntent) {
            return { type: 'search', term: transcript };
        }

        // 2. Remove intent keywords to get the content
        let content = normalized;
        addKeywords.forEach(k => {
            content = content.replace(new RegExp(`^${k}\\s+`), '').replace(new RegExp(`\\s+${k}\\s+`, 'g'), ' ');
        });

        // 3. Split by separators
        const separators = [' y ', ' , ', ' con ', ' mas '];
        let parts = [content];
        separators.forEach(sep => {
            let newParts = [];
            parts.forEach(p => {
                newParts = [...newParts, ...p.split(sep)];
            });
            parts = newParts;
        });

        // 4. Parse each part for quantity and product
        const items = parts.map(part => {
            part = part.trim();
            if (!part) return null;

            // Extract quantity
            let quantity = 1;
            const words = part.split(' ');

            const numberMap = {
                'un': 1, 'una': 1, 'uno': 1, 'unas': 1, 'unos': 1,
                'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
                'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9, 'diez': 10
            };

            if (words.length > 0) {
                const firstWord = words[0];
                if (!isNaN(firstWord)) {
                    quantity = parseInt(firstWord);
                    part = words.slice(1).join(' ');
                } else if (numberMap[firstWord]) {
                    quantity = numberMap[firstWord];
                    part = words.slice(1).join(' ');
                }
            }

            // Find best product match
            const matches = SmartSearchService.searchProducts(part, products);
            const product = matches.length > 0 ? matches[0] : null;

            return product ? { product, quantity } : null;
        }).filter(item => item !== null);

        return {
            type: 'addToCart',
            items
        };
    }
};
