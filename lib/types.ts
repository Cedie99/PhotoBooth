export type MemoryTheme = "warm-editorial" | "y2k-maximalist" | "minimal-portfolio";

export interface MemorySite {
  slug: string;
  title: string;
  eventType: string;
  description: string;
  photoCount: number;
  guestCount: number;
  theme: MemoryTheme;
  publishedAt: string;
}

export interface CustomizationPayload {
  layout: "strip-4" | "grid-2x2" | "strip-3" | "grid-3x3";
  frame: string;
  filter: string;
  stickers: string[];
  textOverlay: string;
}
