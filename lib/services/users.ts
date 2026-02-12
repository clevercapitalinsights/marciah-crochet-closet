import { databases } from "@/lib/appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

export async function getUserByAuthId(authUserId: string) {
  const res = await databases.listDocuments(
    DATABASE_ID,
    USERS_COLLECTION_ID,
    [
      `equal("userId", "${authUserId}")`
    ]
  );

  return res.documents[0] || null;
}
