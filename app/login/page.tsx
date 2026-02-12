"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
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
    setSubmitting(true);

    try {
      await account.createEmailPasswordSession(email, password);

      toast.success("Welcome back!");

      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">
            Welcome Back
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your Marciah account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&amp;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}
