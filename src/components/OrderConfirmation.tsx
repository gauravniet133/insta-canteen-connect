
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { useQuery } from '@tanstack/react-query';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId!),
    enabled: !!orderId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order not found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link to="/profile">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your order. We'll prepare it with care.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order ID</span>
                <span className="font-mono text-sm">{order.id.slice(-8)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <Badge className={`${getStatusColor(order.status)} border font-medium`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Time</span>
                <span className="text-sm">{formatDate(order.created_at)}</span>
              </div>
              
              {order.estimated_delivery_time && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Delivery</span>
                  <span className="text-sm">{formatDate(order.estimated_delivery_time)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Amount</span>
                <span className="text-green-600">₹{order.total_amount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Canteen Details */}
          <Card>
            <CardHeader>
              <CardTitle>Canteen Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{order.canteens.name}</h3>
              </div>
              
              {order.canteens.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{order.canteens.location}</span>
                </div>
              )}
              
              {order.canteens.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{order.canteens.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.order_items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.food_items.name}</h4>
                    <p className="text-sm text-gray-600">₹{item.price} each</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">x{item.quantity}</span>
                    <p className="text-sm text-gray-600">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-600">
            We'll send you updates about your order status via notifications.
          </p>
          <div className="space-x-4">
            <Link to="/profile">
              <Button variant="outline">View All Orders</Button>
            </Link>
            <Link to="/canteens">
              <Button>Order Again</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
