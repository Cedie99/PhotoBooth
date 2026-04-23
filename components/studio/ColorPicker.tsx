"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  presetColors?: string[];
}

const defaultPresets = [
  "#ffffff", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#374151", "#111827",
  "#fef2f2", "#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#991b1b", "#7f1d1d",
  "#fff7ed", "#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#9a3412", "#7c2d12",
  "#fefce8", "#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207", "#713f12",
  "#f0fdf4", "#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d", "#14532d",
  "#f0f9ff", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7", "#0369a1", "#0c4a6e",
  "#eff6ff", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af",
  "#faf5ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7e22ce", "#6b21a8",
  "#fdf4ff", "#f5d0fe", "#f0abfc", "#e879f9", "#d946ef", "#c026d3", "#a21caf", "#701a75",
  "#fff1f3", "#fda4af", "#fb7185", "#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337"
];

export function ColorPicker({ 
  color, 
  onChange, 
  label,
  presetColors = defaultPresets 
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full h-9 rounded-lg border-2 flex items-center gap-2 px-2 transition-all duration-200",
            isOpen ? "border-primary ring-2 ring-primary/20" : "border-input hover:border-primary/50"
          )}
        >
          <div 
            className="w-5 h-5 rounded-md border shadow-sm"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-mono uppercase flex-1 text-left">{color}</span>
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-popover border rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95">
              {/* Custom Color Input */}
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => onChange(e.target.value)}
                  className="flex-1 h-8 px-2 text-xs border rounded-md bg-background"
                  placeholder="#000000"
                />
              </div>

              {/* Preset Grid */}
              <div className="grid grid-cols-8 gap-1">
                {presetColors.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      onChange(preset);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-6 h-6 rounded-md border transition-all duration-150 hover:scale-110",
                      color.toLowerCase() === preset.toLowerCase() 
                        ? "border-primary ring-1 ring-primary shadow-sm scale-110" 
                        : "border-transparent hover:border-muted-foreground/30"
                    )}
                    style={{ backgroundColor: preset }}
                    title={preset}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface GradientBuilderProps {
  gradient: {
    type: "linear" | "radial" | "conic";
    angle: number;
    stops: { color: string; position: number }[];
  };
  onChange: (gradient: any) => void;
}

export function GradientBuilder({ gradient, onChange }: GradientBuilderProps) {
  const updateStop = (index: number, updates: Partial<{ color: string; position: number }>) => {
    const newStops = [...gradient.stops];
    newStops[index] = { ...newStops[index], ...updates };
    onChange({ ...gradient, stops: newStops });
  };

  const addStop = () => {
    const newStops = [...gradient.stops];
    const lastStop = newStops[newStops.length - 1];
    newStops.push({ 
      color: lastStop?.color || "#ffffff", 
      position: Math.min(1, (lastStop?.position || 1) + 0.1) 
    });
    onChange({ ...gradient, stops: newStops });
  };

  const removeStop = (index: number) => {
    if (gradient.stops.length <= 2) return;
    const newStops = gradient.stops.filter((_, i) => i !== index);
    onChange({ ...gradient, stops: newStops });
  };

  return (
    <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
      {/* Preview */}
      <div 
        className="h-12 rounded-lg border shadow-inner"
        style={{
          background: `linear-gradient(${gradient.angle}deg, ${gradient.stops.map(s => `${s.color} ${s.position * 100}%`).join(", ")})`
        }}
      />

      {/* Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium w-12">Angle</label>
          <input
            type="range"
            min="0"
            max="360"
            value={gradient.angle}
            onChange={(e) => onChange({ ...gradient, angle: parseInt(e.target.value) })}
            className="flex-1 h-1 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs font-mono w-10 text-right">{gradient.angle}°</span>
        </div>

        {/* Color Stops */}
        <div className="space-y-2">
          {gradient.stops.map((stop, index) => (
            <div key={index} className="flex items-center gap-2">
              <ColorPicker
                color={stop.color}
                onChange={(color) => updateStop(index, { color })}
                presetColors={defaultPresets}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(stop.position * 100)}
                onChange={(e) => updateStop(index, { position: parseInt(e.target.value) / 100 })}
                className="flex-1 h-1 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-mono w-10 text-right">
                {Math.round(stop.position * 100)}%
              </span>
              <button
                type="button"
                onClick={() => removeStop(index)}
                disabled={gradient.stops.length <= 2}
                className="p-1 text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addStop}
          className="w-full py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
        >
          + Add Color Stop
        </button>
      </div>
    </div>
  );
}
