"use client";

import { useState } from "react";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFormat = () => {
    try {
      if (!input.trim()) {
        setOutput("");
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax");
      setOutput("");
    }
  };

  const handleMinify = () => {
    try {
      if (!input.trim()) {
        setOutput("");
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax");
      setOutput("");
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleSample = () => {
    const sample = {
      project: "DevForge",
      version: "1.0.0",
      description: "Developer toolbox",
      features: ["JSON Formatter", "Color Picker"],
      active: true,
      stats: {
        stars: 42,
        forks: 7
      }
    };
    setInput(JSON.stringify(sample, null, 2));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">JSON Formatter & Validator</h2>
        <p className="text-xs text-slate-400">Format, validate, beautify, and minify your JSON data.</p>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input area */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Raw Input JSON</span>
            <div className="flex gap-2">
              <button onClick={handleSample} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 transition-colors">
                Sample
              </button>
              <button onClick={handleClear} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 transition-colors">
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your raw JSON here..."
            className="flex-1 min-h-[400px] bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-4 text-xs font-mono text-slate-300 placeholder-slate-600 resize-none shadow-inner"
          />
        </div>

        {/* Output area */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Formatted Output</span>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="text-[10px] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-2 py-1 rounded transition-colors"
            >
              Copy Output
            </button>
          </div>
          <div className="flex-1 min-h-[400px] bg-slate-900/40 border border-slate-800 rounded-xl p-4 relative overflow-auto shadow-inner">
            {error && (
              <div className="absolute inset-x-0 top-0 bg-rose-500/10 border-b border-rose-500/20 p-3 text-xs text-rose-400 font-mono">
                <strong>Validation Error:</strong> {error}
              </div>
            )}
            <pre className={`text-xs font-mono text-slate-300 whitespace-pre-wrap ${error ? "pt-12" : ""}`}>
              {output || (input ? "" : "// Output will appear here...")}
            </pre>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleFormat}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/10"
        >
          Format JSON
        </button>
        <button
          onClick={handleMinify}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs px-4 py-2 rounded-lg transition-colors"
        >
          Minify JSON
        </button>
      </div>
    </div>
  );
}
