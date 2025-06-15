
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, ChefHat, Package, Truck } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
  showIcon?: boolean;
}

const OrderStatusBadge = ({ status, showIcon = true }: OrderStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4" />,
          label: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'confirmed':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Confirmed',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'preparing':
        return {
          icon: <ChefHat className="h-4 w-4" />,
          label: 'Preparing',
          className: 'bg-orange-100 text-orange-800 border-orange-200'
        };
      case 'ready':
        return {
          icon: <Package className="h-4 w-4" />,
          label: 'Ready',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'completed':
        return {
          icon: <Truck className="h-4 w-4" />,
          label: 'Completed',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      case 'cancelled':
        return {
          icon: <Clock className="h-4 w-4" />,
          label: 'Cancelled',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          label: status.charAt(0).toUpperCase() + status.slice(1),
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={`${config.className} border font-medium px-3 py-1 flex items-center gap-1`}>
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
};

export default OrderStatusBadge;
