import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiShoppingCart, HiTrash, HiMinus, HiPlus, HiCreditCard } from 'react-icons/hi'
import { useAuth } from '../contexts/AuthContext'

const Cart = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem(`cart_${user.id}`)
      if (storedCart) {
        setCart(JSON.parse(storedCart))
      }
    }
  }, [user])

  const updateCart = (newCart) => {
    setCart(newCart)
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart))
  }

  const updateQuantity = (productId, change) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    updateCart(updatedCart)
  }

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId)
    updateCart(updatedCart)
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1 // 10% tax
  const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
  const total = subtotal + tax + shipping

  const handleCheckout = () => {
    setIsCheckingOut(true)
    navigate('/checkout')
  }

  return (
    <div className="max-w-7xl mx-auto px-3 py-4">
      <h1 className="text-lg font-semibold text-gray-900 mb-4">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <HiShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Your cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm divide-y">
              {cart.map(item => (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                    <div className="flex items-center gap-4">
                      <p className="text-primary font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <HiMinus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <HiPlus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-red-500 hover:text-red-600"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-semibold text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full mt-4 bg-primary text-white font-medium rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <HiCreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </>
              )}
            </button>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Free shipping on orders over $100
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart