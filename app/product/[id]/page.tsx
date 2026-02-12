"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { getProductById, getProducts } from "@/lib/services/products";
import { Product } from "@/types/product";

/* ============================= */
/* Appwrite Image Configuration  */
/* ============================= */

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

function getImageUrl(fileOrUrl: string) {
  // If it's already a full URL, return it
  if (fileOrUrl.startsWith("http")) return fileOrUrl;

  // Otherwise treat it as Appwrite fileId
  return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileOrUrl}/download?project=${PROJECT_ID}`;
}

/* ============================= */

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();

  /* ============================= */
  /* Fetch Product */
  /* ============================= */

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const data = await getProductById(id);

        if (!data) {
          router.push("/shop");
          return;
        }

        setProduct(data);

        const allProducts = await getProducts();
        const filtered = allProducts
          .filter(
            (p: Product) => p.category === data.category && p.$id !== data.$id,
          )
          .slice(0, 4);

        setRelated(filtered);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, router]);

  /* ============================= */

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Button variant="outline" className="mt-4 rounded-full" asChild>
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  /* ============================= */
  /* Safe Image Handling */
  /* ============================= */

  const imageSrc =
    product.images && product.images.length > 0
      ? getImageUrl(product.images[0])
      : "/placeholder.svg";

  const wishlisted = isWishlisted(product.$id);

  /* ============================= */

  return (
    <section className="container py-8 md:py-16">
      <Link
        href="/shop"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        {/* ================= IMAGE ================= */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative aspect-square overflow-hidden rounded-2xl bg-secondary"
        >
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* ================= INFO ================= */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start gap-2">
            {product.isNewArrival && (
              <Badge className="bg-accent text-accent-foreground">
                New
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary">Sold Out</Badge>
            )}
          </div>

          <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            {product.name}
          </h1>

          <p className="mt-2 text-2xl font-medium text-primary">
            {formatPrice(product.price)}
          </p>

          <p className="mt-6 leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {product.materials && (
            <p className="mt-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                Materials:
              </span>{" "}
              {product.materials}
            </p>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium">Color</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color: string) => (
                  <Button
                    key={color}
                    variant={
                      selectedColor === color ? "default" : "outline"
                    }
                    size="sm"
                    className="rounded-full"
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-medium">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size: string) => (
                  <Button
                    key={size}
                    variant={
                      selectedSize === size ? "default" : "outline"
                    }
                    size="sm"
                    className="rounded-full"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <Button
              size="lg"
              className="flex-1 rounded-full"
              disabled={!product.inStock}
              onClick={() =>
                addItem(product, selectedColor, selectedSize)
              }
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {product.inStock ? "Add to Bag" : "Sold Out"}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              onClick={() => toggleWishlist(product.$id)}
            >
              <Heart
                className={`h-5 w-5 ${
                  wishlisted ? "fill-accent text-accent" : ""
                }`}
              />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* ================= RELATED ================= */}
      {related.length > 0 && (
        <div className="mt-16 md:mt-24">
          <h2 className="font-display text-2xl font-semibold">
            You May Also Like
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.$id} product={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
