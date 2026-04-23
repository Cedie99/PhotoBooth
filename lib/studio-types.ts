export type LayoutOption = {
  value: "strip-3" | "strip-4" | "grid-2x2" | "grid-3x3";
  label: string;
  rows: number;
  cols: number;
  icon: string;
};

export type ShapeStyle = "square" | "rounded" | "circle";

export type PhotoShape = ShapeStyle;

export type BorderStyle = "none" | "thin" | "thick" | "dashed" | "double" | "glow" | "neon" | "polaroid";

export type BackgroundType = "solid" | "gradient" | "pattern" | "image" | "animated";

export type PatternType = 
  | "dots" 
  | "grid" 
  | "diagonal" 
  | "waves" 
  | "hearts" 
  | "stars" 
  | "confetti"
  | "none";

export type FontFamily = 
  | "modern" 
  | "classic" 
  | "playful" 
  | "elegant" 
  | "retro" 
  | "bold"
  | "handwritten";

export type TextPosition = "top" | "bottom" | "both" | "hidden";

export type TextAlignment = "left" | "center" | "right";

export type FilterEffect = 
  | "none"
  | "grayscale"
  | "sepia"
  | "vintage"
  | "warm"
  | "cool"
  | "dramatic"
  | "soft"
  | "vivid"
  | "fade";

export type StickerStyle = 
  | "none"
  | "minimal"
  | "cute"
  | "party"
  | "love"
  | "celebration"
  | "retro"
  | "nature";

export type TemplateCategory = 
  | "classic"
  | "modern"
  | "fun"
  | "elegant"
  | "retro"
  | "minimal"
  | "vibrant"
  | "dark";

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

export interface GradientConfig {
  type: "linear" | "radial" | "conic";
  angle: number;
  stops: { color: string; position: number }[];
}

export interface StripTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  thumbnail: string;
  colors: ColorPalette;
  gradient?: GradientConfig;
  pattern?: PatternType;
  borderStyle: BorderStyle;
  photoShape: PhotoShape;
  fontFamily: FontFamily;
  filter: FilterEffect;
  textPosition: TextPosition;
  decorations?: string[];
}

export interface StripCustomization {
  templateId: string;
  layout: LayoutOption["value"];
  shape: PhotoShape;
  borderStyle: BorderStyle;
  borderColor: string;
  borderWidth: number;
  backgroundType: BackgroundType;
  backgroundColor: string;
  gradient?: GradientConfig;
  pattern: PatternType;
  patternColor: string;
  patternOpacity: number;
  colors: ColorPalette;
  fontFamily: FontFamily;
  fontSize: number;
  textPosition: TextPosition;
  textAlignment: TextAlignment;
  headerText: string;
  footerText: string;
  subfooterText: string;
  filter: FilterEffect;
  stickerStyle: StickerStyle;
  customStickers: string[];
  cornerRadius: number;
  spacing: number;
  padding: number;
  shadow: boolean;
  shadowColor: string;
  shadowBlur: number;
}

export const layoutOptions: LayoutOption[] = [
  { value: "strip-3", label: "Classic Strip (3)", rows: 3, cols: 1, icon: "⊟⊟⊟" },
  { value: "strip-4", label: "Full Strip (4)", rows: 4, cols: 1, icon: "⊟⊟⊟⊟" },
  { value: "grid-2x2", label: "Square Grid (2x2)", rows: 2, cols: 2, icon: "⊞" },
  { value: "grid-3x3", label: "Full Grid (3x3)", rows: 3, cols: 3, icon: "⊞⊞⊞" }
];

export const shapeOptions: { value: PhotoShape; label: string; icon: string }[] = [
  { value: "square", label: "Square", icon: "□" },
  { value: "rounded", label: "Rounded", icon: "▢" },
  { value: "circle", label: "Circle", icon: "○" }
];

export const borderStyleOptions: { value: BorderStyle; label: string }[] = [
  { value: "none", label: "No Border" },
  { value: "thin", label: "Thin Line" },
  { value: "thick", label: "Thick Line" },
  { value: "dashed", label: "Dashed" },
  { value: "double", label: "Double Line" },
  { value: "glow", label: "Soft Glow" },
  { value: "neon", label: "Neon Effect" },
  { value: "polaroid", label: "Polaroid Style" }
];

export const backgroundTypeOptions: { value: BackgroundType; label: string; icon: string }[] = [
  { value: "solid", label: "Solid Color", icon: "■" },
  { value: "gradient", label: "Gradient", icon: "◬" },
  { value: "pattern", label: "Pattern", icon: "▤" },
  { value: "image", label: "Image", icon: "🖼" },
  { value: "animated", label: "Animated", icon: "✨" }
];

export const patternOptions: { value: PatternType; label: string; preview: string }[] = [
  { value: "none", label: "None", preview: "" },
  { value: "dots", label: "Polka Dots", preview: "⚫" },
  { value: "grid", label: "Grid Lines", preview: "▦" },
  { value: "diagonal", label: "Diagonal Stripes", preview: "⚡" },
  { value: "waves", label: "Waves", preview: "〰" },
  { value: "hearts", label: "Hearts", preview: "♥" },
  { value: "stars", label: "Stars", preview: "★" },
  { value: "confetti", label: "Confetti", preview: "✦" }
];

export const fontFamilyOptions: { value: FontFamily; label: string; sample: string }[] = [
  { value: "modern", label: "Modern Sans", sample: "Aa" },
  { value: "classic", label: "Classic Serif", sample: "Aa" },
  { value: "playful", label: "Playful", sample: "Aa" },
  { value: "elegant", label: "Elegant", sample: "Aa" },
  { value: "retro", label: "Retro", sample: "Aa" },
  { value: "bold", label: "Bold Impact", sample: "Aa" },
  { value: "handwritten", label: "Handwritten", sample: "Aa" }
];

export const filterOptions: { value: FilterEffect; label: string; description: string }[] = [
  { value: "none", label: "Natural", description: "No filter applied" },
  { value: "grayscale", label: "Black & White", description: "Classic monochrome" },
  { value: "sepia", label: "Sepia", description: "Warm vintage tone" },
  { value: "vintage", label: "Vintage Film", description: "Old film look" },
  { value: "warm", label: "Warm Glow", description: "Cozy warm tones" },
  { value: "cool", label: "Cool Breeze", description: "Fresh cool tones" },
  { value: "dramatic", label: "Dramatic", description: "High contrast" },
  { value: "soft", label: "Soft Dream", description: "Gentle and dreamy" },
  { value: "vivid", label: "Vivid Pop", description: "Enhanced colors" },
  { value: "fade", label: "Faded", description: "Subtle faded look" }
];

export const stickerStyleOptions: { value: StickerStyle; label: string; emoji: string }[] = [
  { value: "none", label: "No Stickers", emoji: "✕" },
  { value: "minimal", label: "Minimal", emoji: "◇" },
  { value: "cute", label: "Cute & Kawaii", emoji: "🌸" },
  { value: "party", label: "Party Time", emoji: "🎉" },
  { value: "love", label: "Love & Hearts", emoji: "💕" },
  { value: "celebration", label: "Celebration", emoji: "🎊" },
  { value: "retro", label: "Retro Vibes", emoji: "📼" },
  { value: "nature", label: "Nature", emoji: "🌿" }
];

export const textPositionOptions: { value: TextPosition; label: string }[] = [
  { value: "top", label: "Top Only" },
  { value: "bottom", label: "Bottom Only" },
  { value: "both", label: "Top & Bottom" },
  { value: "hidden", label: "No Text" }
];

export const textAlignmentOptions: { value: TextAlignment; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" }
];

export const predefinedTemplates: StripTemplate[] = [
  {
    id: "photo-strip-pink",
    name: "Photo Strip Pink",
    category: "fun",
    description: "Bold retro pink with star decorations",
    thumbnail: "💗",
    colors: {
      primary: "#ec4899",
      secondary: "#f472b6",
      accent: "#fce7f3",
      background: "#fdf2f8",
      text: "#be185d",
      border: "#fbcfe8"
    },
    gradient: {
      type: "linear",
      angle: 180,
      stops: [
        { color: "#fdf2f8", position: 0 },
        { color: "#fce7f3", position: 0.5 },
        { color: "#fbcfe8", position: 1 }
      ]
    },
    pattern: "none",
    borderStyle: "thick",
    photoShape: "rounded",
    fontFamily: "bold",
    filter: "vivid",
    textPosition: "top",
    decorations: ["stars", "sparkles"]
  },
  {
    id: "every-moment-blue",
    name: "Every Moment",
    category: "modern",
    description: "Cool blue grid with modern typography",
    thumbnail: "💙",
    colors: {
      primary: "#1e40af",
      secondary: "#3b82f6",
      accent: "#dbeafe",
      background: "#eff6ff",
      text: "#1e3a8a",
      border: "#93c5fd"
    },
    gradient: {
      type: "linear",
      angle: 135,
      stops: [
        { color: "#dbeafe", position: 0 },
        { color: "#eff6ff", position: 1 }
      ]
    },
    pattern: "grid",
    borderStyle: "thin",
    photoShape: "rounded",
    fontFamily: "modern",
    filter: "cool",
    textPosition: "both",
    decorations: ["geometric"]
  },
  {
    id: "checkerboard-fun",
    name: "Checkerboard Fun",
    category: "fun",
    description: "Playful checkered pattern design",
    thumbnail: "�",
    colors: {
      primary: "#7c3aed",
      secondary: "#a78bfa",
      accent: "#ede9fe",
      background: "#f5f3ff",
      text: "#5b21b6",
      border: "#c4b5fd"
    },
    pattern: "grid",
    borderStyle: "dashed",
    photoShape: "rounded",
    fontFamily: "playful",
    filter: "vivid",
    textPosition: "top",
    decorations: ["checkered", "shapes"]
  },
  {
    id: "y2k-pink-core",
    name: "Y2K Pink Core",
    category: "vibrant",
    description: "Hot pink Y2K inspired design",
    thumbnail: "💕",
    colors: {
      primary: "#db2777",
      secondary: "#ec4899",
      accent: "#fce7f3",
      background: "#fdf2f8",
      text: "#9d174d",
      border: "#f9a8d4"
    },
    gradient: {
      type: "linear",
      angle: 45,
      stops: [
        { color: "#fce7f3", position: 0 },
        { color: "#fbcfe8", position: 0.5 },
        { color: "#f9a8d4", position: 1 }
      ]
    },
    borderStyle: "glow",
    photoShape: "rounded",
    fontFamily: "bold",
    filter: "vivid",
    textPosition: "both",
    decorations: ["stars", "hearts", "sparkles"]
  },
  {
    id: "cobalt-blue",
    name: "Cobalt Blue",
    category: "modern",
    description: "Deep blue with white frames",
    thumbnail: "🔷",
    colors: {
      primary: "#1e3a8a",
      secondary: "#2563eb",
      accent: "#dbeafe",
      background: "#1e40af",
      text: "#ffffff",
      border: "#60a5fa"
    },
    borderStyle: "thick",
    photoShape: "square",
    fontFamily: "modern",
    filter: "none",
    textPosition: "bottom",
    decorations: ["minimal"]
  },
  {
    id: "cherry-red",
    name: "Cherry Red",
    category: "classic",
    description: "Classic red with white frames",
    thumbnail: "🍒",
    colors: {
      primary: "#dc2626",
      secondary: "#ef4444",
      accent: "#fee2e2",
      background: "#fef2f2",
      text: "#991b1b",
      border: "#fca5a5"
    },
    pattern: "dots",
    borderStyle: "double",
    photoShape: "rounded",
    fontFamily: "classic",
    filter: "warm",
    textPosition: "bottom",
    decorations: ["hearts"]
  },
  {
    id: "lovely-day",
    name: "Lovely Day",
    category: "fun",
    description: "Pink and red with love theme",
    thumbnail: "❤️",
    colors: {
      primary: "#e11d48",
      secondary: "#fb7185",
      accent: "#ffe4e6",
      background: "#fff1f2",
      text: "#be123c",
      border: "#fda4af"
    },
    gradient: {
      type: "linear",
      angle: 135,
      stops: [
        { color: "#ffe4e6", position: 0 },
        { color: "#fce7f3", position: 1 }
      ]
    },
    pattern: "hearts",
    borderStyle: "thick",
    photoShape: "rounded",
    fontFamily: "playful",
    filter: "soft",
    textPosition: "top",
    decorations: ["hearts", "love"]
  },
  {
    id: "photostrip-ideas",
    name: "Photostrip Ideas",
    category: "elegant",
    description: "Elegant pink floral design",
    thumbnail: "�",
    colors: {
      primary: "#db2777",
      secondary: "#f472b6",
      accent: "#fce7f3",
      background: "#fdf2f8",
      text: "#9d174d",
      border: "#fbcfe8"
    },
    pattern: "dots",
    borderStyle: "glow",
    photoShape: "rounded",
    fontFamily: "elegant",
    filter: "soft",
    textPosition: "top",
    decorations: ["floral", "sparkles"]
  },
  {
    id: "blue-checkered",
    name: "Blue Checkered",
    category: "modern",
    description: "Blue and white checkered pattern",
    thumbnail: "🔵",
    colors: {
      primary: "#2563eb",
      secondary: "#60a5fa",
      accent: "#dbeafe",
      background: "#eff6ff",
      text: "#1e40af",
      border: "#93c5fd"
    },
    pattern: "grid",
    borderStyle: "thin",
    photoShape: "square",
    fontFamily: "modern",
    filter: "cool",
    textPosition: "both",
    decorations: ["checkered"]
  },
  {
    id: "retro-90s",
    name: "Retro 90s",
    category: "retro",
    description: "90s inspired bold colors",
    thumbnail: "�",
    colors: {
      primary: "#0891b2",
      secondary: "#22d3ee",
      accent: "#cffafe",
      background: "#ecfeff",
      text: "#0e7490",
      border: "#67e8f9"
    },
    gradient: {
      type: "linear",
      angle: 180,
      stops: [
        { color: "#cffafe", position: 0 },
        { color: "#a5f3fc", position: 0.5 },
        { color: "#67e8f9", position: 1 }
      ]
    },
    borderStyle: "dashed",
    photoShape: "rounded",
    fontFamily: "retro",
    filter: "vintage",
    textPosition: "top",
    decorations: ["retro", "shapes"]
  },
  {
    id: "wavy-purple",
    name: "Wavy Purple",
    category: "vibrant",
    description: "Purple waves with fun shapes",
    thumbnail: "〰️",
    colors: {
      primary: "#7c3aed",
      secondary: "#a78bfa",
      accent: "#ede9fe",
      background: "#f5f3ff",
      text: "#5b21b6",
      border: "#c4b5fd"
    },
    pattern: "waves",
    borderStyle: "glow",
    photoShape: "rounded",
    fontFamily: "playful",
    filter: "vivid",
    textPosition: "both",
    decorations: ["waves", "shapes"]
  },
  {
    id: "classic-black",
    name: "Classic Black",
    category: "minimal",
    description: "Clean black and white design",
    thumbnail: "⚫",
    colors: {
      primary: "#000000",
      secondary: "#374151",
      accent: "#f3f4f6",
      background: "#ffffff",
      text: "#111827",
      border: "#1f2937"
    },
    borderStyle: "thick",
    photoShape: "square",
    fontFamily: "modern",
    filter: "none",
    textPosition: "bottom"
  }
];

export function getFilterStyle(filter: FilterEffect): string {
  switch (filter) {
    case "grayscale": return "grayscale(100%) contrast(1.1)";
    case "sepia": return "sepia(0.7) contrast(1.05)";
    case "vintage": return "sepia(0.3) contrast(1.1) saturate(0.9) brightness(1.05)";
    case "warm": return "saturate(1.2) brightness(1.05) sepia(0.1)";
    case "cool": return "hue-rotate(10deg) saturate(0.95) brightness(1.02)";
    case "dramatic": return "contrast(1.3) saturate(1.1)";
    case "soft": return "contrast(0.95) saturate(0.95) brightness(1.02)";
    case "vivid": return "saturate(1.4) contrast(1.1)";
    case "fade": return "contrast(0.9) saturate(0.8) brightness(1.05)";
    default: return "none";
  }
}

export const defaultCustomization: StripCustomization = {
  templateId: "minimal-white",
  layout: "strip-4",
  shape: "rounded",
  borderStyle: "thin",
  borderColor: "#e5e7eb",
  borderWidth: 2,
  backgroundType: "solid",
  backgroundColor: "#ffffff",
  pattern: "none",
  patternColor: "#e5e7eb",
  patternOpacity: 0.3,
  colors: {
    primary: "#111827",
    secondary: "#6b7280",
    accent: "#f3f4f6",
    background: "#ffffff",
    text: "#111827",
    border: "#e5e7eb"
  },
  fontFamily: "modern",
  fontSize: 16,
  textPosition: "bottom",
  textAlignment: "center",
  headerText: "",
  footerText: "photobooth.ph",
  subfooterText: "",
  filter: "none",
  stickerStyle: "none",
  customStickers: [],
  cornerRadius: 12,
  spacing: 16,
  padding: 24,
  shadow: true,
  shadowColor: "rgba(0,0,0,0.1)",
  shadowBlur: 8
};
