"use client";

import { motion } from "framer-motion";
import { Leaf, Heart, MapPin } from "lucide-react";
import Image from "next/image";

const values = [
  {
    icon: Heart,
    title: "Handmade with Love",
    description:
      "Every piece is carefully crafted by hand, taking hours of dedicated work and attention to detail.",
  },
  {
    icon: Leaf,
    title: "Sustainable Materials",
    description:
      "We use natural, eco-friendly yarns and materials wherever possible to reduce our environmental footprint.",
  },
  {
    icon: MapPin,
    title: "Locally Made",
    description:
      "Proudly made in Nairobi, Kenya. Supporting local artisans and the community we call home.",
  },
];

export default function About() {
  return (
    <section>
      {/* Story */}
      <div className="container py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-accent">
              Our Story
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-5xl">
              From a Single Hook
              <br />
              to Your Wardrobe
            </h1>
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Knotted started as a passion project in a small apartment in
                Nairobi. What began with one hook and a skein of yarn quickly
                grew into a love letter to traditional craft meeting modern
                fashion.
              </p>
              <p>
                Each piece in our collection is designed and handmade with
                intention — from choosing the perfect yarn to the final stitch.
                We believe that fashion should be personal, sustainable, and
                full of character.
              </p>
              <p>
                Today, we&amp;re a small team of makers dedicated to bringing you
                unique, wearable art that celebrates the beauty of handmade
                craftsmanship.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl w-full h-80 md:h-118"
          >
            <Image
              src="/images/about-hands.jpg"
              alt="Hands crocheting with a wooden hook"
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </motion.div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-card py-16 md:py-24">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-semibold md:text-4xl">
            What We Stand For
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
                  <v.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
