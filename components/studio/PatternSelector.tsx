"use client";

import { cn } from "@/lib/utils";
import { PatternType, patternOptions } from "@/lib/studio-types";

interface PatternSelectorProps {
  selectedPattern: PatternType;
  patternColor: string;
  patternOpacity: number;
  onPatternChange: (pattern: PatternType) => void;
  onColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
}

export function PatternSelector({
  selectedPattern,
  patternColor,
  patternOpacity,
  onPatternChange,
  onColorChange,
  onOpacityChange
}: PatternSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Background Pattern</label>
      
      {/* Pattern Grid */}
      <div className="grid grid-cols-4 gap-2">
        {patternOptions.map((pattern) => (
          <button
            key={pattern.value}
            type="button"
            onClick={() => onPatternChange(pattern.value)}
            className={cn(
              "relative aspect-square rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1",
              selectedPattern === pattern.value
                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                : "border-input hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            {/* Pattern Preview */}
            <div 
              className="w-8 h-8 rounded-md border overflow-hidden"
              style={{ 
                backgroundColor: "#f3f4f6",
                ...getPatternStyle(pattern.value, patternColor, patternOpacity)
              }}
            />
            <span className="text-[10px] font-medium text-muted-foreground">{pattern.label}</span>
          </button>
        ))}
      </div>

      {/* Pattern Controls */}
      {selectedPattern !== "none" && (
        <div className="space-y-3 p-3 bg-muted/50 rounded-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium w-16">Color</label>
            <input
              type="color"
              value={patternColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-10 h-8 rounded cursor-pointer border-0 p-0"
            />
            <input
              type="text"
              value={patternColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="flex-1 h-8 px-2 text-xs border rounded-md bg-background font-mono uppercase"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium w-16">Opacity</label>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(patternOpacity * 100)}
              onChange={(e) => onOpacityChange(parseInt(e.target.value) / 100)}
              className="flex-1 h-1 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs font-mono w-10 text-right">{Math.round(patternOpacity * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function getPatternStyle(
  pattern: PatternType, 
  color: string = "#000000", 
  opacity: number = 0.1
): React.CSSProperties {
  const rgba = hexToRgba(color, opacity);
  
  switch (pattern) {
    case "dots":
      return {
        backgroundImage: `radial-gradient(circle, ${rgba} 1.5px, transparent 1.5px)`,
        backgroundSize: "12px 12px"
      };
    case "grid":
      return {
        backgroundImage: `
          linear-gradient(${rgba} 1px, transparent 1px),
          linear-gradient(90deg, ${rgba} 1px, transparent 1px)
        `,
        backgroundSize: "16px 16px"
      };
    case "diagonal":
      return {
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 8px,
          ${rgba} 8px,
          ${rgba} 10px
        )`
      };
    case "waves":
      return {
        backgroundImage: `radial-gradient(ellipse at center, ${rgba} 0%, transparent 70%)`,
        backgroundSize: "20px 10px"
      };
    case "hearts":
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E")`,
        backgroundSize: "16px 16px"
      };
    case "stars":
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(rgba)}' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/%3E%3C/svg%3E")`,
        backgroundSize: "16px 16px"
      };
    case "confetti":
      return {
        backgroundImage: `
          radial-gradient(circle at 20% 30%, ${rgba} 2px, transparent 2px),
          radial-gradient(circle at 70% 60%, ${rgba} 2px, transparent 2px),
          radial-gradient(circle at 40% 80%, ${rgba} 2px, transparent 2px),
          radial-gradient(circle at 80% 20%, ${rgba} 2px, transparent 2px)
        `,
        backgroundSize: "30px 30px, 25px 25px, 35px 35px, 20px 20px"
      };
    default:
      return {};
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
