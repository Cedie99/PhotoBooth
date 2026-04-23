"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  StripCustomization, 
  LayoutOption,
  getFilterStyle
} from "@/lib/studio-types";
import { getPatternStyle } from "./PatternSelector";

interface LivePreviewProps {
  customization: StripCustomization;
  layout: LayoutOption;
  shots: string[];
  isStripLayout: boolean;
  maxShots: number;
}

export function LivePreview({ 
  customization, 
  layout, 
  shots, 
  isStripLayout,
  maxShots 
}: LivePreviewProps) {
  const { colors, pattern, patternColor, patternOpacity, borderStyle, shape } = customization;

  const backgroundStyle = useMemo(() => {
    if (customization.backgroundType === "gradient" && customization.gradient) {
      const { type, angle, stops } = customization.gradient;
      const gradientStops = stops.map(s => `${s.color} ${s.position * 100}%`).join(", ");
      
      if (type === "linear") {
        return { background: `linear-gradient(${angle}deg, ${gradientStops})` };
      } else if (type === "radial") {
        return { background: `radial-gradient(circle, ${gradientStops})` };
      } else {
        return { background: `conic-gradient(from ${angle}deg, ${gradientStops})` };
      }
    }
    return { backgroundColor: customization.backgroundColor };
  }, [customization]);

  const patternStyle = useMemo(() => {
    if (pattern !== "none") {
      return getPatternStyle(pattern, patternColor, patternOpacity);
    }
    return {};
  }, [pattern, patternColor, patternOpacity]);

  const borderStyleProps = useMemo(() => {
    const baseColor = customization.borderColor;
    switch (borderStyle) {
      case "none":
        return { border: "none" };
      case "thin":
        return { border: `2px solid ${baseColor}` };
      case "thick":
        return { border: `4px solid ${baseColor}` };
      case "dashed":
        return { border: `2px dashed ${baseColor}` };
      case "double":
        return { border: `4px double ${baseColor}` };
      case "glow":
        return { 
          border: `2px solid ${baseColor}`,
          boxShadow: `0 0 12px ${baseColor}40, 0 0 4px ${baseColor}20`
        };
      case "neon":
        return {
          border: `2px solid ${colors.primary}`,
          boxShadow: `
            0 0 5px ${colors.primary},
            0 0 10px ${colors.primary}80,
            0 0 20px ${colors.primary}40,
            inset 0 0 5px ${colors.primary}20
          `
        };
      case "polaroid":
        return { 
          border: `8px solid ${colors.background}`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)`
        };
      default:
        return { border: `2px solid ${baseColor}` };
    }
  }, [borderStyle, customization.borderColor, colors]);

  const photoShapeClass = useMemo(() => {
    switch (shape) {
      case "circle": return "aspect-square rounded-full";
      case "rounded": return isStripLayout ? "rounded-xl" : "rounded-2xl";
      case "square": return "rounded-none";
      default: return "rounded-xl";
    }
  }, [shape, isStripLayout]);

  const fontFamily = useMemo(() => {
    switch (customization.fontFamily) {
      case "modern": return "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      case "classic": return "Georgia, 'Times New Roman', serif";
      case "playful": return "'Comic Sans MS', 'Chalkboard SE', cursive";
      case "elegant": return "'Playfair Display', 'Times New Roman', serif";
      case "retro": return "'Courier New', 'Monaco', monospace";
      case "bold": return "Impact, 'Haettenschweiler', 'Arial Narrow Bold', sans-serif";
      case "handwritten": return "'Brush Script MT', 'Lucida Handwriting', cursive";
      default: return "system-ui, sans-serif";
    }
  }, [customization.fontFamily]);

  const shadowStyle = customization.shadow ? {
    boxShadow: `0 ${customization.shadowBlur / 2}px ${customization.shadowBlur}px ${customization.shadowColor}`
  } : {};

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-all duration-500",
        isStripLayout ? "max-w-[320px] mx-auto" : ""
      )}
      style={{
        ...backgroundStyle,
        borderRadius: `${customization.cornerRadius}px`,
        padding: `${customization.padding}px`,
        ...shadowStyle
      }}
    >
      {/* Pattern Overlay */}
      {pattern !== "none" && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={patternStyle}
        />
      )}

      {/* Decorative Elements */}
      <StickerDecorations 
        stickerStyle={customization.stickerStyle} 
        colors={colors}
      />

      <div className="relative z-10">
        {/* Header Text */}
        {(customization.textPosition === "top" || customization.textPosition === "both") && 
         customization.headerText && (
          <div
            className={cn(
              "mb-3 px-3 py-2 rounded-lg animate-fade-in",
              customization.textAlignment === "center" ? "text-center" :
              customization.textAlignment === "right" ? "text-right" : "text-left"
            )}
            style={{
              backgroundColor: colors.accent + "30",
              color: colors.text,
              fontFamily,
              fontSize: `${customization.fontSize}px`,
              fontWeight: customization.fontFamily === "bold" ? 800 : 600,
              textTransform: customization.fontFamily === "bold" ? "uppercase" : "none",
              letterSpacing: customization.fontFamily === "bold" ? "0.05em" : "normal"
            }}
          >
            {customization.headerText}
          </div>
        )}

        {/* Photo Grid */}
        <div 
          className="grid gap-3"
          style={{ 
            gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
            gap: `${customization.spacing}px`
          }}
        >
          {Array.from({ length: maxShots }).map((_, index) => {
            const shot = shots[index];
            return (
              <div
                key={`${layout.value}-${index}`}
                className={cn(
                  "overflow-hidden bg-muted/30 animate-fade-in",
                  photoShapeClass
                )}
                style={{
                  ...borderStyleProps,
                  aspectRatio: shape === "circle" ? "1/1" : isStripLayout ? "4/3" : "1/1",
                  animationDelay: `${index * 50}ms`
                }}
              >
                {shot ? (
                  <img
                    src={shot}
                    alt={`Captured shot ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ filter: getFilterStyle(customization.filter) }}
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ color: colors.text + "60" }}
                  >
                    <span className="text-xs font-medium">{index + 1}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Text */}
        {(customization.textPosition === "bottom" || customization.textPosition === "both") && 
         customization.footerText && (
          <div
            className={cn(
              "mt-3 px-3 py-3 rounded-lg animate-fade-in",
              customization.textAlignment === "center" ? "text-center" :
              customization.textAlignment === "right" ? "text-right" : "text-left"
            )}
            style={{
              backgroundColor: colors.accent + "30",
              color: colors.text,
              fontFamily,
              fontSize: `${customization.fontSize + 2}px`,
              fontWeight: 600
            }}
          >
            {customization.footerText}
          </div>
        )}

        {/* Subfooter */}
        {customization.subfooterText && (
          <div
            className={cn(
              "mt-2 px-2 py-1 text-xs animate-fade-in",
              customization.textAlignment === "center" ? "text-center" :
              customization.textAlignment === "right" ? "text-right" : "text-left"
            )}
            style={{
              color: colors.text + "99",
              fontFamily,
              animationDelay: "200ms"
            }}
          >
            {customization.subfooterText}
          </div>
        )}
      </div>
    </div>
  );
}

// Sticker Decorations Component
interface StickerDecorationsProps {
  stickerStyle: string;
  colors: { primary: string; secondary: string; accent: string };
}

function StickerDecorations({ stickerStyle, colors }: StickerDecorationsProps) {
  if (stickerStyle === "none") return null;

  const getStickers = () => {
    switch (stickerStyle) {
      case "cute":
        return ["✨", "🌸", "💕", "⭐", "🎀", "💖"];
      case "party":
        return ["🎉", "🎊", "✨", "🎈", "🎁", "🎂"];
      case "love":
        return ["❤️", "💕", "💖", "💗", "💝", "💘"];
      case "celebration":
        return ["🎊", "✨", "🎉", "🌟", "💫", "⭐"];
      case "retro":
        return ["📼", "✌️", "💿", "🎵", "⭐", "🌈"];
      case "nature":
        return ["🌿", "🌸", "🍃", "🌼", "🦋", "🌱"];
      case "minimal":
        return ["◆", "○", "△", "□", "✦", "◇"];
      default:
        return [];
    }
  };

  const stickers = getStickers();
  const positions = [
    { top: "5%", left: "5%" },
    { top: "10%", right: "8%" },
    { top: "25%", left: "3%" },
    { top: "40%", right: "5%" },
    { top: "60%", left: "8%" },
    { top: "75%", right: "3%" },
    { bottom: "15%", left: "5%" },
    { bottom: "25%", right: "8%" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stickers.map((emoji, index) => {
        const pos = positions[index % positions.length];
        const rotation = Math.random() * 30 - 15;
        const scale = 0.8 + Math.random() * 0.4;
        
        return (
          <span
            key={index}
            className="absolute text-lg opacity-60"
            style={{
              ...pos,
              transform: `rotate(${rotation}deg) scale(${scale})`,
              filter: `drop-shadow(0 2px 4px ${colors.primary}40)`,
            }}
          >
            {emoji}
          </span>
        );
      })}
    </div>
  );
}
