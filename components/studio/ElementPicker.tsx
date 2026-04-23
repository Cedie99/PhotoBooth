"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CanvasElement } from "./StickerCanvas";

interface ElementPickerProps {
  onAddElement: (element: Omit<CanvasElement, "id">) => void;
}

const stickerCategories = {
  hearts: ["❤️", "💖", "💕", "💗", "💝", "💘", "💓", "💞"],
  stars: ["⭐", "🌟", "✨", "💫", "☆", "★", "✦", "✧"],
  fun: ["🎉", "🎊", "🎈", "🎁", "🎀", "🎵", "🌈", "🔥"],
  cute: ["🌸", "🌺", "🦋", "🌙", "☁️", "🍃", "🌿", "🌼"],
  faces: ["😊", "😍", "🥰", "😎", "🤩", "😋", "😇", "🥳"],
  food: ["🍕", "🍦", "🍩", "🧋", "🍓", "🍒", "🍰", "🎂"],
};

const shapes = [
  { type: "circle", color: "#ec4899" },
  { type: "square", color: "#3b82f6" },
  { type: "circle", color: "#f59e0b" },
  { type: "square", color: "#10b981" },
  { type: "circle", color: "#8b5cf6" },
  { type: "square", color: "#ef4444" },
];

const textStyles = [
  { label: "Heading", fontSize: 32, color: "#000000" },
  { label: "Subheading", fontSize: 24, color: "#374151" },
  { label: "Body", fontSize: 18, color: "#6b7280" },
  { label: "Pink", fontSize: 28, color: "#ec4899" },
  { label: "Blue", fontSize: 28, color: "#3b82f6" },
  { label: "Purple", fontSize: 28, color: "#8b5cf6" },
];

type TabType = "stickers" | "text" | "shapes" | "emojis";

export function ElementPicker({ onAddElement }: ElementPickerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("stickers");
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof stickerCategories>("hearts");
  const [customText, setCustomText] = useState("");

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "stickers", label: "Stickers", icon: "✨" },
    { id: "text", label: "Text", icon: "T" },
    { id: "shapes", label: "Shapes", icon: "◯" },
    { id: "emojis", label: "Emojis", icon: "😊" },
  ];

  const handleAddSticker = (content: string) => {
    onAddElement({
      type: "sticker",
      content,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
    });
  };

  const handleAddText = () => {
    if (!customText.trim()) return;
    onAddElement({
      type: "text",
      content: customText,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
      fontSize: 24,
      color: "#000000",
    });
    setCustomText("");
  };

  const handleAddShape = (color: string) => {
    onAddElement({
      type: "shape",
      content: "circle",
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
      color,
    });
  };

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
            )}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-3 bg-muted/30 rounded-xl">
        {/* Stickers Tab */}
        {activeTab === "stickers" && (
          <div className="space-y-3">
            {/* Categories */}
            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
              {Object.keys(stickerCategories).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as keyof typeof stickerCategories)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted-foreground/10"
                  )}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Sticker Grid */}
            <div className="grid grid-cols-4 gap-2">
              {stickerCategories[selectedCategory].map((sticker, i) => (
                <button
                  key={i}
                  onClick={() => handleAddSticker(sticker)}
                  className="aspect-square rounded-xl bg-background hover:bg-primary/10 flex items-center justify-center text-2xl transition-all hover:scale-110"
                >
                  {sticker}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Tab */}
        {activeTab === "text" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddText()}
                placeholder="Type your text..."
                className="flex-1 h-10 px-3 rounded-lg border bg-background text-sm"
              />
              <button
                onClick={handleAddText}
                disabled={!customText.trim()}
                className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
              >
                Add
              </button>
            </div>

            <div className="text-xs text-muted-foreground">Quick styles:</div>
            <div className="grid grid-cols-2 gap-2">
              {textStyles.map((style, i) => (
                <button
                  key={i}
                  onClick={() =>
                    onAddElement({
                      type: "text",
                      content: style.label,
                      x: 50,
                      y: 50,
                      scale: 1,
                      rotation: 0,
                      fontSize: style.fontSize,
                      color: style.color,
                    })
                  }
                  className="p-3 rounded-xl bg-background hover:bg-primary/10 text-left transition-all"
                >
                  <span style={{ fontSize: style.fontSize * 0.6, color: style.color }}>
                    {style.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Shapes Tab */}
        {activeTab === "shapes" && (
          <div className="grid grid-cols-3 gap-2">
            {shapes.map((shape, i) => (
              <button
                key={i}
                onClick={() => handleAddShape(shape.color)}
                className={cn(
                  "aspect-square rounded-xl flex items-center justify-center transition-all hover:scale-110",
                  shape.type === "circle" ? "rounded-full" : "rounded-lg"
                )}
                style={{ backgroundColor: shape.color }}
              />
            ))}
          </div>
        )}

        {/* Emojis Tab */}
        {activeTab === "emojis" && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">Click to add to your design:</div>
            <div className="grid grid-cols-6 gap-1 max-h-[200px] overflow-y-auto">
              {["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"].map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => handleAddSticker(emoji)}
                  className="aspect-square rounded-lg hover:bg-primary/10 flex items-center justify-center text-xl transition-all"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Click elements to add • Drag to move • Select to resize/rotate
      </div>
    </div>
  );
}
