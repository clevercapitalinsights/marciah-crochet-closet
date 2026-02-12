"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { account, databases } from "@/lib/appwrite";
import { ID, Permission, Role } from "appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to home
    account.get().then(
      () => router.push("/"),
      () => {} // Not logged in, do nothing
    );
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);

    try {
      // 1️⃣ Create Appwrite Auth user
      const user = await account.create(ID.unique(), email, password, fullName);

      // 2️⃣ Log the user in immediately
      await account.createEmailPasswordSession(email, password);

      // 3️⃣ Get the logged-in user
      const currentUser = await account.get();

      // 4️⃣ Create user document in users collection with permissions for that user
      await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: currentUser.$id,
          email: currentUser.email,
          name: fullName,
          role: "customer",
        },
        [
          Permission.read(Role.user(currentUser.$id)),
          Permission.update(Role.user(currentUser.$id)),
          Permission.delete(Role.user(currentUser.$id)),
        ],
      );

      toast.success("Account created successfully!");
      router.push("/"); // Redirect home
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">Create Account</h1>
          <p className="mt-2 text-muted-foreground">
            Join the Marciah community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
