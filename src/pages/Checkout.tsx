
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Navigate } from 'react-router-dom';
import CartSummary from '@/components/CartSummary';
import CheckoutForm from '@/components/CheckoutForm';

const Checkout = () => {
  const { user } = useAuth();
  const { items } = useCart();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (items.length === 0) {
    return <Navigate to="/canteens" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Review your order and complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <CheckoutForm />
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
