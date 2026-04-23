"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface CanvasElement {
  id: string;
  type: "sticker" | "text" | "shape";
  content: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color?: string;
  fontSize?: number;
}

interface StickerCanvasProps {
  elements: CanvasElement[];
  onElementsChange: (elements: CanvasElement[]) => void;
  children: React.ReactNode;
  cardRef: React.RefObject<HTMLDivElement>;
}

export function StickerCanvas({ elements, onElementsChange, children, cardRef }: StickerCanvasProps) {
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = elements.find(el => el.id === id);
    if (!element || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
    
    setDragOffset({
      x: mouseX - element.x,
      y: mouseY - element.y
    });
    
    setDraggedElement(id);
    setSelectedElement(id);
  }, [elements]);

  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!draggedElement || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'clientX' in e ? e.clientX : 0;
    const clientY = 'clientY' in e ? e.clientY : 0;
    
    const mouseX = ((clientX - rect.left) / rect.width) * 100;
    const mouseY = ((clientY - rect.top) / rect.height) * 100;
    
    const newX = mouseX - dragOffset.x;
    const newY = mouseY - dragOffset.y;

    onElementsChange(
      elements.map((el) =>
        el.id === draggedElement 
          ? { ...el, x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) } 
          : el
      )
    );
  }, [draggedElement, dragOffset, elements, onElementsChange]);

  const handleMouseUp = useCallback(() => {
    setDraggedElement(null);
  }, []);

  // Global mouse events for dragging outside container
  useEffect(() => {
    if (draggedElement) {
      const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
      const handleGlobalMouseUp = () => handleMouseUp();
      
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [draggedElement, handleMouseMove, handleMouseUp]);

  const handleDelete = useCallback((id: string) => {
    onElementsChange(elements.filter((el) => el.id !== id));
    setSelectedElement(null);
  }, [elements, onElementsChange]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    onElementsChange(
      elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  }, [elements, onElementsChange]);

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      style={{ minHeight: "400px" }}
      onClick={() => setSelectedElement(null)}
    >
      {children}

      {/* Draggable Elements - positioned directly over the preview */}
      {elements.map((element) => (
        <DraggableElement
          key={element.id}
          element={element}
          isSelected={selectedElement === element.id}
          isDragging={draggedElement === element.id}
          onMouseDown={handleMouseDown}
          onDelete={handleDelete}
          onUpdate={updateElement}
        />
      ))}
    </div>
  );
}

interface DraggableElementProps {
  element: CanvasElement;
  isSelected: boolean;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
}

function DraggableElement({ element, isSelected, isDragging, onMouseDown, onDelete, onUpdate }: DraggableElementProps) {
  return (
    <div
      className={cn(
        "absolute cursor-move select-none group pointer-events-auto",
        isSelected && "z-50",
        isDragging && "z-50"
      )}
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        transform: `translate(-50%, -50%) rotate(${element.rotation}deg) scale(${element.scale})`,
      }}
      onMouseDown={(e) => onMouseDown(e, element.id)}
    >
      {/* Selection Ring */}
      {isSelected && (
        <div className="absolute -inset-3 border-2 border-primary rounded-lg pointer-events-none" />
      )}

      {/* Element Content */}
      <div className="relative">
        {element.type === "sticker" && (
          <span className="text-4xl filter drop-shadow-lg">{element.content}</span>
        )}
        {element.type === "text" && (
          <span
            className="font-bold whitespace-nowrap filter drop-shadow-md"
            style={{
              fontSize: `${element.fontSize || 24}px`,
              color: element.color || "#000",
            }}
          >
            {element.content}
          </span>
        )}
        {element.type === "shape" && (
          <div
            className="w-12 h-12 rounded-full"
            style={{ backgroundColor: element.color || "#ec4899" }}
          />
        )}
      </div>

      {/* Controls (shown when selected) */}
      {isSelected && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(element.id, { scale: Math.max(0.5, element.scale - 0.2) });
            }}
            className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-sm hover:bg-gray-100"
          >
            −
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(element.id, { scale: Math.min(3, element.scale + 0.2) });
            }}
            className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-sm hover:bg-gray-100"
          >
            +
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(element.id, { rotation: element.rotation - 15 });
            }}
            className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-sm hover:bg-gray-100"
          >
            ↺
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(element.id, { rotation: element.rotation + 15 });
            }}
            className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-sm hover:bg-gray-100"
          >
            ↻
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(element.id);
            }}
            className="w-7 h-7 rounded-full bg-red-500 text-white shadow-md flex items-center justify-center text-sm hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
