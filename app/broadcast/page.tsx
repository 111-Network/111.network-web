import { Section } from "@/components/section";
import { Container } from "@/components/container";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function BroadcastPage() {
  return (
    <>
      <Navigation />
      <main className="relative min-h-screen">
        <Section className="py-16">
          <Container size="lg">
            {/* Blank page - to be developed next */}
          </Container>
        </Section>
        <Footer />
      </main>
    </>
  );
}
