import { PageWrapper } from "@/components/ui/page-wrapper";
import { Hero } from "@/features/landing/components/hero";
import { About } from "@/features/landing/components/about";
import { FeaturedMenu } from "@/features/menu/components/featured-menu";

export default function Home() {
  return (
    <PageWrapper>
      <Hero />
      <About />
      <FeaturedMenu />
    </PageWrapper>
  );
}
