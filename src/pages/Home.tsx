
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, MapPin, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Mock data - will be replaced with real data from Supabase
  const featuredCanteens = [
    {
      id: 1,
      name: "Central Cafeteria",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop",
      rating: 4.5,
      cuisines: ["Indian", "Chinese", "Continental"],
      deliveryTime: "15-25 min",
      location: "Main Campus",
      isOpen: true
    },
    {
      id: 2,
      name: "Hostel Mess",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop",
      rating: 4.2,
      cuisines: ["South Indian", "North Indian"],
      deliveryTime: "10-20 min",
      location: "Hostel Block A",
      isOpen: true
    },
    {
      id: 3,
      name: "Quick Bites",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop",
      rating: 4.0,
      cuisines: ["Snacks", "Fast Food", "Beverages"],
      deliveryTime: "5-15 min",
      location: "Library Block",
      isOpen: false
    }
  ];

  const popularItems = [
    {
      id: 1,
      name: "Butter Chicken",
      canteen: "Central Cafeteria",
      price: "₹120",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop",
      rating: 4.6
    },
    {
      id: 2,
      name: "Masala Dosa",
      canteen: "Hostel Mess",
      price: "₹60",
      image: "https://images.unsplash.com/photo-1694849681251-7b63b9f24f85?w=300&h=200&fit=crop",
      rating: 4.4
    },
    {
      id: 3,
      name: "Cheese Sandwich",
      canteen: "Quick Bites",
      price: "₹40",
      image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=200&fit=crop",
      rating: 4.2
    },
    {
      id: 4,
      name: "Cold Coffee",
      canteen: "Quick Bites",
      price: "₹50",
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop",
      rating: 4.3
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Campus Food,<br />Delivered Fresh
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Order from your favorite campus canteens. Quick, convenient, and made just for students and faculty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/canteens">
                  <Utensils className="mr-2 h-5 w-5" />
                  Browse Canteens
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Register Your Canteen
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Canteens */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Canteens</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the most loved canteens on campus, serving fresh and delicious food daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCanteens.map((canteen) => (
              <Card key={canteen.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={canteen.image} 
                    alt={canteen.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge 
                    className={`absolute top-4 right-4 ${canteen.isOpen ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    {canteen.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{canteen.name}</h3>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{canteen.rating}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {canteen.cuisines.join(' • ')}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {canteen.deliveryTime}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {canteen.location}
                    </div>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link to={`/canteen/${canteen.id}`}>
                      View Menu
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Items</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The most ordered dishes across campus. Try these student favorites!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.canteen}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{item.price}</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-xs">{item.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Order?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of students and faculty who order their meals through Campus Canteen.
          </p>
          <Button size="lg" asChild>
            <Link to="/canteens">
              Start Ordering Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
