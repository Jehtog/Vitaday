import type { CollectionId } from "@/lib/catalog";

export interface NutritionRow {
  name: string;
  unit: string;
  /** Only vitamins and minerals have a Nutrient Reference Value. */
  nrv: boolean;
}

const v = (name: string, unit: string): NutritionRow => ({ name, unit, nrv: true });
const x = (name: string, unit = "mg"): NutritionRow => ({ name, unit, nrv: false });

/** Ingredients per collection. Amounts stay placeholders until each final formulation (EU maximum levels). */
export const COLLECTION_NUTRITION: Record<CollectionId, NutritionRow[]> = {
  essential: [v("Vitamin C", "mg"), v("Vitamin B6", "mg"), v("Vitamin B12", "µg"), v("Thiamin (B1)", "mg"), v("Riboflavin (B2)", "mg"), v("Niacin (B3)", "mg")],
  glow: [v("Biotin (B7)", "µg"), v("Vitamin C", "mg"), v("Zinc", "mg"), v("Vitamin E", "mg"), x("Collagen peptides"), x("Hyaluronic acid"), x("Silicon (bamboo or silica extract)")],
  balance: [v("Magnesium (bisglycinate)", "mg"), x("Ashwagandha (KSM-66)"), x("L-Theanine"), v("Vitamin B6", "mg"), v("Vitamin D3", "µg"), x("Lemon balm extract"), v("Pantothenic acid (B5)", "mg")],
  active: [x("Caffeine (from green tea)"), x("L-Theanine"), x("Rhodiola extract"), x("Citicoline (choline)"), v("Vitamin B12 (methylcobalamin)", "µg"), v("Magnesium", "mg"), v("Potassium", "mg"), x("Sodium")],
  focus: [x("Caffeine (from green tea)"), x("L-Theanine"), x("Rhodiola extract"), x("Citicoline (choline)"), v("Vitamin B12 (methylcobalamin)", "µg"), v("Magnesium", "mg"), v("Potassium", "mg"), x("Sodium")],
  cycle: [v("Iron (bisglycinate)", "mg"), v("Vitamin C", "mg"), v("Vitamin B6", "mg"), v("Magnesium", "mg"), v("Zinc", "mg"), x("Ginger extract"), x("Chasteberry extract")],
  junior: [v("Vitamin D3", "µg"), v("Vitamin C", "mg"), v("Zinc", "mg"), v("Vitamin A", "µg"), v("Vitamin B12", "µg"), v("Iodine", "µg"), v("Selenium", "µg")],
};

/** Kept for existing callers: the Essential rows. */
export const NUTRITION_ROWS = COLLECTION_NUTRITION.essential;

/** Extra warnings per collection, shown with the nutrition table and in the quiz result. */
export const COLLECTION_WARNINGS: Partial<Record<CollectionId, string[]>> = {
  active: ["Contains caffeine. Not suitable for children or for pregnant or breastfeeding women."],
  focus: ["Contains caffeine. Not suitable for children or for pregnant or breastfeeding women."],
  balance: ["Contains ashwagandha. Not suitable during pregnancy or for people with thyroid conditions."],
  cycle: ["Contains iron. Iron is not right for everyone — an iron-free option is planned."],
  junior: ["Made for children aged about 4–12, with age-appropriate amounts. No plant extracts and no caffeine."],
};

export const MANDATORY_NOTES = [
  "Food supplements should not be used as a substitute for a varied and balanced diet and a healthy lifestyle.",
  "Do not exceed the recommended daily dose.",
  "Keep out of reach of young children.",
] as const;

/** EU-authorised health claim wording only. */
export const HEALTH_CLAIMS = [
  "Vitamin C contributes to the normal function of the immune system.",
  "Vitamin C contributes to the reduction of tiredness and fatigue.",
  "Vitamin B6 contributes to normal energy-yielding metabolism.",
  "Vitamin B12 contributes to the reduction of tiredness and fatigue.",
] as const;
