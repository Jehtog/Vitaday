import { PRODUCTS, SHIPPING_CENTS, type ProductId } from "./catalog";

export interface CartLine {
  id: ProductId;
  qty: number;
}

export interface CartTotals {
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  /** Amount billed every month after today, from subscription lines. */
  recurringCents: number;
  hasSubscription: boolean;
}

export function computeTotals(lines: CartLine[]): CartTotals {
  let subtotal = 0;
  let recurring = 0;
  let count = 0;
  for (const line of lines) {
    const p = PRODUCTS[line.id];
    if (!p || line.qty <= 0) continue;
    subtotal += p.priceCents * line.qty;
    count += line.qty;
    if (p.recurring) recurring += p.priceCents * line.qty;
  }
  const shipping = count > 0 ? SHIPPING_CENTS : 0;
  return {
    itemCount: count,
    subtotalCents: subtotal,
    shippingCents: shipping,
    totalCents: subtotal + shipping,
    recurringCents: recurring,
    hasSubscription: recurring > 0,
  };
}

/** Percentage saved by the monthly subscription versus buying four 7-day refills. */
export function subscriptionSavingPercent(): number {
  const oneTime = PRODUCTS["refill-7"].priceCents * 4;
  const sub = PRODUCTS["subscription-28"].priceCents;
  return Math.round(((oneTime - sub) / oneTime) * 100);
}

/**
 * Switch one-time refills to the monthly subscription. Four 7-day rings make up
 * one month, so any number of them becomes a single monthly subscription.
 */
export function switchToSubscription(lines: CartLine[]): CartLine[] {
  const rest = lines.filter((l) => l.id !== "refill-7" && l.id !== "subscription-28");
  return [...rest, { id: "subscription-28", qty: 1 }];
}
