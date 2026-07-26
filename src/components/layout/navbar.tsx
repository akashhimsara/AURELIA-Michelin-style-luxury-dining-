"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Container } from "../ui/container";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Suites", href: "/rooms" },
    { label: "Gastronomy", href: "/#menu" },
    { label: "Private Dining", href: "/private-dining" },
    { label: "Wellness", href: "/spa" },
    { label: "Gallery", href: "/gallery" },
    { label: "Events", href: "/events" },
    { label: "Offers", href: "/offers" },
    { label: "Admin Console", href: "/admin" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-lg border-b border-gold/10 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <Container className="flex items-center justify-between">
        {/* Brand Identity Logo */}
        <Link
          href="/"
          className="font-serif text-xl sm:text-2xl font-light tracking-[0.2em] text-gold-gradient"
        >
          AURELIA
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-zinc-400 hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Reserve Trigger */}
        <div className="hidden md:block">
          <Link href="/reserve">
            <Button variant="outline" size="sm">
              Reserve
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-zinc-400 hover:text-gold focus:outline-none transition-colors"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed inset-x-0 top-[73px] bg-black/95 backdrop-blur-lg border-b border-gold/10 transition-all duration-500 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center py-10 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-zinc-300 hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/reserve">
            <Button
              variant="primary"
              size="sm"
              className="w-[200px] mt-4"
              onClick={() => setIsOpen(false)}
            >
              Reserve
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
