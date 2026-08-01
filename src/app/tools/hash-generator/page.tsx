'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';

type Algorithm = 'MD5' | 'SHA1' | 'SHA256';

const HashGeneratorPage: React.FC = () => {
  const toolSlug = "hash-generator";
  const toolName = "Hash Generator";
  const description = "Generate cryptographic hashes (MD5, SHA1, SHA256) from text.";

  const addToHistory = useToolStore((state) => state.addToHistory);

  const [inputText, setInputText] = useState<string>('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('MD5');
  const [outputHash, setOutputHash] = useState<string>('');

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const generateHash = useCallback(() => {
    if (!inputText) {
      setOutputHash('');
      return;
    }

    let hash = '';
    switch (selectedAlgorithm) {
      case 'MD5':
        hash = CryptoJS.MD5(inputText).toString();
        break;
      case 'SHA1':
        hash = CryptoJS.SHA1(inputText).toString();
        break;
      case 'SHA256':
        hash = CryptoJS.SHA256(inputText).toString();
        break;
      default:
        hash = '';
    }
    setOutputHash(hash);
  }, [inputText, selectedAlgorithm]);

  useEffect(() => {
    generateHash();
  }, [generateHash]);

  const handleCopy = () => {
    if (outputHash) {
      navigator.clipboard.writeText(outputHash);
      toast.success('Hash copied to clipboard!');
    } else {
      toast.error('No hash to copy.');
    }
  };

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Input Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="inputText" className="block text-sm font-medium text-slate-300 mb-2">
            Input Text
          </label>
          <textarea
            id="inputText"
            className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 resize-y font-mono text-sm"
            placeholder="Enter text to hash..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Controls and Output Section */}
        <div className="flex-1 flex flex-col">
          {/* Algorithm Selector */}
          <div className="mb-6">
            <label htmlFor="algorithmSelect" className="block text-sm font-medium text-slate-300 mb-2">
              Select Algorithm
            </label>
            <div className="relative">
              <select
                id="algorithmSelect"
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 appearance-none pr-10 cursor-pointer text-sm"
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value as Algorithm)}
              >
                <option value="MD5">MD5</option>
                <option value="SHA1">SHA-1</option>
                <option value="SHA256">SHA-256</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex-1 flex flex-col">
            <label htmlFor="outputHash" className="block text-sm font-medium text-slate-300 mb-2">
              Output Hash
            </label>
            <div className="relative flex-1">
              <textarea
                id="outputHash"
                className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 resize-y font-mono text-sm"
                readOnly
                value={outputHash}
                placeholder="Generated hash will appear here..."
              />
              <button
                onClick={handleCopy}
                className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!outputHash}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default HashGeneratorPage;