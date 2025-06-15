
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, CreditCard } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

const CheckoutForm = () => {
  const { items, totalAmount, placeOrder, loading } = useCart();
  const { user } = useAuth();
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const deliveryFee = 5;
  const finalTotal = totalAmount + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliveryAddress.trim()) {
      return;
    }

    const result = await placeOrder(specialInstructions);
    if (result.success) {
      // Order placed successfully, navigation handled by useCart
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Please sign in to proceed with checkout</p>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Your cart is empty</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Delivery Address *</Label>
            <Input
              id="address"
              placeholder="Enter your delivery address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Any special delivery instructions..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Estimated Delivery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">25-35 minutes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600"
        size="lg"
        disabled={loading || !deliveryAddress.trim()}
      >
        {loading ? 'Placing Order...' : `Place Order - ₹${finalTotal.toFixed(2)}`}
      </Button>
    </form>
  );
};

export default CheckoutForm;
