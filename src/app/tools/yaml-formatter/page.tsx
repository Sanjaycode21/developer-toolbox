"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const TOOL_SLUG = "yaml-formatter";
const TOOL_NAME = "YAML Formatter";
const TOOL_DESCRIPTION = "Format and beautify JSON-compatible YAML data for better readability.";

export default function YamlFormatterPage() {
  const [inputYaml, setInputYaml] = useState<string>('');
  const [outputYaml, setOutputYaml] = useState<string>('');
  const [indentation, setIndentation] = useState<number>(2);

  const { addToHistory } = useToolStore();

  useEffect(() => {
    addToHistory(TOOL_SLUG);
  }, [addToHistory]);

  const formatYaml = useCallback(() => {
    if (!inputYaml.trim()) {
      setOutputYaml('');
      toast.error('Input cannot be empty.');
      return;
    }

    try {
      // YAML is a superset of JSON, so we can try to parse it as JSON first.
      // This tool currently relies on JSON parsing for formatting due to
      // the absence of a dedicated YAML parsing library.
      const parsed = JSON.parse(inputYaml);
      setOutputYaml(JSON.stringify(parsed, null, indentation));
      toast.success('YAML formatted successfully!');
    } catch (error: any) {
      setOutputYaml('');
      toast.error(`Invalid JSON or non-JSON compatible YAML. This tool currently supports YAML that can be parsed as JSON. Error: ${error.message}`);
    }
  }, [inputYaml, indentation]);

  return (
    <ToolPageWrapper
      toolSlug={TOOL_SLUG}
      toolName={TOOL_NAME}
      description={TOOL_DESCRIPTION}
    >
      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Input Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="input-yaml" className="block text-sm font-medium text-slate-300 mb-2">
            Input YAML (JSON-compatible)
          </label>
          <textarea
            id="input-yaml"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
            placeholder="Enter your YAML (or JSON) here..."
            value={inputYaml}
            onChange={(e) => setInputYaml(e.target.value)}
            spellCheck="false"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-slate-900 rounded-lg shadow-inner border border-slate-800">
          <button
            onClick={formatYaml}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors shadow-md"
          >
            Format YAML
          </button>

          <div className="flex flex-col items-center gap-2">
            <label htmlFor="indentation-select" className="text-sm font-medium text-slate-300">
              Indentation
            </label>
            <select
              id="indentation-select"
              value={indentation}
              onChange={(e) => setIndentation(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-slate-50 rounded-lg py-1.5 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
            </select>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="output-yaml" className="block text-sm font-medium text-slate-300 mb-2">
            Formatted YAML
          </label>
          <textarea
            id="output-yaml"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
            placeholder="Formatted YAML will appear here..."
            value={outputYaml}
            readOnly
            spellCheck="false"
          />
        </div>
      </div>
    </ToolPageWrapper>
  );
}