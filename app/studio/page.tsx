"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  StripCustomization,
  StripTemplate,
  layoutOptions,
  defaultCustomization,
  predefinedTemplates,
  getFilterStyle
} from "@/lib/studio-types";
import { TemplateGallery } from "@/components/studio/TemplateGallery";
import { CustomizationPanel } from "@/components/studio/CustomizationPanel";
import { LivePreview } from "@/components/studio/LivePreview";

export default function StudioPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [shots, setShots] = useState<string[]>([]);
  const [capturing, setCapturing] = useState(false);

  const [sessionId, setSessionId] = useState("session-001");
  const [customization, setCustomization] = useState<StripCustomization>(defaultCustomization);
  const [selectedTemplate, setSelectedTemplate] = useState<StripTemplate | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  const layoutMeta = useMemo(() => {
    return layoutOptions.find((option) => option.value === customization.layout) ?? layoutOptions[1];
  }, [customization.layout]);

  const isStripLayout = customization.layout.startsWith("strip");
  const maxShots = layoutMeta.rows * layoutMeta.cols;

  useEffect(() => {
    // Load first template by default
    const defaultTemplate = predefinedTemplates[0];
    setSelectedTemplate(defaultTemplate);
    applyTemplateToCustomization(defaultTemplate);
    
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    setShots((current) => current.slice(0, maxShots));
  }, [maxShots]);

  const applyTemplateToCustomization = (template: StripTemplate) => {
    setCustomization((prev) => ({
      ...prev,
      templateId: template.id,
      borderStyle: template.borderStyle,
      shape: template.photoShape,
      colors: { ...template.colors },
      filter: template.filter,
      textPosition: template.textPosition,
      fontFamily: template.fontFamily,
      ...(template.gradient && {
        backgroundType: "gradient" as const,
        gradient: template.gradient,
        backgroundColor: template.colors.background
      }),
      ...(template.pattern && {
        pattern: template.pattern
      }),
      footerText: template.name
    }));
  };

  async function startCamera() {
    setCameraError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera API is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraReady(true);
    } catch {
      setCameraError("Unable to access camera. Allow camera permissions and use HTTPS or localhost.");
      setCameraReady(false);
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  }

  function captureShot() {
    if (!videoRef.current || !previewCanvasRef.current || !cameraReady) {
      return;
    }

    setCapturing(true);

    const video = videoRef.current;
    const canvas = previewCanvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      setCapturing(false);
      return;
    }

    canvas.width = 900;
    canvas.height = 900;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    setShots((current) => [imageData, ...current].slice(0, maxShots));

    // Flash effect
    setTimeout(() => setCapturing(false), 300);
  }

  async function loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  async function downloadComposite() {
    if (shots.length === 0) {
      setMessage("Capture at least one photo before exporting.");
      return;
    }

    const cellWidth = isStripLayout ? 520 : 360;
    const cellHeight = isStripLayout ? 350 : 360;
    const gap = customization.spacing;
    const padding = customization.padding;
    const header = (customization.textPosition === "top" || customization.textPosition === "both") && customization.headerText ? 60 : 0;
    const footer = (customization.textPosition === "bottom" || customization.textPosition === "both") && customization.footerText ? 100 : 0;
    const subfooter = customization.subfooterText ? 40 : 0;
    
    const width = padding * 2 + layoutMeta.cols * cellWidth + (layoutMeta.cols - 1) * gap;
    const height = padding * 2 + header + layoutMeta.rows * cellHeight + (layoutMeta.rows - 1) * gap + footer + subfooter;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    // Draw background
    if (customization.backgroundType === "gradient" && customization.gradient) {
      const { type, angle, stops } = customization.gradient;
      const gradientStops = stops.map(s => `${s.color} ${s.position * 100}%`).join(", ");
      
      if (type === "linear") {
        context.fillStyle = `linear-gradient(${angle}deg, ${gradientStops})`;
        context.fillRect(0, 0, width, height);
      } else {
        context.fillStyle = customization.backgroundColor;
        context.fillRect(0, 0, width, height);
      }
    } else {
      context.fillStyle = customization.backgroundColor;
      context.fillRect(0, 0, width, height);
    }

    // Draw header text
    if (header > 0) {
      context.fillStyle = customization.colors.text;
      context.font = `${customization.fontSize}px ${getCanvasFont(customization.fontFamily)}`;
      context.textAlign = customization.textAlignment as CanvasTextAlign;
      const x = customization.textAlignment === "center" ? width / 2 : 
                customization.textAlignment === "right" ? width - padding : padding;
      context.fillText(customization.headerText, x, padding + 30);
    }

    // Draw photos
    const usableShots = shots.slice(0, maxShots);
    const loaded = await Promise.all(usableShots.map((src) => loadImage(src)));

    loaded.forEach((image, index) => {
      const row = Math.floor(index / layoutMeta.cols);
      const col = index % layoutMeta.cols;
      const x = padding + col * (cellWidth + gap);
      const y = padding + header + row * (cellHeight + gap);

      context.save();
      context.filter = getFilterStyle(customization.filter);

      if (customization.shape === "circle") {
        context.beginPath();
        const radius = Math.min(cellWidth, cellHeight) / 2;
        context.arc(x + cellWidth / 2, y + cellHeight / 2, radius, 0, Math.PI * 2);
        context.clip();
      } else if (customization.shape === "rounded") {
        context.beginPath();
        const radius = isStripLayout ? 16 : 24;
        context.roundRect(x, y, cellWidth, cellHeight, radius);
        context.clip();
      }

      context.drawImage(image, x, y, cellWidth, cellHeight);
      context.restore();

      // Border
      if (customization.borderStyle !== "none") {
        context.strokeStyle = customization.borderColor;
        context.lineWidth = customization.borderWidth;
        if (customization.shape === "circle") {
          context.beginPath();
          const radius = Math.min(cellWidth, cellHeight) / 2;
          context.arc(x + cellWidth / 2, y + cellHeight / 2, radius, 0, Math.PI * 2);
          context.stroke();
        } else {
          context.strokeRect(x, y, cellWidth, cellHeight);
        }
      }
    });

    // Draw footer
    if (footer > 0) {
      context.fillStyle = customization.colors.text;
      context.font = `bold ${customization.fontSize + 4}px ${getCanvasFont(customization.fontFamily)}`;
      context.textAlign = customization.textAlignment as CanvasTextAlign;
      const x = customization.textAlignment === "center" ? width / 2 : 
                customization.textAlignment === "right" ? width - padding : padding;
      context.fillText(customization.footerText, x, height - subfooter - 40);
    }

    // Draw subfooter
    if (subfooter > 0) {
      context.fillStyle = customization.colors.text + "99";
      context.font = `${customization.fontSize - 2}px ${getCanvasFont(customization.fontFamily)}`;
      context.textAlign = customization.textAlignment as CanvasTextAlign;
      const x = customization.textAlignment === "center" ? width / 2 : 
                customization.textAlignment === "right" ? width - padding : padding;
      context.fillText(customization.subfooterText, x, height - 20);
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${sessionId}-${customization.layout}.png`;
    link.click();
    setMessage("Card exported successfully!");
    setTimeout(() => setMessage(""), 3000);
  }

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/customizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          layout: customization.layout,
          design: customization.templateId,
          customization
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not save customization.");
        return;
      }

      setMessage("Customization saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Unexpected error while saving customization.");
    } finally {
      setSaving(false);
    }
  }

  function getCanvasFont(font: string): string {
    switch (font) {
      case "modern": return "sans-serif";
      case "classic": return "serif";
      case "playful": return "cursive";
      case "elegant": return "serif";
      case "retro": return "monospace";
      case "bold": return "sans-serif";
      case "handwritten": return "cursive";
      default: return "sans-serif";
    }
  }

  const shotProgress = (shots.length / maxShots) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                📷
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Studio</h1>
                <p className="text-xs text-muted-foreground">Create your perfect photo strip</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Progress Indicator */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
                <div className="w-24 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${shotProgress}%` }}
                  />
                </div>
                <span className="text-xs font-medium">
                  {shots.length}/{maxShots} shots
                </span>
              </div>

              {/* Actions */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-200",
                  showPreview ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                )}
                title="Toggle Preview"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Camera & Capture */}
          <div className="lg:col-span-5 space-y-4">
            {/* Camera Card */}
            <div className="studio-card overflow-hidden">
              <div className="p-4 border-b bg-muted/30">
                <h2 className="studio-section-title flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-sm">📸</span>
                  Camera
                </h2>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Camera Feed */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 ring-1 ring-border">
                  <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover"
                    muted 
                    playsInline 
                  />
                  
                  {!cameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/90">
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 flex items-center justify-center">
                          <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-sm text-zinc-400">Camera is off</p>
                      </div>
                    </div>
                  )}

                  {/* Capture Flash Effect */}
                  {capturing && (
                    <div className="absolute inset-0 bg-white animate-pulse" />
                  )}

                  {/* Countdown overlay could go here */}
                </div>

                {/* Camera Controls */}
                <div className="flex flex-wrap gap-2">
                  {!cameraReady ? (
                    <button
                      onClick={startCamera}
                      className="flex-1 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Start Camera
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={stopCamera}
                        className="h-12 px-4 rounded-xl border-2 border-input hover:border-primary/50 font-medium transition-all duration-200 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" stroke-linejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Stop
                      </button>

                      <button
                        onClick={captureShot}
                        disabled={shots.length >= maxShots}
                        className="flex-1 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" stroke-linejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        </svg>
                        Capture ({shots.length}/{maxShots})
                      </button>

                      <button
                        onClick={() => setShots([])}
                        className="h-12 px-4 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-destructive/50 text-muted-foreground hover:text-destructive font-medium transition-all duration-200"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>

                {cameraError && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {cameraError}
                  </div>
                )}
              </div>
              
              <canvas ref={previewCanvasRef} className="hidden" />
            </div>

            {/* Templates Gallery */}
            <div className="studio-card">
              <div className="p-4 border-b bg-muted/30">
                <h2 className="studio-section-title flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-sm">✨</span>
                  Choose Template
                </h2>
              </div>
              <div className="p-4">
                <TemplateGallery
                  selectedTemplateId={selectedTemplate?.id || ""}
                  onSelectTemplate={setSelectedTemplate}
                  onApplyToCustomization={applyTemplateToCustomization}
                />
              </div>
            </div>
          </div>

          {/* Middle Column - Customization */}
          <div className="lg:col-span-4">
            <div className="studio-card sticky top-24">
              <div className="p-4 border-b bg-muted/30">
                <h2 className="studio-section-title flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-sm">🎨</span>
                  Customize Design
                </h2>
              </div>
              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                <CustomizationPanel
                  customization={customization}
                  onCustomizationChange={(updates) => setCustomization(prev => ({ ...prev, ...updates }))}
                  selectedTemplate={selectedTemplate}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Live Preview */}
          {showPreview && (
            <div className="lg:col-span-3">
              <div className="studio-card sticky top-24">
                <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                  <h2 className="studio-section-title flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-sm">👁</span>
                    Preview
                  </h2>
                  <span className="text-xs text-muted-foreground">Live</span>
                </div>
                
                <div className="p-4 space-y-4">
                  <LivePreview
                    customization={customization}
                    layout={layoutMeta}
                    shots={shots}
                    isStripLayout={isStripLayout}
                    maxShots={maxShots}
                  />

                  {/* Session ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Session ID</label>
                    <input
                      type="text"
                      value={sessionId}
                      onChange={(e) => setSessionId(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border bg-background text-sm font-mono"
                    />
                  </div>

                  {/* Export Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={downloadComposite}
                      disabled={shots.length === 0}
                      className="h-11 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export
                    </button>
                    
                    <form onSubmit={onSave} className="contents">
                      <button
                        type="submit"
                        disabled={saving}
                        className="h-11 px-4 rounded-xl border-2 border-input hover:border-primary/50 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </form>
                  </div>

                  {message && (
                    <div className={cn(
                      "p-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in",
                      message.includes("success") 
                        ? "bg-green-100 text-green-800" 
                        : "bg-destructive/10 text-destructive"
                    )}>
                      {message.includes("success") ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
