
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Star, MapPin, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Canteens = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  // Mock data - will be replaced with real data from Supabase
  const canteens = [
    {
      id: 1,
      name: "Central Cafeteria",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop",
      rating: 4.5,
      totalReviews: 245,
      cuisines: ["Indian", "Chinese", "Continental"],
      deliveryTime: "15-25 min",
      location: "Main Campus",
      isOpen: true,
      description: "The main cafeteria serving a variety of cuisines with the best quality ingredients."
    },
    {
      id: 2,
      name: "Hostel Mess",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop",
      rating: 4.2,
      totalReviews: 189,
      cuisines: ["South Indian", "North Indian"],
      deliveryTime: "10-20 min",
      location: "Hostel Block A",
      isOpen: true,
      description: "Authentic Indian cuisine served fresh daily with home-style cooking."
    },
    {
      id: 3,
      name: "Quick Bites",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop",
      rating: 4.0,
      totalReviews: 156,
      cuisines: ["Snacks", "Fast Food", "Beverages"],
      deliveryTime: "5-15 min",
      location: "Library Block",
      isOpen: false,
      description: "Perfect for quick snacks and beverages between classes."
    },
    {
      id: 4,
      name: "Food Court Express",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop",
      rating: 4.3,
      totalReviews: 203,
      cuisines: ["Multi-Cuisine", "Italian", "Mexican"],
      deliveryTime: "20-30 min",
      location: "Student Center",
      isOpen: true,
      description: "International cuisine hub with diverse food options for adventurous eaters."
    },
    {
      id: 5,
      name: "Healthy Corner",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop",
      rating: 4.4,
      totalReviews: 178,
      cuisines: ["Healthy", "Salads", "Juices"],
      deliveryTime: "10-15 min",
      location: "Sports Complex",
      isOpen: true,
      description: "Fresh, healthy options including salads, smoothies, and nutritious meals."
    },
    {
      id: 6,
      name: "Night Owl Cafe",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      rating: 3.9,
      totalReviews: 134,
      cuisines: ["Coffee", "Sandwiches", "Late Night"],
      deliveryTime: "15-20 min",
      location: "24/7 Block",
      isOpen: true,
      description: "Open late for night owls, serving coffee, snacks, and light meals."
    }
  ];

  const filteredCanteens = canteens.filter(canteen => {
    const matchesSearch = canteen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         canteen.cuisines.some(cuisine => cuisine.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterStatus === 'open') return matchesSearch && canteen.isOpen;
    if (filterStatus === 'closed') return matchesSearch && !canteen.isOpen;
    return matchesSearch;
  });

  const sortedCanteens = [...filteredCanteens].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'deliveryTime') {
      const aTime = parseInt(a.deliveryTime.split('-')[0]);
      const bTime = parseInt(b.deliveryTime.split('-')[0]);
      return aTime - bTime;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Canteens</h1>
          <p className="text-gray-600">Discover all the food options available on campus</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search canteens or cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Canteens</SelectItem>
                <SelectItem value="open">Open Now</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="deliveryTime">Delivery Time</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-500 flex items-center">
              {sortedCanteens.length} canteen{sortedCanteens.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Canteens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCanteens.map((canteen) => (
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
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {canteen.description}
                </p>
                
                <div className="flex items-center mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{canteen.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({canteen.totalReviews} reviews)</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">
                  {canteen.cuisines.join(' • ')}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {canteen.deliveryTime}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {canteen.location}
                  </div>
                </div>
                
                <Button className="w-full" asChild disabled={!canteen.isOpen}>
                  <Link to={`/canteen/${canteen.id}`}>
                    {canteen.isOpen ? 'View Menu' : 'Currently Closed'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedCanteens.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No canteens found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canteens;
