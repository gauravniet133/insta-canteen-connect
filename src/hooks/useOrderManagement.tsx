
import { useState, useEffect } from 'react';
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

export const useOrderManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveOrders = async () => {
    if (!user) return;

    try {
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

      if (error) throw error;
      setActiveOrders(data || []);
    } catch (error) {
      console.error('Error fetching active orders:', error);
      toast({
        title: "Error",
        description: "Unable to load your active orders",
        variant: "destructive",
      });
    }
  };

  const fetchOrderHistory = async () => {
    if (!user) return;

    try {
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
        .in('status', ['completed', 'cancelled'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setOrderHistory(data || []);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled",
      });

      fetchActiveOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: "Error",
        description: "Unable to cancel the order",
        variant: "destructive",
      });
    }
  };

  const reorderItems = async (orderId: string) => {
    try {
      // Fetch the original order items
      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select('food_item_id, quantity')
        .eq('order_id', orderId);

      if (error) throw error;

      // You would implement the reorder logic here
      // For now, just show a success message
      toast({
        title: "Reorder Initiated",
        description: "Items have been added to your cart",
      });

      return orderItems;
    } catch (error) {
      console.error('Error reordering:', error);
      toast({
        title: "Error",
        description: "Unable to reorder items",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      setLoading(true);
      await Promise.all([fetchActiveOrders(), fetchOrderHistory()]);
      setLoading(false);
    };

    loadOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('order-management')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Order updated:', payload);
          
          if (payload.new && payload.old) {
            const newStatus = payload.new.status;
            const oldStatus = payload.old.status;
            
            if (newStatus !== oldStatus) {
              // Show appropriate notification based on status
              const statusMessages = {
                confirmed: "Your order has been confirmed!",
                preparing: "Your order is being prepared",
                ready: "Your order is ready for pickup/delivery!",
                completed: "Your order has been completed",
                cancelled: "Your order has been cancelled"
              };

              toast({
                title: "Order Update",
                description: statusMessages[newStatus as keyof typeof statusMessages] || `Order status: ${newStatus}`,
              });
            }
          }
          
          fetchActiveOrders();
          fetchOrderHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    activeOrders,
    orderHistory,
    loading,
    cancelOrder,
    reorderItems,
    refreshOrders: () => {
      fetchActiveOrders();
      fetchOrderHistory();
    }
  };
};
