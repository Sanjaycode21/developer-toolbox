"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import CryptoJS from 'crypto-js';
import toast from 'react-hot-toast';
import { useToolStore } from '@/store/useToolStore';
import { Copy } from 'lucide-react';

type HashAlgorithm = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512';

const HashGeneratorPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<HashAlgorithm>('MD5');
  const [outputHash, setOutputHash] = useState<string>('');

  const { addToHistory } = useToolStore();
  const toolSlug = "hash-generator";

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const generateHash = useCallback((text: string, algorithm: HashAlgorithm): string => {
    if (!text) return '';

    switch (algorithm) {
      case 'MD5':
        return CryptoJS.MD5(text).toString();
      case 'SHA1':
        return CryptoJS.SHA1(text).toString();
      case 'SHA256':
        return CryptoJS.SHA256(text).toString();
      case 'SHA512':
        return CryptoJS.SHA512(text).toString();
      default:
        return '';
    }
  }, []);

  useEffect(() => {
    setOutputHash(generateHash(inputText, selectedAlgorithm));
  }, [inputText, selectedAlgorithm, generateHash]);

  const handleCopy = async () => {
    if (outputHash) {
      try {
        await navigator.clipboard.writeText(outputHash);
        toast.success('Hash copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy hash.');
        console.error('Failed to copy: ', err);
      }
    } else {
      toast('Nothing to copy.', { icon: 'ℹ️' });
    }
  };

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="Hash Generator"
      description="Generate cryptographic hashes (MD5, SHA1, SHA256, SHA512) from your text."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Input Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="inputText" className="block text-sm font-medium text-slate-300 mb-2">
            Input Text
          </label>
          <textarea
            id="inputText"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm transition-colors"
            placeholder="Enter text to hash..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
          />
        </div>

        {/* Controls and Output Section */}
        <div className="flex-1 flex flex-col">
          {/* Algorithm Selector */}
          <div className="mb-6">
            <label htmlFor="algorithmSelect" className="block text-sm font-medium text-slate-300 mb-2">
              Select Algorithm
            </label>
            <select
              id="algorithmSelect"
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none pr-10 cursor-pointer transition-colors"
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value as HashAlgorithm)}
            >
              <option value="MD5">MD5</option>
              <option value="SHA1">SHA1</option>
              <option value="SHA256">SHA256</option>
              <option value="SHA512">SHA512</option>
            </select>
          </div>

          {/* Output Section */}
          <div className="flex-1 flex flex-col">
            <label htmlFor="outputHash" className="block text-sm font-medium text-slate-300 mb-2">
              Generated Hash
            </label>
            <div className="relative flex-1">
              <textarea
                id="outputHash"
                className="w-full h-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm read-only:bg-slate-800 read-only:text-slate-300 transition-colors"
                readOnly
                value={outputHash}
                placeholder="Generated hash will appear here..."
              />
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!outputHash}
                aria-label="Copy hash to clipboard"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default HashGeneratorPage;