
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Clock, Star, MapPin, Users, Utensils, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <ChefHat className="h-16 w-16 text-orange-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Campus <span className="text-orange-500">Eats</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your favorite college canteen food, delivered fresh and fast. 
              Order from multiple canteens across campus with just a few clicks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" className="text-lg px-8 py-3" asChild>
                  <Link to="/canteens">Browse Canteens</Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="text-lg px-8 py-3" asChild>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3" asChild>
                    <Link to="/canteens">View Menu</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Campus Eats?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make campus dining easier, faster, and more convenient for students and faculty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Get your food delivered in 15-30 minutes across campus locations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiple Canteens</h3>
                <p className="text-gray-600">
                  Order from all campus canteens in one place - from quick snacks to full meals.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Student Friendly</h3>
                <p className="text-gray-600">
                  Affordable prices, student discounts, and payment options that work for you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Popular Canteens Preview */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Campus Canteens
            </h2>
            <p className="text-lg text-gray-600">
              Discover the most loved food spots on campus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop"
                alt="Central Cafeteria"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">Central Cafeteria</h3>
                  <Badge className="bg-green-500">Open</Badge>
                </div>
                <p className="text-gray-600 mb-3">Multi-cuisine dining with the best variety</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>4.5 (245 reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>15-25 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop"
                alt="Hostel Mess"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">Hostel Mess</h3>
                  <Badge className="bg-green-500">Open</Badge>
                </div>
                <p className="text-gray-600 mb-3">Authentic home-style Indian cuisine</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>4.2 (189 reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>10-20 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop"
                alt="Quick Bites"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">Quick Bites</h3>
                  <Badge variant="secondary">Closed</Badge>
                </div>
                <p className="text-gray-600 mb-3">Perfect for snacks and beverages</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>4.0 (156 reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>5-15 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link to="/canteens">View All Canteens</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of students and faculty who use Campus Eats for their daily meals.
          </p>
          {!user && (
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
              <Link to="/auth">Sign Up Now</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
