'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Sparkles, Trash2, Copy, Download, UploadCloud, Eye, EyeOff } from 'lucide-react';

// Helper function to format bytes
const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Basic SVG optimization function
const optimizeSvgContent = (svgString: string): string => {
  let optimized = svgString;

  // 1. Remove XML declaration (e.g., <?xml version="1.0" encoding="utf-8"?>)
  optimized = optimized.replace(/<\?xml[^>]*\?>/g, '');

  // 2. Remove DOCTYPE declaration (e.g., <!DOCTYPE svg PUBLIC ...>)
  optimized = optimized.replace(/<!DOCTYPE[^>]*>/g, '');

  // 3. Remove comments (e.g., <!-- comment -->)
  optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');

  // 4. Remove default xmlns attribute if it's the standard SVG namespace
  //    This is generally safe for inline SVGs.
  optimized = optimized.replace(/xmlns="http:\/\/www.w3.org\/2000\/svg"/g, '');

  // 5. Remove empty groups (e.g., <g></g> or <g/>)
  optimized = optimized.replace(/<g\s*\/?>\s*<\/g>/g, '');
  optimized = optimized.replace(/<g\s*\/>/g, ''); // For self-closing empty groups

  // 6. Collapse multiple whitespaces into a single space
  optimized = optimized.replace(/\s+/g, ' ');

  // 7. Remove whitespace between tags (e.g., `> <` becomes `><`)
  optimized = optimized.replace(/>\s+</g, '><');

  // 8. Minify hex colors (e.g., #RRGGBB to #RGB if R=RR, G=GG, B=BB)
  optimized = optimized.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, '#$1$2$3');

  // 9. Remove editor metadata (e.g., inkscape, sodipodi, illustrator)
  optimized = optimized.replace(/<metadata>[\s\S]*?<\/metadata>/g, '');
  optimized = optimized.replace(/<sodipodi:namedview[^>]*\/>/g, '');
  optimized = optimized.replace(/<inkscape:group[^>]*\/>/g, '');
  // Simplified layer groups, careful not to remove essential attributes
  optimized = optimized.replace(/<g\s+id="layer\d+"[^>]*>/g, '<g>');

  // 10. Remove unnecessary attributes (e.g., version, baseProfile)
  optimized = optimized.replace(/\s(version|baseProfile)="[^"]*"/g, '');

  // 11. Trim leading/trailing whitespace
  optimized = optimized.trim();

  return optimized;
};

const SvgOptimizerViewerPage: React.FC = () => {
  const [inputSvg, setInputSvg] = useState<string>('');
  const [optimizedSvg, setOptimizedSvg] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(true);

  const { addToHistory } = useToolStore();
  const toolSlug = "svg-optimizer-viewer";

  const handleOptimize = useCallback(() => {
    setError('');
    if (!inputSvg.trim()) {
      setOptimizedSvg('');
      setOriginalSize(0);
      setOptimizedSize(0);
      toast.error('Please paste or upload SVG content to optimize.');
      return;
    }

    try {
      const originalBytes = new TextEncoder().encode(inputSvg).length;
      const optimizedContent = optimizeSvgContent(inputSvg);
      const optimizedBytes = new TextEncoder().encode(optimizedContent).length;

      setOptimizedSvg(optimizedContent);
      setOriginalSize(originalBytes);
      setOptimizedSize(optimizedBytes);
      addToHistory(toolSlug);
      toast.success('SVG optimized successfully!');
    } catch (e: any) {
      setError(`Optimization failed: ${e.message}`);
      setOptimizedSvg('');
      setOriginalSize(0);
      setOptimizedSize(0);
      toast.error('Failed to optimize SVG.');
    }
  }, [inputSvg, addToHistory, toolSlug]);

  const handleClear = useCallback(() => {
    setInputSvg('');
    setOptimizedSvg('');
    setOriginalSize(0);
    setOptimizedSize(0);
    setError('');
    toast.success('Cleared all content.');
  }, []);

  const handleCopy = useCallback(() => {
    if (optimizedSvg) {
      navigator.clipboard.writeText(optimizedSvg)
        .then(() => toast.success('Optimized SVG copied to clipboard!'))
        .catch(() => toast.error('Failed to copy SVG.'));
    } else {
      toast.error('No optimized SVG to copy.');
    }
  }, [optimizedSvg]);

  const handleDownload = useCallback(() => {
    if (optimizedSvg) {
      const blob = new Blob([optimizedSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Optimized SVG downloaded!');
    } else {
      toast.error('No optimized SVG to download.');
    }
  }, [optimizedSvg]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInputSvg(content);
        toast.success('SVG file loaded.');
      };
      reader.onerror = () => {
        toast.error('Failed to read file.');
        setError('Failed to read file.');
      };
      reader.readAsText(file);
    }
  }, []);

  const reductionPercentage = originalSize > 0
    ? (((originalSize - optimizedSize) / originalSize) * 100).toFixed(2)
    : '0.00';

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SVG Optimizer & Viewer"
      description="Optimize SVG files by removing unnecessary data and view the result."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Input & Controls Panel */}
        <div className="flex-1 flex flex-col gap-4">
          <label htmlFor="svg-input" className="block text-sm font-medium text-slate-300">
            Input SVG
          </label>
          <textarea
            id="svg-input"
            className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none resize-y"
            placeholder="Paste your SVG code here or upload a file..."
            value={inputSvg}
            onChange={(e) => setInputSvg(e.target.value)}
          />

          <label className="flex items-center justify-center px-4 py-2 border border-slate-700 rounded-md cursor-pointer bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium text-slate-300">
            <UploadCloud className="w-4 h-4 mr-2" /> Upload SVG File
            <input type="file" accept=".svg" className="hidden" onChange={handleFileChange} />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleOptimize}
              className="btn btn-primary flex items-center justify-center"
            >
              <Sparkles className="w-4 h-4 mr-2" /> Optimize SVG
            </button>
            <button
              onClick={handleClear}
              className="btn btn-secondary flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Clear All
            </button>
          </div>

          {originalSize > 0 && (
            <div className="bg-slate-800 p-4 rounded-lg text-sm text-slate-300 border border-slate-700">
              <h3 className="font-semibold text-slate-200 mb-2">Optimization Stats:</h3>
              <p>Original Size: <span className="font-mono text-indigo-300">{formatBytes(originalSize)}</span></p>
              <p>Optimized Size: <span className="font-mono text-emerald-300">{formatBytes(optimizedSize)}</span></p>
              <p>Reduction: <span className="font-mono text-yellow-300">{reductionPercentage}%</span></p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md text-sm">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Output & Preview Panel */}
        <div className="flex-1 flex flex-col gap-4">
          <label htmlFor="svg-output" className="block text-sm font-medium text-slate-300">
            Optimized SVG
          </label>
          <textarea
            id="svg-output"
            className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none resize-y"
            placeholder="Optimized SVG will appear here..."
            value={optimizedSvg}
            readOnly
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              disabled={!optimizedSvg}
              className="btn btn-secondary flex items-center justify-center"
            >
              <Copy className="w-4 h-4 mr-2" /> Copy Optimized
            </button>
            <button
              onClick={handleDownload}
              disabled={!optimizedSvg}
              className="btn btn-secondary flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" /> Download SVG
            </button>
          </div>

          <div className="flex items-center justify-between mt-2">
            <label htmlFor="show-preview" className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="show-preview"
                  className="sr-only"
                  checked={showPreview}
                  onChange={() => setShowPreview(!showPreview)}
                />
                <div className="block bg-slate-700 w-10 h-6 rounded-full"></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                    showPreview ? 'translate-x-4 bg-indigo-500' : ''
                  }`}
                ></div>
              </div>
              <div className="ml-3 text-slate-300 text-sm font-medium">
                {showPreview ? <EyeOff className="inline-block w-4 h-4 mr-1" /> : <Eye className="inline-block w-4 h-4 mr-1" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </div>
            </label>
          </div>

          {showPreview && optimizedSvg && (
            <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-center min-h-[150px] max-h-[400px] overflow-auto border border-slate-700">
              <div
                className="max-w-full max-h-full"
                dangerouslySetInnerHTML={{ __html: optimizedSvg }}
              />
            </div>
          )}
          {showPreview && !optimizedSvg && (
            <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-center min-h-[150px] max-h-[400px] border border-slate-700 text-slate-500 text-sm">
              No SVG to preview. Optimize an SVG to see it here.
            </div>
          )}
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SvgOptimizerViewerPage;