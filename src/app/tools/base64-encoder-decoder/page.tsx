"use client";

import { useState, useCallback } from "react";

export default function Base64EncoderDecoderPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const encodeBase64 = useCallback(() => {
    setError(null);
    if (!inputText) {
      setOutputText("");
      return;
    }
    try {
      // btoa only works for ASCII strings. For full Unicode support, a more complex approach is needed.
      // For common developer use cases with mostly ASCII or simple UTF-8, this is often sufficient.
      // Example for robust Unicode encoding:
      // const encoded = btoa(encodeURIComponent(inputText).replace(/%([0-9A-F]{2})/g,
      //     function toSolidBytes(match, p1) {
      //         return String.fromCharCode(parseInt(p1, 16));
      //     }));
      const encoded = btoa(inputText);
      setOutputText(encoded);
    } catch (e: any) {
      setError("Encoding failed. Input must be a valid ASCII string for direct btoa() use. For Unicode, consider a more advanced encoder.");
      setOutputText("");
    }
  }, [inputText]);

  const decodeBase64 = useCallback(() => {
    setError(null);
    if (!inputText) {
      setOutputText("");
      return;
    }
    try {
      const decoded = atob(inputText);
      // Example for robust Unicode decoding:
      // const decoded = decodeURIComponent(Array.prototype.map.call(atob(inputText), function(c) {
      //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      // }).join(''));
      setOutputText(decoded);
    } catch (e: any) {
      setError("Decoding failed. Please ensure the input is a valid Base64 string.");
      setOutputText("");
    }
  }, [inputText]);

  const clearInputs = useCallback(() => {
    setInputText("");
    setOutputText("");
    setError(null);
    setCopied(false);
  }, []);

  const copyToClipboard = useCallback(async () => {
    if (outputText) {
      try {
        await navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
      } catch (err) {
        console.error("Failed to copy: ", err);
        setError("Failed to copy text to clipboard.");
      }
    }
  }, [outputText]);

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold text-slate-100 mb-2">Base64 Encoder/Decoder</h1>
      <p className="text-slate-400 mb-6">
        Encode or decode strings to and from Base64 format. Useful for data transmission and obfuscation.
      </p>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Input Section */}
        <div className="flex flex-col">
          <label htmlFor="input-text" className="text-sm font-medium text-slate-300 mb-2">
            Input
          </label>
          <textarea
            id="input-text"
            className="flex-1 w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none font-mono text-sm transition-colors"
            placeholder="Enter text or Base64 string here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
          />
        </div>

        {/* Output Section */}
        <div className="flex flex-col">
          <label htmlFor="output-text" className="text-sm font-medium text-slate-300 mb-2">
            Output
          </label>
          <div className="relative flex-1">
            <textarea
              id="output-text"
              className="flex-1 w-full h-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none font-mono text-sm transition-colors"
              placeholder="Encoded/Decoded output will appear here..."
              value={outputText}
              readOnly
              rows={10}
            />
            {outputText && (
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-100 transition-colors flex items-center gap-1 text-xs"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    Copy
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-end">
        <button
          onClick={clearInputs}
          className="px-5 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          Clear
        </button>
        <button
          onClick={encodeBase64}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          Encode
        </button>
        <button
          onClick={decodeBase64}
          className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Decode
        </button>
      </div>
    </div>
  );
}
