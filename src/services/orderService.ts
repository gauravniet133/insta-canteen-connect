
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type OrderItem = {
  food_item_id: string;
  quantity: number;
  price: number;
  special_notes?: string;
};

type CreateOrderData = {
  canteen_id: string;
  order_items: OrderItem[];
  total_amount: number;
  delivery_fee?: number;
  special_instructions?: string;
};

export const orderService = {
  async createOrder(orderData: CreateOrderData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to place an order');
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        canteen_id: orderData.canteen_id,
        total_amount: orderData.total_amount,
        delivery_fee: orderData.delivery_fee || 0,
        special_instructions: orderData.special_instructions,
        estimated_delivery_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.order_items.map(item => ({
      order_id: order.id,
      food_item_id: item.food_item_id,
      quantity: item.quantity,
      price: item.price,
      special_notes: item.special_notes,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  },

  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        canteens (
          name,
          image_url
        ),
        order_items (
          *,
          food_items (
            name,
            image_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrderById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        canteens (
          name,
          location,
          phone
        ),
        order_items (
          *,
          food_items (
            name,
            image_url
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  }
};
