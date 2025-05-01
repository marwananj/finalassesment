import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiLockClosed, HiCreditCard, HiCurrencyDollar, HiQrcode, HiClipboardCopy, HiCheck, HiExclamationCircle } from 'react-icons/hi';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  // Simulated crypto wallet address
  const cryptoAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

  useEffect(() => {
    const storedCart = localStorage.getItem(`cart_${user.id}`);
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [user.id]);

  if (!user) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 bg-gray-50 rounded-lg max-w-md">
          <HiLockClosed className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to complete your purchase</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  const validateCardDetails = () => {
    if (paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) return 'Card number is required';
      if (!formData.cardName.trim()) return 'Cardholder name is required';
      if (!formData.expiry.trim()) return 'Expiry date is required';
      if (!formData.cvv.trim()) return 'CVV is required';
      
      // Basic validation
      if (formData.cardNumber.replace(/\s/g, '').length !== 16) return 'Invalid card number';
      if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) return 'Invalid expiry date (MM/YY)';
      if (!/^\d{3}$/.test(formData.cvv)) return 'Invalid CVV';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substr(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substr(0, 3);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    setError(''); // Clear error when user types
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cryptoAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate cart
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // Validate payment details
    const validationError = validateCardDetails();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create purchase records
      const purchases = cart.map(item => ({
        id: Date.now() + Math.random(),
        productId: item.id,
        date: new Date().toISOString(),
        total: item.price * item.quantity,
        quantity: item.quantity,
        paymentMethod
      }));

      // Update purchase history
      const storedPurchases = JSON.parse(localStorage.getItem(`purchases_${user.id}`) || '[]');
      const updatedPurchases = [...storedPurchases, ...purchases];
      localStorage.setItem(`purchases_${user.id}`, JSON.stringify(updatedPurchases));

      // Clear cart
      localStorage.setItem(`cart_${user.id}`, '[]');
      
      // Navigate to success page
      navigate('/checkout/success');
    } catch (error) {
      setError('Payment failed. Please try again.');
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors duration-200">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setError('');
                  }}
                  className="h-4 w-4 text-primary"
                />
                <div className="ml-4">
                  <div className="flex items-center">
                    <HiCreditCard className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">Credit Card</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Pay securely with your credit card</p>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors duration-200">
                <input
                  type="radio"
                  name="payment"
                  value="crypto"
                  checked={paymentMethod === 'crypto'}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setError('');
                  }}
                  className="h-4 w-4 text-primary"
                />
                <div className="ml-4">
                  <div className="flex items-center">
                    <HiCurrencyDollar className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">Cryptocurrency</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Pay with Bitcoin, Ethereum, or other cryptocurrencies</p>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <HiExclamationCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {paymentMethod === 'card' ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Details</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                    maxLength="19"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                      maxLength="5"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cryptocurrency Payment</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-4">
                    <HiQrcode className="w-32 h-32 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <code className="text-sm text-gray-600 truncate">{cryptoAddress}</code>
                    <button
                      onClick={copyToClipboard}
                      className="ml-2 p-1.5 text-gray-500 hover:text-primary transition-colors duration-200"
                    >
                      {copied ? (
                        <HiCheck className="w-5 h-5" />
                      ) : (
                        <HiClipboardCopy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-4 text-sm text-gray-500 text-center">
                    Send the exact amount to this address. The payment will be automatically detected.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-semibold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || cart.length === 0}
                className="w-full mt-4 bg-primary text-white font-medium rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <HiLockClosed className="w-5 h-5" />
                    Complete Purchase
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;