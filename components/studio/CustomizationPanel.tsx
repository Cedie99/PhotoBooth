"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  StripCustomization,
  StripTemplate,
  LayoutOption,
  ShapeStyle,
  BorderStyle,
  BackgroundType,
  PatternType,
  FontFamily,
  FilterEffect,
  StickerStyle,
  TextPosition,
  TextAlignment,
  layoutOptions,
  shapeOptions,
  borderStyleOptions,
  backgroundTypeOptions,
  patternOptions,
  fontFamilyOptions,
  filterOptions,
  stickerStyleOptions,
  textPositionOptions,
  textAlignmentOptions
} from "@/lib/studio-types";
import { ColorPicker, GradientBuilder } from "./ColorPicker";
import { PatternSelector } from "./PatternSelector";

interface CustomizationPanelProps {
  customization: StripCustomization;
  onCustomizationChange: (updates: Partial<StripCustomization>) => void;
  selectedTemplate: StripTemplate | null;
}

export function CustomizationPanel({ 
  customization, 
  onCustomizationChange,
  selectedTemplate
}: CustomizationPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("layout");

  type TabType = "layout" | "colors" | "typography" | "effects" | "advanced";

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "layout", label: "Layout", icon: "⊞" },
    { id: "colors", label: "Colors", icon: "◐" },
    { id: "typography", label: "Text", icon: "T" },
    { id: "effects", label: "Effects", icon: "✦" },
    { id: "advanced", label: "More", icon: "⋯" }
  ];

  const updateColors = (colorKey: keyof typeof customization.colors, value: string) => {
    onCustomizationChange({
      colors: { ...customization.colors, [colorKey]: value }
    });
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
            )}
          >
            <span className="text-sm">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4 animate-fade-in">
        {/* Layout Tab */}
        {activeTab === "layout" && (
          <div className="space-y-4">
            {/* Layout Selection */}
            <div className="space-y-2">
              <label className="studio-label">Grid Layout</label>
              <div className="grid grid-cols-2 gap-2">
                {layoutOptions.map((layout) => (
                  <button
                    key={layout.value}
                    onClick={() => onCustomizationChange({ layout: layout.value })}
                    className={cn(
                      "p-3 rounded-xl border-2 text-left transition-all duration-200",
                      customization.layout === layout.value
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{layout.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{layout.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {layout.rows} × {layout.cols}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Shape */}
            <div className="space-y-2">
              <label className="studio-label">Photo Shape</label>
              <div className="flex gap-2">
                {shapeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onCustomizationChange({ shape: option.value })}
                    className={cn(
                      "flex-1 py-3 px-2 rounded-xl border-2 flex flex-col items-center gap-1 transition-all duration-200",
                      customization.shape === option.value
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <span className="text-xs font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Border Style */}
            <div className="space-y-2">
              <label className="studio-label">Border Style</label>
              <div className="grid grid-cols-4 gap-2">
                {borderStyleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onCustomizationChange({ borderStyle: option.value })}
                    className={cn(
                      "py-2 px-2 rounded-lg border-2 text-xs font-medium transition-all duration-200",
                      customization.borderStyle === option.value
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Color */}
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Border Color"
                color={customization.borderColor}
                onChange={(color) => onCustomizationChange({ borderColor: color })}
              />
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Border Width</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={customization.borderWidth}
                  onChange={(e) => onCustomizationChange({ borderWidth: parseInt(e.target.value) })}
                  className="w-full h-2 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-muted-foreground text-right">{customization.borderWidth}px</div>
              </div>
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === "colors" && (
          <div className="space-y-4">
            {/* Background Type */}
            <div className="space-y-2">
              <label className="studio-label">Background Type</label>
              <div className="flex flex-wrap gap-2">
                {backgroundTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onCustomizationChange({ backgroundType: option.value })}
                    className={cn(
                      "py-2 px-3 rounded-lg border-2 text-sm font-medium flex items-center gap-2 transition-all duration-200",
                      customization.backgroundType === option.value
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/50"
                    )}
                  >
                    <span>{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Solid Background */}
            {customization.backgroundType === "solid" && (
              <ColorPicker
                label="Background Color"
                color={customization.backgroundColor}
                onChange={(color) => onCustomizationChange({ backgroundColor: color })}
              />
            )}

            {/* Gradient Background */}
            {customization.backgroundType === "gradient" && customization.gradient && (
              <GradientBuilder
                gradient={customization.gradient}
                onChange={(gradient) => onCustomizationChange({ gradient })}
              />
            )}

            {/* Pattern Background */}
            {customization.backgroundType === "pattern" && (
              <PatternSelector
                selectedPattern={customization.pattern}
                patternColor={customization.patternColor}
                patternOpacity={customization.patternOpacity}
                onPatternChange={(pattern) => onCustomizationChange({ pattern })}
                onColorChange={(color) => onCustomizationChange({ patternColor: color })}
                onOpacityChange={(opacity) => onCustomizationChange({ patternOpacity: opacity })}
              />
            )}

            {/* Color Palette */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-xl">
              <label className="studio-label">Color Palette</label>
              <div className="grid grid-cols-2 gap-3">
                <ColorPicker
                  label="Primary"
                  color={customization.colors.primary}
                  onChange={(color) => updateColors("primary", color)}
                />
                <ColorPicker
                  label="Secondary"
                  color={customization.colors.secondary}
                  onChange={(color) => updateColors("secondary", color)}
                />
                <ColorPicker
                  label="Accent"
                  color={customization.colors.accent}
                  onChange={(color) => updateColors("accent", color)}
                />
                <ColorPicker
                  label="Text"
                  color={customization.colors.text}
                  onChange={(color) => updateColors("text", color)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Typography Tab */}
        {activeTab === "typography" && (
          <div className="space-y-4">
            {/* Text Position */}
            <div className="space-y-2">
              <label className="studio-label">Text Position</label>
              <div className="flex gap-2">
                {textPositionOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onCustomizationChange({ textPosition: option.value })}
                    className={cn(
                      "flex-1 py-2 px-2 rounded-lg border-2 text-xs font-medium transition-all duration-200",
                      customization.textPosition === option.value
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Alignment */}
            <div className="space-y-2">
              <label className="studio-label">Text Alignment</label>
              <div className="flex gap-2">
                {textAlignmentOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onCustomizationChange({ textAlignment: option.value })}
                    className={cn(
                      "flex-1 py-2 px-2 rounded-lg border-2 text-xs font-medium transition-all duration-200",
                      customization.textAlignment === option.value
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
              <label className="studio-label">Font Style</label>
              <div className="grid grid-cols-2 gap-2">
                {fontFamilyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onCustomizationChange({ fontFamily: option.value })}
                    className={cn(
                      "py-2 px-3 rounded-lg border-2 text-sm font-medium flex items-center justify-between transition-all duration-200",
                      customization.fontFamily === option.value
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/50"
                    )}
                  >
                    <span>{option.label}</span>
                    <span 
                      className="text-lg"
                      style={{ fontFamily: getFontFamily(option.value) }}
                    >
                      {option.sample}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Content */}
            {customization.textPosition !== "hidden" && (
              <div className="space-y-3">
                {(customization.textPosition === "top" || customization.textPosition === "both") && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Header Text</label>
                    <input
                      type="text"
                      value={customization.headerText}
                      onChange={(e) => onCustomizationChange({ headerText: e.target.value })}
                      placeholder="Optional header text..."
                      className="w-full h-10 px-3 rounded-lg border bg-background text-sm"
                    />
                  </div>
                )}
                {(customization.textPosition === "bottom" || customization.textPosition === "both") && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Footer Text</label>
                    <input
                      type="text"
                      value={customization.footerText}
                      onChange={(e) => onCustomizationChange({ footerText: e.target.value })}
                      placeholder="Main text on card..."
                      className="w-full h-10 px-3 rounded-lg border bg-background text-sm"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Subfooter</label>
                  <input
                    type="text"
                    value={customization.subfooterText}
                    onChange={(e) => onCustomizationChange({ subfooterText: e.target.value })}
                    placeholder="Optional subfooter..."
                    className="w-full h-10 px-3 rounded-lg border bg-background text-sm"
                  />
                </div>
              </div>
            )}

            {/* Font Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Font Size</label>
              <input
                type="range"
                min="10"
                max="32"
                value={customization.fontSize}
                onChange={(e) => onCustomizationChange({ fontSize: parseInt(e.target.value) })}
                className="w-full h-2 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-muted-foreground text-right">{customization.fontSize}px</div>
            </div>
          </div>
        )}

        {/* Effects Tab */}
        {activeTab === "effects" && (
          <div className="space-y-4">
            {/* Filter */}
            <div className="space-y-2">
              <label className="studio-label">Photo Filter</label>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onCustomizationChange({ filter: option.value })}
                    className={cn(
                      "py-2 px-3 rounded-lg border-2 text-left transition-all duration-200",
                      customization.filter === option.value
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/50"
                    )}
                  >
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stickers */}
            <div className="space-y-2">
              <label className="studio-label">Sticker Style</label>
              <div className="grid grid-cols-4 gap-2">
                {stickerStyleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onCustomizationChange({ stickerStyle: option.value })}
                    className={cn(
                      "py-2 px-1 rounded-lg border-2 flex flex-col items-center gap-1 transition-all duration-200",
                      customization.stickerStyle === option.value
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/50"
                    )}
                  >
                    <span className="text-lg">{option.emoji}</span>
                    <span className="text-[10px] font-medium text-center leading-tight">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Shadow */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="studio-label mb-0">Card Shadow</label>
                <button
                  onClick={() => onCustomizationChange({ shadow: !customization.shadow })}
                  className={cn(
                    "w-11 h-6 rounded-full transition-colors duration-200 relative",
                    customization.shadow ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                >
                  <span 
                    className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200",
                      customization.shadow ? "left-6" : "left-1"
                    )}
                  />
                </button>
              </div>
              {customization.shadow && (
                <div className="space-y-3">
                  <ColorPicker
                    label="Shadow Color"
                    color={customization.shadowColor}
                    onChange={(color) => onCustomizationChange({ shadowColor: color })}
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Blur Amount</label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={customization.shadowBlur}
                      onChange={(e) => onCustomizationChange({ shadowBlur: parseInt(e.target.value) })}
                      className="w-full h-2 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-muted-foreground text-right">{customization.shadowBlur}px</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === "advanced" && (
          <div className="space-y-4">
            {/* Corner Radius */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Corner Radius</label>
              <input
                type="range"
                min="0"
                max="40"
                value={customization.cornerRadius}
                onChange={(e) => onCustomizationChange({ cornerRadius: parseInt(e.target.value) })}
                className="w-full h-2 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-muted-foreground text-right">{customization.cornerRadius}px</div>
            </div>

            {/* Spacing */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Photo Spacing</label>
              <input
                type="range"
                min="4"
                max="32"
                value={customization.spacing}
                onChange={(e) => onCustomizationChange({ spacing: parseInt(e.target.value) })}
                className="w-full h-2 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-muted-foreground text-right">{customization.spacing}px</div>
            </div>

            {/* Padding */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Card Padding</label>
              <input
                type="range"
                min="12"
                max="48"
                value={customization.padding}
                onChange={(e) => onCustomizationChange({ padding: parseInt(e.target.value) })}
                className="w-full h-2 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-muted-foreground text-right">{customization.padding}px</div>
            </div>

            {/* Reset Button */}
            {selectedTemplate && (
              <button
                onClick={() => {
                  if (selectedTemplate) {
                    onCustomizationChange({
                      borderStyle: selectedTemplate.borderStyle,
                      shape: selectedTemplate.photoShape,
                      colors: selectedTemplate.colors,
                      filter: selectedTemplate.filter,
                      textPosition: selectedTemplate.textPosition,
                      fontFamily: selectedTemplate.fontFamily,
                      ...(selectedTemplate.gradient && { 
                        backgroundType: "gradient" as const,
                        gradient: selectedTemplate.gradient 
                      }),
                      ...(selectedTemplate.pattern && { pattern: selectedTemplate.pattern })
                    });
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-muted-foreground/30 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200"
              >
                Reset to Template Defaults
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getFontFamily(font: FontFamily): string {
  switch (font) {
    case "modern": return "system-ui, -apple-system, sans-serif";
    case "classic": return "Georgia, serif";
    case "playful": return "cursive";
    case "elegant": return "'Playfair Display', serif";
    case "retro": return "'Courier New', monospace";
    case "bold": return "Impact, sans-serif";
    case "handwritten": return "cursive";
    default: return "system-ui, sans-serif";
  }
}
