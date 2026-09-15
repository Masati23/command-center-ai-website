import type { Metadata } from "next";
import Image from "next/image";
import { LogoFull, LogoMark } from "@/components/Logo";
import { GlassCard, Badge, Section } from "@/components/ui";
import { TrackedAnchor } from "@/components/connect/TrackedLink";
import QrShowcase from "@/components/connect/QrShowcase";
import { CARD_CONTACT, CONNECT_URL } from "@/lib/connect";

// Standalone digital business card -- the NFC-tap / QR-scan landing page.
// Deliberately isolated from the rest of the marketing site: its own
// folder, its own metadata, no imports from checkout/admin/chatbot code.
// It still inherits the shared root layout (fonts, global visitor
// tracking, chat widget) automatically since Next.js layouts nest.
export const metadata: Metadata = {
    title: "Alfred Acosta -- Command Center AI",
    description: CARD_CONTACT.description,
    alternates: { canonical: CONNECT_URL },
    // Not meant to rank in search -- this page exists to be reached by a
    // direct NFC tap or QR scan, not organic discovery. Keeping it out of
    // the sitemap (untouched) does most of that already; this is the
    // belt-and-suspenders version of the same intent.
    robots: { index: false, follow: true },
    openGraph: {
          title: "Alfred Acosta -- Command Center AI",
          description: CARD_CONTACT.description,
          url: CONNECT_URL,
    },
};

export default function ConnectPage() {
    return (
          <main className="min-h-screen bg-navy-900">
                <Section className="py-14 sm:py-20">
                        <div className="mx-auto flex max-w-xl flex-col items-center gap-8">
                                  <LogoFull className="h-12 w-auto" />
                        
                                  <GlassCard className="w-full p-6 sm:p-8" hover={false}>
                                              <div className="flex flex-col items-center gap-4 text-center">
                                                            <LogoMark className="h-16 w-16" />
                                                            <div>
                                                                            <h1 className="text-2xl font-semibold text-white sm:text-3xl">{CARD_CONTACT.fullName}</h1>
                                                                            <p className="mt-1 text-sm font-medium text-electric-400">
                                                                              {CARD_CONTACT.title} &middot; {CARD_CONTACT.org}
                                                                            </p>
                                                            </div>
                                                            <p className="text-balance text-sm leading-relaxed text-silver-400 sm:text-base">
                                                              {CARD_CONTACT.description}
                                                            </p>
                                              </div>
                                  
                                    {/* Primary actions */}
                                              <div className="mt-8 flex flex-col gap-3">
                                                            <TrackedAnchor
                                                                              action="save_contact"
                                                                              href="/api/connect/vcard"
                                                                              download
                                                                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-electric-500 to-electric-700 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
                                                                            >
                                                                            Save Contact
                                                            </TrackedAnchor>
                                              
                                                            <TrackedAnchor
                                                                              action="email"
                                                                              href={`mailto:${CARD_CONTACT.email}`}
                                                                              className="inline-flex items-center justify-center gap-2 rounded-xl glass px-6 py-3.5 text-sm font-semibold text-silver-200 transition-all duration-200 hover:border-electric-500/40 hover:text-white hover:-translate-y-0.5"
                                                                            >
                                                                            Email Me
                                                            </TrackedAnchor>
                                              
                                                            <TrackedAnchor
                                                                              action="linkedin"
                                                                              href={CARD_CONTACT.linkedinUrl}
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              className="inline-flex items-center justify-center gap-2 rounded-xl glass px-6 py-3.5 text-sm font-semibold text-silver-200 transition-all duration-200 hover:border-electric-500/40 hover:text-white hover:-translate-y-0.5"
                                                                            >
                                                                            Connect on LinkedIn
                                                            </TrackedAnchor>
                                              
                                                            <TrackedAnchor
                                                                              action="command_center_ai"
                                                                              href={CARD_CONTACT.website}
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              className="flex flex-col items-center gap-0.5 rounded-xl glass px-6 py-3.5 text-center transition-all duration-200 hover:border-electric-500/40 hover:-translate-y-0.5"
                                                                            >
                                                                            <span className="text-sm font-semibold text-silver-200 group-hover:text-white">
                                                                                              Command Center AI
                                                                            </span>
                                                                            <span className="text-xs text-silver-500">Need an AI system built for your business?</span>
                                                            </TrackedAnchor>
                                              
                                                            <TrackedAnchor
                                                                              action="academy"
                                                                              href={CARD_CONTACT.academyUrl}
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              className="flex flex-col items-center gap-0.5 rounded-xl glass px-6 py-3.5 text-center transition-all duration-200 hover:border-electric-500/40 hover:-translate-y-0.5"
                                                                            >
                                                                            <span className="text-sm font-semibold text-silver-200">Command Center AI Academy</span>
                                                                            <span className="text-xs text-silver-500">Want to learn how to build AI systems yourself?</span>
                                                            </TrackedAnchor>
                                              </div>
                                  </GlassCard>
                        
                          {/* QR block */}
                                  <GlassCard className="w-full p-6 sm:p-8" hover={false}>
                                              <div className="flex flex-col items-center gap-4 text-center">
                                                            <Badge>Scan to connect</Badge>
                                                            <div className="relative h-48 w-48 rounded-xl bg-white p-3 sm:h-56 sm:w-56">
                                                                            <Image
                                                                                                src="/api/connect/qrcode/png"
                                                                                                alt="QR code linking to this Command Center AI digital business card"
                                                                                                fill
                                                                                                sizes="224px"
                                                                                                className="object-contain p-2"
                                                                                                priority
                                                                                              />
                                                            </div>
                                                            <p className="max-w-xs text-xs text-silver-500">
                                                                            Scans to <span className="text-silver-300">{CONNECT_URL}</span> -- this exact page. NFC tags will be
                                                                            programmed to the same permanent link.
                                                            </p>
                                              
                                                            <QrShowcase />
                                              
                                                            <div className="mt-2 flex items-center gap-4 text-xs">
                                                                            <a
                                                                                                href="/api/connect/qrcode/png"
                                                                                                download="command-center-ai-connect-qr.png"
                                                                                                className="text-silver-500 underline hover:text-silver-300"
                                                                                              >
                                                                                              Download PNG
                                                                            </a>
                                                                            <a
                                                                                                href="/api/connect/qrcode/svg"
                                                                                                download="command-center-ai-connect-qr.svg"
                                                                                                className="text-silver-500 underline hover:text-silver-300"
                                                                                              >
                                                                                              Download SVG
                                                                            </a>
                                                            </div>
                                              </div>
                                  </GlassCard>
                        
                                  <p className="text-center text-xs text-silver-500">
                                              &copy; {new Date().getFullYear()} Command Center AI
                                  </p>
                        </div>
                </Section>
          </main>
      );
}
