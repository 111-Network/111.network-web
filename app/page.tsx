import { Section } from "@/components/section";
import { Container } from "@/components/container";
import { Navigation } from "@/components/navigation";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedSection } from "@/components/animated-section";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="relative min-h-screen">
        <GradientBackground variant="mesh" intensity="light" />
        
        <Section fullHeight className="flex items-center justify-center">
          <Container size="lg" className="relative z-10">
            <AnimatedSection animation="fade-in-up" delay={100}>
              <div className="mx-auto max-w-4xl text-center">
                {/* Logo/Brand */}
                <div className="mb-8">
                  <h1 className="font-mono text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl">
                    <span className="bg-gradient-primary bg-clip-text text-transparent">
                      111
                    </span>
                    <span className="text-foreground"> Network</span>
                  </h1>
                </div>

                {/* Tagline */}
                <AnimatedSection animation="fade-in-up" delay={200}>
                  <p className="mb-6 text-xl text-muted-foreground sm:text-2xl">
                    Free, Secure Communication for Everyone
                  </p>
                </AnimatedSection>

                {/* Main Message */}
                <AnimatedSection animation="fade-in-up" delay={300}>
                  <div className="mb-12 space-y-4">
                    <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
                      Coming Soon
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
                      A global message network that doesn't rely on companies, governments, or infrastructure.
                      <br />
                      <span className="font-medium text-foreground">
                        It runs on people, not servers.
                      </span>
                    </p>
                  </div>
                </AnimatedSection>

                {/* Key Features */}
                <AnimatedSection animation="fade-in-up" delay={400}>
                  <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
                      <div className="mb-3 text-2xl">🌍</div>
                      <h3 className="mb-2 font-semibold">Global Reach</h3>
                      <p className="text-sm text-muted-foreground">
                        Messages travel across the world map, visible to everyone
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
                      <div className="mb-3 text-2xl">🔒</div>
                      <h3 className="mb-2 font-semibold">Private & Secure</h3>
                      <p className="text-sm text-muted-foreground">
                        End-to-end encryption for private conversations
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
                      <div className="mb-3 text-2xl">📡</div>
                      <h3 className="mb-2 font-semibold">Works Offline</h3>
                      <p className="text-sm text-muted-foreground">
                        Messages hop between devices, even without internet
                      </p>
                    </div>
                  </div>
                </AnimatedSection>

                {/* CTA */}
                <AnimatedSection animation="fade-in-up" delay={500}>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Join us in building a decentralized communication network
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                      <a
                        href="https://github.com/111-Network/111.network-website"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        View on GitHub
                      </a>
                      <a
                        href="/docs"
                        className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        Documentation
                      </a>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </AnimatedSection>
          </Container>
        </Section>

        {/* Footer */}
        <footer className="border-t border-border bg-background/50 py-8 backdrop-blur-sm">
          <Container size="lg">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} 111 Network. Open Source.
              </p>
              <p className="text-sm text-muted-foreground">
                Status: <span className="font-mono text-warning">In Development</span>
              </p>
            </div>
          </Container>
        </footer>
      </main>
    </>
  );
}
