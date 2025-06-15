
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
              Campus Eats
            </h1>
            <p className="text-xl sm:text-2xl mb-10 text-orange-100 max-w-3xl mx-auto leading-relaxed">
              Your favorite campus meals, delivered fresh and fast to your doorstep
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
                asChild
              >
                <Link to="/canteens">Order Now</Link>
              </Button>
              {!user && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
                  asChild
                >
                  <Link to="/auth">Sign Up</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Order Tracking Section - Only show for authenticated users */}
        {user && (
          <div className="mb-16">
            <OrderTracking />
          </div>
        )}

        {/* Featured Canteens */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Canteens</h2>
              <p className="text-gray-600 text-lg">Discover the most popular food spots on campus</p>
            </div>
            <Button variant="outline" size="lg" className="px-6 py-3 font-semibold" asChild>
              <Link to="/canteens">View All</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center px-6 py-3 font-medium text-lg text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mr-3"></div>
                Loading featured canteens...
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCanteens.map((canteen) => (
                <Card key={canteen.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
                  <div className="relative">
                    <img 
                      src={canteen.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop'} 
                      alt={canteen.name}
                      className="w-full h-56 object-cover"
                    />
                    <Badge 
                      className={`absolute top-4 right-4 px-3 py-1 font-semibold ${
                        canteen.status === 'open' ? 'bg-green-500 hover:bg-green-600' : 
                        canteen.status === 'busy' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'
                      } text-white border-0`}
                    >
                      {canteen.status === 'open' ? 'Open' : 
                       canteen.status === 'busy' ? 'Busy' : 'Closed'}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{canteen.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {canteen.description}
                    </p>
                    
                    <div className="flex items-center mb-3">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold text-gray-900">{canteen.rating || 0}</span>
                      <span className="text-sm text-gray-500 ml-1">({canteen.total_reviews || 0} reviews)</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 font-medium">
                      {canteen.canteen_cuisines.map(c => c.cuisine_name).join(' • ')}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="font-medium">{canteen.delivery_time_min}-{canteen.delivery_time_max} min</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="font-medium">{canteen.location}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full py-3 font-semibold text-base" 
                      asChild 
                      disabled={canteen.status === 'closed'}
                    >
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
          <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Fast Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">Get your food delivered in 15-30 minutes across campus with real-time tracking</p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Quality Food</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">Fresh, delicious meals from your favorite campus canteens with quality guarantee</p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Campus Wide</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">Order from any canteen and get it delivered anywhere on campus with precise location tracking</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
