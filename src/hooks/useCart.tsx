
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { orderService } from '@/services/orderService';

type CartItem = {
  id: string;
  food_item_id: string;
  name: string;
  price: number;
  quantity: number;
  canteen_id: string;
  canteen_name: string;
};

interface CartContextType {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (specialInstructions?: string) => Promise<{ success: boolean; orderId?: string }>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    }
  }, [user]);

  // Save cart to localStorage
  useEffect(() => {
    if (user && items.length > 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
    } else if (user && items.length === 0) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  }, [items, user]);

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    const existingItem = items.find(item => item.food_item_id === newItem.food_item_id);
    
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + newItem.quantity);
    } else {
      const cartItem: CartItem = {
        ...newItem,
        id: Date.now().toString() + Math.random().toString(36)
      };
      setItems(prev => [...prev, cartItem]);
      toast({
        title: "Added to cart",
        description: `${newItem.name} has been added to your cart`,
      });
    }
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  const placeOrder = async (specialInstructions?: string): Promise<{ success: boolean; orderId?: string }> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to place an order.",
        variant: "destructive",
      });
      return { success: false };
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      });
      return { success: false };
    }
    
    setLoading(true);
    try {
      console.log('Starting order placement process...');
      
      // Group items by canteen
      const itemsByCanteen = items.reduce((acc, item) => {
        if (!acc[item.canteen_id]) {
          acc[item.canteen_id] = [];
        }
        acc[item.canteen_id].push(item);
        return acc;
      }, {} as Record<string, CartItem[]>);

      console.log('Items grouped by canteen:', itemsByCanteen);

      const orderIds: string[] = [];

      // Create orders for each canteen
      for (const [canteenId, canteenItems] of Object.entries(itemsByCanteen)) {
        const orderTotal = canteenItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const orderItems = canteenItems.map(item => ({
          food_item_id: item.food_item_id,
          quantity: item.quantity,
          price: item.price,
        }));

        console.log(`Creating order for canteen ${canteenId}:`, {
          canteen_id: canteenId,
          order_items: orderItems,
          total_amount: orderTotal + 5,
          delivery_fee: 5,
          special_instructions: specialInstructions
        });

        const order = await orderService.createOrder({
          canteen_id: canteenId,
          order_items: orderItems,
          total_amount: orderTotal + 5, // Including delivery fee
          delivery_fee: 5,
          special_instructions: specialInstructions,
        });

        orderIds.push(order.id);
        console.log('Order created successfully:', order.id);
      }

      clearCart();
      
      toast({
        title: "Order Placed Successfully!",
        description: `${orderIds.length > 1 ? 'Orders have' : 'Order has'} been placed and ${orderIds.length > 1 ? 'are' : 'is'} being processed`,
      });
      
      return { success: true, orderId: orderIds[0] };
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Unable to place your order. Please try again.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    items,
    totalAmount,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    placeOrder,
    loading
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
