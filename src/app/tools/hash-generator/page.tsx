'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import CryptoJS from 'crypto-js';
import toast from 'react-hot-toast';

type Algorithm = 'MD5' | 'SHA1' | 'SHA256';

export default function HashGeneratorPage() {
  const [inputText, setInputText] = useState<string>('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('MD5');
  const [outputHash, setOutputHash] = useState<string>('');

  const calculateHash = useCallback((text: string, algorithm: Algorithm): string => {
    if (!text) return '';
    switch (algorithm) {
      case 'MD5':
        return CryptoJS.MD5(text).toString();
      case 'SHA1':
        return CryptoJS.SHA1(text).toString();
      case 'SHA256':
        return CryptoJS.SHA256(text).toString();
      default:
        return '';
    }
  }, []);

  useEffect(() => {
    setOutputHash(calculateHash(inputText, selectedAlgorithm));
  }, [inputText, selectedAlgorithm, calculateHash]);

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
      toolSlug="hash-generator"
      toolName="Hash Generator"
      description="Generate MD5, SHA1, and SHA256 hashes from text."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Input Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="inputText" className="block text-sm font-medium text-slate-300 mb-2">
            Input Text
          </label>
          <textarea
            id="inputText"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-50 font-mono text-sm resize-none"
            placeholder="Enter text here to generate its hash..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
          />
          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-2">
              {(['MD5', 'SHA1', 'SHA256'] as Algorithm[]).map((algo) => (
                <button
                  key={algo}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedAlgorithm === algo
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                  onClick={() => setSelectedAlgorithm(algo)}
                >
                  {algo}
                </button>
              ))}
            </div>
            <button
              className="px-4 py-2 rounded-md bg-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-600 transition-colors"
              onClick={() => setInputText('')}
            >
              Clear Input
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="outputHash" className="block text-sm font-medium text-slate-300 mb-2">
            Output Hash ({selectedAlgorithm})
          </label>
          <textarea
            id="outputHash"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-50 font-mono text-sm resize-none"
            readOnly
            value={outputHash}
            rows={10}
          />
          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md"
              onClick={handleCopy}
            >
              Copy Hash
            </button>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}