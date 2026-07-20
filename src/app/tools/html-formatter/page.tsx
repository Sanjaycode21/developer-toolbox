'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, Sparkles, XCircle } from 'lucide-react';

const HTMLFormatter: React.FC = () => {
  const [inputHtml, setInputHtml] = useState<string>('');
  const [outputHtml, setOutputHtml] = useState<string>('');
  const [indentation, setIndentation] = useState<number>(2); // Default 2 spaces
  const { addToHistory } = useToolStore();

  const toolSlug = "html-formatter";

  const formatHtml = useCallback((html: string, indent: number): string => {
    if (!html.trim()) {
      return '';
    }

    try {
      const indentString = ' '.repeat(indent);

      // Preserve content inside pre, textarea, script, style tags by temporarily replacing them
      const placeholders: string[] = [];
      let tempHtml = html.replace(/(<pre[^>]*>[\s\S]*?<\/pre>|<textarea[^>]*>[\s\S]*?<\/textarea>|<script[^>]*>[\s\S]*?<\/script>|<style[^>]*>[\s\S]*?<\/style>)/gi, (match) => {
        const placeholder = `__DEVFORGE_PLACEHOLDER_${placeholders.length}__`;
        placeholders.push(match);
        return placeholder;
      });

      // Normalize whitespace: remove leading/trailing whitespace from lines, collapse multiple spaces
      tempHtml = tempHtml.split('\n').map(line => line.trim()).filter(Boolean).join('\n');

      // Add newlines around block-level tags for easier processing
      // This is a heuristic. It will put most tags on their own line.
      tempHtml = tempHtml
        .replace(/<([a-zA-Z0-9]+)([^>]*)>/g, (match, tagName, attrs) => {
            const lowerTagName = tagName.toLowerCase();
            const blockTags = new Set(['html', 'head', 'body', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'header', 'footer', 'nav', 'section', 'article', 'aside', 'main', 'figure', 'figcaption', 'blockquote', 'pre', 'address', 'fieldset', 'legend', 'details', 'summary', 'dl', 'dt', 'dd']);
            if (blockTags.has(lowerTagName)) {
                return `\n${match}\n`;
            }
            return match;
        })
        .replace(/<\/[a-zA-Z0-9]+>/g, (match) => `\n${match}\n`) // Newline before and after closing tags
        .replace(/\n\s*\n/g, '\n') // Collapse multiple newlines
        .trim();

      // Step 2: Apply indentation
      let currentIndent = 0;
      let formattedLines: string[] = [];

      tempHtml.split('\n').forEach(line => {
        line = line.trim();
        if (!line) return;

        // Handle comments
        if (line.startsWith('<!--') && line.endsWith('-->')) {
            formattedLines.push(indentString.repeat(currentIndent) + line);
            return;
        }

        // Decrease indent for closing tags
        if (line.match(/<\/(.+?)>/)) {
          currentIndent--;
        }

        const indentedLine = indentString.repeat(Math.max(0, currentIndent)) + line;
        formattedLines.push(indentedLine);

        // Increase indent for opening tags (that are not self-closing)
        if (line.match(/^<(?!\/)(.+?)>/) && !line.match(/<(.+?)\/>/) && !line.match(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([^>]*)>/i)) {
          currentIndent++;
        }
      });

      let finalFormatted = formattedLines.join('\n');

      // Restore preserved content
      placeholders.forEach((originalContent, index) => {
        finalFormatted = finalFormatted.replace(`__DEVFORGE_PLACEHOLDER_${index}__`, originalContent);
      });

      return finalFormatted.trim();

    } catch (error: any) {
      toast.error(`Formatting error: ${error.message}`);
      return html;
    }
  }, []);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleFormat = useCallback(() => {
    setOutputHtml(formatHtml(inputHtml, indentation));
  }, [inputHtml, indentation, formatHtml]);

  const handleClear = useCallback(() => {
    setInputHtml('');
    setOutputHtml('');
  }, []);

  const handleCopy = useCallback(() => {
    if (outputHtml) {
      navigator.clipboard.writeText(outputHtml);
      toast.success('Formatted HTML copied to clipboard!');
    } else {
      toast.error('Nothing to copy!');
    }
  }, [outputHtml]);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="HTML Formatter"
      description="Clean up and beautify your HTML code with proper indentation."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Input Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="inputHtml" className="block text-sm font-medium text-slate-300 mb-2">
            Input HTML
          </label>
          <textarea
            id="inputHtml"
            className="flex-1 w-full p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 font-mono text-sm text-slate-50 resize-none"
            placeholder="Paste your HTML here..."
            value={inputHtml}
            onChange={(e) => setInputHtml(e.target.value)}
            rows={10}
          ></textarea>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-slate-800/50 rounded-lg lg:w-48 flex-shrink-0">
          <div className="w-full">
            <label htmlFor="indentation" className="block text-xs font-medium text-slate-400 mb-1">
              Indentation
            </label>
            <select
              id="indentation"
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-50 focus:outline-none focus:border-indigo-500"
              value={indentation}
              onChange={(e) => setIndentation(Number(e.target.value))}
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value={8}>8 Spaces</option>
              <option value={0}>No Indent</option>
            </select>
          </div>

          <button
            onClick={handleFormat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <Sparkles size={16} /> Format
          </button>
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <Copy size={16} /> Copy Output
          </button>
          <button
            onClick={handleClear}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-white font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <XCircle size={16} /> Clear
          </button>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="outputHtml" className="block text-sm font-medium text-slate-300 mb-2">
            Formatted HTML
          </label>
          <textarea
            id="outputHtml"
            className="flex-1 w-full p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 font-mono text-sm text-slate-50 resize-none"
            placeholder="Formatted HTML will appear here..."
            value={outputHtml}
            readOnly
            rows={10}
          ></textarea>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default HTMLFormatter;