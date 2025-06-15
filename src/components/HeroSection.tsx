
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
            Campus Eats
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-10 text-orange-100 max-w-3xl mx-auto leading-relaxed px-4">
            Your favorite campus meals, delivered fresh and fast to your doorstep
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
              asChild
            >
              <Link to="/canteens">Order Now</Link>
            </Button>
            {!user && (
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
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
