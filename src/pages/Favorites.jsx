import { useState, useEffect } from 'react'
import { HiHeart, HiShoppingCart, HiTrash, HiSortAscending, HiSearch } from 'react-icons/hi'
import { useAuth } from '../contexts/AuthContext'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [sortBy, setSortBy] = useState('title')
  const [sortOrder, setSortOrder] = useState('asc')
  const [search, setSearch] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`)
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
    }
  }, [user])

  const handleRemoveFromFavorites = (productId) => {
    const updatedFavorites = favorites.filter(item => item.id !== productId)
    setFavorites(updatedFavorites)
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites))
  }

  const handleAddToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem(`cart_${user.id}`) || '[]')
    const existingItem = currentCart.find(item => item.id === product.id)
    
    if (existingItem) {
      const updatedCart = currentCart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart))
    } else {
      const updatedCart = [...currentCart, { ...product, quantity: 1 }]
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart))
    }
  }

  const sortedAndFilteredFavorites = favorites
    .filter(product => 
      product.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = sortBy === 'price' ? a[sortBy] : a[sortBy].toLowerCase()
      const bValue = sortBy === 'price' ? b[sortBy] : b[sortBy].toLowerCase()
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      }
      return aValue < bValue ? 1 : -1
    })

  return (
    <div className="max-w-7xl mx-auto px-3 py-4">
      <h1 className="text-lg font-semibold text-gray-900 mb-4">Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <HiHeart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>No favorites yet</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search favorites..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <HiSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="title">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="category">Sort by Category</option>
              </select>
              <button
                onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <HiSortAscending className={`w-5 h-5 transition-transform ${
                  sortOrder === 'desc' ? 'rotate-180' : ''
                }`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedAndFilteredFavorites.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="relative pb-[100%] mb-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2 truncate">
                  {product.category}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-primary">
                    ${product.price}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-1.5 text-gray-500 hover:text-primary transition-colors duration-200"
                      title="Add to Cart"
                    >
                      <HiShoppingCart className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromFavorites(product.id)}
                      className="p-1.5 text-red-500 hover:text-red-600 transition-colors duration-200"
                      title="Remove from Favorites"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Favorites