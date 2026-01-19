import { Section } from "@/components/section";
import { Container, Navigation, Footer } from "@111-network/ui";
import Link from "next/link";
import { GlitchText } from "@/components/glitch-text";
import { getMapAppUrl } from "@/lib/map-url";

export default function AboutPage() {
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
            <a
              href={`${getMapAppUrl()}#broadcast`}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-error pulse-glow flex-shrink-0"></span>
              <span className="flex items-center justify-center">Broadcast</span>
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
        <Section className="py-16">
          <Container size="lg">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h1 className="mb-8 text-4xl font-bold">About 111 Network</h1>

              <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold">Our Mission</h2>
                <p className="mb-4 text-lg">
                  We believe <strong>everyone deserves a way to speak, share, and connect</strong>, no matter where they are, what they have, or whether the internet is working.
                </p>
                <p className="mb-4 text-lg">
                  This project is building a <strong>global message network</strong> that doesn't rely on companies, governments, or infrastructure. It runs on <strong>people, not servers</strong>. It works with phones, small devices, radios, and anything else that can carry a message.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-3xl font-semibold">How It Works</h2>

                <div className="mb-8">
                  <h3 className="mb-3 text-2xl font-semibold">1. A Daily Shout to the World</h3>
                  <p className="mb-3">
                    Each person can send <strong>limited public messages per day</strong>.
                  </p>
                  <p className="mb-3">
                    You choose what to say and roughly where you are (exact or general). That message shows up on a <strong>world map</strong> for everyone to see.
                  </p>
                  <p>
                    It's like a pin on a global bulletin board — <strong>your voice, shared freely</strong>.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="mb-3 text-2xl font-semibold">2. Private, Secure Conversations</h3>
                  <p className="mb-3">
                    You can also message people <strong>directly</strong>.
                  </p>
                  <ul className="mb-3 list-disc pl-6 space-y-2">
                    <li>Only you and the other person can read what's sent. <strong>No one else!</strong></li>
                    <li>Messages take a smart route, hopping between nearby phones or small devices until they find a way to the intended user.</li>
                    <li>Messages arrive eventually. <strong>The more users in the network, the faster and wider the range!</strong></li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="mb-3 text-2xl font-semibold">3. Works Without the Internet</h3>
                  <p className="mb-3">
                    <strong>No bars? No Wi-Fi? No problem.</strong>
                  </p>
                  <p className="mb-3">
                    Messages can travel through phones, laptops, plug-in devices, even homemade tools.
                  </p>
                  <p className="mb-3">
                    If someone nearby is connected to the internet, they help move messages for others too.
                  </p>
                  <p>
                    Delivery might take minutes or hours, even days — but they keep traveling until they reach their owner or the world map.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="mb-3 text-2xl font-semibold">4. Use It Anonymously — Or with Your Name</h3>
                  <p className="mb-3">
                    You don't need to sign up. <strong>Just open the app and go.</strong>
                  </p>
                  <p className="mb-3">
                    Want to find your friends later? You can add an email or phone number anytime to reconnect.
                  </p>
                  <p>
                    <strong>You stay in control</strong> of your identity and privacy.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="mb-3 text-2xl font-semibold">5. Sends Messages Any Way It Can</h3>
                  <p className="mb-3">
                    This network is <strong>smart and flexible</strong>.
                  </p>
                  <p className="mb-3">Messages are packed so they can travel via:</p>
                  <ul className="mb-3 list-disc pl-6 space-y-2">
                    <li>📻 Radios</li>
                    <li>📱 Phones</li>
                    <li>📧 Email</li>
                    <li>🛰️ Satellite tools (like Garmin or Starlink)</li>
                    <li>More to come later</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="mb-3 text-2xl font-semibold">6. Optional Little Devices</h3>
                  <p className="mb-3">
                    To grow the network, people can use <strong>tiny gadgets</strong>:
                  </p>
                  <ul className="mb-3 list-disc pl-6 space-y-2">
                    <li>A plug that goes into a phone</li>
                    <li>A solar-powered box on a roof</li>
                    <li>Anyone can make a device!</li>
                  </ul>
                  <p className="mb-3">
                    These boost signal range, connect distant areas, or keep messages flowing during a blackout.
                  </p>
                  <p>
                    They're <strong>optional, cheap, and help everyone</strong>.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold">Anyone Can Join!</h2>
                <p className="mb-4 text-lg">
                  A global message system:
                </p>
                <ul className="mb-4 list-disc pl-6 space-y-2">
                  <li>✅ Built by <strong>people, not providers</strong></li>
                  <li>✅ Keeps going when the internet doesn't</li>
                  <li>✅ <strong>Private, secure, and open to all</strong></li>
                </ul>
                <p className="text-lg">
                  <strong>No matter who you are or where you are — you have a voice. This network makes sure it's heard.</strong>
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold">Get Involved</h2>
                <p className="mb-4">
                  This is an open source project. We welcome contributions, ideas, and participation from anyone who shares our vision.
                </p>
                <p>
                  Visit our <a href="https://github.com/111-Network" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub repository</a> to learn more, contribute, or get involved.
                </p>
              </section>
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
