
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const FeaturedCanteens = () => {
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
    <div className="mb-12 sm:mb-16">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 sm:mb-10 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Featured Canteens</h2>
          <p className="text-gray-600 text-base sm:text-lg">Discover the most popular food spots on campus</p>
        </div>
        <Button variant="outline" size="lg" className="px-4 sm:px-6 py-2 sm:py-3 font-semibold w-full sm:w-auto" asChild>
          <Link to="/canteens">View All</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 sm:py-16">
          <div className="inline-flex items-center px-4 sm:px-6 py-3 font-medium text-base sm:text-lg text-gray-600">
            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-orange-500 mr-3"></div>
            Loading featured canteens...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {featuredCanteens.map((canteen) => (
            <Card key={canteen.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
              <div className="relative">
                <img 
                  src={canteen.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop'} 
                  alt={canteen.name}
                  className="w-full h-48 sm:h-56 object-cover"
                />
                <Badge 
                  className={`absolute top-3 sm:top-4 right-3 sm:right-4 px-2 sm:px-3 py-1 font-semibold text-xs sm:text-sm ${
                    canteen.status === 'open' ? 'bg-green-500 hover:bg-green-600' : 
                    canteen.status === 'busy' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'
                  } text-white border-0`}
                >
                  {canteen.status === 'open' ? 'Open' : 
                   canteen.status === 'busy' ? 'Busy' : 'Closed'}
                </Badge>
              </div>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">{canteen.name}</h3>
                <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                  {canteen.description}
                </p>
                
                <div className="flex items-center mb-2 sm:mb-3">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-semibold text-gray-900">{canteen.rating || 0}</span>
                  <span className="text-sm text-gray-500 ml-1">({canteen.total_reviews || 0} reviews)</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 sm:mb-4 font-medium">
                  {canteen.canteen_cuisines.map(c => c.cuisine_name).join(' • ')}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mb-4 sm:mb-6 gap-2">
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
                  className="w-full py-2 sm:py-3 font-semibold text-sm sm:text-base" 
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
  );
};

export default FeaturedCanteens;
