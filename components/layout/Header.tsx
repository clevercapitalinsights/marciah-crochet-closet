"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart, Menu, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUser } from "@/hooks/useUser";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, loading, isAdmin, signOut } = useUser();
  const [mounted, setMounted] = useState(true);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="px-6 flex h-16 items-center justify-between md:h-20">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <nav className="mt-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`font-display text-xl transition-colors hover:text-primary ${
                    pathname === link.to ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-xl transition-colors hover:text-primary text-muted-foreground"
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="font-display text-xl font-semibold tracking-tight md:text-2xl">
          Marciah Crochet Closet
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium tracking-wide transition-colors hover:text-primary"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {!loading && (
            user ? (
              <Button variant="ghost" size="icon" aria-label="Sign out" onClick={signOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" aria-label="Sign in">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )
          )}

          <Link href="/shop?wishlist=true">
            <Button variant="ghost" size="icon" className="relative" aria-label="Wishlist">
              <Heart
                className={`h-5 w-5 ${mounted && wishlist.length > 0 ? "fill-accent text-accent" : ""}`}
              />
              {mounted && wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {wishlist.length}
                </span>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Cart"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <AnimatePresence>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                >
                  {totalItems}
                </motion.span>
              </AnimatePresence>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
