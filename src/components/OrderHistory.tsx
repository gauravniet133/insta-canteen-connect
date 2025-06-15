
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, RotateCcw, X } from 'lucide-react';
import { useOrderManagement } from '@/hooks/useOrderManagement';

const OrderHistory = () => {
  const { orderHistory, loading, reorderItems, cancelOrder } = useOrderManagement();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your order history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orderHistory.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No order history</p>
            <p className="text-gray-400 text-sm">Your completed orders will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Order History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orderHistory.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div>
                  <Badge className={`${getStatusColor(order.status)} border font-medium px-3 py-1`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <p className="font-semibold text-gray-900 mt-1">{order.canteens.name}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-gray-900">₹{order.total_amount}</div>
                <div className="flex gap-2 mt-2">
                  {order.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reorderItems(order.id)}
                      className="text-xs"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reorder
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Items:</p>
              <p className="text-sm text-gray-600">
                {order.order_items.map((item, index) => (
                  <span key={index}>
                    {item.quantity}x {item.food_items.name}
                    {index < order.order_items.length - 1 && ', '}
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
