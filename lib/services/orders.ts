import { databases } from "@/lib/appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const ORDERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!;

export async function getOrders() {
  const res = await databases.listDocuments(
    DATABASE_ID,
    ORDERS_COLLECTION_ID
  );

  return res.documents;
}
