export const NUTRITION_ROWS = [
  { name: "Vitamin C", unit: "mg" },
  { name: "Vitamin B6", unit: "mg" },
  { name: "Vitamin B12", unit: "µg" },
  { name: "Thiamin (B1)", unit: "mg" },
  { name: "Riboflavin (B2)", unit: "mg" },
  { name: "Niacin (B3)", unit: "mg" },
] as const;

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
