
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent leading-tight">
            Campus Eats
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl mb-10 sm:mb-12 text-orange-100 max-w-4xl mx-auto leading-relaxed font-medium">
            Your favorite campus meals, delivered fresh and fast to your doorstep
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-md mx-auto sm:max-w-none">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-xl" 
              asChild
            >
              <Link to="/canteens">Order Now</Link>
            </Button>
            {!user && (
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-xl bg-transparent" 
                asChild
              >
                <Link to="/auth">Sign Up</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
