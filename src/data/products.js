import { ShoppingBasket, Apple, Milk, SprayCan, Dog, Pill, Croissant, Baby } from 'lucide-react';

export const products = [
    // Abarrotes
    {
        id: 1,
        name: "Aceite Vegetal 1-2-3 1L",
        price: 35.50,
        originalPrice: 42.00,
        image: "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Abarrotes",
        subcategory: "Aceites",
        unitPrice: "$35.50/L"
    },
    {
        id: 2,
        name: "Arroz Super Extra 1kg",
        price: 18.90,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Abarrotes",
        subcategory: "Granos y Semillas",
        unitPrice: "$18.90/kg"
    },
    {
        id: 3,
        name: "Frijol Negro Querétaro 900g",
        price: 24.50,
        originalPrice: 28.00,
        image: "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Abarrotes",
        subcategory: "Granos y Semillas",
        unitPrice: "$27.22/kg"
    },
    {
        id: 4,
        name: "Atún en Agua 140g",
        price: 17.50,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1577308856961-8e9ec50d0c6b?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Abarrotes",
        subcategory: "Enlatados",
        unitPrice: "$12.50/100g"
    },
    {
        id: 20,
        name: "Azúcar Estándar 1kg",
        price: 28.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1612155692224-001612155692?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Abarrotes",
        subcategory: "Azúcar y Postres",
        unitPrice: "$28.00/kg"
    },
    {
        id: 21,
        name: "Sal de Mar 1kg",
        price: 15.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1518110925418-4304991d7069?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Abarrotes",
        subcategory: "Condimentos",
        unitPrice: "$15.00/kg"
    },
    {
        id: 22,
        name: "Pasta para Sopa 200g",
        price: 9.50,
        originalPrice: 11.00,
        image: "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Abarrotes",
        subcategory: "Pastas",
        unitPrice: "$4.75/100g"
    },
    {
        id: 23,
        name: "Puré de Tomate 210g",
        price: 8.50,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1577308856961-8e9ec50d0c6b?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Abarrotes",
        subcategory: "Enlatados",
        unitPrice: "$4.05/100g"
    },
    {
        id: 24,
        name: "Mayonesa 260g",
        price: 30.00,
        originalPrice: 52.00,
        image: "https://images.unsplash.com/photo-1585325701165-351af916e581?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Abarrotes",
        subcategory: "Aderezos",
        unitPrice: "$11.54/100g"
    },
    {
        id: 25,
        name: "Café Soluble 225g",
        price: 115.00,
        originalPrice: 135.00,
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Abarrotes",
        subcategory: "Café y Té",
        unitPrice: "$51.11/100g"
    },
    {
        id: 26,
        name: "Cereal de Maíz 530g",
        price: 51.50,
        originalPrice: 75.00,
        image: "https://images.unsplash.com/photo-1521483450102-1366789809e2?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Abarrotes",
        subcategory: "Cereales",
        unitPrice: "$9.71/100g"
    },
    {
        id: 27,
        name: "Galletas Marías 170g",
        price: 16.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Abarrotes",
        subcategory: "Galletas",
        unitPrice: "$9.41/100g"
    },

    // Lácteos
    {
        id: 5,
        name: "Leche Entera 1L",
        price: 26.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Lácteos",
        subcategory: "Leche",
        unitPrice: "$26.00/L"
    },
    {
        id: 6,
        name: "Huevo Blanco San Juan 30 pzas",
        price: 82.00,
        originalPrice: 95.00,
        image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Lácteos",
        subcategory: "Huevo",
        unitPrice: "$2.73/pza"
    },
    {
        id: 11,
        name: "Yogurt Griego Natural 1kg",
        price: 85.00,
        originalPrice: 98.00,
        image: "https://images.unsplash.com/photo-1488477181946-6428a029177b?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Lácteos",
        subcategory: "Yogurt",
        unitPrice: "$85.00/kg"
    },
    {
        id: 28,
        name: "Mantequilla Sin Sal 90g",
        price: 22.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Lácteos",
        subcategory: "Mantequilla y Margarina",
        unitPrice: "$24.44/100g"
    },
    {
        id: 29,
        name: "Queso Panela 400g",
        price: 58.00,
        originalPrice: 65.00,
        image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Lácteos",
        subcategory: "Quesos",
        unitPrice: "$14.50/100g"
    },
    {
        id: 30,
        name: "Crema Ácida 450ml",
        price: 34.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Lácteos",
        subcategory: "Crema",
        unitPrice: "$7.55/100ml"
    },
    {
        id: 31,
        name: "Queso Manchego Rebanado 200g",
        price: 48.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Lácteos",
        subcategory: "Quesos",
        unitPrice: "$24.00/100g"
    },

    // Limpieza
    {
        id: 7,
        name: "Papel Higiénico 12 rollos",
        price: 65.00,
        originalPrice: 78.00,
        image: "https://images.unsplash.com/photo-1584553153336-b3c37c47f9cc?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Limpieza",
        subcategory: "Papel Higiénico",
        unitPrice: "$5.42/rollo"
    },
    {
        id: 8,
        name: "Detergente en Polvo 5kg",
        price: 145.00,
        originalPrice: 160.00,
        image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Limpieza",
        subcategory: "Ropa",
        unitPrice: "$29.00/kg"
    },
    {
        id: 9,
        name: "Cloro 2L",
        price: 28.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1584641911870-1c2804294306?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Limpieza",
        subcategory: "Desinfectantes",
        unitPrice: "$14.00/L"
    },
    {
        id: 32,
        name: "Suavizante de Telas 3L",
        price: 98.00,
        originalPrice: 110.00,
        image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Limpieza",
        subcategory: "Ropa",
        unitPrice: "$3.25/100ml"
    },
    {
        id: 33,
        name: "Limpiador de Baños 750ml",
        price: 35.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Limpieza",
        subcategory: "Baño",
        unitPrice: "$11.66/pza"
    },
    {
        id: 34,
        name: "Lavastes Líquido 750ml",
        price: 38.00,
        originalPrice: 45.00,
        image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Limpieza",
        subcategory: "Trastes",
        unitPrice: "$5.06/100ml"
    },
    {
        id: 35,
        name: "Limpiador Multiusos 1L",
        price: 24.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1584641911870-1c2804294306?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Limpieza",
        subcategory: "Pisos",
        unitPrice: "$24.00/L"
    },

    // Frutas y Verduras
    {
        id: 10,
        name: "Jitomate Saladet 1kg",
        price: 12.90,
        originalPrice: 24.90,
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Frutas y Verduras",
        subcategory: "Verduras",
        unitPrice: "$12.90/kg"
    },
    {
        id: 12,
        name: "Plátano Chiapas 1kg",
        price: 19.90,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Frutas y Verduras",
        subcategory: "Frutas",
        unitPrice: "$19.90/kg"
    },
    {
        id: 36,
        name: "Aguacate Hass 1kg",
        price: 58.00,
        originalPrice: 75.00,
        image: "https://images.unsplash.com/photo-1523049673856-6468baca292f?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Frutas y Verduras",
        subcategory: "Verduras",
        unitPrice: "$58.00/kg"
    },
    {
        id: 37,
        name: "Cebolla Blanca 1kg",
        price: 32.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Frutas y Verduras",
        subcategory: "Verduras",
        unitPrice: "$32.00/kg"
    },
    {
        id: 38,
        name: "Papa Blanca 1kg",
        price: 28.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1518977676601-b53f82a6b6dc?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Frutas y Verduras",
        subcategory: "Verduras",
        unitPrice: "$28.00/kg"
    },
    {
        id: 39,
        name: "Zanahoria 1kg",
        price: 14.00,
        originalPrice: 18.00,
        image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Frutas y Verduras",
        subcategory: "Verduras",
        unitPrice: "$24.00/kg"
    },
    {
        id: 40,
        name: "Manzana Golden 1kg",
        price: 45.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Frutas y Verduras",
        subcategory: "Frutas",
        unitPrice: "$45.00/kg"
    },
    {
        id: 41,
        name: "Limón Agrio 1kg",
        price: 24.00,
        originalPrice: 35.00,
        image: "https://images.unsplash.com/photo-1582280521931-380266e3f2a1?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Frutas y Verduras",
        subcategory: "Verduras",
        unitPrice: "$14.00/kg"
    },

    // Mascotas
    {
        id: 13,
        name: "Alimento Perro Adulto 4kg",
        price: 210.00,
        originalPrice: 240.00,
        image: "https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Mascotas",
        subcategory: "Perros",
        unitPrice: "$52.50/kg"
    },
    {
        id: 14,
        name: "Sobres Gato Variados 85g",
        price: 11.50,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Mascotas",
        subcategory: "Gatos",
        unitPrice: "$13.53/100g"
    },
    {
        id: 42,
        name: "Arena para Gato 5kg",
        price: 85.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Mascotas",
        subcategory: "Gatos",
        unitPrice: "$17.00/kg"
    },
    {
        id: 43,
        name: "Premios para Perro 200g",
        price: 45.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Mascotas",
        subcategory: "Perros",
        unitPrice: "$45.00/pza"
    },

    // Farmacia
    {
        id: 15,
        name: "Paracetamol 500mg 20 tabs",
        price: 30.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Farmacia",
        subcategory: "Medicamentos",
        unitPrice: "$1.50/tab"
    },
    {
        id: 16,
        name: "Alcohol Etílico 500ml",
        price: 35.00,
        originalPrice: 45.00,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Farmacia",
        subcategory: "Material de Curación",
        unitPrice: "$7.00/100ml"
    },
    {
        id: 44,
        name: "Vendas Elásticas 5cm",
        price: 15.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Farmacia",
        subcategory: "Material de Curación",
        unitPrice: "$2.50/pza"
    },
    {
        id: 45,
        name: "Jarabe para Tos 120ml",
        price: 85.00,
        originalPrice: 110.00,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Farmacia",
        subcategory: "Medicamentos",
        unitPrice: "$4.40/100ml"
    },
    {
        id: 46,
        name: "Cubrebocas Tricapa 10 pzas",
        price: 25.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Farmacia",
        subcategory: "Material de Curación",
        unitPrice: "$12.00/pza"
    },

    // Panadería
    {
        id: 17,
        name: "Pan Blanco Grande 680g",
        price: 42.00,
        originalPrice: 48.00,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Panadería",
        subcategory: "Pan de Caja",
        unitPrice: "$42.00/pza"
    },
    {
        id: 18,
        name: "Donas de Chocolate 6 pzas",
        price: 38.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Panadería",
        subcategory: "Pan Dulce",
        unitPrice: "$6.33/pza"
    },
    {
        id: 19,
        name: "Bolillo 1 pza",
        price: 2.50,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Panadería",
        subcategory: "Pan Salado",
        unitPrice: "$2.50/pza"
    },
    {
        id: 47,
        name: "Conchas Vainilla/Choco 1 pza",
        price: 12.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Panadería",
        subcategory: "Pan Dulce",
        unitPrice: "$12.00/pza"
    },
    {
        id: 48,
        name: "Pastel de Chocolate Rebanada",
        price: 45.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Panadería",
        subcategory: "Pasteles",
        unitPrice: "$45.00/pza"
    },

    // Bebés
    {
        id: 49,
        name: "Pañales Etapa 4 40 pzas",
        price: 245.00,
        originalPrice: 280.00,
        image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Bebés",
        subcategory: "Pañales",
        unitPrice: "$6.12/pza"
    },
    {
        id: 50,
        name: "Toallitas Húmedas 80 pzas",
        price: 45.00,
        originalPrice: 55.00,
        image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Bebés",
        subcategory: "Higiene",
        unitPrice: "$0.56/pza"
    },
    {
        id: 51,
        name: "Fórmula Infantil 1kg",
        price: 380.00,
        originalPrice: 420.00,
        image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Bebés",
        subcategory: "Alimentación",
        unitPrice: "$380.00/kg"
    },
    {
        id: 52,
        name: "Gerber Frutas 113g",
        price: 18.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=300&h=300",
        category: "Bebés",
        subcategory: "Alimentación",
        unitPrice: "$15.92/100g"
    }
];

export const categories = [
    { id: 1, name: "Abarrotes", icon: "ShoppingBasket", color: "#e3f2fd", subcategories: ["Aceites", "Granos y Semillas", "Enlatados", "Azúcar y Postres", "Condimentos", "Pastas", "Aderezos", "Café y Té", "Cereales", "Galletas"] },
    { id: 2, name: "Frutas y Verduras", icon: "Apple", color: "#e8f5e9", subcategories: ["Frutas", "Verduras"] },
    { id: 3, name: "Lácteos", icon: "Milk", color: "#f3e5f5", subcategories: ["Leche", "Huevo", "Yogurt", "Mantequilla y Margarina", "Quesos", "Crema"] },
    { id: 4, name: "Limpieza", icon: "SprayCan", color: "#e0f7fa", subcategories: ["Papel Higiénico", "Ropa", "Desinfectantes", "Baño", "Trastes", "Pisos"] },
    { id: 5, name: "Mascotas", icon: "Dog", color: "#fff3e0", subcategories: ["Perros", "Gatos"] },
    { id: 6, name: "Farmacia", icon: "Pill", color: "#ffebee", subcategories: ["Medicamentos", "Material de Curación"] },
    { id: 7, name: "Panadería", icon: "Croissant", color: "#fff8e1", subcategories: ["Pan de Caja", "Pan Dulce", "Pan Salado", "Pasteles"] },
    { id: 8, name: "Bebés", icon: "Baby", color: "#fce4ec", subcategories: ["Pañales", "Higiene", "Alimentación"] },
];
