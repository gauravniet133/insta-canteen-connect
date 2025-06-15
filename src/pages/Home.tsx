
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import OrderTracking from '@/components/OrderTracking';

const Home = () => {
  const { user } = useAuth();

  const { data: featuredCanteens = [], isLoading } = useQuery({
    queryKey: ['featured-canteens'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canteens')
        .select(`
          *,
          canteen_cuisines (
            cuisine_name
          )
        `)
        .eq('status', 'open')
        .order('rating', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">
            Campus Eats
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-orange-100">
            Your favorite campus meals, delivered fresh and fast
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100" asChild>
              <Link to="/canteens">Order Now</Link>
            </Button>
            {!user && (
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-500" asChild>
                <Link to="/auth">Sign Up</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Order Tracking Section - Only show for authenticated users */}
        {user && (
          <div className="mb-12">
            <OrderTracking />
          </div>
        )}

        {/* Featured Canteens */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Canteens</h2>
            <Button variant="outline" asChild>
              <Link to="/canteens">View All</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-lg">Loading featured canteens...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCanteens.map((canteen) => (
                <Card key={canteen.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={canteen.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop'} 
                      alt={canteen.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge 
                      className={`absolute top-4 right-4 ${
                        canteen.status === 'open' ? 'bg-green-500' : 
                        canteen.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    >
                      {canteen.status === 'open' ? 'Open' : 
                       canteen.status === 'busy' ? 'Busy' : 'Closed'}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{canteen.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {canteen.description}
                    </p>
                    
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{canteen.rating || 0}</span>
                      <span className="text-sm text-gray-500 ml-1">({canteen.total_reviews || 0} reviews)</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      {canteen.canteen_cuisines.map(c => c.cuisine_name).join(' • ')}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {canteen.delivery_time_min}-{canteen.delivery_time_max} min
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {canteen.location}
                      </div>
                    </div>
                    
                    <Button className="w-full" asChild disabled={canteen.status === 'closed'}>
                      <Link to={`/canteen/${canteen.id}`}>
                        {canteen.status === 'closed' ? 'Currently Closed' : 'View Menu'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-500" />
                Fast Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Get your food delivered in 15-30 minutes across campus</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-orange-500" />
                Quality Food
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fresh, delicious meals from your favorite campus canteens</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                Campus Wide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Order from any canteen and get it delivered anywhere on campus</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
