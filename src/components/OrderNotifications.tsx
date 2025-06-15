
import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'order_update' | 'delivery' | 'promotion';
  order_id?: string;
};

const OrderNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimeAgo = (date: Date) => {
    try {
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch (error) {
      return 'Recently';
    }
  };

  const generateNotificationFromOrder = (order: any, event: string): Notification => {
    const statusMessages = {
      confirmed: { title: 'Order Confirmed', message: `Your order from ${order.canteens?.name || 'canteen'} has been confirmed` },
      preparing: { title: 'Order Being Prepared', message: `Your order is being prepared` },
      ready: { title: 'Order Ready', message: `Your order is ready for pickup!` },
      completed: { title: 'Order Completed', message: `Your order has been delivered` },
      cancelled: { title: 'Order Cancelled', message: `Your order has been cancelled` }
    };

    const statusInfo = statusMessages[order.status as keyof typeof statusMessages] || 
                      { title: 'Order Update', message: `Order status: ${order.status}` };

    return {
      id: `${order.id}-${Date.now()}`,
      title: statusInfo.title,
      message: statusInfo.message,
      timestamp: new Date(),
      read: false,
      type: 'order_update',
      order_id: order.id
    };
  };

  useEffect(() => {
    if (!user) return;

    // Fetch recent order updates as notifications
    const fetchRecentOrderUpdates = async () => {
      try {
        const { data: orders, error } = await supabase
          .from('orders')
          .select(`
            *,
            canteens (name)
          `)
          .eq('user_id', user.id)
          .not('status', 'eq', 'pending')
          .order('updated_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        const orderNotifications: Notification[] = orders?.map(order => 
          generateNotificationFromOrder(order, 'update')
        ) || [];

        setNotifications(orderNotifications);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive",
        });
      }
    };

    fetchRecentOrderUpdates();

    // Set up real-time subscription for order updates
    const channel = supabase
      .channel('order-notifications')
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
            const newOrder = payload.new;
            const oldOrder = payload.old;
            
            if (newOrder.status !== oldOrder.status) {
              const notification = generateNotificationFromOrder(newOrder, 'status_change');
              setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep only 10 most recent
              
              toast({
                title: notification.title,
                description: notification.message,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-gray-100"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600 border-0">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto z-50 shadow-xl border-gray-200">
          <CardContent className="p-0">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm text-gray-900">{notification.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="h-6 w-6 p-0 hover:bg-gray-200"
                      >
                        <X className="h-3 w-3 text-gray-400" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">{notification.message}</p>
                    <p className="text-xs text-gray-400">{formatTimeAgo(notification.timestamp)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderNotifications;
