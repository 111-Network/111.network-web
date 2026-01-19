import { Section } from "@/components/section";
import { Container, Navigation, Footer } from "@111-network/ui";
import { GlitchText } from "@/components/glitch-text";
import Link from "next/link";

export default function ResourcesPage() {
  return (
    <>
      <Navigation
        logo={
          <Link href="/" className="block">
            <GlitchText
              className="font-mono text-xl font-semibold"
              intensity="medium"
              randomTiming={true}
            >
              111 Network
            </GlitchText>
          </Link>
        }
        items={[
          { label: "Home", href: "/" },
          { label: "Network", href: "/network" },
          { label: "About", href: "/about" },
          { label: "Resources", href: "/resources" },
        ]}
        ctaItems={
          <>
            <Link
              href="/broadcast"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-error pulse-glow flex-shrink-0"></span>
              <span className="flex items-center justify-center">Broadcast</span>
            </Link>
            <a
              href="https://github.com/111-Network"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <GlitchText intensity="low">Get Involved</GlitchText>
            </a>
          </>
        }
      />
      <main className="relative min-h-screen">
        <Section className="py-16">
          <Container size="lg">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
                Coming Soon
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                The Resources page is under development. Check back soon for documentation, development guides, community resources, and getting started materials.
              </p>
            </div>
          </Container>
        </Section>
        <Footer
          copyright={`© ${new Date().getFullYear()} 111 Network. Open Source.`}
          links={[
            { label: "Terms", href: "/terms" },
          ]}
          showThemeToggle={true}
        >
          <p className="text-sm text-muted-foreground">
            Status: <span className="font-mono text-warning">In Development</span>
          </p>
        </Footer>
      </main>
    </>
  );
}
