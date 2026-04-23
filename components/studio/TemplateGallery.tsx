"use client";

import { useState, useMemo } from "react";
import { 
  predefinedTemplates, 
  StripTemplate, 
  TemplateCategory
} from "@/lib/studio-types";
import { cn } from "@/lib/utils";

interface TemplateGalleryProps {
  selectedTemplateId: string;
  onSelectTemplate: (template: StripTemplate) => void;
  onApplyToCustomization: (template: StripTemplate) => void;
}

const categoryLabels: Record<TemplateCategory, { label: string; color: string }> = {
  classic: { label: "Classic", color: "bg-amber-100 text-amber-800" },
  modern: { label: "Modern", color: "bg-blue-100 text-blue-800" },
  fun: { label: "Fun & Playful", color: "bg-pink-100 text-pink-800" },
  elegant: { label: "Elegant", color: "bg-purple-100 text-purple-800" },
  retro: { label: "Retro", color: "bg-orange-100 text-orange-800" },
  minimal: { label: "Minimal", color: "bg-gray-100 text-gray-800" },
  vibrant: { label: "Vibrant", color: "bg-fuchsia-100 text-fuchsia-800" },
  dark: { label: "Dark Mode", color: "bg-slate-800 text-slate-100" }
};

export function TemplateGallery({ 
  selectedTemplateId, 
  onSelectTemplate,
  onApplyToCustomization 
}: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all");
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(predefinedTemplates.map(t => t.category));
    return Array.from(cats);
  }, []);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === "all") return predefinedTemplates;
    return predefinedTemplates.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
            activeCategory === "all"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          )}
        >
          All Templates
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-md"
                : categoryLabels[cat].color + " hover:opacity-80"
            )}
          >
            {categoryLabels[cat].label}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            onClick={() => {
              onSelectTemplate(template);
              onApplyToCustomization(template);
            }}
            className={cn(
              "group relative cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden animate-fade-in",
              selectedTemplateId === template.id
                ? "border-primary ring-2 ring-primary/30 shadow-lg scale-[1.02]"
                : "border-border hover:border-primary/50 hover:shadow-md"
            )}
              style={{
                background: template.gradient
                  ? `linear-gradient(${template.gradient.angle}deg, ${template.gradient.stops.map(s => `${s.color} ${s.position * 100}%`).join(", ")})`
                  : template.colors.background
              }}
            >
              {/* Preview Card */}
              <div className="p-3 aspect-[3/4] flex flex-col">
                {/* Mini Header */}
                {template.textPosition === "top" || template.textPosition === "both" ? (
                  <div 
                    className="text-[8px] font-medium text-center mb-2 truncate px-1"
                    style={{ color: template.colors.text, fontFamily: getFontFamily(template.fontFamily) }}
                  >
                    {template.name}
                  </div>
                ) : <div className="h-4" />}

                {/* Mini Photo Slots */}
                <div className="flex-1 flex flex-col gap-1.5 justify-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex-1 rounded border-2 flex items-center justify-center"
                      style={{ 
                        borderColor: template.colors.border,
                        borderStyle: template.borderStyle === "dashed" ? "dashed" : "solid",
                        borderRadius: template.photoShape === "circle" ? "50%" : template.photoShape === "rounded" ? "6px" : "2px",
                        backgroundColor: template.colors.accent + "40"
                      }}
                    >
                      <span className="text-xs opacity-30">📷</span>
                    </div>
                  ))}
                </div>

                {/* Mini Footer */}
                {template.textPosition === "bottom" || template.textPosition === "both" ? (
                  <div 
                    className="text-[8px] font-medium text-center mt-2 truncate px-1"
                    style={{ color: template.colors.text, fontFamily: getFontFamily(template.fontFamily) }}
                  >
                    {template.name}
                  </div>
                ) : <div className="h-4" />}
              </div>

              {/* Hover Overlay */}
              <div 
                className={cn(
                  "absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 transition-opacity duration-200",
                  hoveredTemplate === template.id ? "opacity-100" : "opacity-0"
                )}
              >
                <span className="text-white text-xs font-medium text-center px-2">
                  {template.name}
                </span>
                <span className="text-white/70 text-[10px] text-center px-2 line-clamp-2">
                  {template.description}
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-medium mt-1",
                  categoryLabels[template.category].color
                )}>
                  {categoryLabels[template.category].label}
                </span>
              </div>

            {/* Selected Indicator */}
            {selectedTemplateId === template.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-md">
                <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No templates found in this category</p>
        </div>
      )}
    </div>
  );
}

function getFontFamily(font: string): string {
  const fontMap: Record<string, string> = {
    modern: "system-ui, -apple-system, sans-serif",
    classic: "Georgia, serif",
    playful: "cursive",
    elegant: "Times New Roman, serif",
    retro: "Courier New, monospace",
    bold: "Impact, sans-serif",
    handwritten: "cursive"
  };
  return fontMap[font] || "system-ui";
}
