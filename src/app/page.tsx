import { PageWrapper } from "@/components/ui/page-wrapper";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { AnimationWrapper } from "@/components/ui/animation-wrapper";

export default function Home() {
  return (
    <PageWrapper>
      <Section padding="lg" className="flex-1 flex items-center">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <AnimationWrapper delay={0.2}>
              <Heading subtitle>AURELIA Fine Dining</Heading>
            </AnimationWrapper>
            
            <AnimationWrapper delay={0.4}>
              <Heading as="h1" accent className="mt-2">
                A New Era of Culinary Artistry
              </Heading>
            </AnimationWrapper>
            
            <AnimationWrapper delay={0.6}>
              <p className="text-sm sm:text-base font-light text-zinc-400 max-w-lg mx-auto leading-relaxed font-sans">
                Experience meticulous gastronomy orchestrated for the world's most discerning palates.
              </p>
            </AnimationWrapper>

            <AnimationWrapper delay={0.8} className="pt-4 flex justify-center gap-4">
              <Button variant="primary">Reserve Table</Button>
              <Button variant="outline">Explore Menu</Button>
            </AnimationWrapper>
          </div>
        </Container>
      </Section>
    </PageWrapper>
  );
}
