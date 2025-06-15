
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

const validateOrderItem = (item: OrderItem): boolean => {
  return !!(
    item.food_item_id && 
    typeof item.quantity === 'number' && 
    item.quantity > 0 &&
    typeof item.price === 'number' && 
    item.price >= 0
  );
};

const validateOrderData = (orderData: CreateOrderData): void => {
  if (!orderData.canteen_id) {
    throw new Error('Canteen ID is required');
  }
  
  if (!orderData.order_items || orderData.order_items.length === 0) {
    throw new Error('Order must contain at least one item');
  }
  
  if (typeof orderData.total_amount !== 'number' || orderData.total_amount <= 0) {
    throw new Error('Invalid total amount');
  }
  
  for (const item of orderData.order_items) {
    if (!validateOrderItem(item)) {
      throw new Error('Invalid order item data');
    }
  }
};

export const orderService = {
  async createOrder(orderData: CreateOrderData) {
    try {
      validateOrderData(orderData);
      
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
          special_instructions: orderData.special_instructions?.trim() || null,
          estimated_delivery_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
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
        special_notes: item.special_notes?.trim() || null,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      throw new Error(errorMessage);
    }
  },

  async getUserOrders(userId: string) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

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
      return data || [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
      throw new Error(errorMessage);
    }
  },

  async getOrderById(orderId: string) {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order';
      throw new Error(errorMessage);
    }
  }
};
