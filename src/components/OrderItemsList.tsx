
interface OrderItem {
  quantity: number;
  food_items: {
    name: string;
    image_url?: string;
  };
  price: number;
}

interface OrderItemsListProps {
  items: OrderItem[];
  compact?: boolean;
}

const OrderItemsList = ({ items, compact = false }: OrderItemsListProps) => {
  if (compact) {
    return (
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Order Items:</p>
        <p className="text-sm text-gray-600">
          {items.map((item, index) => (
            <span key={index}>
              {item.quantity}x {item.food_items.name}
              {index < items.length - 1 && ', '}
            </span>
          ))}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Order Items</h4>
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {item.food_items.image_url && (
              <img
                src={item.food_items.image_url}
                alt={item.food_items.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">{item.food_items.name}</p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
          </div>
          <span className="font-semibold text-green-600">₹{(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
};

export default OrderItemsList;
