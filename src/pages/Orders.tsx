
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import OrderTracking from '@/components/OrderTracking';
import OrderHistory from '@/components/OrderHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Orders = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track your orders and view order history</p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <OrderTracking />
          </TabsContent>
          
          <TabsContent value="history">
            <OrderHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;
