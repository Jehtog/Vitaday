import { Link } from "@tanstack/react-router";
import { Minus, Plus, Repeat, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { PRODUCTS, formatPrice } from "@/lib/catalog";
import { collectionBox, media } from "@/lib/media";
import { t } from "@/i18n/en";

const thumb = (id: string) => (id === "bottle" ? media.bottleHero.src : id === "starter-kit" ? media.refillBox.src : collectionBox.essential);

export function CartDrawer() {
  const { lines, totals, open, setOpen, setQty, remove, upgradeToSubscription } = useCart();
  const canUpsell = !totals.hasSubscription && lines.length > 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 border-border bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-5 text-left">
          <SheetTitle className="font-display text-3xl font-normal">{t.cart.title}</SheetTitle>
          <SheetDescription className="text-xs">Shipping {formatPrice(totals.shippingCents || 490)} — shown before checkout, always.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5">
          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">{t.cart.empty}</p>
              <Button asChild className="mt-6" onClick={() => setOpen(false)}>
                <Link to="/shop/essential-starter-kit">Get the Starter Kit</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => {
                const p = PRODUCTS[line.id];
                return (
                  <li key={line.id} className="flex gap-4 rounded-2xl bg-card p-3 shadow-soft">
                    <img src={thumb(line.id)} alt="" className="h-20 w-16 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.short}</p>
                        </div>
                        <button onClick={() => remove(line.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-surface" aria-label={`Remove ${p.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-border">
                          <button className="grid h-9 w-9 place-items-center" onClick={() => setQty(line.id, line.qty - 1)} aria-label="Decrease quantity"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="w-6 text-center text-sm" aria-live="polite">{line.qty}</span>
                          <button className="grid h-9 w-9 place-items-center" onClick={() => setQty(line.id, line.qty + 1)} aria-label="Increase quantity"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <p className="text-sm">{formatPrice(p.priceCents * line.qty)}{p.recurring && <span className="text-muted-foreground">/mo</span>}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {canUpsell && (
            <div className="mt-6 rounded-2xl border border-gold/60 bg-card p-4">
              <div className="flex items-start gap-3">
                <Repeat className="mt-1 h-5 w-5 shrink-0 text-gold-ink" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">{t.cart.upsell}</p>
                  <p className="mt-1 text-xs text-muted-foreground">28 portions every month for {formatPrice(PRODUCTS["subscription-28"].priceCents)}. Pause, skip or cancel anytime in 2 clicks.</p>
                  <Button size="sm" variant="outline" className="mt-3" onClick={upgradeToSubscription}>Switch & save 10%</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="space-y-2 border-t border-border bg-card p-5 text-sm">
            <div className="flex justify-between"><span>{t.cart.subtotal}</span><span>{formatPrice(totals.subtotalCents)}</span></div>
            <div className="flex justify-between"><span>{t.cart.shipping}</span><span>{formatPrice(totals.shippingCents)}</span></div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-medium"><span>{t.cart.total}</span><span>{formatPrice(totals.totalCents)}</span></div>
            {totals.hasSubscription && <p className="text-xs text-muted-foreground">Then {formatPrice(totals.recurringCents)}/month for your refills.</p>}
            <Button asChild size="lg" className="mt-3 w-full" onClick={() => setOpen(false)}>
              <Link to="/checkout">{t.cart.checkout}</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
