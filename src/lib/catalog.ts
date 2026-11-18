// Product catalogue and prices. Prices are in euro cents to avoid rounding errors.

export type ProductId =
  | "starter-kit"
  | "bottle"
  | "refill-7"
  | "refill-28"
  | "subscription-28";

export interface Product {
  id: ProductId;
  name: string;
  short: string;
  priceCents: number;
  /** Recurring products are billed every month. */
  recurring?: "month";
  badge?: string;
  note?: string;
}

export const PRODUCTS: Record<ProductId, Product> = {
  "starter-kit": {
    id: "starter-kit",
    name: "Essential Starter Kit",
    short: "Bottle + 7-day Essential ring",
    priceCents: 3499,
  },
  bottle: {
    id: "bottle",
    name: "VITADAY Bottle",
    short: "Glass bottle with 7-day cap",
    priceCents: 2999,
  },
  "refill-7": {
    id: "refill-7",
    name: "Essential 7-day refill",
    short: "1 Weekly Refill Ring",
    priceCents: 599,
  },
  "refill-28": {
    id: "refill-28",
    name: "Essential 28-day refill",
    short: "4 Weekly Refill Rings",
    priceCents: 1999,
  },
  "subscription-28": {
    id: "subscription-28",
    name: "Essential monthly subscription",
    short: "28 portions, delivered monthly",
    priceCents: 1799,
    recurring: "month",
    badge: "Save 10%",
    note: "Pause, skip or cancel anytime in 2 clicks",
  },
};

export const PURCHASE_OPTIONS: ProductId[] = [
  "starter-kit",
  "bottle",
  "refill-7",
  "refill-28",
  "subscription-28",
];

/** Placeholder flat shipping rate — replace with the real rate before launch. */
export const SHIPPING_CENTS = 490;

export const FLAVORS = [
  { id: "lemon-peach", name: "Lemon & Peach", available: true },
  { id: "more", name: "More flavours soon", available: false },
] as const;

export type CollectionId =
  | "essential"
  | "glow"
  | "balance"
  | "active"
  | "focus"
  | "cycle"
  | "junior";

export interface Collection {
  id: CollectionId;
  name: string;
  tagline: string;
  description: string;
  available: boolean;
  /** Tailwind background token class for the collection colour. */
  colorClass: string;
  /** Flavour once it is fixed; omitted while still in development. */
  flavor?: string;
}

export const COLLECTIONS: Collection[] = [
  { id: "essential", name: "Essential", tagline: "Everyday Wellness", description: "Your daily multivitamin.", available: true, colorClass: "bg-essential", flavor: "Lemon & Peach" },
  { id: "glow", name: "Glow", tagline: "Beauty & Wellness", description: "A beauty-focused routine in development.", available: false, colorClass: "bg-glow" },
  { id: "balance", name: "Balance", tagline: "Daily Vitality", description: "A vitamin and mineral routine for busy days, in development.", available: false, colorClass: "bg-balance" },
  { id: "active", name: "Active", tagline: "Sports & Hydration", description: "An electrolyte refill for active days, in development.", available: false, colorClass: "bg-active" },
  { id: "focus", name: "Focus", tagline: "Student Wellness", description: "A routine for academic life, in development.", available: false, colorClass: "bg-focus" },
  { id: "cycle", name: "Cycle", tagline: "Menstrual Wellness", description: "A convenient routine around your cycle, in development.", available: false, colorClass: "bg-cycle" },
  { id: "junior", name: "Junior", tagline: "Kids' Wellness", description: "Developed with paediatric nutrition experts before launch.", available: false, colorClass: "bg-junior" },
];

export const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

/** Monday-first index (0 = Monday … 6 = Sunday). */
export function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}
