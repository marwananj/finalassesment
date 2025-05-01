import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi';

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 text-green-500">
          <HiCheckCircle className="w-full h-full" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CheckoutSuccess;