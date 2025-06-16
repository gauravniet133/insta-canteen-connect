
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Store, 
  Clock, 
  Phone, 
  Mail, 
  MapPin,
  Settings,
  Save
} from 'lucide-react';

interface Canteen {
  id: string;
  name: string;
  description?: string;
  location: string;
  phone?: string;
  email?: string;
  image_url?: string;
  opening_time?: string;
  closing_time?: string;
  status: string;
  delivery_time_min: number;
  delivery_time_max: number;
}

const SellerCanteenSettings = () => {
  const { profile, loading: profileLoading, isCanteenOwner } = useProfile();
  const { toast } = useToast();
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    phone: '',
    email: '',
    image_url: '',
    opening_time: '',
    closing_time: '',
    status: 'open',
    delivery_time_min: 15,
    delivery_time_max: 30
  });

  useEffect(() => {
    if (profile && isCanteenOwner) {
      fetchCanteen();
    }
  }, [profile, isCanteenOwner]);

  const fetchCanteen = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('canteens')
        .select('*')
        .eq('owner_id', profile?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      if (data) {
        setCanteen(data);
        setFormData({
          name: data.name || '',
          description: data.description || '',
          location: data.location || '',
          phone: data.phone || '',
          email: data.email || '',
          image_url: data.image_url || '',
          opening_time: data.opening_time || '',
          closing_time: data.closing_time || '',
          status: data.status || 'open',
          delivery_time_min: data.delivery_time_min || 15,
          delivery_time_max: data.delivery_time_max || 30
        });
      }
    } catch (error) {
      console.error('Error fetching canteen:', error);
      toast({
        title: "Error",
        description: "Failed to load canteen settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);

      const canteenData = {
        name: formData.name,
        description: formData.description || null,
        location: formData.location,
        phone: formData.phone || null,
        email: formData.email || null,
        image_url: formData.image_url || null,
        opening_time: formData.opening_time || null,
        closing_time: formData.closing_time || null,
        status: formData.status,
        delivery_time_min: formData.delivery_time_min,
        delivery_time_max: formData.delivery_time_max,
        owner_id: profile.id
      };

      if (canteen) {
        // Update existing canteen
        const { error } = await supabase
          .from('canteens')
          .update(canteenData)
          .eq('id', canteen.id);

        if (error) throw error;
        
        toast({
          title: "Settings Updated",
          description: "Your canteen settings have been updated successfully",
        });
      } else {
        // Create new canteen
        const { data, error } = await supabase
          .from('canteens')
          .insert(canteenData)
          .select()
          .single();

        if (error) throw error;
        
        setCanteen(data);
        toast({
          title: "Canteen Created",
          description: "Your canteen has been set up successfully",
        });
      }

      fetchCanteen();
    } catch (error) {
      console.error('Error saving canteen:', error);
      toast({
        title: "Error",
        description: "Failed to save canteen settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Canteen Settings</h1>
          <p className="text-gray-600 mt-2">
            {canteen ? 'Update your canteen information and operating settings' : 'Set up your canteen profile'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Essential details about your canteen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Canteen Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="e.g., Main Campus Canteen"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                    placeholder="e.g., Building A, Ground Floor"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your canteen, specialties, and what makes it unique..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image_url">Canteen Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/your-canteen-image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Contact Information</span>
              </CardTitle>
              <CardDescription>
                How customers can reach you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="canteen@college.edu"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Operating Hours</span>
              </CardTitle>
              <CardDescription>
                Set your canteen's working hours and delivery times
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="opening_time">Opening Time</Label>
                  <Input
                    id="opening_time"
                    type="time"
                    value={formData.opening_time}
                    onChange={(e) => setFormData({...formData, opening_time: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="closing_time">Closing Time</Label>
                  <Input
                    id="closing_time"
                    type="time"
                    value={formData.closing_time}
                    onChange={(e) => setFormData({...formData, closing_time: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="delivery_min">Minimum Delivery Time (minutes)</Label>
                  <Input
                    id="delivery_min"
                    type="number"
                    min="5"
                    max="60"
                    value={formData.delivery_time_min}
                    onChange={(e) => setFormData({...formData, delivery_time_min: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="delivery_max">Maximum Delivery Time (minutes)</Label>
                  <Input
                    id="delivery_max"
                    type="number"
                    min="10"
                    max="120"
                    value={formData.delivery_time_max}
                    onChange={(e) => setFormData({...formData, delivery_time_max: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Status Settings</span>
              </CardTitle>
              <CardDescription>
                Control your canteen's availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="status">Current Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">🟢 Open - Accepting orders</SelectItem>
                    <SelectItem value="busy">🟡 Busy - Limited availability</SelectItem>
                    <SelectItem value="closed">🔴 Closed - Not accepting orders</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600 mt-1">
                  This affects whether customers can place new orders
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={saving} size="lg">
              {saving ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {canteen ? 'Update Settings' : 'Create Canteen'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerCanteenSettings;
