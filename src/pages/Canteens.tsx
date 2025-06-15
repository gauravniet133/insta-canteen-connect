
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading canteens...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading canteens</div>
      </div>
    );
  }

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
