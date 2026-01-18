import { Section } from "@/components/section";
import { Container } from "@/components/container";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function NetworkPage() {
  return (
    <>
      <Navigation />
      <main className="relative min-h-screen">
        <Section className="py-16">
          <Container size="lg">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
                Coming Soon
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                The Network page is under development. Check back soon for information about how the 111 Network operates, network architecture, and participation details.
              </p>
            </div>
          </Container>
        </Section>
        <Footer />
      </main>
    </>
  );
}
