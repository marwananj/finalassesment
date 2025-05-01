import { useState, useEffect } from 'react'
import { HiHeart, HiTrash, HiSearch, HiSortAscending } from 'react-icons/hi'

const AdminFavorites = () => {
  const [allFavorites, setAllFavorites] = useState([])
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [search, setSearch] = useState('')

  useEffect(() => {
    // In a real application, this would fetch from an API
    const storedFavorites = localStorage.getItem('favorites') || '[]'
    setAllFavorites(JSON.parse(storedFavorites))
  }, [])

  const handleDelete = (userId, productId) => {
    setAllFavorites(prev => prev.filter(fav => 
      !(fav.userId === userId && fav.id === productId)
    ))
    // In a real application, this would also update the backend
  }

  const filteredFavorites = allFavorites.filter(favorite =>
    favorite.title.toLowerCase().includes(search.toLowerCase())
  )

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]
    return sortOrder === 'asc' 
      ? aValue > bValue ? 1 : -1
      : aValue < bValue ? 1 : -1
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Manage User Favorites</h1>
        <p className="text-gray-600">View and manage all user favorite items</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search favorites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <HiSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="userId">Sort by User</option>
            </select>
            <button
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <HiSortAscending className={`w-5 h-5 transition-transform ${
                sortOrder === 'desc' ? 'rotate-180' : ''
              }`} />
            </button>
          </div>
        </div>

        {sortedFavorites.length === 0 ? (
          <div className="text-center py-12">
            <HiHeart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Favorites Found</h3>
            <p className="text-gray-500">No users have added any items to their favorites yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Added Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedFavorites.map((favorite) => (
                  <tr key={`${favorite.userId}-${favorite.id}`} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {favorite.userName?.[0] || 'U'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">{favorite.userName || 'Unknown User'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100">
                          <img
                            src={favorite.image}
                            alt={favorite.title}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                        <span className="text-sm text-gray-900 font-medium">{favorite.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{favorite.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-gray-900">
                        ${favorite.price}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">
                        {new Date(favorite.addedDate || Date.now()).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(favorite.userId, favorite.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminFavorites