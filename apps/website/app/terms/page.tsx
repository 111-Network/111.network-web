import { Section } from "@/components/section";
import { Container, Navigation, Footer } from "@111-network/ui";
import Link from "next/link";
import { GlitchText } from "@/components/glitch-text";

export default function TermsPage() {
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
            {/* Development Notice */}
            <div className="mb-8 rounded-lg border-2 border-warning/50 bg-warning/10 p-6">
              <h2 className="mb-2 text-lg font-semibold text-warning">
                ⚠️ Legal Document Under Development
              </h2>
              <p className="text-sm text-muted-foreground">
                This Terms of Service and Privacy Policy document is currently under development and requires legal review before finalization. We are seeking legal assistance to ensure compliance with applicable laws and regulations. The content below represents our current understanding and intent, but should not be considered legally binding until reviewed by qualified legal counsel.
              </p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h1 className="mb-8 text-4xl font-bold">Terms of Service & Privacy Policy</h1>
              
              <p className="text-muted-foreground mb-8">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              {/* Terms of Service Section */}
              <section className="mb-12">
                <h2 className="mb-6 text-3xl font-semibold">Terms of Service</h2>

                <h3 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h3>
                <p className="mb-4">
                  By accessing or using the 111 Network website and services (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
                </p>

                <h3 className="mb-4 text-2xl font-semibold">2. Description of Service</h3>
                <p className="mb-4">
                  111 Network is a decentralized, peer-to-peer communication network designed to enable free and secure communication for everyone, even without traditional internet infrastructure. The Service allows users to send public broadcast messages and private messages through a distributed network that operates on devices, phones, and various communication methods including radio, email, and satellite tools.
                </p>
                <p className="mb-4">
                  The Service is currently in active development. Features, functionality, and availability may change without notice.
                </p>

                <h3 className="mb-4 text-2xl font-semibold">3. User Responsibilities</h3>
                <p className="mb-4">You are responsible for:</p>
                <ul className="mb-4 list-disc pl-6 space-y-2">
                  <li>Your use of the Service and any content you transmit through it</li>
                  <li>Ensuring your use complies with all applicable local, state, national, and international laws</li>
                  <li>Maintaining the security of any devices or accounts you use to access the Service</li>
                  <li>Respecting the rights and privacy of other users</li>
                  <li>Not interfering with or disrupting the Service or network operations</li>
                </ul>

                <h3 className="mb-4 text-2xl font-semibold">4. Prohibited Uses</h3>
                <p className="mb-4">You agree NOT to use the Service to:</p>
                <ul className="mb-4 list-disc pl-6 space-y-2">
                  <li>Violate any applicable laws, regulations, or third-party rights</li>
                  <li>Transmit illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable content</li>
                  <li>Engage in spam, unsolicited bulk communications, or automated message sending</li>
                  <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with any person or entity</li>
                  <li>Interfere with, disrupt, or attempt to gain unauthorized access to the Service, network, or other users' devices</li>
                  <li>Transmit viruses, malware, or any other malicious code</li>
                  <li>Collect or harvest information about other users without their consent</li>
                  <li>Use the Service for commercial purposes without explicit authorization</li>
                  <li>Violate any intellectual property rights</li>
                </ul>

                <h3 className="mb-4 text-2xl font-semibold">5. Limitation of Liability</h3>
                <p className="mb-4">
                  <strong>YOU USE THE SERVICE AT YOUR OWN RISK.</strong> The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied.
                </p>
                <p className="mb-4">
                  To the maximum extent permitted by law, 111 Network, its developers, contributors, and affiliates (collectively, "we" or "us") shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                </p>
                <ul className="mb-4 list-disc pl-6 space-y-2">
                  <li>Your use or inability to use the Service</li>
                  <li>Any unauthorized access to or use of our servers or any personal information stored therein</li>
                  <li>Any interruption or cessation of transmission to or from the Service</li>
                  <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Service</li>
                  <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, transmitted, or otherwise made available through the Service</li>
                  <li>User-generated content, including but not limited to messages, broadcasts, or communications transmitted through the Service</li>
                </ul>

                <h3 className="mb-4 text-2xl font-semibold">6. User-Generated Content</h3>
                <p className="mb-4">
                  The Service allows users to transmit messages and content through the network. We do not control, monitor, or review user-generated content before it is transmitted. We are not responsible for any content transmitted by users through the Service.
                </p>
                <p className="mb-4">
                  <strong>We are not liable for:</strong>
                </p>
                <ul className="mb-4 list-disc pl-6 space-y-2">
                  <li>Illegal content transmitted by users</li>
                  <li>Harassment, abuse, or harmful communications between users</li>
                  <li>Spam or unsolicited messages</li>
                  <li>Content that violates intellectual property rights</li>
                  <li>Any misuse of the Service by users</li>
                  <li>Consequences arising from user-generated content</li>
                </ul>
                <p className="mb-4">
                  Users are solely responsible for the content they transmit. If you encounter illegal or harmful content, please report it through appropriate legal channels. We reserve the right, but not the obligation, to investigate and take appropriate action in response to reports of misuse.
                </p>

                <h3 className="mb-4 text-2xl font-semibold">7. Intellectual Property</h3>
                <p className="mb-4">
                  The Service, including its original content, features, and functionality, is owned by 111 Network and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. The Service is open source, and specific licensing terms apply as set forth in the project's license file.
                </p>
                <p className="mb-4">
                  You retain ownership of any content you create and transmit through the Service. By using the Service, you grant us a limited, non-exclusive license to process and transmit your content as necessary to provide the Service.
                </p>

                <h3 className="mb-4 text-2xl font-semibold">8. Termination</h3>
                <p className="mb-4">
                  We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will cease immediately.
                </p>
                <p className="mb-4">
                  You may discontinue use of the Service at any time by simply ceasing to use it.
                </p>

                <h3 className="mb-4 text-2xl font-semibold">9. Changes to Terms</h3>
                <p className="mb-4">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
              </section>

              {/* Privacy Policy Section */}
              <section className="mb-12">
                <h2 className="mb-6 text-3xl font-semibold">Privacy Policy</h2>

                <h3 className="mb-4 text-2xl font-semibold">1. Information We Collect</h3>
                <p className="mb-4">
                  <strong>Minimal Data Collection:</strong> 111 Network is designed with privacy in mind. We aim to collect as little information as possible.
                </p>
                <p className="mb-4">We may collect:</p>
                <ul className="mb-4 list-disc pl-6 space-y-2">
                  <li><strong>Website Usage Data:</strong> Basic analytics about how visitors use our website (pages visited, time spent, etc.)</li>
                  <li><strong>Technical Information:</strong> Browser type, device information, IP address (for security and analytics purposes)</li>
                  <li><strong>Voluntary Information:</strong> Information you voluntarily provide, such as email addresses if you choose to register for updates or contribute to the project</li>
                </ul>
                <p className="mb-4">
                  <strong>Network Messages:</strong> Messages transmitted through the 111 Network are designed to be decentralized. We do not store or monitor the content of messages transmitted through the network. Messages are processed and forwarded by the network itself, not by our servers.
                </p>

                <h3 className="mb-4 text-2xl font-semibold">2. How We Use Information</h3>
                <p className="mb-4">We use collected information to:</p>
                <ul className="mb-4 list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve the Service</li>
                  <li>Understand how visitors use our website</li>
                  <li>Respond to inquiries and provide support</li>
                  <li>Ensure security and prevent abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h3 className="mb-4 text-2xl font-semibold">3. Data Security</h3>
                <p className="mb-4">
                  We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                </p>

                <h3 className="mb-4 text-2xl font-semibold">4. Third-Party Services</h3>
                <p className="mb-4">
                  Our website may use third-party services for analytics, hosting, and other functions. These services have their own privacy policies governing the collection and use of information. We are not responsible for the privacy practices of third-party services.
                </p>
                <p className="mb-4">
                  The 111 Network itself is designed to operate independently of third-party services. Messages transmitted through the network do not rely on third-party servers.
                </p>

                <h3 className="mb-4 text-2xl font-semibold">5. Your Privacy Rights</h3>
                <p className="mb-4">You have the right to:</p>
                <ul className="mb-4 list-disc pl-6 space-y-2">
                  <li>Access information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Object to processing of your information</li>
                  <li>Request restriction of processing</li>
                  <li>Data portability (where applicable)</li>
                </ul>
                <p className="mb-4">
                  To exercise these rights, please contact us through the project's GitHub repository or official communication channels.
                </p>

                <h3 className="mb-4 text-2xl font-semibold">6. Children's Privacy</h3>
                <p className="mb-4">
                  Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>

                <h3 className="mb-4 text-2xl font-semibold">7. International Data Transfers</h3>
                <p className="mb-4">
                  The Service may be accessed from anywhere in the world. Information may be transferred to and processed in countries other than your country of residence. By using the Service, you consent to the transfer of your information to these countries.
                </p>

                <h3 className="mb-4 text-2xl font-semibold">8. Changes to Privacy Policy</h3>
                <p className="mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              {/* Contact Section */}
              <section className="mb-12">
                <h2 className="mb-6 text-3xl font-semibold">Contact Us</h2>
                <p className="mb-4">
                  If you have questions about these Terms of Service or Privacy Policy, please contact us through:
                </p>
                <ul className="mb-4 list-disc pl-6 space-y-2">
                  <li>GitHub: <a href="https://github.com/111-Network" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://github.com/111-Network</a></li>
                  <li>Project Website: <Link href="/" className="text-primary hover:underline">111 Network</Link></li>
                </ul>
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
