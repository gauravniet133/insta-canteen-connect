
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from './LoadingSpinner';
import RatingDisplay from './RatingDisplay';

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
    <section className="mb-16 sm:mb-20">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
          Featured Canteens
        </h2>
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Discover the most popular food spots on campus
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" text="Loading featured canteens..." />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {featuredCanteens.map((canteen) => (
              <Card key={canteen.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-0 shadow-lg group">
                <div className="relative overflow-hidden">
                  <img 
                    src={canteen.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop'} 
                    alt={canteen.name}
                    className="w-full h-56 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <Badge 
                    className={`absolute top-4 right-4 px-3 py-1 font-bold text-sm shadow-lg ${
                      canteen.status === 'open' ? 'bg-green-500 hover:bg-green-600' : 
                      canteen.status === 'busy' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'
                    } text-white border-0`}
                  >
                    {canteen.status === 'open' ? 'Open' : 
                     canteen.status === 'busy' ? 'Busy' : 'Closed'}
                  </Badge>
                </div>
                
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">
                    {canteen.name}
                  </h3>
                  <p className="text-gray-600 text-base mb-4 line-clamp-2 leading-relaxed">
                    {canteen.description}
                  </p>
                  
                  <div className="mb-4">
                    <RatingDisplay 
                      rating={canteen.rating || 0} 
                      totalReviews={canteen.total_reviews || 0}
                      size="md"
                    />
                  </div>
                  
                  <p className="text-gray-700 text-base mb-6 font-medium">
                    {canteen.canteen_cuisines.map(c => c.cuisine_name).join(' • ')}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 mb-6 gap-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-orange-500" />
                      <span className="font-semibold">{canteen.delivery_time_min}-{canteen.delivery_time_max} min</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                      <span className="font-semibold">{canteen.location}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full py-3 font-bold text-base bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" 
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
          
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3 font-bold text-lg border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
              asChild
            >
              <Link to="/canteens">View All Canteens</Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedCanteens;
