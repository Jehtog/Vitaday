import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/lib/cart";
import { PRODUCTS } from "@/lib/catalog";
import { BOT_NAME, botMessages, logBotEvent, whatsappUrl } from "@/lib/whatsapp";

export function WhatsAppLink({ message, source, label, className, variant = "default" }: { message: string; source: string; label: string; className?: string; variant?: "default" | "outline" }) {
  return (
    <Button asChild size="lg" variant={variant} className={className}>
      <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" onClick={() => logBotEvent("whatsapp_click", source)}>
        <MessageCircle className="mr-2 h-4 w-4" aria-hidden /> {label}
      </a>
    </Button>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl(botMessages.general)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => logBotEvent("whatsapp_click", "floating_button")}
      aria-label={`Chat with ${BOT_NAME} on WhatsApp`}
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-primary px-5 text-sm text-primary-foreground shadow-lift transition-transform hover:scale-105"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="hidden sm:inline">Chat with {BOT_NAME}</span>
    </a>
  );
}

export function AddedToCartPopup() {
  const { botPrompt, setBotPrompt, setOpen } = useCart();
  const product = botPrompt ? PRODUCTS[botPrompt].name : "";
  const close = (openCart: boolean) => {
    setBotPrompt(null);
    if (openCart) setOpen(true);
  };
  return (
    <Dialog open={botPrompt !== null} onOpenChange={(o) => !o && close(true)}>
      <DialogContent className="max-w-md bg-background">
        <DialogHeader>
          <p className="eyebrow">Added to your cart</p>
          <DialogTitle className="font-display text-3xl font-normal">{product}</DialogTitle>
          <DialogDescription>
            Questions about the Weekly Refill Ring or which routine fits you? Try our new {BOT_NAME} assistant on WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-3">
          <WhatsAppLink message={botMessages.cart(product)} source="cart_popup" label={`Chat with ${BOT_NAME}`} className="w-full" />
          <Button size="lg" variant="outline" className="w-full" onClick={() => close(true)}>View cart</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
