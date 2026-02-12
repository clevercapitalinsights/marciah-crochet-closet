"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, testimonials } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/services/products";
import { Product } from "@/types/product";

const collectionImages: Record<string, string> = {
  bags: "/images/collection-bags.jpg",
  tops: "/images/collection-tops.jpg",
  accessories: "/images/collection-accessories.jpg",
  home: "/images/collection-home.jpg",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const bestSellers = products.filter((p) => p.isBestSeller);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-lifestyle.jpg"
            alt="Handmade crochet products"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container relative flex min-h-[85vh] flex-col items-center justify-center py-20 text-center md:min-h-[90vh]">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/80"
          >
            Handmade with Love by Marciah
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-display text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
          >
            Every Stitch
            <br />
            Tells a Story
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 max-w-md text-base leading-relaxed text-white/80 md:text-lg"
          >
            Unique crochet pieces that blend tradition with modern style.
            Sustainably crafted, just for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" asChild className="rounded-full px-8">
              <Link href="/shop">Shop Now</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full border-white/30 px-8 hover:bg-black hover:text-white"
            >
              <Link href="/shop?filter=new">New Arrivals</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ================= COLLECTIONS ================= */}
      <section className="container py-16 md:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-display text-3xl font-semibold md:text-4xl"
          >
            Shop by Collection
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={1}
            className="mt-3 text-muted-foreground"
          >
            Find your perfect handmade piece
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {categories.map((cat, i) => (
            <motion.div key={cat.id} variants={fadeUp} custom={i + 2}>
              <Link
                href={`/shop?category=${cat.id}`}
                className="group relative block overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <Image
                    src={
                      collectionImages[cat.id] ||
                      "/images/collection-bags.jpg"
                    }
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h3 className="font-display text-xl font-semibold text-white">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/70">
                    {cat.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= BEST SELLERS ================= */}
      <section className="bg-card py-16 md:py-24">
        <div className="container">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold md:text-4xl">
                Best Sellers
              </h2>
              <p className="mt-2 text-muted-foreground">
                Our most loved pieces
              </p>
            </div>

            <Link
              href="/shop"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <p className="mt-10 text-muted-foreground">
              Loading products...
            </p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.$id}
                  product={product}
                />
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="container py-16 md:py-24">
        <h2 className="text-center font-display text-3xl font-semibold md:text-4xl">
          What Our Customers Say
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-border/50 bg-card p-6"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                &quot;{t.text}&quot;
              </p>

              <p className="mt-4 text-sm font-semibold">
                — {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
