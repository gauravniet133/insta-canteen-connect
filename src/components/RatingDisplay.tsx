
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RatingDisplayProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

const RatingDisplay = ({ 
  rating, 
  totalReviews, 
  size = 'md', 
  showBadge = true,
  className = '' 
}: RatingDisplayProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${sizeClasses[size]} ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-200 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        {renderStars()}
      </div>
      
      {showBadge && (
        <Badge variant="outline" className={`${textSizeClasses[size]} font-medium`}>
          {rating.toFixed(1)}
        </Badge>
      )}
      
      {totalReviews !== undefined && (
        <span className={`${textSizeClasses[size]} text-gray-500`}>
          ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;
