
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Package,
  User,
  Phone,
  MapPin
} from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  special_instructions?: string;
  estimated_delivery_time?: string;
  profiles: {
    full_name: string;
    phone?: string;
  };
  order_items: {
    quantity: number;
    price: number;
    special_notes?: string;
    food_items: {
      name: string;
      preparation_time: number;
    };
  }[];
}

const SellerOrderManagement = () => {
  const { profile, loading: profileLoading, isCanteenOwner } = useProfile();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [canteenId, setCanteenId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'completed'>('pending');

  useEffect(() => {
    if (profile && isCanteenOwner) {
      fetchCanteenAndOrders();
    }
  }, [profile, isCanteenOwner]);

  useEffect(() => {
    if (!canteenId) return;

    // Set up real-time subscription for orders
    const channel = supabase
      .channel('seller-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `canteen_id=eq.${canteenId}`
        },
        () => {
          fetchCanteenAndOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [canteenId]);

  const fetchCanteenAndOrders = async () => {
    try {
      setLoading(true);
      
      // Get user's canteen
      const { data: canteen, error: canteenError } = await supabase
        .from('canteens')
        .select('id')
        .eq('owner_id', profile?.id)
        .single();

      if (canteenError) throw canteenError;
      if (!canteen) {
        toast({
          title: "No Canteen Found",
          description: "Please set up your canteen first",
          variant: "destructive",
        });
        return;
      }

      setCanteenId(canteen.id);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_user_id_fkey (full_name, phone),
          order_items (
            quantity,
            price,
            special_notes,
            food_items (name, preparation_time)
          )
        `)
        .eq('canteen_id', canteen.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      
      // Set estimated delivery time for confirmed orders
      if (newStatus === 'confirmed') {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 25); // Default 25 minutes
        updates.estimated_delivery_time = now.toISOString();
      }

      // Set actual delivery time for completed orders
      if (newStatus === 'completed') {
        updates.actual_delivery_time = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order Updated",
        description: `Order status updated to ${newStatus}`,
      });

      fetchCanteenAndOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'confirmed': 
      case 'preparing': return <Clock className="h-4 w-4" />;
      case 'ready':
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filterOrders = (orders: Order[]) => {
    switch (activeTab) {
      case 'pending':
        return orders.filter(order => order.status === 'pending');
      case 'active':
        return orders.filter(order => ['confirmed', 'preparing', 'ready'].includes(order.status));
      case 'completed':
        return orders.filter(order => ['completed', 'cancelled'].includes(order.status));
      default:
        return orders;
    }
  };

  const getAvailableActions = (status: string) => {
    switch (status) {
      case 'pending':
        return [
          { label: 'Accept', value: 'confirmed', variant: 'default' as const },
          { label: 'Reject', value: 'cancelled', variant: 'destructive' as const }
        ];
      case 'confirmed':
        return [
          { label: 'Start Preparing', value: 'preparing', variant: 'default' as const }
        ];
      case 'preparing':
        return [
          { label: 'Mark Ready', value: 'ready', variant: 'default' as const }
        ];
      case 'ready':
        return [
          { label: 'Mark Completed', value: 'completed', variant: 'default' as const }
        ];
      default:
        return [];
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isCanteenOwner) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const filteredOrders = filterOrders(orders);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Manage incoming orders and track their progress</p>
        </div>

        {/* Order Status Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
            { key: 'active', label: 'Active', count: orders.filter(o => ['confirmed', 'preparing', 'ready'].includes(o.status)).length },
            { key: 'completed', label: 'Completed', count: orders.filter(o => ['completed', 'cancelled'].includes(o.status)).length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab} orders
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'pending' ? 'New orders will appear here when customers place them.' :
                   activeTab === 'active' ? 'Orders being prepared will show up here.' :
                   'Completed and cancelled orders will be listed here.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>Order #{order.id.slice(-8)}</span>
                        <Badge className={`${getStatusColor(order.status)} border`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Placed on {new Date(order.created_at).toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">₹{Number(order.total_amount).toFixed(2)}</div>
                      {order.estimated_delivery_time && (
                        <div className="text-sm text-gray-600">
                          ETA: {new Date(order.estimated_delivery_time).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">{order.profiles.full_name}</div>
                      {order.profiles.phone && (
                        <div className="text-sm text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {order.profiles.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2">Order Items:</h4>
                    <div className="space-y-2">
                      {order.order_items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{item.quantity}x {item.food_items.name}</span>
                            {item.special_notes && (
                              <div className="text-sm text-gray-600">Note: {item.special_notes}</div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-medium">₹{Number(item.price).toFixed(2)}</div>
                            <div className="text-xs text-gray-500">{item.food_items.preparation_time}m prep</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {order.special_instructions && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-1">Special Instructions:</h4>
                      <p className="text-blue-800 text-sm">{order.special_instructions}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4">
                    {getAvailableActions(order.status).map((action) => (
                      <Button
                        key={action.value}
                        variant={action.variant}
                        onClick={() => updateOrderStatus(order.id, action.value)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrderManagement;
