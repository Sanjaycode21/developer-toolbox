"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const XMLFormatterTool: React.FC = () => {
  const [inputXml, setInputXml] = useState<string>('');
  const [outputXml, setOutputXml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const addToHistory = useToolStore((state) => state.addToHistory);
  const toolSlug = "xml-formatter";

  const formatXml = useCallback((xmlString: string): string => {
    if (!xmlString.trim()) {
      return '';
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "application/xml");

      // Check for parsing errors
      const errorNode = xmlDoc.querySelector('parsererror');
      if (errorNode) {
        throw new Error(errorNode.textContent || 'Invalid XML format');
      }

      const serializer = new XMLSerializer();
      const formattedXml = serializer.serializeToString(xmlDoc);

      // Basic indentation (can be improved for more complex cases)
      const PADDING = '  '; // 2 spaces
      let reg = /(>)(<)(\/*)/g;
      let xml = formattedXml.replace(reg, '$1\r\n$2$3');
      let pad = 0;
      return xml.split('\r\n').map((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/)) {
          if (pad !== 0) {
            pad -= 1;
          }
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }
        let padding = Array(pad + 1).join(PADDING);
        pad += indent;
        return padding + node;
      }).join('\r\n');

    } catch (e: any) {
      throw new Error(`XML parsing or formatting error: ${e.message}`);
    }
  }, []);

  const handleFormat = useCallback(() => {
    setError(null);
    try {
      const formatted = formatXml(inputXml);
      setOutputXml(formatted);
      addToHistory(toolSlug);
      toast.success('XML formatted successfully!');
    } catch (e: any) {
      setError(e.message);
      setOutputXml('');
      toast.error(e.message);
    }
  }, [inputXml, formatXml, addToHistory]);

  const handleCopy = useCallback(() => {
    if (outputXml) {
      navigator.clipboard.writeText(outputXml)
        .then(() => toast.success('Formatted XML copied to clipboard!'))
        .catch(() => toast.error('Failed to copy XML.'));
    } else {
      toast.error('No XML to copy.');
    }
  }, [outputXml]);

  useEffect(() => {
    // Attempt to format on initial load if there's any default input, or when input changes
    if (inputXml) {
      handleFormat();
    }
  }, [inputXml, handleFormat]); // Re-run when inputXml changes

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="XML Formatter"
      description="Beautify and format your XML data for better readability."
    >
      <div className="flex flex-col space-y-6">
        {/* Input Section */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="xml-input" className="text-sm font-medium text-slate-300">
            Input XML
          </label>
          <textarea
            id="xml-input"
            className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
            placeholder="Paste your XML here..."
            value={inputXml}
            onChange={(e) => setInputXml(e.target.value)}
            spellCheck="false"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleFormat}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Format XML
          </button>
          <button
            onClick={handleCopy}
            disabled={!outputXml}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Copy Output
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-sm font-mono">
            <p className="font-bold mb-1">Error:</p>
            <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {/* Output Section */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="xml-output" className="text-sm font-medium text-slate-300">
            Formatted XML
          </label>
          <textarea
            id="xml-output"
            className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
            placeholder="Formatted XML will appear here..."
            value={outputXml}
            readOnly
            spellCheck="false"
          />
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default XMLFormatterTool;