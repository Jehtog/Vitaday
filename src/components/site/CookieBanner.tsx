import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const KEY = "vitaday-cookie-consent-v1";
export const OPEN_COOKIE_EVENT = "vitaday:open-cookie-settings";

interface Consent { necessary: true; analytics: boolean; marketing: boolean }

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_EVENT));
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) setVisible(true);
    else {
      try {
        const c = JSON.parse(raw) as Consent;
        setAnalytics(c.analytics);
        setMarketing(c.marketing);
      } catch { setVisible(true); }
    }
    const open = () => { setVisible(true); setDetails(true); };
    window.addEventListener(OPEN_COOKIE_EVENT, open);
    return () => window.removeEventListener(OPEN_COOKIE_EVENT, open);
  }, []);

  const save = (c: Omit<Consent, "necessary">) => {
    window.localStorage.setItem(KEY, JSON.stringify({ necessary: true, ...c }));
    setVisible(false);
    setDetails(false);
  };

  if (!visible) return null;

  return (
    <div role="dialog" aria-label="Cookie settings" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-border bg-card p-5 shadow-lift md:inset-x-auto md:right-6 md:bottom-6">
      <p className="font-display text-2xl">A quick note on cookies</p>
      <p className="mt-2 text-sm text-muted-foreground">
        We use essential cookies to run the shop. With your permission we'd also use analytics to improve it. Read our{" "}
        <Link to="/privacy" className="text-gold-ink underline underline-offset-4">Privacy policy</Link>.
      </p>
      {details && (
        <div className="mt-4 space-y-3 rounded-xl bg-surface p-4 text-sm">
          <div className="flex items-center justify-between gap-4"><span>Essential (always on)</span><Switch checked disabled aria-label="Essential cookies" /></div>
          <div className="flex items-center justify-between gap-4"><span>Analytics</span><Switch checked={analytics} onCheckedChange={setAnalytics} aria-label="Analytics cookies" /></div>
          <div className="flex items-center justify-between gap-4"><span>Marketing</span><Switch checked={marketing} onCheckedChange={setMarketing} aria-label="Marketing cookies" /></div>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => save({ analytics: false, marketing: false })}>Essential only</Button>
        {details ? (
          <Button size="sm" variant="outline" onClick={() => save({ analytics, marketing })}>Save choices</Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => setDetails(true)}>Settings</Button>
        )}
        <Button size="sm" onClick={() => save({ analytics: true, marketing: true })}>Accept all</Button>
      </div>
    </div>
  );
}
