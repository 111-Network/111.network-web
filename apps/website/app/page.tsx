"use client";

import { Section } from "@/components/section";
import { Container } from "@/components/container";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { TypewriterText } from "@/components/typewriter-text";
import { AnimatedSection } from "@/components/animated-section";
import { Globe } from "@/components/magicui/globe";

export default function Home() {
  const typewriterPhrases = [
    "for Everyone",
    "Without Borders",
    "Always Free",
    "Powered by people",
  ];

  return (
    <>
      <Navigation />
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

        <Footer />
      </main>
    </>
  );
}
