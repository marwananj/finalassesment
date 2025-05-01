import { Link, useLocation } from 'react-router-dom'
import { HiHome, HiClipboardCheck, HiCube, HiHeart, HiShoppingCart, HiUser, HiMoon, HiSun, HiUsers, HiCurrencyDollar } from 'react-icons/hi'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const { isDark, toggleDark } = useTheme()
  const { user, isAdmin } = useAuth()

  const userNavItems = [
    { id: '/', label: 'Dashboard', icon: <HiHome className="h-4 w-4" /> },
    { id: '/tasks', label: 'Tasks', icon: <HiClipboardCheck className="h-4 w-4" /> },
    { id: '/products', label: 'Products', icon: <HiCube className="h-4 w-4" /> },
    { id: '/favorites', label: 'Favorites', icon: <HiHeart className="h-4 w-4" /> },
    { id: '/cart', label: 'Cart', icon: <HiShoppingCart className="h-4 w-4" /> },
  ]

  const adminNavItems = [
    { id: '/admin', label: 'Dashboard', icon: <HiHome className="h-4 w-4" /> },
    { id: '/admin/users', label: 'Users', icon: <HiUsers className="h-4 w-4" /> },
    { id: '/admin/tasks', label: 'Tasks', icon: <HiClipboardCheck className="h-4 w-4" /> },
    { id: '/admin/products', label: 'Products', icon: <HiCube className="h-4 w-4" /> },
    { id: '/admin/transactions', label: 'Transactions', icon: <HiCurrencyDollar className="h-4 w-4" /> },
  ]

  const currentNavItems = isAdmin() ? adminNavItems : userNavItems

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-12">
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {currentNavItems.map(item => (
              <Link
                key={item.id}
                to={item.id}
                className={`flex items-center space-x-1 px-2 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                  location.pathname === item.id
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDark}
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              {isDark ? <HiSun className="h-5 w-5" /> : <HiMoon className="h-5 w-5" />}
            </button>
            <Link
              to={isAdmin() ? "/admin/profile" : "/profile"}
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light"
            >
              <span className="hidden sm:inline">{user.name}</span>
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                <HiUser className="h-3 w-3" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar