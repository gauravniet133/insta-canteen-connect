
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Truck, ChefHat, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
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

      if (fetchError) throw fetchError;
      setActiveOrders(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError('Unable to load your active orders');
      toast({
        title: "Error fetching orders",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrders();

    if (!user) return;

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
          if (payload.new && payload.old) {
            const newStatus = payload.new.status;
            const oldStatus = payload.old.status;
            
            if (newStatus !== oldStatus) {
              toast({
                title: "Order Status Updated",
                description: `Your order is now ${newStatus}`,
              });
            }
          }
          
          fetchActiveOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="h-5 w-5" />,
      confirmed: <CheckCircle className="h-5 w-5" />,
      preparing: <ChefHat className="h-5 w-5" />,
      ready: <Package className="h-5 w-5" />,
      completed: <Truck className="h-5 w-5" />
    };
    return icons[status as keyof typeof icons] || <Clock className="h-5 w-5" />;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      preparing: 'bg-orange-100 text-orange-800 border-orange-200',
      ready: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getEstimatedTime = (estimatedDeliveryTime: string) => {
    if (!estimatedDeliveryTime) return 0;
    try {
      const now = new Date();
      const deliveryTime = new Date(estimatedDeliveryTime);
      const diffInMinutes = Math.max(0, Math.ceil((deliveryTime.getTime() - now.getTime()) / (1000 * 60)));
      return diffInMinutes;
    } catch {
      return 0;
    }
  };

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Order Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Order Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-red-500 text-lg mb-2">{error}</p>
            <button 
              onClick={fetchActiveOrders}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Try Again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeOrders.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Order Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No active orders</p>
            <p className="text-gray-400 text-sm">Place an order to track it here!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          Active Orders ({activeOrders.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {activeOrders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-xl p-6 space-y-4 bg-white hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gray-50">
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <Badge className={`${getStatusColor(order.status)} border font-medium px-3 py-1`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <p className="font-semibold text-gray-900 mt-1">{order.canteens.name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl text-green-600">₹{order.total_amount}</div>
                {order.estimated_delivery_time && (
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    ETA: {getEstimatedTime(order.estimated_delivery_time)} min
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Order Items:</p>
              <p className="text-sm text-gray-600">
                {order.order_items.map((item, index) => (
                  <span key={index}>
                    {item.quantity}x {item.food_items.name}
                    {index < order.order_items.length - 1 && ', '}
                  </span>
                ))}
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Pending</span>
                <span>Confirmed</span>
                <span>Preparing</span>
                <span>Ready</span>
              </div>
              <div className="flex space-x-1">
                {['pending', 'confirmed', 'preparing', 'ready'].map((step, index) => {
                  const currentStepIndex = ['pending', 'confirmed', 'preparing', 'ready'].indexOf(order.status);
                  const isActive = currentStepIndex >= index;
                  const isCurrent = currentStepIndex === index;
                  
                  return (
                    <div
                      key={step}
                      className={`flex-1 h-3 rounded-full transition-all duration-500 ${
                        isActive
                          ? isCurrent 
                            ? 'bg-orange-500 animate-pulse' 
                            : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OrderTracking;
