import type { Metadata } from "next";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { LoginForm } from "@/features/admin/components/login-form";

export const metadata: Metadata = {
  title: "Admin Console | AURELIA London",
  description: "Secure gateway for administrative control.",
};

export default function AdminLoginPage() {
  return (
    <PageWrapper>
      <Section className="flex-1 flex items-center justify-center min-h-[80vh]">
        <Container>
          <LoginForm />
        </Container>
      </Section>
    </PageWrapper>
  );
}
