"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";
import { Copy, Link, XCircle } from "lucide-react";

export default function UrlEncoderDecoderPage() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const addToHistory = useToolStore((state) => state.addToHistory);

  const toolSlug = "url-encoder-decoder";
  const toolName = "URL Encode/Decode";
  const description = "Encode or decode URL components, query strings, and parameters.";

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleEncode = useCallback(() => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      toast.success("URL encoded successfully!");
    } catch (error: any) {
      toast.error(`Encoding failed: ${error.message}`);
      setOutput(`Error: ${error.message}`);
    }
  }, [input]);

  const handleDecode = useCallback(() => {
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      toast.success("URL decoded successfully!");
    } catch (error: any) {
      toast.error(`Decoding failed: ${error.message}`);
      setOutput(`Error: ${error.message}`);
    }
  }, [input]);

  const handleCopyOutput = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast.success("Output copied to clipboard!");
    } else {
      toast.error("Nothing to copy!");
    }
  }, [output]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    toast.success("Cleared input and output!");
  }, []);

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col space-y-6">
        {/* Input Section */}
        <div className="flex flex-col">
          <label htmlFor="url-input" className="text-sm font-medium text-slate-300 mb-2 flex items-center">
            <Link className="w-4 h-4 mr-2 text-indigo-400" />
            Input URL/String
          </label>
          <div className="relative">
            <textarea
              id="url-input"
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-sm resize-y min-h-[150px]"
              placeholder="Enter URL or string to encode/decode..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {input && (
              <button
                onClick={() => setInput("")}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Clear input"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleEncode}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!input.trim()}
          >
            Encode URL
          </button>
          <button
            onClick={handleDecode}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!input.trim()}
          >
            Decode URL
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            disabled={!input && !output}
          >
            Clear All
          </button>
        </div>

        {/* Output Section */}
        <div className="flex flex-col">
          <label htmlFor="url-output" className="text-sm font-medium text-slate-300 mb-2 flex items-center">
            <Copy className="w-4 h-4 mr-2 text-purple-400" />
            Output
          </label>
          <div className="relative">
            <textarea
              id="url-output"
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-purple-500 focus:border-purple-500 transition-colors font-mono text-sm resize-y min-h-[150px]"
              placeholder="Encoded/Decoded output will appear here..."
              value={output}
              readOnly
            />
            {output && (
              <button
                onClick={handleCopyOutput}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Copy output"
              >
                <Copy className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}