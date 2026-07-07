import React from "react";
import { LogoFull } from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <LogoFull markClassName="h-10 w-10" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-silver-400">
              We Build AI Command Centers for Businesses.
            </p>
            <p className="mt-1 text-sm font-medium tracking-wide text-electric-400">
              Operate Smarter. Scale Faster.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Navigate</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-silver-400">
              <li><a href="#home" className="hover:text-white">Home</a></li>
              <li><a href="#solutions" className="hover:text-white">Solutions</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="#about" className="hover:text-white">About</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Contact</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-silver-400">
              <li>Alfred Joe Acosta</li>
              <li>Founder &amp; Chief AI Systems Architect</li>
              <li>
                <a href="tel:+18327441631" className="hover:text-white">832-744-1631</a>
              </li>
              <li>
                <a href="mailto:alfred@commandcenterai.net" className="hover:text-white">
                  alfred@commandcenterai.net
                </a>
              </li>
              <li>Houston, Texas</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-silver-500">
            &copy; {year} Command Center AI. All rights reserved.
          </p>
          <p className="text-xs text-silver-500">Houston, Texas</p>
        </div>
      </div>
    </footer>
  );
}
