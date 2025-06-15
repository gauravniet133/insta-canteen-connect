
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const CartSummary = () => {
  const { items, totalAmount, updateQuantity, removeItem, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600">Add some delicious items to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Order</span>
          <Badge variant="secondary">{itemCount} items</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border-b pb-4 last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.canteen_name}</p>
                <p className="text-sm font-semibold text-green-600">₹{item.price}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
        
        <div className="border-t pt-4">
          <div className="flex justify-between font-semibold text-lg">
            <span>Subtotal</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
