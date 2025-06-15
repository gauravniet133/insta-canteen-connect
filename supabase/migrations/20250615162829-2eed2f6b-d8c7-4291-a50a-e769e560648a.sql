
-- First, let's insert canteens that don't already exist
INSERT INTO public.canteens (
  name, 
  description, 
  image_url, 
  location, 
  phone, 
  email,
  status, 
  rating, 
  total_reviews, 
  delivery_time_min, 
  delivery_time_max,
  opening_time,
  closing_time
) 
SELECT * FROM (
  VALUES 
  (
    'Central Cafeteria',
    'The main dining hall serving a variety of cuisines from around the world. Features multiple food stations including Indian, Continental, Chinese, and South Indian specialties.',
    'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop',
    'Main Campus Building, Ground Floor',
    '+91-9876543210',
    'central@campuseats.edu',
    'open'::canteen_status,
    4.3,
    156,
    15,
    25,
    '07:00:00'::time,
    '22:00:00'::time
  ),
  (
    'Spice Garden',
    'Authentic Indian cuisine with a focus on traditional recipes and fresh ingredients. Known for their biryani, curries, and freshly made rotis.',
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop',
    'Academic Block A, First Floor',
    '+91-9876543211',
    'spicegarden@campuseats.edu',
    'open'::canteen_status,
    4.6,
    89,
    20,
    30,
    '11:00:00'::time,
    '21:30:00'::time
  ),
  (
    'Quick Bites',
    'Fast food joint perfect for students on the go. Specializes in burgers, sandwiches, wraps, and quick snacks with affordable prices.',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
    'Student Center, Ground Floor',
    '+91-9876543212',
    'quickbites@campuseats.edu',
    'busy'::canteen_status,
    4.1,
    203,
    10,
    20,
    '08:00:00'::time,
    '23:00:00'::time
  ),
  (
    'Healthy Corner',
    'Health-conscious dining with fresh salads, smoothies, grilled items, and vegan options. Perfect for fitness enthusiasts and health-conscious students.',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    'Sports Complex, Ground Floor',
    '+91-9876543213',
    'healthy@campuseats.edu',
    'open'::canteen_status,
    4.4,
    67,
    15,
    25,
    '06:30:00'::time,
    '20:00:00'::time
  ),
  (
    'Coffee House',
    'Premium coffee shop with freshly brewed coffee, tea, pastries, and light snacks. The perfect spot for studying and casual meetings.',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
    'Library Building, Ground Floor',
    '+91-9876543214',
    'coffeehouse@campuseats.edu',
    'open'::canteen_status,
    4.5,
    134,
    5,
    15,
    '06:00:00'::time,
    '24:00:00'::time
  ),
  (
    'Noodle Station',
    'Asian cuisine specialist featuring various noodle dishes, fried rice, momos, and authentic Chinese and Thai preparations.',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
    'Engineering Block, First Floor',
    '+91-9876543215',
    'noodles@campuseats.edu',
    'open'::canteen_status,
    4.2,
    98,
    18,
    28,
    '11:30:00'::time,
    '22:00:00'::time
  ),
  (
    'South Delight',
    'Authentic South Indian cuisine featuring dosas, idlis, vadas, and traditional meals served on banana leaves with authentic chutneys and sambar.',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&h=600&fit=crop',
    'Hostel Block B, Ground Floor',
    '+91-9876543216',
    'southdelight@campuseats.edu',
    'open'::canteen_status,
    4.7,
    112,
    20,
    30,
    '07:00:00'::time,
    '21:00:00'::time
  ),
  (
    'Pizza Corner',
    'Wood-fired pizzas with fresh toppings, garlic bread, pasta, and Italian specialties. Popular among students for group orders and parties.',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
    'Recreation Center, First Floor',
    '+91-9876543217',
    'pizza@campuseats.edu',
    'closed'::canteen_status,
    4.0,
    145,
    25,
    40,
    '12:00:00'::time,
    '23:30:00'::time
  )
) AS new_canteens(name, description, image_url, location, phone, email, status, rating, total_reviews, delivery_time_min, delivery_time_max, opening_time, closing_time)
WHERE NOT EXISTS (
  SELECT 1 FROM public.canteens WHERE canteens.name = new_canteens.name
);

-- Insert cuisines using INSERT ... ON CONFLICT DO NOTHING to avoid duplicates
INSERT INTO public.canteen_cuisines (canteen_id, cuisine_name)
SELECT c.id, cuisine_data.cuisine_name
FROM public.canteens c
CROSS JOIN (
  VALUES 
  ('Central Cafeteria', 'Indian'),
  ('Central Cafeteria', 'Continental'),
  ('Central Cafeteria', 'Chinese'),
  ('Central Cafeteria', 'South Indian'),
  ('Spice Garden', 'Indian'),
  ('Spice Garden', 'North Indian'),
  ('Quick Bites', 'Fast Food'),
  ('Quick Bites', 'American'),
  ('Quick Bites', 'Snacks'),
  ('Healthy Corner', 'Healthy'),
  ('Healthy Corner', 'Salads'),
  ('Healthy Corner', 'Vegan'),
  ('Coffee House', 'Coffee'),
  ('Coffee House', 'Beverages'),
  ('Coffee House', 'Bakery'),
  ('Noodle Station', 'Chinese'),
  ('Noodle Station', 'Thai'),
  ('Noodle Station', 'Asian'),
  ('South Delight', 'South Indian'),
  ('South Delight', 'Traditional'),
  ('Pizza Corner', 'Italian'),
  ('Pizza Corner', 'Pizza')
) AS cuisine_data(canteen_name, cuisine_name)
WHERE c.name = cuisine_data.canteen_name
ON CONFLICT (canteen_id, cuisine_name) DO NOTHING;

-- Insert food items
INSERT INTO public.food_items (
  name, 
  description, 
  price, 
  category, 
  image_url, 
  canteen_id, 
  is_available, 
  is_vegetarian, 
  is_vegan, 
  spice_level, 
  rating, 
  total_reviews, 
  preparation_time
)
SELECT 
  item_data.name,
  item_data.description,
  item_data.price,
  item_data.category,
  item_data.image_url,
  c.id,
  item_data.is_available,
  item_data.is_vegetarian,
  item_data.is_vegan,
  item_data.spice_level,
  item_data.rating,
  item_data.total_reviews,
  item_data.preparation_time
FROM public.canteens c
CROSS JOIN (
  VALUES
  -- Central Cafeteria items
  ('Chicken Biryani', 'Aromatic basmati rice cooked with tender chicken and traditional spices', 180, 'Main Course', 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400&h=300&fit=crop', 'Central Cafeteria', true, false, false, 3, 4.5, 45, 25),
  ('Paneer Butter Masala', 'Creamy tomato-based curry with soft paneer cubes', 150, 'Main Course', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop', 'Central Cafeteria', true, true, false, 2, 4.3, 38, 20),
  ('Hakka Noodles', 'Stir-fried noodles with vegetables and soy sauce', 120, 'Chinese', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop', 'Central Cafeteria', true, true, true, 1, 4.1, 52, 15),
  ('Masala Dosa', 'Crispy rice crepe filled with spiced potato curry', 80, 'South Indian', 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop', 'Central Cafeteria', true, true, true, 2, 4.4, 67, 18),
  
  -- Spice Garden items
  ('Hyderabadi Biryani', 'Royal biryani with fragrant basmati rice and succulent mutton', 220, 'Biryani', 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400&h=300&fit=crop', 'Spice Garden', true, false, false, 4, 4.8, 89, 30),
  ('Dal Makhani', 'Rich and creamy black lentils slow-cooked with butter and cream', 140, 'Vegetarian', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', 'Spice Garden', true, true, false, 2, 4.6, 43, 25),
  ('Butter Chicken', 'Tender chicken in a rich tomato and butter sauce', 190, 'Non-Vegetarian', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop', 'Spice Garden', true, false, false, 3, 4.7, 76, 22),
  ('Garlic Naan', 'Soft leavened bread topped with fresh garlic and cilantro', 45, 'Breads', 'https://images.unsplash.com/photo-1513906237160-38302bd9fb6d?w=400&h=300&fit=crop', 'Spice Garden', true, true, false, 1, 4.2, 34, 8),
  
  -- Quick Bites items
  ('Classic Burger', 'Juicy beef patty with lettuce, tomato, and special sauce', 120, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', 'Quick Bites', true, false, false, 1, 4.0, 156, 12),
  ('Chicken Wrap', 'Grilled chicken with fresh vegetables wrapped in soft tortilla', 110, 'Wraps', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop', 'Quick Bites', true, false, false, 2, 4.1, 89, 10),
  ('French Fries', 'Crispy golden fries seasoned with salt and herbs', 60, 'Side Dishes', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', 'Quick Bites', true, true, true, 0, 3.8, 203, 8),
  ('Veggie Sandwich', 'Fresh vegetables with mayo and cheese in toasted bread', 80, 'Sandwiches', 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop', 'Quick Bites', true, true, false, 0, 3.9, 67, 8),
  
  -- Healthy Corner items
  ('Greek Salad', 'Fresh mixed greens with feta cheese, olives, and Mediterranean dressing', 150, 'Salads', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', 'Healthy Corner', true, true, false, 0, 4.5, 43, 10),
  ('Protein Smoothie', 'Banana, berries, protein powder, and almond milk blend', 120, 'Beverages', 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop', 'Healthy Corner', true, true, true, 0, 4.3, 32, 5),
  ('Grilled Chicken Salad', 'Lean grilled chicken breast over mixed greens with vinaigrette', 180, 'Salads', 'https://images.unsplash.com/photo-1512852939750-1305098529bf?w=400&h=300&fit=crop', 'Healthy Corner', true, false, false, 0, 4.6, 28, 15),
  ('Quinoa Bowl', 'Nutritious quinoa with roasted vegetables and tahini dressing', 160, 'Bowls', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', 'Healthy Corner', true, true, true, 0, 4.4, 19, 12),
  
  -- Coffee House items
  ('Cappuccino', 'Rich espresso with steamed milk and foam art', 80, 'Coffee', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop', 'Coffee House', true, true, false, 0, 4.6, 124, 5),
  ('Chocolate Croissant', 'Buttery, flaky pastry filled with rich dark chocolate', 90, 'Pastries', 'https://images.unsplash.com/photo-1555507036-ab794f4eed25?w=400&h=300&fit=crop', 'Coffee House', true, true, false, 0, 4.3, 78, 3),
  ('Iced Americano', 'Smooth espresso over ice with a splash of cold water', 70, 'Cold Coffee', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop', 'Coffee House', true, true, true, 0, 4.2, 95, 3),
  ('Blueberry Muffin', 'Freshly baked muffin bursting with juicy blueberries', 75, 'Bakery', 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop', 'Coffee House', true, true, false, 0, 4.1, 56, 2),
  
  -- Noodle Station items
  ('Pad Thai', 'Traditional Thai stir-fried noodles with tamarind, fish sauce, and peanuts', 160, 'Thai', 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400&h=300&fit=crop', 'Noodle Station', true, false, false, 3, 4.4, 67, 20),
  ('Chicken Momos', 'Steamed dumplings filled with seasoned chicken and vegetables', 100, 'Tibetan', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop', 'Noodle Station', true, false, false, 2, 4.5, 89, 15),
  ('Veg Fried Rice', 'Wok-tossed rice with mixed vegetables and soy sauce', 110, 'Chinese', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', 'Noodle Station', true, true, true, 1, 4.0, 45, 12),
  ('Tom Yum Soup', 'Spicy and sour Thai soup with lemongrass and lime leaves', 90, 'Soups', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', 'Noodle Station', true, true, true, 4, 4.3, 34, 10),
  
  -- South Delight items
  ('Sambar Vada', 'Deep-fried lentil donuts served in spicy lentil curry', 60, 'Snacks', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', 'South Delight', true, true, true, 3, 4.6, 78, 12),
  ('Chettinad Chicken', 'Spicy South Indian chicken curry with aromatic spices', 200, 'Non-Vegetarian', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop', 'South Delight', true, false, false, 5, 4.8, 65, 25),
  ('Idli Sambar', 'Steamed rice cakes served with lentil curry and chutney', 50, 'Breakfast', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop', 'South Delight', true, true, true, 2, 4.4, 92, 8),
  ('Filter Coffee', 'Traditional South Indian coffee brewed with chicory', 40, 'Beverages', 'https://images.unsplash.com/photo-1559496417-e7f25cb247cd?w=400&h=300&fit=crop', 'South Delight', true, true, false, 0, 4.7, 156, 5),
  
  -- Pizza Corner items
  ('Margherita Pizza', 'Classic pizza with fresh mozzarella, tomato sauce, and basil', 220, 'Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop', 'Pizza Corner', false, true, false, 0, 4.2, 89, 18),
  ('Pepperoni Pizza', 'Spicy pepperoni with mozzarella cheese on tomato base', 280, 'Pizza', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', 'Pizza Corner', false, false, false, 1, 4.0, 67, 20),
  ('Garlic Bread', 'Crispy bread topped with garlic butter and herbs', 80, 'Sides', 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop', 'Pizza Corner', false, true, false, 0, 3.9, 45, 10),
  ('Pasta Arrabbiata', 'Spicy tomato pasta with garlic, red chilies, and herbs', 160, 'Pasta', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop', 'Pizza Corner', false, true, false, 3, 4.1, 32, 15)
) AS item_data(name, description, price, category, image_url, canteen_name, is_available, is_vegetarian, is_vegan, spice_level, rating, total_reviews, preparation_time)
WHERE c.name = item_data.canteen_name
AND NOT EXISTS (
  SELECT 1 FROM public.food_items fi 
  WHERE fi.canteen_id = c.id AND fi.name = item_data.name
);
