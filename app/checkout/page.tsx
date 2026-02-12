"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";

/* =========================
   Appwrite Image Helper
========================= */
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

function getAppwriteImageUrl(fileId?: string) {
  if (!fileId) return "/placeholder.svg";
  if (fileId.startsWith("http")) return fileId;
  return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/download?project=${PROJECT_ID}`;
}

/* =========================
   Checkout Component
========================= */
export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    clearCart();
    toast.success(
      "Order placed! We'll reach out via WhatsApp to confirm."
    );
  };

  /* =========================
     Order Submitted Screen
  ========================== */
  if (submitted) {
    return (
      <section className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-5xl">🎉</div>
          <h1 className="mt-4 font-display text-3xl font-semibold">
            Thank You!
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Your order has been received. We&amp;ll send you an M-Pesa STK push and confirm via WhatsApp shortly.
          </p>
          <Button className="mt-8 rounded-full" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </motion.div>
      </section>
    );
  }

  /* =========================
     Empty Cart Screen
  ========================== */
  if (items.length === 0) {
    return (
      <section className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">Your bag is empty.</p>
        <Button className="mt-4 rounded-full" asChild>
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </section>
    );
  }

  /* =========================
     Checkout Form + Summary
  ========================== */
  return (
    <section className="container py-10 md:py-16">
      <h1 className="font-display text-3xl font-semibold md:text-4xl">
        Checkout
      </h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-5">
        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-3">
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">
              Delivery Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  placeholder="Jane Muthoni"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone (M-Pesa)</Label>
                <Input
                  id="phone"
                  required
                  placeholder="0712 345 678"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Input
                id="address"
                required
                placeholder="Nairobi, Kenya"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="notes">Order Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="Any special requests..."
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <h3 className="font-display text-lg font-semibold">
              Payment — M-Pesa
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              After placing your order, you&amp;ll receive an M-Pesa STK push to
              your phone. Confirm the payment to complete your purchase.
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full rounded-full">
            Place Order — {formatPrice(totalPrice)}
          </Button>
        </form>

        {/* ================= ORDER SUMMARY ================= */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="font-display text-lg font-semibold">
              Order Summary
            </h2>

            <div className="mt-4 space-y-4">
              {items.map((item) => {
                const product = item.product;
                const productId = product.$id || product.$id;

                const imageSrc =
                  product.images && product.images.length > 0
                    ? getAppwriteImageUrl(product.images[0])
                    : "/placeholder.svg";

                return (
                  <div key={productId} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(product.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border-t border-border/50 pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
