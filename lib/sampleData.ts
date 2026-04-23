import type { MemorySite } from "./types";

export const sampleSites: MemorySite[] = [
  {
    slug: "sofia-marco",
    title: "Sofia & Marco",
    eventType: "Wedding",
    description: "Sunset wedding memories with custom warm editorial theme.",
    photoCount: 247,
    guestCount: 38,
    theme: "warm-editorial",
    publishedAt: "2026-03-18"
  },
  {
    slug: "maya",
    title: "Maya",
    eventType: "Personal",
    description: "Y2K scrapbook vibe with glitter overlays and bold gradients.",
    photoCount: 156,
    guestCount: 22,
    theme: "y2k-maximalist",
    publishedAt: "2026-04-02"
  },
  {
    slug: "alex",
    title: "Alex Reyes",
    eventType: "Portfolio",
    description: "Minimalist gallery layout for recurring mall photobooth sessions.",
    photoCount: 89,
    guestCount: 1,
    theme: "minimal-portfolio",
    publishedAt: "2026-04-09"
  }
];

export function findSiteBySlug(slug: string) {
  return sampleSites.find((site) => site.slug === slug);
}
