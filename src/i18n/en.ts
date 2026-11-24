// Shared interface strings. Add pt.ts / de.ts with the same keys to translate later.
export const en = {
  nav: {
    shop: "Shop",
    howItWorks: "How it works",
    collections: "Collections",
    ingredients: "Ingredients",
    faq: "FAQ",
    account: "Account",
    cart: "Reservation",
    menu: "Menu",
    quiz: "Find your VITADAY",
  },
  footer: {
    newsletterTitle: "Get your routine started",
    newsletterText: "News and launch updates. No spam — unsubscribe anytime.",
    imprint: "Imprint",
    privacy: "Privacy",
    terms: "Terms",
    shipping: "Shipping & Returns",
    cookies: "Cookie settings",
  },
  cart: {
    title: "Your reservation",
    empty: "You haven’t reserved anything yet.",
    shipping: "Shipping",
    subtotal: "Subtotal",
    total: "Estimated total",
    checkout: "Continue to letter of intent",
    upsell: "Switch to subscription and save 10%",
  },
} as const;

export const t = en;
