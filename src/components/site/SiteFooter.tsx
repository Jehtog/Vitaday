import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { t } from "@/i18n/en";
import { NewsletterForm } from "./NewsletterForm";
import { openCookieSettings } from "./CookieBanner";
import { Wordmark } from "./SiteHeader";


export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">VITADAY keeps the doctor away. Seven days, one bottle.</p>
          <div className="mt-8">
            <p className="font-display text-2xl">{t.footer.newsletterTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t.footer.newsletterText}</p>
            <NewsletterForm source="footer" className="mt-4 max-w-md" />
          </div>
        </div>
        <nav aria-label="Shop links">
          <p className="eyebrow">Shop</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link to="/shop/essential-starter-kit" className="hover:text-gold-ink">Essential Starter Kit</Link></li>
            <li><Link to="/shop" className="hover:text-gold-ink">Refills & bottle</Link></li>
            <li><Link to="/how-it-works" className="hover:text-gold-ink">How it works</Link></li>
            <li><Link to="/collections" className="hover:text-gold-ink">Collections</Link></li>
            <li><Link to="/ingredients" className="hover:text-gold-ink">Ingredients</Link></li>
            <li><Link to="/faq" className="hover:text-gold-ink">FAQ</Link></li>
          </ul>
        </nav>
        <nav aria-label="Legal links">
          <p className="eyebrow">Info</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link to="/imprint" className="hover:text-gold-ink">{t.footer.imprint}</Link></li>
            <li><Link to="/privacy" className="hover:text-gold-ink">{t.footer.privacy}</Link></li>
            <li><Link to="/terms" className="hover:text-gold-ink">{t.footer.terms}</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-gold-ink">{t.footer.shipping}</Link></li>
            <li><button onClick={openCookieSettings} className="hover:text-gold-ink">{t.footer.cookies}</button></li>
          </ul>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-6 inline-flex h-11 items-center gap-2 text-sm hover:text-gold-ink">
            <Instagram className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" /> Instagram
          </a>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-start justify-between gap-4 py-6 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} VITADAY. Food supplement. Not a substitute for a varied diet.</p>
          <p className="text-xs text-muted-foreground">
            A student project at Cat&oacute;lica Lisbon. Not for sale yet, and no payment is taken.
          </p>
        </div>
      </div>
    </footer>
  );
}
