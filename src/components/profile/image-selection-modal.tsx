"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Check,
  RotateCw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Move,
  Scissors,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageSelectionModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onConfirm: (croppedDataUrl: string) => void;
}

type HandleType = "tl" | "tr" | "bl" | "br" | "move";

interface Box {
  x: number;
  y: number;
  size: number;
}

export function ImageSelectionModal({
  isOpen,
  imageSrc,
  onClose,
  onConfirm,
}: ImageSelectionModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [rotation, setRotation] = useState<number>(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [naturalDim, setNaturalDim] = useState({ w: 0, h: 0 });

  // Rendered image layout inside container
  const [layout, setLayout] = useState({
    containerW: 0,
    containerH: 0,
    imgLeft: 0,
    imgTop: 0,
    imgW: 0,
    imgH: 0,
  });

  // Selection box relative to container
  const [box, setBox] = useState<Box>({ x: 0, y: 0, size: 100 });

  // Dragging state
  const isDraggingRef = useRef(false);
  const dragHandleRef = useRef<HandleType>("move");
  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    startBox: Box;
    anchorX: number;
    anchorY: number;
  }>({
    pointerX: 0,
    pointerY: 0,
    startBox: { x: 0, y: 0, size: 100 },
    anchorX: 0,
    anchorY: 0,
  });

  // Calculate layout whenever container or image natural dimensions or rotation change
  const updateLayout = useCallback(() => {
    if (!containerRef.current || naturalDim.w === 0 || naturalDim.h === 0) return;

    const cRect = containerRef.current.getBoundingClientRect();
    const cW = cRect.width;
    const cH = cRect.height;

    const isFlipped = rotation % 180 !== 0;
    const effW = isFlipped ? naturalDim.h : naturalDim.w;
    const effH = isFlipped ? naturalDim.w : naturalDim.h;

    // Fit with padding inside container
    const padding = 20;
    const maxW = Math.max(100, cW - padding * 2);
    const maxH = Math.max(100, cH - padding * 2);

    const scale = Math.min(maxW / effW, maxH / effH);
    const renderedW = effW * scale;
    const renderedH = effH * scale;

    const left = (cW - renderedW) / 2;
    const top = (cH - renderedH) / 2;

    setLayout({
      containerW: cW,
      containerH: cH,
      imgLeft: left,
      imgTop: top,
      imgW: renderedW,
      imgH: renderedH,
    });

    // Initialize or adjust crop box to stay within bounds
    setBox((prev) => {
      const minDimension = Math.min(renderedW, renderedH);
      const initialSize = Math.max(50, minDimension * 0.85);

      if (prev.size === 100 || prev.x === 0 || prev.y === 0) {
        return {
          x: left + (renderedW - initialSize) / 2,
          y: top + (renderedH - initialSize) / 2,
          size: initialSize,
        };
      }

      // Clamp existing box to new bounds
      const clampedSize = Math.min(prev.size, minDimension);
      const clampedX = Math.max(left, Math.min(left + renderedW - clampedSize, prev.x));
      const clampedY = Math.max(top, Math.min(top + renderedH - clampedSize, prev.y));

      return {
        x: clampedX,
        y: clampedY,
        size: clampedSize,
      };
    });
  }, [naturalDim, rotation]);

  // Load natural dimensions
  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    setImageLoaded(false);
    setRotation(0);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      setNaturalDim({ w: img.naturalWidth, h: img.naturalHeight });
      setImageLoaded(true);
    };
  }, [isOpen, imageSrc]);

  // Handle window resize or container re-layout
  useEffect(() => {
    if (!isOpen || !imageLoaded) return;
    updateLayout();

    const handleResize = () => updateLayout();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, imageLoaded, updateLayout]);

  if (!isOpen) return null;

  // Pointer Down - start drag or resize
  const handlePointerDown = (e: React.PointerEvent, handle: HandleType) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    isDraggingRef.current = true;
    dragHandleRef.current = handle;

    let anchorX = box.x;
    let anchorY = box.y;

    if (handle === "tl") {
      anchorX = box.x + box.size;
      anchorY = box.y + box.size;
    } else if (handle === "tr") {
      anchorX = box.x;
      anchorY = box.y + box.size;
    } else if (handle === "bl") {
      anchorX = box.x + box.size;
      anchorY = box.y;
    } else if (handle === "br") {
      anchorX = box.x;
      anchorY = box.y;
    }

    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      startBox: { ...box },
      anchorX,
      anchorY,
    };
  };

  // Pointer Move - execute move or resize
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();
    e.preventDefault();

    const { pointerX, pointerY, startBox, anchorX, anchorY } = dragStartRef.current;
    const dx = e.clientX - pointerX;
    const dy = e.clientY - pointerY;

    const { imgLeft, imgTop, imgW, imgH } = layout;
    const minSize = Math.max(44, Math.min(imgW, imgH) * 0.15);

    if (dragHandleRef.current === "move") {
      // Reposition crop box within image boundaries
      const minX = imgLeft;
      const maxX = imgLeft + imgW - startBox.size;
      const minY = imgTop;
      const maxY = imgTop + imgH - startBox.size;

      const newX = Math.max(minX, Math.min(maxX, startBox.x + dx));
      const newY = Math.max(minY, Math.min(maxY, startBox.y + dy));

      setBox({
        x: newX,
        y: newY,
        size: startBox.size,
      });
      return;
    }

    // Corner Resizing
    if (dragHandleRef.current === "br") {
      const maxDeltaX = imgLeft + imgW - anchorX;
      const maxDeltaY = imgTop + imgH - anchorY;
      const maxAllowedSize = Math.min(maxDeltaX, maxDeltaY);

      const targetSize = startBox.size + Math.max(dx, dy);
      const clampedSize = Math.max(minSize, Math.min(maxAllowedSize, targetSize));

      setBox({
        x: anchorX,
        y: anchorY,
        size: clampedSize,
      });
    } else if (dragHandleRef.current === "bl") {
      const maxDeltaLeft = anchorX - imgLeft;
      const maxDeltaBottom = imgTop + imgH - anchorY;
      const maxAllowedSize = Math.min(maxDeltaLeft, maxDeltaBottom);

      const targetSize = startBox.size + Math.max(-dx, dy);
      const clampedSize = Math.max(minSize, Math.min(maxAllowedSize, targetSize));

      setBox({
        x: anchorX - clampedSize,
        y: anchorY,
        size: clampedSize,
      });
    } else if (dragHandleRef.current === "tr") {
      const maxDeltaRight = imgLeft + imgW - anchorX;
      const maxDeltaTop = anchorY - imgTop;
      const maxAllowedSize = Math.min(maxDeltaRight, maxDeltaTop);

      const targetSize = startBox.size + Math.max(dx, -dy);
      const clampedSize = Math.max(minSize, Math.min(maxAllowedSize, targetSize));

      setBox({
        x: anchorX,
        y: anchorY - clampedSize,
        size: clampedSize,
      });
    } else if (dragHandleRef.current === "tl") {
      const maxDeltaLeft = anchorX - imgLeft;
      const maxDeltaTop = anchorY - imgTop;
      const maxAllowedSize = Math.min(maxDeltaLeft, maxDeltaTop);

      const targetSize = startBox.size + Math.max(-dx, -dy);
      const clampedSize = Math.max(minSize, Math.min(maxAllowedSize, targetSize));

      setBox({
        x: anchorX - clampedSize,
        y: anchorY - clampedSize,
        size: clampedSize,
      });
    }
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Rotate Image 90 degrees
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Recenter Crop Box
  const handleRecenter = () => {
    const { imgLeft, imgTop, imgW, imgH } = layout;
    const minDim = Math.min(imgW, imgH);
    const size = Math.min(box.size, minDim);
    setBox({
      x: imgLeft + (imgW - size) / 2,
      y: imgTop + (imgH - size) / 2,
      size,
    });
  };

  // Maximize Crop Box
  const handleMaximize = () => {
    const { imgLeft, imgTop, imgW, imgH } = layout;
    const maxSize = Math.min(imgW, imgH);
    setBox({
      x: imgLeft + (imgW - maxSize) / 2,
      y: imgTop + (imgH - maxSize) / 2,
      size: maxSize,
    });
  };

  // Zoom Slider Handler (resizes crop box from center)
  const handleZoomSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const factor = parseFloat(e.target.value); // 0.2 to 1.0 (smaller box = zoomed in avatar)
    const { imgLeft, imgTop, imgW, imgH } = layout;
    const maxSize = Math.min(imgW, imgH);
    const newSize = Math.max(44, maxSize * factor);

    const centerX = box.x + box.size / 2;
    const centerY = box.y + box.size / 2;

    const clampedX = Math.max(imgLeft, Math.min(imgLeft + imgW - newSize, centerX - newSize / 2));
    const clampedY = Math.max(imgTop, Math.min(imgTop + imgH - newSize, centerY - newSize / 2));

    setBox({
      x: clampedX,
      y: clampedY,
      size: newSize,
    });
  };

  // Confirm and Export Cropped Image via HTML5 Canvas
  const handleConfirm = () => {
    if (!imgRef.current || naturalDim.w === 0 || naturalDim.h === 0) return;

    try {
      const isFlipped = rotation % 180 !== 0;
      const effW = isFlipped ? naturalDim.h : naturalDim.w;
      const effH = isFlipped ? naturalDim.w : naturalDim.w;

      // 1. Step: Draw rotated image onto intermediate canvas
      const rotCanvas = document.createElement("canvas");
      rotCanvas.width = effW;
      rotCanvas.height = effH;
      const rotCtx = rotCanvas.getContext("2d");
      if (!rotCtx) return;

      rotCtx.translate(effW / 2, effH / 2);
      rotCtx.rotate((rotation * Math.PI) / 180);
      rotCtx.drawImage(
        imgRef.current,
        -naturalDim.w / 2,
        -naturalDim.h / 2,
        naturalDim.w,
        naturalDim.h
      );

      // 2. Step: Crop from rotated canvas to target 512x512 canvas
      const { imgLeft, imgTop, imgW } = layout;
      const srcX = ((box.x - imgLeft) / imgW) * effW;
      const srcY = ((box.y - imgTop) / imgW) * effW;
      const srcSize = (box.size / imgW) * effW;

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = 512;
      outputCanvas.height = 512;
      const outCtx = outputCanvas.getContext("2d");
      if (!outCtx) return;

      outCtx.imageSmoothingEnabled = true;
      outCtx.imageSmoothingQuality = "high";
      outCtx.drawImage(rotCanvas, srcX, srcY, srcSize, srcSize, 0, 0, 512, 512);

      const croppedDataUrl = outputCanvas.toDataURL("image/png");
      onConfirm(croppedDataUrl);
      onClose();
    } catch (err) {
      console.error("Fehler beim Zuschneiden des Bildes:", err);
      // Fallback: use raw image
      onConfirm(imageSrc);
      onClose();
    }
  };

  // Calculate live preview metrics
  const previewScale = layout.imgW > 0 ? (layout.imgW / box.size) * 72 : 1;
  const previewOffsetX = layout.imgW > 0 ? -((box.x - layout.imgLeft) / box.size) * 72 : 0;
  const previewOffsetY = layout.imgW > 0 ? -((box.y - layout.imgTop) / box.size) * 72 : 0;

  const currentZoomRatio =
    layout.imgW > 0 ? box.size / Math.min(layout.imgW, layout.imgH) : 0.8;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-xl bg-[#0c101c] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95dvh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Bildausschnitt anpassen
              </h2>
              <p className="text-[11px] text-neutral-400">
                Wähle und verändere die Größe des Bereichs nach deinen Wünschen.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Viewport Area */}
          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-[280px] sm:h-[350px] bg-[#07090f] relative overflow-hidden rounded-2xl flex items-center justify-center border border-white/10 touch-none cursor-default select-none shadow-inner"
          >
            {/* The base image */}
            {imageLoaded && (
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Ausschnitt"
                draggable={false}
                style={{
                  position: "absolute",
                  left: `${layout.imgLeft}px`,
                  top: `${layout.imgTop}px`,
                  width: `${layout.imgW}px`,
                  height: `${layout.imgH}px`,
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                  maxWidth: "none",
                  maxHeight: "none",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />
            )}

            {/* Dark Mask Outside Selection Box (4 overlays) */}
            {imageLoaded && layout.imgW > 0 && (
              <>
                {/* Top mask */}
                <div
                  className="absolute inset-x-0 top-0 bg-black/65 pointer-events-none"
                  style={{ height: `${box.y}px` }}
                />
                {/* Bottom mask */}
                <div
                  className="absolute inset-x-0 bottom-0 bg-black/65 pointer-events-none"
                  style={{ top: `${box.y + box.size}px` }}
                />
                {/* Left mask */}
                <div
                  className="absolute left-0 bg-black/65 pointer-events-none"
                  style={{
                    top: `${box.y}px`,
                    height: `${box.size}px`,
                    width: `${box.x}px`,
                  }}
                />
                {/* Right mask */}
                <div
                  className="absolute right-0 bg-black/65 pointer-events-none"
                  style={{
                    top: `${box.y}px`,
                    height: `${box.size}px`,
                    left: `${box.x + box.size}px`,
                  }}
                />
              </>
            )}

            {/* Selection Box / Crop Window */}
            {imageLoaded && layout.imgW > 0 && (
              <div
                onPointerDown={(e) => handlePointerDown(e, "move")}
                style={{
                  position: "absolute",
                  left: `${box.x}px`,
                  top: `${box.y}px`,
                  width: `${box.size}px`,
                  height: `${box.size}px`,
                }}
                className="cursor-move border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] select-none group"
                title="Ziehen, um Ausschnitt zu verschieben"
              >
                {/* Dashed circular avatar guide */}
                <div className="absolute inset-0 rounded-full border border-dashed border-white/70 pointer-events-none shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]" />

                {/* 3x3 Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                  <div className="border-r border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-b border-white/40" />
                  <div className="border-r border-white/40" />
                  <div className="border-r border-white/40" />
                  <div />
                </div>

                {/* Move Hint Icon in center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity">
                  <Move className="w-5 h-5 text-white drop-shadow" />
                </div>

                {/* Corner Resize Handles (with 44x44px touch targets) */}
                {/* Top-Left */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, "tl")}
                  className="absolute -top-4 -left-4 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center cursor-nwse-resize touch-none z-20"
                  title="Größe anpassen (Ecke oben links)"
                >
                  <div className="w-3.5 h-3.5 bg-white border-2 border-cyan-500 rounded-sm shadow-md" />
                </div>

                {/* Top-Right */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, "tr")}
                  className="absolute -top-4 -right-4 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center cursor-nesw-resize touch-none z-20"
                  title="Größe anpassen (Ecke oben rechts)"
                >
                  <div className="w-3.5 h-3.5 bg-white border-2 border-cyan-500 rounded-sm shadow-md" />
                </div>

                {/* Bottom-Left */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, "bl")}
                  className="absolute -bottom-4 -left-4 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center cursor-nesw-resize touch-none z-20"
                  title="Größe anpassen (Ecke unten links)"
                >
                  <div className="w-3.5 h-3.5 bg-white border-2 border-cyan-500 rounded-sm shadow-md" />
                </div>

                {/* Bottom-Right */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, "br")}
                  className="absolute -bottom-4 -right-4 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center cursor-nwse-resize touch-none z-20"
                  title="Größe anpassen (Ecke unten rechts)"
                >
                  <div className="w-3.5 h-3.5 bg-white border-2 border-cyan-500 rounded-sm shadow-md" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Controls & Live Preview Card */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Live circular avatar preview */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500/80 bg-neutral-900 shrink-0 shadow-lg">
                {imageLoaded && (
                  <img
                    src={imageSrc}
                    alt="Vorschau"
                    draggable={false}
                    style={{
                      position: "absolute",
                      width: `${previewScale}px`,
                      height: `${(layout.imgH / (layout.imgW || 1)) * previewScale}px`,
                      left: `${previewOffsetX}px`,
                      top: `${previewOffsetY}px`,
                      transform: `rotate(${rotation}deg)`,
                      transformOrigin: "center center",
                      maxWidth: "none",
                      maxHeight: "none",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-black tracking-wider text-orange-400 block">
                  Ergebnis-Vorschau
                </span>
                <span className="text-xs font-bold text-white block">
                  Runder Avatar
                </span>
                <span className="text-[10px] text-neutral-400">
                  Wird so im Profil angezeigt
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleRotate}
                title="Bild um 90° drehen"
                className="flex-1 sm:flex-initial h-10 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
              >
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Drehen</span>
              </button>

              <button
                type="button"
                onClick={handleRecenter}
                title="Ausschnitt zentrieren"
                className="flex-1 sm:flex-initial h-10 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Zentrieren</span>
              </button>

              <button
                type="button"
                onClick={handleMaximize}
                title="Maximalen Ausschnitt wählen"
                className="flex-1 sm:flex-initial h-10 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
              >
                <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Vollbild</span>
              </button>
            </div>
          </div>

          {/* Zoom Slider */}
          <div className="space-y-1.5 px-1">
            <div className="flex items-center justify-between text-xs text-neutral-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ausschnitt-Größe / Zoom</span>
              </span>
              <span className="text-[11px] text-neutral-400">
                {Math.round((1.05 - currentZoomRatio) * 100)}% vergrößert
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="range"
                min="0.25"
                max="1.0"
                step="0.01"
                value={currentZoomRatio}
                onChange={handleZoomSlider}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />
              <ZoomIn className="w-4 h-4 text-neutral-400 shrink-0" />
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer Actions (Mobile Extralocke per AGENTS.md) */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-300 hover:text-white text-xs font-bold transition-all min-h-[44px] cursor-pointer flex items-center justify-center"
          >
            Abbrechen
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all active:scale-95 min-h-[44px] cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Ausschnitt übernehmen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
