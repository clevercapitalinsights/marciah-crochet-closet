"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, color?: string, size?: string) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    color?: string,
    size?: string
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Lazy-initialize state safely
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items]);

  const addItem = useCallback(
    (product: Product, color?: string, size?: string) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) =>
            i.product.$id === product.$id &&
            i.selectedColor === color &&
            i.selectedSize === size
        );

        if (existing) {
          return prev.map((i) =>
            i.product.$id === product.$id &&
            i.selectedColor === color &&
            i.selectedSize === size
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }

        return [
          ...prev,
          { product, quantity: 1, selectedColor: color, selectedSize: size },
        ];
      });

      setIsCartOpen(true);
    },
    []
  );

  const removeItem = useCallback(
    (productId: string, color?: string, size?: string) => {
      setItems((prev) =>
        prev.filter(
          (i) =>
            !(
              i.product.$id === productId &&
              i.selectedColor === color &&
              i.selectedSize === size
            )
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, color?: string, size?: string) => {
      if (quantity <= 0) {
        removeItem(productId, color, size);
        return;
      }

      setItems((prev) =>
        prev.map((i) =>
          i.product.$id === productId &&
          i.selectedColor === color &&
          i.selectedSize === size
            ? { ...i, quantity }
            : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
