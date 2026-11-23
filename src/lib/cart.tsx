import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ProductId } from "./catalog";
import { logBotEvent } from "./whatsapp";
import { computeTotals, switchToSubscription, type CartLine, type CartTotals } from "./pricing";

const STORAGE_KEY = "vitaday-cart-v1";

interface CartContextValue {
  lines: CartLine[];
  totals: CartTotals;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (id: ProductId, qty?: number, opts?: { openDrawer?: boolean }) => void;
  setQty: (id: ProductId, qty: number) => void;
  remove: (id: ProductId) => void;
  clear: () => void;
  upgradeToSubscription: () => void;
  botPrompt: ProductId | null;
  setBotPrompt: (id: ProductId | null) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [botPrompt, setBotPrompt] = useState<ProductId | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore broken storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const add = useCallback<CartContextValue["add"]>((id, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { id, qty }];
    });
    logBotEvent("add_to_cart", "site", id, qty);
    setBotPrompt(id);
  }, []);

  const setQty = useCallback((id: ProductId, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((id: ProductId) => setLines((prev) => prev.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);
  const upgradeToSubscription = useCallback(() => setLines((prev) => switchToSubscription(prev)), []);

  const value = useMemo(
    () => ({ lines, totals: computeTotals(lines), open, setOpen, add, setQty, remove, clear, upgradeToSubscription, botPrompt, setBotPrompt }),
    [lines, open, botPrompt, add, setQty, remove, clear, upgradeToSubscription],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
