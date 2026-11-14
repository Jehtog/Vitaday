import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { CollectionId } from "./catalog";
import type { PresetId } from "./quiz/presets";

export const emailSchema = z.string().trim().email("Please enter a valid email address.").max(255);

export async function joinWaitlist(email: string, collection: Exclude<CollectionId, "essential">) {
  const parsed = emailSchema.parse(email);
  const { error } = await supabase.from("waitlist_signups").insert({ email: parsed.toLowerCase(), collection });
  if (error) throw new Error("Something went wrong. Please try again.");
}

export async function joinNewsletter(email: string, source: string) {
  const parsed = emailSchema.parse(email);
  const { error } = await supabase.from("newsletter_signups").insert({ email: parsed.toLowerCase(), source: source.slice(0, 50) });
  if (error) throw new Error("Something went wrong. Please try again.");
}

export async function voteForCollection(collection: Exclude<CollectionId, "essential">) {
  const { error } = await supabase.from("collection_votes").insert({ collection });
  if (error) throw new Error("Your vote couldn't be saved. Please try again.");
}

/** Stores the email a visitor opted in with, plus the presets the quiz recommended. */
export async function saveQuizResult(email: string, primary: PresetId, secondary: PresetId | null) {
  const parsed = emailSchema.parse(email);
  const { error } = await supabase.from("quiz_email_results").insert({
    email: parsed.toLowerCase(),
    primary_preset: primary,
    secondary_preset: secondary,
    consent: true,
  });
  if (error) throw new Error("Something went wrong. Please try again.");
}

export async function fetchVoteCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc("get_collection_vote_counts");
  if (error || !data) return {};
  const out: Record<string, number> = {};
  for (const row of data) out[row.collection] = Number(row.votes);
  return out;
}
