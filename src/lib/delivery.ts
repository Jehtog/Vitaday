/** Adds business days (Mon–Fri) to a date. */
export function addBusinessDays(date: Date, days: number): Date {
  const d = new Date(date);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) added++;
  }
  return d;
}

/** Placeholder delivery window of 3–5 business days — replace with your carrier's estimate. */
export function deliveryWindow(from: Date): [Date, Date] {
  return [addBusinessDays(from, 3), addBusinessDays(from, 5)];
}

export const fmtDay = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
