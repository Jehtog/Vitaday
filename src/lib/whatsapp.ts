import { supabase } from "@/integrations/supabase/client";
import type { ProductId } from "./catalog";

export const BOT_NAME = "VITADAY";
export const WHATSAPP_NUMBER = "351923534189";

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const botMessages = {
  general: `Hi ${BOT_NAME}! I'd like some help choosing the right daily routine.`,
  cart: (product: string) => `Hi ${BOT_NAME}! I just added the ${product} to my cart and have a quick question.`,
  quiz: (match: string) => `Hi ${BOT_NAME}! I just completed the quiz and got matched with ${match}. Can you tell me more?`,
};

/** Fire-and-forget event log; never blocks the shopper. */
export function logBotEvent(event: "add_to_cart" | "whatsapp_click", source: string, productId?: ProductId, quantity?: number) {
  void supabase
    .from("bot_events")
    .insert({ event, source: source.slice(0, 50), product_id: productId ?? null, quantity: quantity ?? null })
    .then(({ error }) => {
      if (error) console.warn("bot event not saved", error.message);
    });
}
