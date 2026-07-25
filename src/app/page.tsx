import { PageWrapper } from "@/components/ui/page-wrapper";
import { Hero } from "@/features/landing/components/hero";
import { About } from "@/features/landing/components/about";

export default function Home() {
  return (
    <PageWrapper>
      <Hero />
      <About />
    </PageWrapper>
  );
}
