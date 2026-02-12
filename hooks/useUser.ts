"use client";

import { useState, useEffect, useCallback } from "react";
import { account, databases, DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import type { Models } from "appwrite";

export function useUser() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      // Get current auth session user
      const currentUser = await account.get();
      setUser(currentUser);

      // Get role from users collection
      const res = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
        Query.equal("userId", currentUser.$id),
      ]);
      const userDoc = res.documents[0];
      setIsAdmin(userDoc?.role === "admin");
    } catch (err) {
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();

    // Optional: poll every 5 minutes to keep session fresh
    const interval = setInterval(fetchUser, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchUser]);

  const signOut = useCallback(async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      setIsAdmin(false);
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  }, []);

  return { user, isAdmin, loading, signOut, refetch: fetchUser };
}
