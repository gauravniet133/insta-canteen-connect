
interface OrderProgressBarProps {
  currentStatus: string;
}

const OrderProgressBar = ({ currentStatus }: OrderProgressBarProps) => {
  const steps = ['pending', 'confirmed', 'preparing', 'ready'];
  const currentStepIndex = steps.indexOf(currentStatus);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs text-gray-500 font-medium">
        <span>Pending</span>
        <span>Confirmed</span>
        <span>Preparing</span>
        <span>Ready</span>
      </div>
      <div className="flex space-x-1">
        {steps.map((step, index) => {
          const isActive = currentStepIndex >= index;
          const isCurrent = currentStepIndex === index;
          
          return (
            <div
              key={step}
              className={`flex-1 h-3 rounded-full transition-all duration-500 ${
                isActive
                  ? isCurrent 
                    ? 'bg-orange-500 animate-pulse' 
                    : 'bg-green-500'
                  : 'bg-gray-200'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OrderProgressBar;
