"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Instagram, Mail } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    e.currentTarget.reset();
  };

  return (
    <section className="container py-16 md:py-24">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-medium uppercase tracking-widest text-accent">Contact</p>
          <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            Get in Touch
          </h1>
          <p className="mt-3 text-muted-foreground">
            Have a question, custom order request, or just want to say hi? We&amp;d love to hear from you.
          </p>
        </motion.div>
      </div>

      {/* Main grid */}
      <div className="mx-auto mt-12 grid max-w-4xl gap-12 md:grid-cols-5">
        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-5 md:col-span-3"
        >
          <div>
            <Label htmlFor="contact-name">Name</Label>
            <Input id="contact-name" required placeholder="Your name" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              required
              placeholder="you@example.com"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              required
              rows={5}
              placeholder="Tell us what's on your mind..."
              className="mt-1.5"
            />
          </div>
          <Button type="submit" size="lg" className="w-full rounded-full">
            Send Message
          </Button>
        </motion.form>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-6 md:col-span-2"
        >
          <a
            href="https://wa.me/254713370420"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-5 transition-colors hover:border-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
              <MessageCircle className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">WhatsApp</p>
              <p className="text-xs text-muted-foreground">Chat with us directly</p>
            </div>
          </a>

          <a
            href="https://instagram.com/marciahs_crochet_closet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-5 transition-colors hover:border-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
              <Instagram className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">Instagram</p>
              <p className="text-xs text-muted-foreground">@marciahs_crochet_closet</p>
            </div>
          </a>

          <a
            href="mailto:marciahcrochet@gmail.com"
            className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-5 transition-colors hover:border-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
              <Mail className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-xs text-muted-foreground">marciahcrochet@gmail.com</p>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
