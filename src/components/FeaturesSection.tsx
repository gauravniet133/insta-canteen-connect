
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Star, MapPin } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Get your food delivered in 15-30 minutes across campus with real-time tracking and updates"
    },
    {
      icon: Star,
      title: "Quality Food",
      description: "Fresh, delicious meals from your favorite campus canteens with our quality guarantee program"
    },
    {
      icon: MapPin,
      title: "Campus Wide",
      description: "Order from any canteen and get it delivered anywhere on campus with precise GPS location tracking"
    }
  ];

  return (
    <section>
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
          Why Choose Campus Eats?
        </h2>
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Experience the best food delivery service designed specifically for campus life
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="text-center p-8 sm:p-10 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-0 shadow-lg group"
          >
            <CardHeader className="pb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
