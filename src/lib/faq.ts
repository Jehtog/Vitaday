export interface FaqItem {
  q: string;
  a: string;
}
export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Product & use",
    items: [
      { q: "How does VITADAY work?", a: "Open the cap, drop in your Weekly Refill Ring, then close it. Each day, rotate the cap to today, press, shake and drink. One chamber, one day." },
      { q: "Do I need an app or batteries?", a: "No. VITADAY is fully mechanical — no app, no electronics, no charging." },
      { q: "How much water should I use?", a: "Fill the bottle with regular drinking water before releasing your daily portion. Exact directions will be printed on every refill box." },
      { q: "Can I see which days I've already taken?", a: "Yes. The weekday ring shows which chamber you're on, so you can see at a glance whether today's portion is released." },
      { q: "Do all collections fit the same bottle?", a: "Yes. Every VITADAY refill ring fits the same cap, so you never need a second bottle." },
    ],
  },
  {
    title: "Freshness & storage",
    items: [
      { q: "How do the vitamins stay fresh?", a: "Each portion sits in its own sealed, moisture-protected chamber until you release it. Final shelf-life details will be confirmed before launch." },
      { q: "How should I store refills?", a: "Keep unopened refill rings in a cool, dry place away from direct sunlight." },
    ],
  },
  {
    title: "Cleaning",
    items: [
      { q: "How do I clean the bottle?", a: "Remove the cap and refill ring, then rinse the glass bottle with warm water and mild soap. Let it dry fully before reassembling." },
      { q: "Is the bottle dishwasher safe?", a: "Final care instructions will be confirmed with our manufacturer. Until then, we recommend hand washing." },
    ],
  },
  {
    title: "Subscription",
    items: [
      { q: "How does the subscription work?", a: "You receive 28 Essential portions (4 refill rings) every month for €17.99 — 10% less than buying them one at a time." },
      { q: "Can I pause or cancel?", a: "Yes. Pause, skip or cancel anytime in your account, in no more than two clicks." },
      { q: "Do I need an account?", a: "Only for subscriptions, so you can manage them. One-time orders use guest checkout." },
    ],
  },
  {
    title: "Shipping & payment",
    items: [
      { q: "Which payment methods do you accept?", a: "Card, PayPal, Apple Pay, MB WAY and Multibanco." },
      { q: "What does shipping cost?", a: "Shipping costs are always shown in your cart before checkout." },
    ],
  },
  {
    title: "Safety",
    items: [
      { q: "Is VITADAY a medicine?", a: "No. VITADAY Essential is a food supplement. Food supplements should not be used as a substitute for a varied and balanced diet and a healthy lifestyle." },
      { q: "Can I take more than one portion a day?", a: "Please don't. Do not exceed the recommended daily dose. If you're pregnant, breastfeeding or taking medication, ask your doctor first." },
      { q: "Is it suitable for children?", a: "Essential is made for adults. Keep out of reach of young children." },
    ],
  },
];

const pick = (g: number, i: number): FaqItem[] => {
  const item = FAQ_GROUPS[g]?.items[i];
  return item ? [item] : [];
};

export const FAQ_PREVIEW: FaqItem[] = [...pick(0, 0), ...pick(0, 1), ...pick(1, 0), ...pick(3, 1)];
