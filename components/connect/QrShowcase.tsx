"use client";

import { useState } from "react";
import Image from "next/image";

// Dedicated "hold this up at a networking event" view: a big, high-contrast
// fullscreen QR the visitor scans off Alfred's phone screen. Kept as its
// own component (rather than just making the inline QR big) so the inline
// page layout can stay a normal card while this stays purpose-built for
// screen-to-camera scanning -- max brightness contrast, no surrounding UI
// competing for attention, one tap to exit.
export default function QrShowcase() {
    const [open, setOpen] = useState(false);

  return (
        <>
              <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-electric-500 to-electric-700 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-400/60"
                      >
                      Show My QR
              </button>
        
          {open && (
                  <div
                              role="dialog"
                              aria-modal="true"
                              aria-label="Command Center AI digital business card QR code, full screen"
                              className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white p-6"
                              onClick={() => setOpen(false)}
                            >
                            <div className="relative h-[70vmin] w-[70vmin] max-h-[520px] max-w-[520px]">
                                        <Image
                                                        src="/api/connect/qrcode/png"
                                                        alt="QR code linking to the Command Center AI digital business card"
                                                        fill
                                                        sizes="70vmin"
                                                        priority
                                                        className="object-contain"
                                                      />
                            </div>
                            <p className="text-center text-sm font-medium text-navy-900">
                                        Scan to open Alfred Acosta&rsquo;s Command Center AI card
                            </p>
                            <button
                                          type="button"
                                          onClick={() => setOpen(false)}
                                          className="rounded-full border border-navy-900/15 px-5 py-2 text-sm font-medium text-navy-900"
                                        >
                                        Close
                            </button>
                  </div>
              )}
        </>
      );
}
