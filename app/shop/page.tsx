"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { categories } from "@/data/products";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Product } from "@/types/product";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategory = searchParams.get("category") || "all";
  const isNewFilter = searchParams.get("filter") === "new";

  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Appwrite
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const filters: ReturnType<typeof Query.equal>[] = [];

        if (activeCategory !== "all") {
          filters.push(Query.equal("category", activeCategory));
        }
        if (isNewFilter) {
          filters.push(Query.equal("isNewArrival", true));
        }

        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
          filters
        );

        setProducts(response.documents as unknown as Product[]);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [activeCategory, isNewFilter]);

  // Apply sorting
  const filteredProducts = useMemo(() => {
    const list = [...products];

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return list;
  }, [products, sortBy]);

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") params.delete("category");
    else params.set("category", cat);
    params.delete("filter");
    router.push(`/shop?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push("/shop");
  };

  return (
    <section className="container py-10 md:py-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold md:text-4xl">
          {isNewFilter ? "New Arrivals" : "Shop All"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </p>
      </motion.div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === "all" && !isNewFilter ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={resetFilters}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="ml-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low → High</SelectItem>
              <SelectItem value="price-desc">Price: High → Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="mt-10 text-center text-muted-foreground">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <p>No products found in this category.</p>
          <Button variant="outline" className="mt-4 rounded-full" onClick={resetFilters}>
            View All Products
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.$id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

// The main export must be wrapped in Suspense to allow for build-time static generation
export default function Shop() {
  return (
    <Suspense fallback={
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Loading your shop...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}