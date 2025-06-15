
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Truck, Chef, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type Order = {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  estimated_delivery_time: string;
  canteens: {
    name: string;
  };
  order_items: {
    quantity: number;
    food_items: {
      name: string;
    };
  }[];
};

const OrderTracking = () => {
  const { user } = useAuth();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;

    // Fetch active orders (not completed or cancelled)
    const fetchActiveOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          canteens (name),
          order_items (
            quantity,
            food_items (name)
          )
        `)
        .eq('user_id', user.id)
        .not('status', 'in', '(completed,cancelled)')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setActiveOrders(data);
      }
    };

    fetchActiveOrders();

    // Set up real-time subscription for order updates
    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Order status updated:', payload);
          fetchActiveOrders(); // Refresh the orders
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'preparing': return <Chef className="h-4 w-4" />;
      case 'ready': return <Package className="h-4 w-4" />;
      case 'completed': return <Truck className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getEstimatedTime = (estimatedDeliveryTime: string) => {
    const now = new Date();
    const deliveryTime = new Date(estimatedDeliveryTime);
    const diffInMinutes = Math.max(0, Math.ceil((deliveryTime.getTime() - now.getTime()) / (1000 * 60)));
    return diffInMinutes;
  };

  if (activeOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No active orders. Place an order to track it here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Orders ({activeOrders.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeOrders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
                <span className="font-medium">{order.canteens.name}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">₹{order.total_amount}</div>
                {order.estimated_delivery_time && (
                  <div className="text-sm text-gray-500">
                    ETA: {getEstimatedTime(order.estimated_delivery_time)} min
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {order.order_items.map((item, index) => (
                <span key={index}>
                  {item.quantity}x {item.food_items.name}
                  {index < order.order_items.length - 1 && ', '}
                </span>
              ))}
            </div>
            
            <div className="flex space-x-1 mt-2">
              {['pending', 'confirmed', 'preparing', 'ready'].map((step, index) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded ${
                    ['pending', 'confirmed', 'preparing', 'ready'].indexOf(order.status) >= index
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OrderTracking;
