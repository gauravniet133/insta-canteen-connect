
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;

-- Create RLS policies for reviews
CREATE POLICY "Anyone can view reviews" 
  ON public.reviews 
  FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create reviews" 
  ON public.reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update canteen ratings
CREATE OR REPLACE FUNCTION update_canteen_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle both INSERT/UPDATE (NEW) and DELETE (OLD) cases
  IF TG_OP = 'DELETE' THEN
    -- Update rating for the deleted review's canteen
    UPDATE canteens 
    SET 
      rating = (
        SELECT COALESCE(AVG(rating::numeric), 0)
        FROM reviews 
        WHERE canteen_id = OLD.canteen_id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM reviews 
        WHERE canteen_id = OLD.canteen_id
      )
    WHERE id = OLD.canteen_id;
    
    RETURN OLD;
  ELSE
    -- Handle INSERT and UPDATE cases
    UPDATE canteens 
    SET 
      rating = (
        SELECT COALESCE(AVG(rating::numeric), 0)
        FROM reviews 
        WHERE canteen_id = NEW.canteen_id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM reviews 
        WHERE canteen_id = NEW.canteen_id
      )
    WHERE id = NEW.canteen_id;
    
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to update food item ratings
CREATE OR REPLACE FUNCTION update_food_item_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle both INSERT/UPDATE (NEW) and DELETE (OLD) cases
  IF TG_OP = 'DELETE' THEN
    -- Update rating for the deleted review's food item
    UPDATE food_items 
    SET 
      rating = (
        SELECT COALESCE(AVG(rating::numeric), 0)
        FROM reviews 
        WHERE food_item_id = OLD.food_item_id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM reviews 
        WHERE food_item_id = OLD.food_item_id
      )
    WHERE id = OLD.food_item_id;
    
    RETURN OLD;
  ELSE
    -- Handle INSERT and UPDATE cases
    UPDATE food_items 
    SET 
      rating = (
        SELECT COALESCE(AVG(rating::numeric), 0)
        FROM reviews 
        WHERE food_item_id = NEW.food_item_id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM reviews 
        WHERE food_item_id = NEW.food_item_id
      )
    WHERE id = NEW.food_item_id;
    
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_canteen_rating_trigger ON reviews;
DROP TRIGGER IF EXISTS update_food_item_rating_trigger ON reviews;

-- Create triggers to automatically update ratings (without WHEN conditions)
CREATE TRIGGER update_canteen_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_canteen_rating();

CREATE TRIGGER update_food_item_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_food_item_rating();
