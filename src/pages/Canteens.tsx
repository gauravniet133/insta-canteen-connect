
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Star, MapPin, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

type Canteen = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  location: string;
  status: 'open' | 'closed' | 'busy';
  rating: number | null;
  total_reviews: number | null;
  delivery_time_min: number | null;
  delivery_time_max: number | null;
  canteen_cuisines: { cuisine_name: string }[];
};

const Canteens = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const { data: canteens = [], isLoading, error } = useQuery({
    queryKey: ['canteens'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canteens')
        .select(`
          *,
          canteen_cuisines (
            cuisine_name
          )
        `);
      
      if (error) throw error;
      return data as Canteen[];
    }
  });

  const filteredCanteens = canteens.filter(canteen => {
    const matchesSearch = canteen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         canteen.canteen_cuisines.some(cuisine => 
                           cuisine.cuisine_name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    if (filterStatus === 'open') return matchesSearch && canteen.status === 'open';
    if (filterStatus === 'closed') return matchesSearch && canteen.status === 'closed';
    return matchesSearch;
  });

  const sortedCanteens = [...filteredCanteens].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'deliveryTime') {
      const aTime = a.delivery_time_min || 0;
      const bTime = b.delivery_time_min || 0;
      return aTime - bTime;
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-base sm:text-lg">Loading canteens...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-base sm:text-lg text-red-600">Error loading canteens</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">All Canteens</h1>
          <p className="text-gray-600 text-sm sm:text-base">Discover all the food options available on campus</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search canteens or cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="text-sm sm:text-base">
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
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="deliveryTime">Delivery Time</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-xs sm:text-sm text-gray-500 flex items-center justify-center sm:justify-start">
              {sortedCanteens.length} canteen{sortedCanteens.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Canteens Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sortedCanteens.map((canteen) => (
            <Card key={canteen.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={canteen.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop'} 
                  alt={canteen.name}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <Badge 
                  className={`absolute top-3 sm:top-4 right-3 sm:right-4 text-xs sm:text-sm ${
                    canteen.status === 'open' ? 'bg-green-500' : 
                    canteen.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                >
                  {canteen.status === 'open' ? 'Open' : 
                   canteen.status === 'busy' ? 'Busy' : 'Closed'}
                </Badge>
              </div>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{canteen.name}</h3>
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
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mb-4 gap-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {canteen.delivery_time_min}-{canteen.delivery_time_max} min
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="truncate">{canteen.location}</span>
                  </div>
                </div>
                
                <Button className="w-full text-sm sm:text-base" asChild disabled={canteen.status === 'closed'}>
                  <Link to={`/canteen/${canteen.id}`}>
                    {canteen.status === 'closed' ? 'Currently Closed' : 'View Menu'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedCanteens.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base sm:text-lg mb-4">No canteens found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="text-sm sm:text-base"
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
