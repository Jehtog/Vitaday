import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { t } from "@/i18n/en";
import { RingIcon } from "./WeekdayRing";

const NAV = [
  { to: "/shop", label: t.nav.shop },
  { to: "/how-it-works", label: t.nav.howItWorks },
  { to: "/collections", label: t.nav.collections },
  { to: "/ingredients", label: t.nav.ingredients },
  { to: "/faq", label: t.nav.faq },
] as const;

export function Wordmark({ className }: { className?: string }) {
  return <span className={`wordmark text-lg text-foreground md:text-xl ${className ?? ""}`}>Vitaday</span>;
}

function CartButton() {
  const { totals, setOpen } = useCart();
  return (
    <button onClick={() => setOpen(true)} className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-surface" aria-label={`${t.nav.cart}, ${totals.itemCount} items`}>
      <ShoppingBag className="h-5 w-5" strokeWidth={1.4} />
      {totals.itemCount > 0 && (
        <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">{totals.itemCount}</span>
      )}
    </button>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-page grid h-16 grid-cols-[auto_1fr_auto] items-center gap-2 md:h-20">
        <div className="flex items-center gap-1">
          <button className="grid h-11 w-11 place-items-center rounded-full hover:bg-surface lg:hidden" onClick={() => setMenuOpen(true)} aria-label={t.nav.menu}>
            <Menu className="h-5 w-5" strokeWidth={1.4} />
          </button>
          <Link to="/" aria-label="VITADAY home" className="px-1"><Wordmark /></Link>
        </div>
        <nav className="hidden justify-center gap-8 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="py-2 text-sm tracking-wide text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground underline decoration-gold decoration-1 underline-offset-[10px]" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="col-start-3 flex items-center">
          <Link to="/account" className="grid h-11 w-11 place-items-center rounded-full hover:bg-surface" aria-label={t.nav.account}>
            <RingIcon />
          </Link>
          <CartButton />
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-full max-w-xs border-border bg-background">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
          <Wordmark />
          <span className="gold-rule mt-6" />
          <nav className="mt-6 flex flex-col" aria-label="Mobile">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setMenuOpen(false)} className="border-b border-border py-4 font-display text-2xl">
                {n.label}
              </Link>
            ))}
            <Link to="/account" onClick={() => setMenuOpen(false)} className="py-4 font-display text-2xl">{t.nav.account}</Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
