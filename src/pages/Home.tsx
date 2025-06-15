
import { useAuth } from '@/hooks/useAuth';
import OrderTracking from '@/components/OrderTracking';
import HeroSection from '@/components/HeroSection';
import FeaturedCanteens from '@/components/FeaturedCanteens';
import FeaturesSection from '@/components/FeaturesSection';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Order Tracking Section - Only show for authenticated users */}
        {user && (
          <div className="mb-16 sm:mb-20">
            <OrderTracking />
          </div>
        )}

        <FeaturedCanteens />
        
        <div className="mt-16 sm:mt-20">
          <FeaturesSection />
        </div>
      </div>
    </div>
  );
};

export default Home;
