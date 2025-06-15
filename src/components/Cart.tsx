
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

const Cart = () => {
  const { user } = useAuth();
  const { items, totalAmount, itemCount, updateQuantity, removeItem, placeOrder, loading, clearCart } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!user) return null;

  const handlePlaceOrder = async () => {
    const success = await placeOrder();
    if (success) {
      setIsExpanded(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-lg bg-gray-100">
          <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <Card className="w-[calc(100vw-2rem)] max-w-sm sm:w-96 max-h-[80vh] sm:max-h-96 shadow-xl border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg">Your Cart</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 max-h-48 sm:max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-xs sm:text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{item.canteen_name}</p>
                  <p className="text-xs sm:text-sm font-semibold text-green-600">₹{item.price}</p>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                  >
                    <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                  </Button>
                  <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                  >
                    <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-2 w-2 sm:h-3 sm:w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm sm:text-base">Total:</span>
                <span className="font-bold text-base sm:text-lg text-green-600">₹{totalAmount}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex-1 text-xs sm:text-sm"
                >
                  Clear Cart
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm"
                >
                  {loading ? 'Placing...' : 'Place Order'}
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setIsExpanded(true)}
          className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg"
        >
          <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
          <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-5 w-5 sm:h-6 sm:w-6 p-0 flex items-center justify-center bg-red-500 hover:bg-red-600 border-2 border-white text-xs">
            {itemCount}
          </Badge>
        </Button>
      )}
    </div>
  );
};

export default Cart;
