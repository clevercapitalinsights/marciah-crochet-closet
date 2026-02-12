import { databases } from "@/lib/appwrite";
import { Product } from "@/types/product";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PRODUCTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;

export async function getProducts(): Promise<Product[]> {
  const res = await databases.listDocuments(
    DATABASE_ID,
    PRODUCTS_COLLECTION_ID
  );

  return res.documents as unknown as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await databases.getDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      id
    );

    return res as unknown as Product;
  } catch {
    return null;
  }
}
