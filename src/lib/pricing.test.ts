import { describe, expect, it } from "vitest";
import { PRODUCTS, SHIPPING_CENTS, weekdayIndex } from "./catalog";
import { computeTotals, subscriptionSavingPercent, switchToSubscription } from "./pricing";

describe("VITADAY prices", () => {
  it("Starter Kit costs €34.99", () => {
    expect(PRODUCTS["starter-kit"].priceCents).toBe(3499);
  });
  it("Bottle only costs €29.99", () => {
    expect(PRODUCTS.bottle.priceCents).toBe(2999);
  });
  it("7-day refill costs €5.99 and 28-day refill €19.99", () => {
    expect(PRODUCTS["refill-7"].priceCents).toBe(599);
    expect(PRODUCTS["refill-28"].priceCents).toBe(1999);
  });
  it("monthly subscription costs €17.99 per month", () => {
    expect(PRODUCTS["subscription-28"].priceCents).toBe(1799);
    expect(PRODUCTS["subscription-28"].recurring).toBe("month");
  });
  it("subscription saves 10% versus the 28-day refill", () => {
    expect(subscriptionSavingPercent()).toBe(10);
  });
});

describe("cart totals", () => {
  it("adds shipping to a non-empty cart", () => {
    const t = computeTotals([{ id: "starter-kit", qty: 1 }]);
    expect(t.subtotalCents).toBe(3499);
    expect(t.totalCents).toBe(3499 + SHIPPING_CENTS);
  });
  it("charges no shipping on an empty cart", () => {
    expect(computeTotals([]).totalCents).toBe(0);
  });
  it("reports the monthly amount for subscriptions", () => {
    const t = computeTotals([
      { id: "starter-kit", qty: 1 },
      { id: "subscription-28", qty: 1 },
    ]);
    expect(t.recurringCents).toBe(1799);
    expect(t.hasSubscription).toBe(true);
  });
  it("switching to subscription replaces 28-day refills", () => {
    const next = switchToSubscription([
      { id: "starter-kit", qty: 1 },
      { id: "refill-28", qty: 2 },
    ]);
    expect(next).toEqual([
      { id: "starter-kit", qty: 1 },
      { id: "subscription-28", qty: 2 },
    ]);
  });
});

describe("weekday ring", () => {
  it("treats Monday as the first chamber and Sunday as the last", () => {
    expect(weekdayIndex(new Date(2026, 10, 9))).toBe(0); // Mon 9 Nov 2026
    expect(weekdayIndex(new Date(2026, 10, 15))).toBe(6); // Sun 15 Nov 2026
  });
});
