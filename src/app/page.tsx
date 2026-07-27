import { PageWrapper } from "@/components/ui/page-wrapper";
import { Hero } from "@/features/landing/components/hero";
import { About } from "@/features/landing/components/about";
import { FeaturedMenu } from "@/features/menu/components/featured-menu";
import { BookingWidget } from "@/features/accommodation/components/booking-widget";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <PageWrapper>
      <Hero />
      
      {/* Immersive Overlay Booking Widget intersecting Hero & About sections */}
      <div className="relative -mt-12 z-30 px-4 max-w-6xl mx-auto">
        <BookingWidget />
      </div>

      <About />
      <FeaturedMenu />
    </PageWrapper>
  );
}
