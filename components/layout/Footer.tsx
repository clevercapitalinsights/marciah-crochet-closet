"use client";

import Link from "next/link";
import { Instagram, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing! 🎉");
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="px-8 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-semibold">Marciah Crochet Closet</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Handmade crochet pieces crafted with love by Marciah. Every stitch tells a story.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Instagram className="h-4 w-4" />
                </Button>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
                  </svg>
                </Button>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h4>
            <nav className="mt-4 flex flex-col gap-2.5">
              {[
                { href: "/shop", label: "Shop All" },
                { href: "/about", label: "Our Story" },
                { href: "/contact", label: "Contact Us" },
                { href: "/register", label: "Register" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/70 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Stay in the Loop
            </h4>
            <p className="mt-3 text-sm text-muted-foreground">
              Get notified about new drops, behind-the-scenes peeks & exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 bg-background"
              />
              <Button type="submit" size="icon" className="h-10 w-10 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Marciah Crochet Closet. All rights reserved. Made with ❤️ by Leeroy Mokua.
        </div>
      </div>
    </footer>
  );
}
