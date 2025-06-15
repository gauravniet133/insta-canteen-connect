
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Clock, Star, MapPin, Phone, Search, Plus, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

type FoodItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_available: boolean | null;
  is_vegetarian: boolean | null;
  is_vegan: boolean | null;
  spice_level: number | null;
  rating: number | null;
  total_reviews: number | null;
  preparation_time: number | null;
};

type Canteen = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  location: string;
  phone: string | null;
  status: 'open' | 'closed' | 'busy';
  rating: number | null;
  total_reviews: number | null;
  delivery_time_min: number | null;
  delivery_time_max: number | null;
  opening_time: string | null;
  closing_time: string | null;
  canteen_cuisines: { cuisine_name: string }[];
};

const CanteenDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addItem, items: cartItems, itemCount, placeOrder, loading: cartLoading } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const { data: canteen, isLoading: canteenLoading } = useQuery({
    queryKey: ['canteen', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canteens')
        .select(`
          *,
          canteen_cuisines (
            cuisine_name
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Canteen;
    },
    enabled: !!id
  });

  const { data: foodItems = [], isLoading: foodLoading } = useQuery({
    queryKey: ['food-items', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('canteen_id', id);
      
      if (error) throw error;
      return data as FoodItem[];
    },
    enabled: !!id
  });

  const categories = [...new Set(foodItems.map(item => item.category).filter(Boolean))];
  
  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.is_available;
  });

  const handleAddToCart = (item: FoodItem, quantity: number = 1) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to cart.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!id || !canteen) {
      toast({
        title: "Error",
        description: "Unable to add item to cart.",
        variant: "destructive",
      });
      return;
    }

    addItem({
      food_item_id: item.id,
      name: item.name,
      price: item.price,
      quantity,
      canteen_id: id,
      canteen_name: canteen.name
    });
  };

  const getItemQuantityInCart = (itemId: string) => {
    const cartItem = cartItems.find(item => item.food_item_id === itemId);
    return cartItem?.quantity || 0;
  };

  const getCanteenCartItems = () => {
    return cartItems.filter(item => item.canteen_id === id);
  };

  const getCanteenCartTotal = () => {
    return getCanteenCartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to place an order.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    const canteenItems = getCanteenCartItems();
    if (canteenItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }

    const result = await placeOrder(specialInstructions);
    if (result.success) {
      setSpecialInstructions('');
      toast({
        title: "Success!",
        description: "Redirecting to your orders...",
      });
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    }
  };

  if (canteenLoading || foodLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading canteen details...</div>
      </div>
    );
  }

  if (!canteen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Canteen not found</h2>
          <Link to="/canteens">
            <Button>Back to Canteens</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/canteens" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Canteens
        </Link>

        {/* Canteen Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative h-64">
            <img 
              src={canteen.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop'} 
              alt={canteen.name}
              className="w-full h-full object-cover"
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
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{canteen.name}</h1>
            <p className="text-gray-600 mb-4">{canteen.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-2" />
                <span className="font-medium">{canteen.rating}</span>
                <span className="text-gray-500 ml-1">({canteen.total_reviews} reviews)</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span>{canteen.delivery_time_min}-{canteen.delivery_time_max} min delivery</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <span>{canteen.location}</span>
              </div>
            </div>

            {canteen.phone && (
              <div className="flex items-center mb-4">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span>{canteen.phone}</span>
              </div>
            )}
            
            <div className="text-sm text-gray-600">
              <strong>Cuisines:</strong> {canteen.canteen_cuisines.map(c => c.cuisine_name).join(', ')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category!}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="text-sm text-gray-500 flex items-center">
                  {filteredItems.length} items available
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const quantityInCart = getItemQuantityInCart(item.id);
                
                return (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <img 
                          src={item.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop'} 
                          alt={item.name}
                          className="w-32 h-32 object-cover"
                        />
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">₹{item.price}</div>
                              {item.preparation_time && (
                                <div className="text-xs text-gray-500">{item.preparation_time} min</div>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {item.is_vegetarian && (
                                <Badge variant="outline" className="text-green-600 border-green-600">Veg</Badge>
                              )}
                              {item.is_vegan && (
                                <Badge variant="outline" className="text-green-700 border-green-700">Vegan</Badge>
                              )}
                              {item.spice_level && item.spice_level > 0 && (
                                <Badge variant="outline" className="text-red-600 border-red-600">
                                  Spicy {item.spice_level}/5
                                </Badge>
                              )}
                              {item.rating && (
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span className="text-xs">{item.rating}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {quantityInCart > 0 ? (
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600">In cart: {quantityInCart}</span>
                                </div>
                              ) : null}
                              <Button
                                size="sm"
                                onClick={() => handleAddToCart(item)}
                                disabled={canteen?.status === 'closed'}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No menu items found.</p>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Your Order ({itemCount})
                </h3>
                
                {itemCount === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {getCanteenCartItems().map((cartItem) => (
                        <div key={cartItem.id} className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="text-sm font-medium">{cartItem.name}</div>
                            <div className="text-xs text-gray-500">₹{cartItem.price} each</div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{cartItem.quantity}x</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{getCanteenCartTotal()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delivery Fee</span>
                        <span>₹5</span>
                      </div>
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total</span>
                        <span className="text-lg">₹{getCanteenCartTotal() + 5}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-medium mb-2 block">Special Instructions</label>
                      <Textarea
                        placeholder="Any special requests or notes..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="text-sm"
                        rows={3}
                      />
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={canteen?.status === 'closed' || cartLoading}
                      onClick={handlePlaceOrder}
                    >
                      {cartLoading ? 'Placing Order...' : 
                       canteen?.status === 'closed' ? 'Canteen Closed' : 
                       `Place Order • ₹${getCanteenCartTotal() + 5}`}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanteenDetail;
