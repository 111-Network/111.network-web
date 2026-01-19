"use client";

import { Section } from "@/components/section";
import { Container, Navigation, Footer } from "@111-network/ui";
import { TypewriterText } from "@/components/typewriter-text";
import { AnimatedSection } from "@/components/animated-section";
import { Globe } from "@/components/magicui/globe";
import { GlitchText } from "@/components/glitch-text";
import Link from "next/link";
import { getMapAppUrl } from "@/lib/map-url";

export default function Home() {
  const typewriterPhrases = [
    "for Everyone",
    "Without Borders",
    "Always Free",
    "Powered by people",
  ];

  return (
    <>
      <Navigation
        logo={
          <Link href="/" className="block font-mono">
            <GlitchText
              className="text-xl font-semibold"
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
            <a
              href={`${getMapAppUrl()}#broadcast`}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              style={{ minHeight: '2.5rem' }}
            >
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-error pulse-glow flex-shrink-0"></span>
              <span>Broadcast</span>
            </a>
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
        <Section fullHeight className="relative flex items-center justify-center">
          <div className="relative z-10 w-full">
            <Container size="lg" className="relative">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
                {/* Left Side: Text Container - Vertically Centered */}
                <div className="flex-1 flex flex-col justify-center">
                  <AnimatedSection animation="fade-in-up" delay={100}>
                    <div className="flex flex-col space-y-6 text-left">
                      {/* First Line: "one network" */}
                      <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
                        one network
                      </h1>

                      {/* Second Line: Typewriter Text */}
                      <div className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl font-mono">
                        <TypewriterText phrases={typewriterPhrases} />
                      </div>

                      {/* Third Line: "even without internet" */}
                      <p className="text-xl font-medium text-muted-foreground sm:text-2xl md:text-3xl">
                        even without internet
                      </p>
                    </div>
                  </AnimatedSection>
                </div>

                {/* Right Side: Globe Container - Fully Contained */}
                <div className="flex-1 w-full lg:w-auto flex items-center justify-center">
                  <div className="w-full max-w-full lg:max-w-[500px] flex items-center justify-center overflow-hidden">
                    <Globe />
                  </div>
                </div>
              </div>
            </Container>
          </div>
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
