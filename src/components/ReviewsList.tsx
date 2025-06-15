
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import LoadingSpinner from './LoadingSpinner';

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

interface ReviewsListProps {
  canteenId?: string;
  foodItemId?: string;
  showReviewForm?: boolean;
  title?: string;
}

const ReviewsList = ({ 
  canteenId, 
  foodItemId, 
  showReviewForm = true,
  title = "Reviews"
}: ReviewsListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const { data: reviews = [], isLoading, refetch } = useQuery({
    queryKey: ['reviews', canteenId, foodItemId],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (canteenId) {
        query = query.eq('canteen_id', canteenId);
      }
      
      if (foodItemId) {
        query = query.eq('food_item_id', foodItemId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Review[];
    }
  });

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Review Deleted",
        description: "Your review has been deleted successfully.",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
  };

  const handleReviewSubmitted = () => {
    setEditingReview(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" text="Loading reviews..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <span className="text-sm font-normal text-gray-500">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Review Form */}
          {showReviewForm && (
            <div className="border-b pb-6 mb-6">
              {editingReview ? (
                <ReviewForm
                  canteenId={canteenId}
                  foodItemId={foodItemId}
                  existingReview={editingReview}
                  onReviewSubmitted={handleReviewSubmitted}
                  onCancel={() => setEditingReview(null)}
                />
              ) : (
                <ReviewForm
                  canteenId={canteenId}
                  foodItemId={foodItemId}
                  onReviewSubmitted={handleReviewSubmitted}
                />
              )}
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onEdit={user?.id === review.user_id ? handleEditReview : undefined}
                  onDelete={user?.id === review.user_id ? handleDeleteReview : undefined}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsList;
