"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";

// Define allowed categories
type ProductCategory = "bags" | "tops" | "accessories" | "home";

// Appwrite product structure
interface AppwriteProduct {
  $id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  materials: string;
  images?: string[];
  inStock: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  colors?: string[];
  sizes?: string[];
}



interface ProductCardProps {
  product: AppwriteProduct;
}

// Appwrite storage config
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

// Convert Appwrite file ID to full URL
function getImageUrl(fileId: string) {
  return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/download?project=${PROJECT_ID}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const id = product.$id;
  const wishlisted = isWishlisted(id);

  // Use Appwrite image URL or fallback
  const imageSrc =
    product.images && product.images.length > 0
      ? getImageUrl(product.images[0])
      : "/placeholder.svg";

  // Map AppwriteProduct to Product
  const cartProduct: Product = {
    $id: product.$id,
    name: product.name,
    price: product.price,
    category: product.category as ProductCategory, // cast to union
    description: product.description,
    materials: product.materials,
    images: product.images || [],
    inStock: product.inStock,
    isBestSeller: product.isBestSeller,
    isNewArrival: product.isNewArrival,
    colors: product.colors || [],
    sizes: product.sizes || [],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      {/* Image + Link */}
      <Link href={`/product/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />

          {/* Sold Out Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <Badge variant="secondary" className="text-xs">
                Sold Out
              </Badge>
            </div>
          )}

          {/* New Badge */}
          {product.isNewArrival && product.inStock && (
            <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground text-xs">
              New
            </Badge>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(id);
            }}
            className="absolute right-3 top-3 rounded-full bg-background/80 p-2 opacity-0 backdrop-blur-sm transition-all hover:bg-background group-hover:opacity-100"
            aria-label={
              wishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <Heart
              className={`h-4 w-4 ${
                wishlisted ? "fill-accent text-accent" : "text-foreground"
              }`}
            />
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <Link href={`/product/${id}`}>
            <h3 className="text-sm font-medium leading-tight hover:text-primary">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 text-sm text-muted-foreground">
            {formatPrice(product.price)}
          </p>
        </div>

        {product.inStock && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => addItem(cartProduct)}
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
