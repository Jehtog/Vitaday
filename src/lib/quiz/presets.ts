// QUIZ PRESETS — the seven result categories.
// Edit names, sentences, ingredient lists and shop links here; nothing else needs to change.
import type { CollectionId } from "@/lib/catalog";
import { collectionBox } from "@/lib/media";
import { COLLECTION_NUTRITION } from "@/lib/ingredients";

const list = (id: CollectionId) => COLLECTION_NUTRITION[id].map((r) => r.name);

export type PresetId = CollectionId;

export interface QuizPreset {
  id: PresetId;
  name: string;
  /** One sentence on the result card. Neutral wording only — no medical or health claims. */
  blurb: string;
  /** Fixed ingredient list, or null to show INGREDIENTS_PLACEHOLDER instead. */
  ingredients: string[] | null;
  image: string;
  imageAlt: string;
  colorClass: string;
  /** Where "Get <name> now" sends people. Swap in the real shop URL per preset. */
  shopUrl: string;
}

/** Shown in place of an ingredient list while a collection is still in development. */
export const INGREDIENTS_PLACEHOLDER = "Ingredients coming soon";

/**
 * Added to every shop link coming out of the quiz, so quiz traffic can be told apart later.
 *
 * Intended per-collection shop pages (swap shopUrl above once they exist):
 *   /shop/essential, /shop/glow, /shop/balance, /shop/active, /shop/focus, /shop/cycle
 * Today only Essential is purchasable, so it points at the Starter Kit page and the
 * other six point at /collections, where their waitlists live.
 */
export const QUIZ_UTM: Record<string, string> = {
  utm_source: "quiz",
  utm_medium: "website",
  utm_campaign: "preset_finder",
};

/** Order used for display and for tie-breaking in the scorer. */
export const PRESET_ORDER: PresetId[] = ["essential", "glow", "balance", "active", "focus", "cycle"];

export const PRESETS: Record<PresetId, QuizPreset> = {
  essential: {
    id: "essential",
    name: "Essential",
    blurb: "Everyday basics — vitamins C, B6, B12 and selected B vitamins, gently flavoured Lemon & Peach.",
    ingredients: list("essential"),
    image: collectionBox.essential,
    imageAlt: "VITADAY Essential 7-day refill box",
    colorClass: "bg-essential",
    shopUrl: "/shop/essential-starter-kit",
  },
  glow: {
    id: "glow",
    name: "Glow",
    blurb: "A beauty-focused routine for skin, hair and nails.",
    ingredients: list("glow"),
    image: collectionBox.glow,
    imageAlt: "VITADAY Glow 7-day refill box",
    colorClass: "bg-glow",
    shopUrl: "/collections",
  },
  balance: {
    id: "balance",
    name: "Balance",
    blurb: "A vitamin and mineral routine for busy, uneven days.",
    ingredients: list("balance"),
    image: collectionBox.balance,
    imageAlt: "VITADAY Balance 7-day refill box",
    colorClass: "bg-balance",
    shopUrl: "/collections",
  },
  active: {
    id: "active",
    name: "Active",
    blurb: "An electrolyte refill for training days and long walks.",
    ingredients: list("active"),
    image: collectionBox.active,
    imageAlt: "VITADAY Active 7-day refill box",
    colorClass: "bg-active",
    shopUrl: "/collections",
  },
  focus: {
    id: "focus",
    name: "Focus",
    blurb: "A routine built around study days and desk days.",
    ingredients: list("focus"),
    image: collectionBox.focus,
    imageAlt: "VITADAY Focus 7-day refill box",
    colorClass: "bg-focus",
    shopUrl: "/collections",
  },
  cycle: {
    id: "cycle",
    name: "Cycle",
    blurb: "A convenient routine you keep to hand around your cycle.",
    ingredients: list("cycle"),
    image: collectionBox.cycle,
    imageAlt: "VITADAY Cycle 7-day refill box",
    colorClass: "bg-cycle",
    shopUrl: "/collections",
  },
};

/** A preset's shop link with the quiz UTM parameters already on it. */
export function presetShopUrl(id: PresetId): string {
  const base = PRESETS[id].shopUrl;
  const query = Object.entries(QUIZ_UTM)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
  return `${base}${base.includes("?") ? "&" : "?"}${query}`;
}
