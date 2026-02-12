export const categories = [
  { id: "bags", name: "Bags", description: "Handcrafted totes, crossbodies & more" },
  { id: "tops", name: "Tops", description: "Boho tops, cardigans & cover-ups" },
  { id: "accessories", name: "Accessories", description: "Hats, scrunchies & jewelry" },
  { id: "home", name: "Home", description: "Pillows, plant hangers & décor" },
];

export const testimonials = [
  {
    id: "1",
    name: "Amina K.",
    text: "The quality is unbelievable! My sunflower tote gets compliments everywhere I go. You can feel the love in every stitch.",
    rating: 5,
  },
  {
    id: "2",
    name: "Grace M.",
    text: "I bought the boho crop top for a festival and I'm obsessed. It fits perfectly and feels so unique. Will definitely order again!",
    rating: 5,
  },
  {
    id: "3",
    name: "Fatima W.",
    text: "Fast delivery and beautiful packaging. The plant hanger looks stunning in my living room. Supporting local makers feels great.",
    rating: 5,
  },
];

export function formatPrice(price: number): string {
  return `KSh ${price.toLocaleString()}`;
}
