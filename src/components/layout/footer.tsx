import React from "react";
import Link from "next/link";
import { Container } from "../ui/container";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gold/10 pt-20 pb-10 z-10 relative">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Logo & Philosophy */}
          <div className="space-y-4">
            <Link
              href="/"
              className="font-serif text-xl tracking-[0.2em] text-gold-gradient"
            >
              AURELIA
            </Link>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Bespoke digital architecture and booking ecosystems for Michelin-starred dining experiences.
            </p>
          </div>

          {/* Hours of Operation */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-sans font-medium text-gold">
              Hours
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-sans">
              <li>
                <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">
                  Wednesday – Sunday
                </span>
                Dinner: 5:30 PM – 10:00 PM
              </li>
              <li>
                <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">
                  Friday – Sunday
                </span>
                Lunch: 12:00 PM – 2:30 PM
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-sans font-medium text-gold">
              Location
            </h4>
            <address className="not-italic space-y-2 text-xs text-zinc-400 font-sans leading-relaxed">
              <p>128 Ebury Street, Belgravia<br />London, SW1W 9QQ</p>
              <p>
                <a
                  href="tel:+442071234567"
                  className="hover:text-gold transition-colors"
                >
                  +44 (0) 20 7123 4567
                </a>
              </p>
            </address>
          </div>

          {/* Connections */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-sans font-medium text-gold">
              Connect
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-sans">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <Link
                  href="/inquire"
                  className="hover:text-gold transition-colors"
                >
                  Inquire
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-zinc-600 font-sans uppercase tracking-wider">
            &copy; {currentYear} AURELIA. All rights reserved.
          </p>
          <div className="flex gap-6 text-[10px] text-zinc-600 font-sans uppercase tracking-wider">
            <Link href="#privacy" className="hover:text-zinc-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#terms" className="hover:text-zinc-400 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
