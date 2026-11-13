// IMAGE SLOTS — every product picture on the site comes from here.
// Swap any entry for your final product render and it updates everywhere.
import bottleHero from "@/assets/product/bottle_hero.jpg.asset.json";
import bottlePlinth from "@/assets/product/bottle_plinth.jpg.asset.json";
import capCloseup from "@/assets/product/cap_closeup.jpg.asset.json";
import powderRelease from "@/assets/product/powder_release.jpg.asset.json";
import collectionsLineup from "@/assets/product/collections_lineup.jpg.asset.json";
import ringInsert from "@/assets/product/ring_insert.jpg.asset.json";
import refillBox from "@/assets/product/refill_box.jpg.asset.json";
import stepOpen from "@/assets/product/step_open.jpg.asset.json";
import stepDrop from "@/assets/product/step_drop.jpg.asset.json";
import stepRotate from "@/assets/product/step_rotate.jpg.asset.json";
import boxEssential from "@/assets/product/box_essential.jpg.asset.json";
import boxGlow from "@/assets/product/box_glow.jpg.asset.json";
import boxBalance from "@/assets/product/box_balance.jpg.asset.json";
import boxActive from "@/assets/product/box_active.jpg.asset.json";
import boxFocus from "@/assets/product/box_focus.jpg.asset.json";
import boxCycle from "@/assets/product/box_cycle.jpg.asset.json";
import boxJunior from "@/assets/product/box_junior.jpg.asset.json";
import lifestyleDesk from "@/assets/lifestyle-desk.jpg";
import bottleInHand from "@/assets/bottle-in-hand.jpg";
import howItWorksFilm from "@/assets/video/vitaday_how_it_works.mp4.asset.json";
import type { CollectionId } from "./catalog";

export const media = {
  bottleHero: { src: bottleHero.url, alt: "VITADAY glass bottle with ivory weekday cap on a stone plinth" },
  bottlePlinth: { src: bottlePlinth.url, alt: "VITADAY bottle standing in soft daylight" },
  capCloseup: { src: capCloseup.url, alt: "Close-up of the VITADAY cap with the weekday ring MON to SUN" },
  powderRelease: { src: powderRelease.url, alt: "Vitamin powder dissolving into water inside the bottle" },
  collectionsLineup: { src: collectionsLineup.url, alt: "The seven VITADAY refill collections next to the bottle" },
  ringInsert: { src: ringInsert.url, alt: "Weekly Refill Ring clicking into the open cap" },
  refillBox: { src: refillBox.url, alt: "VITADAY Essential 7-day refill box with a Weekly Refill Ring" },
  stepOpen: { src: stepOpen.url, alt: "Step 1: open the cap" },
  stepDrop: { src: stepDrop.url, alt: "Step 2: drop in the Weekly Refill Ring" },
  stepRotate: { src: stepRotate.url, alt: "Step 3: rotate to today and press to release" },
  lifestyleDesk: { src: lifestyleDesk, alt: "A woman at her desk holding a glass water bottle" },
  bottleInHand: { src: bottleInHand, alt: "A hand holding the bottle to show its size" },
} as const;

export const videos: { howItWorks: string | null; product: string | null; poster: string } = {
  // Home page + How it works page — your 26-second film
  howItWorks: howItWorksFilm.url,
  // Product page — still empty, shows the marked "Video slot" box
  product: null,
  poster: media.bottleHero.src,
};

// VIDEO SLOTS — every product film on the site comes from here.
// The howItWorks film is a CDN pointer: src/assets/video/vitaday_how_it_works.mp4.asset.json
// (upload a file with `lovable-assets create --file <file> --filename <name>`, import the
// printed .asset.json here and use its .url). To fill the product slot the same way, import
// its pointer and set product: <that>.url. Leave a slot null and the page keeps showing the
// clearly marked "Video slot" box.

export const collectionBox: Record<CollectionId, string> = {
  essential: boxEssential.url,
  glow: boxGlow.url,
  balance: boxBalance.url,
  active: boxActive.url,
  focus: boxFocus.url,
  cycle: boxCycle.url,
  junior: boxJunior.url,
};
