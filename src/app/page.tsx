import { HeroSection } from '@/components/storefront/HeroSection';
import { CategoryGrid } from '@/components/storefront/CategoryGrid';
import { FeaturedProducts } from '@/components/storefront/FeaturedProducts';
import { CraftsmanshipSection } from '@/components/storefront/CraftsmanshipSection';
import { TestimonialsSection } from '@/components/storefront/TestimonialsSection';
import { InstagramTikTokFeed } from '@/components/storefront/InstagramTikTokFeed';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <CraftsmanshipSection />
      <TestimonialsSection />
      <InstagramTikTokFeed />
    </div>
  );
}
