"use client";

import { useState } from "react";

export default function ColorPickerPage() {
  const [color, setColor] = useState("#6366f1");

  // Conversions
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) || 0;
    let g = parseInt(hex.slice(3, 5), 16) || 0;
    let b = parseInt(hex.slice(5, 7), 16) || 0;
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const presets = [
    "#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#8b5cf6",
    "#6366f1", "#3b82f6", "#0ea5e9", "#06b6d4", "#14b8a6",
    "#10b981", "#22c55e", "#84cc16", "#eab308", "#f97316"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Color Picker & Converter</h2>
        <p className="text-xs text-slate-400">Generate palettes, convert values, and select colors visually.</p>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Visual selector card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 flex flex-col items-center">
          <div
            className="w-full h-44 rounded-xl border border-slate-850 shadow-inner relative overflow-hidden transition-all duration-300"
            style={{ backgroundColor: color }}
          >
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-200 px-2 py-1 rounded font-medium">
              Click to choose color
            </div>
          </div>

          <div className="w-full space-y-3">
            <span className="text-xs font-semibold text-slate-400 block">Presets</span>
            <div className="grid grid-cols-5 gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setColor(p)}
                  className="h-8 rounded-lg border border-slate-850 hover:scale-110 active:scale-95 transition-transform"
                  style={{ backgroundColor: p }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Formats and converters card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Formats</span>

          <div className="space-y-3">
            {/* Hex */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-semibold text-slate-500">HEX</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={color.toUpperCase()}
                  className="flex-1 bg-slate-955 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-none"
                />
                <button
                  onClick={() => handleCopy(color.toUpperCase())}
                  className="text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-850"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Rgb */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-semibold text-slate-500">RGB</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={hexToRgb(color)}
                  className="flex-1 bg-slate-955 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-none"
                />
                <button
                  onClick={() => handleCopy(hexToRgb(color))}
                  className="text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-850"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Hsl */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-semibold text-slate-500">HSL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={hexToHsl(color)}
                  className="flex-1 bg-slate-955 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-none"
                />
                <button
                  onClick={() => handleCopy(hexToHsl(color))}
                  className="text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-850"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
