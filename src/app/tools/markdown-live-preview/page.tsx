"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { marked } from 'marked';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { ClipboardIcon, EraserIcon, EyeIcon, PencilIcon } from 'lucide-react';

// Configure marked
marked.use({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
});

export default function MarkdownLivePreviewPage() {
  const [markdownInput, setMarkdownInput] = useState<string>(`# Welcome to Markdown Live Preview!

This tool allows you to write Markdown on the left and see the rendered HTML on the right.

## Features:

*   **Headings**: Use \`#\` for H1, \`##\` for H2, etc.
*   **Bold**: \`**bold text**\`
*   **Italic**: \`*italic text*\`
*   **Lists**:
    *   Unordered lists with \`*\` or \`-\`
    *   Ordered lists with \`1.\`, \`2.\`, etc.
*   **Links**: \`[DevForge](https://devforge.app)\`
*   **Code Blocks**:
    \`\`\`javascript
    function helloWorld() {
      console.log("Hello, DevForge!");
    }
    \`\`\`
*   **Inline Code**: \`\`console.log('inline code')\`\`
*   **Blockquotes**:
    > This is a blockquote.
    > It can span multiple lines.

---

Enjoy using DevForge!`);
  const [htmlOutput, setHtmlOutput] = useState<string>('');

  const { addToHistory } = useToolStore();

  useEffect(() => {
    addToHistory('markdown-live-preview');
  }, [addToHistory]);

  useEffect(() => {
    const parseMarkdown = async () => {
      try {
        const parsedHtml = await marked.parse(markdownInput);
        setHtmlOutput(parsedHtml);
      } catch (error) {
        console.error("Error parsing markdown:", error);
        setHtmlOutput(`<p class="text-red-400">Error parsing Markdown: ${error instanceof Error ? error.message : String(error)}</p>`);
      }
    };
    parseMarkdown();
  }, [markdownInput]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownInput(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setMarkdownInput('');
    toast.success('Input cleared!');
  }, []);

  const handleCopyHtml = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(htmlOutput);
      toast.success('HTML copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy HTML: ', err);
      toast.error('Failed to copy HTML.');
    }
  }, [htmlOutput]);

  return (
    <ToolPageWrapper
      toolSlug="markdown-live-preview"
      toolName="Markdown Live Preview"
      description="Write Markdown and see the live HTML preview."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
        {/* Markdown Input */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <PencilIcon className="w-5 h-5 text-indigo-400" /> Markdown Input
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-600 transition-colors border border-slate-600"
              >
                <EraserIcon className="w-4 h-4" /> Clear
              </button>
            </div>
          </div>
          <textarea
            className="flex-1 w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-sm resize-none"
            placeholder="Start typing your Markdown here..."
            value={markdownInput}
            onChange={handleInputChange}
            spellCheck="false"
          />
        </div>

        {/* HTML Output */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <EyeIcon className="w-5 h-5 text-emerald-400" /> HTML Preview
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopyHtml}
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-600 transition-colors border border-slate-600"
              >
                <ClipboardIcon className="w-4 h-4" /> Copy HTML
              </button>
            </div>
          </div>
          <div
            className="
              flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg overflow-auto
              text-slate-200 leading-relaxed text-sm
              [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:pb-2 [&>h1]:border-b [&>h1]:border-slate-700
              [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-6
              [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:mt-5
              [&>h4]:text-lg [&>h4]:font-bold [&>h4]:mb-2 [&>h4]:mt-4
              [&>h5]:text-base [&>h5]:font-bold [&>h5]:mb-1 [&>h5]:mt-3
              [&>h6]:text-sm [&>h6]:font-bold [&>h6]:mb-1 [&>h6]:mt-2
              [&>p]:mb-3
              [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3
              [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3
              [&>li]:mb-1
              [&>a]:text-indigo-400 [&>a]:hover:underline
              [&>blockquote]:border-l-4 [&>blockquote]:border-indigo-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-400 [&>blockquote]:mb-3
              [&>pre]:bg-slate-900 [&>pre]:p-3 [&>pre]:rounded-md [&>pre]:overflow-x-auto [&>pre]:mb-3 [&>pre]:font-mono
              [&>code]:bg-slate-700 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-sm [&>code]:text-xs [&>code]:font-mono
              [&>pre>code]:block [&>pre>code]:bg-transparent [&>pre>code]:p-0 [&>pre>code]:text-slate-100
              [&>table]:w-full [&>table]:border-collapse [&>table]:mb-3 [&>table]:text-sm
              [&>th]:border [&>th]:border-slate-700 [&>th]:p-2 [&>th]:bg-slate-700 [&>th]:text-left
              [&>td]:border [&>td]:border-slate-700 [&>td]:p-2
              [&>hr]:border-t [&>hr]:border-slate-700 [&>hr]:my-6
            "
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
          />
        </div>
      </div>
    </ToolPageWrapper>
  );
}