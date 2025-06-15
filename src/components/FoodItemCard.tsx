
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Clock } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import RatingDisplay from './RatingDisplay';

type FoodItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  preparation_time: number;
  is_available: boolean;
  category: string;
  canteen_id: string;
  canteen_name: string;
  rating?: number;
  total_reviews?: number;
  image_url?: string;
};

interface FoodItemCardProps {
  item: FoodItem;
}

const FoodItemCard = ({ item }: FoodItemCardProps) => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!user) {
      // Redirect to auth or show login prompt
      return;
    }

    addItem({
      food_item_id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantity,
      canteen_id: item.canteen_id,
      canteen_name: item.canteen_name
    });
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 w-full">
      {item.image_url && (
        <div className="aspect-video sm:aspect-[4/3] overflow-hidden">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardContent className="p-3 sm:p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">{item.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
          </div>
          {!item.is_available && (
            <Badge variant="secondary" className="text-xs shrink-0">
              Unavailable
            </Badge>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="whitespace-nowrap">{item.preparation_time} min</span>
            </div>
            {item.rating !== undefined && item.rating > 0 && (
              <RatingDisplay 
                rating={item.rating} 
                totalReviews={item.total_reviews}
                size="sm"
                showBadge={false}
              />
            )}
          </div>
          <Badge variant="outline" className="text-xs w-fit">
            {item.category}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t">
          <div className="font-bold text-lg sm:text-xl text-green-600">
            ₹{item.price}
          </div>
          
          {item.is_available ? (
            <div className="flex items-center justify-between sm:justify-end space-x-2">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 sm:w-8 text-center text-sm font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <Button
                onClick={handleAddToCart}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 px-3 sm:px-4 text-xs sm:text-sm"
              >
                Add to Cart
              </Button>
            </div>
          ) : (
            <Button size="sm" disabled className="w-full sm:w-auto">
              Not Available
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodItemCard;
