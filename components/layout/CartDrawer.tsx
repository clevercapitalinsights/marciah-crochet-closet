"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================= */
/* Appwrite Image Config         */
/* ============================= */

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

function getImageUrl(fileOrUrl: string) {
  if (!fileOrUrl) return "/placeholder.svg";

  // If already full URL
  if (fileOrUrl.startsWith("http")) return fileOrUrl;

  // Otherwise assume it's Appwrite fileId
  return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileOrUrl}/download?project=${PROJECT_ID}`;
}

/* ============================= */

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    totalPrice,
  } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="px-2 flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-display">
            <ShoppingBag className="h-5 w-5" />
            Your Bag
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">Your bag is empty</p>
            <Button
              variant="outline"
              onClick={() => setIsCartOpen(false)}
              asChild
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* ================= ITEMS ================= */}
            <div className="flex-1 overflow-y-auto py-4">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const product = item.product;
                  const productId = product.$id;

                  const imageSrc =
                    product.images && product.images.length > 0
                      ? getImageUrl(product.images[0])
                      : "/placeholder.svg";

                  return (
                    <motion.div
                      key={productId}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-4 border-b border-border/50 py-4"
                    >
                      {/* Product Image */}
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                        <Image
                          src={imageSrc}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-medium">
                            {product.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(
                                productId,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="w-6 text-center text-sm">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(productId, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(productId)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* ================= TOTAL ================= */}
            <div className="border-t border-border/50 pt-4">
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <Button
                className="mt-4 w-full"
                size="lg"
                onClick={() => setIsCartOpen(false)}
                asChild
              >
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
