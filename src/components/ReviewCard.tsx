
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  canteen_id?: string;
  food_item_id?: string;
  profiles?: {
    full_name: string;
  };
}

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

const ReviewCard = ({ review, onEdit, onDelete }: ReviewCardProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === review.user_id;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
            </div>
            <Badge variant="outline" className="text-xs">
              {review.rating}/5
            </Badge>
          </div>
          {isOwner && (
            <div className="flex items-center space-x-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(review)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(review.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {review.comment && (
          <p className="text-gray-700 text-sm mb-3 leading-relaxed">
            {review.comment}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-medium">
            {review.profiles?.full_name || 'Anonymous User'}
          </span>
          <span>
            {new Date(review.created_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
