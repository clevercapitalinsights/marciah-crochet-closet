"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load wishlist from localStorage (client only)
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = localStorage.getItem("wishlist");
        if (stored) setWishlist(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse wishlist from localStorage:", err);
      }
    };
    loadWishlist();
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch (err) {
      console.error("Failed to save wishlist to localStorage:", err);
    }
  }, [wishlist]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isWishlisted = (id: string) => wishlist.includes(id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
