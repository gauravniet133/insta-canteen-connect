
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Star, MapPin } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Get your food delivered in 15-30 minutes across campus with real-time tracking"
    },
    {
      icon: Star,
      title: "Quality Food",
      description: "Fresh, delicious meals from your favorite campus canteens with quality guarantee"
    },
    {
      icon: MapPin,
      title: "Campus Wide",
      description: "Order from any canteen and get it delivered anywhere on campus with precise location tracking"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      {features.map((feature, index) => (
        <Card key={index} className="text-center p-6 sm:p-8 hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeaturesSection;
