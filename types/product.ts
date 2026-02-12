// types/product.ts

export interface Product {
  $id: string;
  name: string;
  price: number;
  category: "bags" | "tops" | "accessories" | "home";
  description: string;
  materials: string;
  images: string[];
  inStock: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  colors?: string[];
  sizes?: string[];
}
