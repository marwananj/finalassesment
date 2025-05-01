import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Products from './pages/Products'
import Favorites from './pages/Favorites'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTasks from './pages/admin/AdminTasks'
import AdminProducts from './pages/admin/AdminProducts'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminFavorites from './pages/admin/AdminFavorites'
import AdminCart from './pages/admin/AdminCart'
import AdminProfile from './pages/admin/AdminProfile'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/admin/*"
                    element={
                      <AdminRoute>
                        <>
                          <Navbar />
                          <main className="pt-2">
                            <Routes>
                              <Route path="/" element={<AdminDashboard />} />
                              <Route path="/users" element={<AdminUsers />} />
                              <Route path="/tasks" element={<AdminTasks />} />
                              <Route path="/products" element={<AdminProducts />} />
                              <Route path="/transactions" element={<AdminTransactions />} />
                              <Route path="/favorites" element={<AdminFavorites />} />
                              <Route path="/cart" element={<AdminCart />} />
                              <Route path="/profile" element={<AdminProfile />} />
                            </Routes>
                          </main>
                        </>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/*"
                    element={
                      <PrivateRoute>
                        <>
                          <Navbar />
                          <main className="pt-2">
                            <Routes>
                              <Route path="/" element={<Dashboard />} />
                              <Route path="/tasks" element={<Tasks />} />
                              <Route path="/products" element={<Products />} />
                              <Route path="/favorites" element={<Favorites />} />
                              <Route path="/cart" element={<Cart />} />
                              <Route path="/checkout" element={<Checkout />} />
                              <Route path="/checkout/success" element={<CheckoutSuccess />} />
                              <Route path="/profile" element={<Profile />} />
                            </Routes>
                          </main>
                        </>
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </div>
            </ErrorBoundary>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App