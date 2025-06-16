
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Clock,
  DollarSign,
  Package
} from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  spice_level: number;
  preparation_time: number;
  rating: number;
  total_reviews: number;
}

const SellerMenuManagement = () => {
  const { profile, loading: profileLoading, isCanteenOwner } = useProfile();
  const { toast } = useToast();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [canteenId, setCanteenId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    is_available: true,
    is_vegetarian: false,
    is_vegan: false,
    spice_level: 0,
    preparation_time: 10
  });

  const categories = [
    'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 
    'Desserts', 'South Indian', 'North Indian', 'Chinese', 'Fast Food'
  ];

  useEffect(() => {
    if (profile && isCanteenOwner) {
      fetchCanteenAndMenu();
    }
  }, [profile, isCanteenOwner]);

  const fetchCanteenAndMenu = async () => {
    try {
      setLoading(true);
      
      // Get user's canteen
      const { data: canteen, error: canteenError } = await supabase
        .from('canteens')
        .select('id')
        .eq('owner_id', profile?.id)
        .single();

      if (canteenError) throw canteenError;
      if (!canteen) {
        toast({
          title: "No Canteen Found",
          description: "Please set up your canteen first",
          variant: "destructive",
        });
        return;
      }

      setCanteenId(canteen.id);

      // Fetch food items
      const { data: items, error: itemsError } = await supabase
        .from('food_items')
        .select('*')
        .eq('canteen_id', canteen.id)
        .order('name');

      if (itemsError) throw itemsError;
      setFoodItems(items || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canteenId) return;

    try {
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: formData.image_url || null,
        is_available: formData.is_available,
        is_vegetarian: formData.is_vegetarian,
        is_vegan: formData.is_vegan,
        spice_level: formData.spice_level,
        preparation_time: formData.preparation_time,
        canteen_id: canteenId
      };

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('food_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
        
        toast({
          title: "Item Updated",
          description: "Menu item has been updated successfully",
        });
      } else {
        // Create new item
        const { error } = await supabase
          .from('food_items')
          .insert(itemData);

        if (error) throw error;
        
        toast({
          title: "Item Added",
          description: "New menu item has been added successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCanteenAndMenu();
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category || '',
      image_url: item.image_url || '',
      is_available: item.is_available,
      is_vegetarian: item.is_vegetarian,
      is_vegan: item.is_vegan,
      spice_level: item.spice_level,
      preparation_time: item.preparation_time
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Item Deleted",
        description: "Menu item has been deleted successfully",
      });

      fetchCanteenAndMenu();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('food_items')
        .update({ is_available: !currentStatus })
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Item ${!currentStatus ? 'enabled' : 'disabled'} successfully`,
      });

      fetchCanteenAndMenu();
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image_url: '',
      is_available: true,
      is_vegetarian: false,
      is_vegan: false,
      spice_level: 0,
      preparation_time: 10
    });
    setEditingItem(null);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isCanteenOwner) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-600 mt-2">Manage your canteen's food items and menu</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Update the details of your menu item' : 'Add a new item to your menu'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Item Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="prep_time">Preparation Time (minutes)</Label>
                    <Input
                      id="prep_time"
                      type="number"
                      value={formData.preparation_time}
                      onChange={(e) => setFormData({...formData, preparation_time: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="vegetarian"
                      checked={formData.is_vegetarian}
                      onCheckedChange={(checked) => setFormData({...formData, is_vegetarian: checked})}
                    />
                    <Label htmlFor="vegetarian">Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="vegan"
                      checked={formData.is_vegan}
                      onCheckedChange={(checked) => setFormData({...formData, is_vegan: checked})}
                    />
                    <Label htmlFor="vegan">Vegan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={formData.is_available}
                      onCheckedChange={(checked) => setFormData({...formData, is_available: checked})}
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="spice_level">Spice Level (0-5)</Label>
                  <Select value={formData.spice_level.toString()} onValueChange={(value) => setFormData({...formData, spice_level: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5].map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          {level === 0 ? 'None' : '🌶️'.repeat(level)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Menu Items Grid */}
        <div className="grid gap-6">
          {foodItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items yet</h3>
                <p className="text-gray-600 mb-4">Start building your menu by adding your first food item</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodItems.map((item) => (
                <Card key={item.id} className={`${!item.is_available ? 'opacity-60' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={item.category ? 'secondary' : 'outline'}>
                            {item.category || 'Uncategorized'}
                          </Badge>
                          {item.is_vegetarian && <Badge variant="outline" className="text-green-600 border-green-600">Veg</Badge>}
                          {item.is_vegan && <Badge variant="outline" className="text-green-700 border-green-700">Vegan</Badge>}
                          <Badge variant={item.is_available ? 'default' : 'destructive'}>
                            {item.is_available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-green-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="font-semibold">₹{item.price}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{item.preparation_time}m</span>
                      </div>
                    </div>

                    {item.total_reviews > 0 && (
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{item.rating.toFixed(1)} ({item.total_reviews} reviews)</span>
                      </div>
                    )}

                    {item.spice_level > 0 && (
                      <div className="text-sm">
                        <span className="text-gray-500">Spice: </span>
                        <span>{'🌶️'.repeat(item.spice_level)}</span>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAvailability(item.id, item.is_available)}
                      >
                        {item.is_available ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerMenuManagement;
