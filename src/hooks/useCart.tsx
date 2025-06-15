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
  placeOrder: () => Promise<boolean>;
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

  const placeOrder = async (): Promise<boolean> => {
    if (!user || items.length === 0) return false;
    
    setLoading(true);
    try {
      // Group items by canteen
      const itemsByCanteen = items.reduce((acc, item) => {
        if (!acc[item.canteen_id]) {
          acc[item.canteen_id] = [];
        }
        acc[item.canteen_id].push(item);
        return acc;
      }, {} as Record<string, CartItem[]>);

      // Create orders for each canteen
      for (const [canteenId, canteenItems] of Object.entries(itemsByCanteen)) {
        const orderTotal = canteenItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const orderItems = canteenItems.map(item => ({
          food_item_id: item.food_item_id,
          quantity: item.quantity,
          price: item.price,
        }));

        await orderService.createOrder({
          canteen_id: canteenId,
          order_items: orderItems,
          total_amount: orderTotal + 5, // Including delivery fee
          delivery_fee: 5,
        });
      }

      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been placed and is being processed",
      });
      return true;
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "Unable to place your order. Please try again.",
        variant: "destructive",
      });
      return false;
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
