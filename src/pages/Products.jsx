import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { HiSearch, HiHeart, HiShoppingCart, HiViewGrid, HiViewList, HiStar, HiExclamationCircle } from 'react-icons/hi'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'
import storage from '../utils/storage'

const Products = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const storedFavorites = storage.getFavorites(user.id);
      const storedCart = storage.getCart(user.id);
      setFavorites(storedFavorites);
      setCart(storedCart);
    }
  }, [user]);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => {
      const products = storage.getProducts();
      // Ensure products are initialized
      if (products.length === 0) {
        storage.initializeProducts();
        return storage.getProducts();
      }
      return products;
    }
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const uniqueCategories = [...new Set(products.map(p => p.category))];
      return uniqueCategories;
    },
    enabled: !!products.length
  });

  const toggleFavorite = (product) => {
    const isFavorite = favorites.some(fav => fav.id === product.id);
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.id !== product.id);
    } else {
      updatedFavorites = [...favorites, product];
    }
    
    setFavorites(updatedFavorites);
    storage.setFavorites(user.id, updatedFavorites);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    
    setCart(updatedCart);
    storage.setCart(user.id, updatedCart);
  };

  const filteredProducts = products?.filter(product => 
    (category === 'all' || product.category === category) &&
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading || categoriesLoading) {
    return <LoadingSpinner size="large" />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-3 py-8">
        <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3">
          <HiExclamationCircle className="w-6 h-6 text-red-500" />
          <p className="text-red-700">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 py-4">
      {selectedProduct ? (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <button
            onClick={() => setSelectedProduct(null)}
            className="text-sm text-gray-600 hover:text-primary mb-4"
          >
            ← Back to products
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center bg-white p-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="max-h-[400px] object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {selectedProduct.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <HiStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(selectedProduct.rating.rate)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({selectedProduct.rating.count} reviews)
                </span>
              </div>
              <p className="text-3xl font-bold text-primary mb-4">
                ${selectedProduct.price}
              </p>
              <p className="text-gray-600 mb-6">
                {selectedProduct.description}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => addToCart(selectedProduct)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors duration-200"
                >
                  <HiShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button 
                  onClick={() => toggleFavorite(selectedProduct)}
                  className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
                    favorites.some(fav => fav.id === selectedProduct.id)
                      ? 'border-primary text-primary'
                      : 'border-gray-200 text-gray-600 hover:text-primary hover:border-primary'
                  }`}
                >
                  <HiHeart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
              />
              <HiSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            <div className="flex gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">All Categories</option>
                {categories?.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:text-primary'
                  }`}
                >
                  <HiViewGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:text-primary'
                  }`}
                >
                  <HiViewList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts?.map(product => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div
                    className="relative pb-[100%] mb-4 cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                  <h3
                    className="text-sm font-medium text-gray-900 mb-1 truncate cursor-pointer hover:text-primary"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <HiStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating.rate)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.rating.count})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-primary">
                      ${product.price}
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleFavorite(product)}
                        className={`p-1.5 transition-colors duration-200 ${
                          favorites.some(fav => fav.id === product.id)
                            ? 'text-primary'
                            : 'text-gray-500 hover:text-primary'
                        }`}
                      >
                        <HiHeart className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => addToCart(product)}
                        className="p-1.5 text-gray-500 hover:text-primary transition-colors duration-200"
                      >
                        <HiShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts?.map(product => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex gap-4">
                    <div
                      className="w-32 h-32 flex-shrink-0 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg font-medium text-gray-900 mb-1 hover:text-primary cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                      >
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <HiStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating.rate)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          ({product.rating.count} reviews)
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-semibold text-primary">
                          ${product.price}
                        </p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => toggleFavorite(product)}
                            className={`p-1.5 transition-colors duration-200 ${
                              favorites.some(fav => fav.id === product.id)
                                ? 'text-primary'
                                : 'text-gray-500 hover:text-primary'
                            }`}
                          >
                            <HiHeart className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => addToCart(product)}
                            className="p-1.5 text-gray-500 hover:text-primary transition-colors duration-200"
                          >
                            <HiShoppingCart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;