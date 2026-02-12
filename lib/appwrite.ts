import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // e.g. https://cloud.appwrite.io/v1
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export default client;
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const PRODUCTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
export const CATEGORIES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!;
export const TESTIMONIALS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_TESTIMONIALS_COLLECTION_ID!;
export const BUCKET_ID =
  process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;
export const USERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;