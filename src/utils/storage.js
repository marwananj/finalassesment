// Storage keys with user-specific prefixes
const STORAGE_KEYS = {
  USERS: 'users',
  PRODUCTS: 'products',
  CART: (userId) => `cart_${userId}`,
  FAVORITES: (userId) => `favorites_${userId}`,
  TASKS: (userId) => `tasks_${userId}`,
  PURCHASES: (userId) => `purchases_${userId}`,
};

// Default products data
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    title: "MacBook Pro M2",
    description: "Latest MacBook Pro with M2 chip, 16GB RAM, and 512GB SSD",
    price: 1499.99,
    category: "Electronics",
    image: "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg",
    rating: { rate: 4.8, count: 259 }
  },
  {
    id: 2,
    title: "Nike Air Max",
    description: "Premium running shoes with advanced cushioning technology",
    price: 129.99,
    category: "Sports",
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    rating: { rate: 4.6, count: 542 }
  },
  {
    id: 3,
    title: "Sony WH-1000XM4",
    description: "Premium noise-canceling wireless headphones",
    price: 299.99,
    category: "Electronics",
    image: "https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg",
    rating: { rate: 4.7, count: 891 }
  },
  {
    id: 4,
    title: "Yoga Mat Pro",
    description: "Non-slip yoga mat with alignment lines",
    price: 45.99,
    category: "Sports",
    image: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg",
    rating: { rate: 4.5, count: 328 }
  },
  {
    id: 5,
    title: "Smart Coffee Maker",
    description: "WiFi-enabled coffee maker with scheduling features",
    price: 199.99,
    category: "Home Appliances",
    image: "https://images.pexels.com/photos/1207918/pexels-photo-1207918.jpeg",
    rating: { rate: 4.3, count: 167 }
  },
  {
    id: 6,
    title: "Designer Watch",
    description: "Luxury analog watch with leather strap",
    price: 299.99,
    category: "Fashion",
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
    rating: { rate: 4.6, count: 423 }
  },
  {
    id: 7,
    title: "4K Gaming Monitor",
    description: "32-inch 4K monitor with 144Hz refresh rate",
    price: 499.99,
    category: "Electronics",
    image: "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg",
    rating: { rate: 4.8, count: 265 }
  },
  {
    id: 8,
    title: "Leather Backpack",
    description: "Handcrafted leather backpack with laptop compartment",
    price: 89.99,
    category: "Fashion",
    image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg",
    rating: { rate: 4.4, count: 189 }
  },
  {
    id: 9,
    title: "Smart Blender",
    description: "Digital blender with multiple presets and timer",
    price: 79.99,
    category: "Home Appliances",
    image: "https://images.pexels.com/photos/3735208/pexels-photo-3735208.jpeg",
    rating: { rate: 4.2, count: 145 }
  },
  {
    id: 10,
    title: "Wireless Earbuds",
    description: "True wireless earbuds with active noise cancellation",
    price: 159.99,
    category: "Electronics",
    image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
    rating: { rate: 4.5, count: 632 }
  },
  {
    id: 11,
    title: "Fitness Tracker",
    description: "Advanced fitness tracker with heart rate monitoring",
    price: 89.99,
    category: "Sports",
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
    rating: { rate: 4.4, count: 445 }
  },
  {
    id: 12,
    title: "Robot Vacuum",
    description: "Smart robot vacuum with mapping technology",
    price: 299.99,
    category: "Home Appliances",
    image: "https://images.pexels.com/photos/4087992/pexels-photo-4087992.jpeg",
    rating: { rate: 4.6, count: 278 }
  },
  {
    id: 13,
    title: "Designer Sunglasses",
    description: "Premium polarized sunglasses",
    price: 149.99,
    category: "Fashion",
    image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg",
    rating: { rate: 4.3, count: 156 }
  },
  {
    id: 14,
    title: "Gaming Keyboard",
    description: "Mechanical gaming keyboard with RGB lighting",
    price: 129.99,
    category: "Electronics",
    image: "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg",
    rating: { rate: 4.7, count: 389 }
  },
  {
    id: 15,
    title: "Dumbbell Set",
    description: "Adjustable dumbbell set with stand",
    price: 249.99,
    category: "Sports",
    image: "https://images.pexels.com/photos/949126/pexels-photo-949126.jpeg",
    rating: { rate: 4.8, count: 234 }
  },
  {
    id: 16,
    title: "Air Purifier",
    description: "HEPA air purifier with air quality monitor",
    price: 199.99,
    category: "Home Appliances",
    image: "https://images.pexels.com/photos/4429559/pexels-photo-4429559.jpeg",
    rating: { rate: 4.5, count: 167 }
  },
  {
    id: 17,
    title: "Leather Wallet",
    description: "Genuine leather wallet with RFID protection",
    price: 49.99,
    category: "Fashion",
    image: "https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg",
    rating: { rate: 4.4, count: 312 }
  },
  {
    id: 18,
    title: "Wireless Mouse",
    description: "Ergonomic wireless mouse with programmable buttons",
    price: 59.99,
    category: "Electronics",
    image: "https://images.pexels.com/photos/5082566/pexels-photo-5082566.jpeg",
    rating: { rate: 4.3, count: 245 }
  },
  {
    id: 19,
    title: "Resistance Bands",
    description: "Set of 5 resistance bands with carrying case",
    price: 29.99,
    category: "Sports",
    image: "https://images.pexels.com/photos/4397833/pexels-photo-4397833.jpeg",
    rating: { rate: 4.6, count: 178 }
  },
  {
    id: 20,
    title: "Smart Thermostat",
    description: "WiFi-enabled smart thermostat with energy saving features",
    price: 179.99,
    category: "Home Appliances",
    image: "https://images.pexels.com/photos/3689532/pexels-photo-3689532.jpeg",
    rating: { rate: 4.7, count: 203 }
  }
];

// Initialize products if none exist
const initializeProducts = () => {
  const existingProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!existingProducts || JSON.parse(existingProducts).length === 0) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
  }
};

// Call initialization on module load
initializeProducts();

// Storage helper functions
const storage = {
  // User-specific data
  getCart: (userId) => JSON.parse(localStorage.getItem(STORAGE_KEYS.CART(userId)) || '[]'),
  setCart: (userId, cart) => localStorage.setItem(STORAGE_KEYS.CART(userId), JSON.stringify(cart)),
  
  getFavorites: (userId) => JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES(userId)) || '[]'),
  setFavorites: (userId, favorites) => localStorage.setItem(STORAGE_KEYS.FAVORITES(userId), JSON.stringify(favorites)),
  
  getTasks: (userId) => JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS(userId)) || '[]'),
  setTasks: (userId, tasks) => localStorage.setItem(STORAGE_KEYS.TASKS(userId), JSON.stringify(tasks)),
  
  getPurchases: (userId) => JSON.parse(localStorage.getItem(STORAGE_KEYS.PURCHASES(userId)) || '[]'),
  setPurchases: (userId, purchases) => localStorage.setItem(STORAGE_KEYS.PURCHASES(userId), JSON.stringify(purchases)),

  // Global data
  getUsers: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  setUsers: (users) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
  
  getProducts: () => {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    if (products.length === 0) {
      initializeProducts();
      return DEFAULT_PRODUCTS;
    }
    return products;
  },
  setProducts: (products) => localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)),

  // Clear user data
  clearUserData: (userId) => {
    localStorage.removeItem(STORAGE_KEYS.CART(userId));
    localStorage.removeItem(STORAGE_KEYS.FAVORITES(userId));
    localStorage.removeItem(STORAGE_KEYS.TASKS(userId));
    localStorage.removeItem(STORAGE_KEYS.PURCHASES(userId));
  },

  // Clear all data (admin only)
  clearAllData: () => {
    localStorage.clear();
    initializeProducts(); // Reinitialize products after clearing
  }
};

export default storage;