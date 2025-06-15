
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Clock, History, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import OrderTracking from '@/components/OrderTracking';
import OrderHistory from '@/components/OrderHistory';

const Profile = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4 text-sm sm:text-base">Please sign in to view your profile</p>
            <Button asChild className="w-full sm:w-auto">
              <a href="/auth">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Profile Header */}
        <Card className="mb-6 sm:mb-8 shadow-sm">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  {user.user_metadata?.full_name || 'User'}
                </h1>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{user.email}</p>
                <Button variant="outline" onClick={signOut} size="sm" className="text-xs sm:text-sm">
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm h-auto">
            <TabsTrigger value="orders" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Active Orders</span>
              <span className="sm:hidden">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Order History</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4 sm:space-y-6">
            <OrderTracking />
          </TabsContent>

          <TabsContent value="history" className="space-y-4 sm:space-y-6">
            <OrderHistory />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 sm:space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900 mt-1 text-sm sm:text-base">{user.user_metadata?.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900 mt-1 text-sm sm:text-base break-all">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Account Created</label>
                    <p className="text-gray-900 mt-1 text-sm sm:text-base">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
