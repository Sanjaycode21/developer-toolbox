"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import CryptoJS from 'crypto-js';
import toast from 'react-hot-toast';
import { Copy } from 'lucide-react';
import { useToolStore } from '@/store/useToolStore';

const HashGeneratorPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [md5Hash, setMd5Hash] = useState<string>('');
  const [sha1Hash, setSha1Hash] = useState<string>('');
  const [sha256Hash, setSha256Hash] = useState<string>('');

  const { addToHistory } = useToolStore();

  const toolSlug = "hash-generator";
  const toolName = "Hash Generator";
  const description = "Generate MD5, SHA1, and SHA256 hashes from text.";

  const generateHashes = useCallback((text: string) => {
    if (!text) {
      setMd5Hash('');
      setSha1Hash('');
      setSha256Hash('');
      return;
    }
    setMd5Hash(CryptoJS.MD5(text).toString());
    setSha1Hash(CryptoJS.SHA1(text).toString());
    setSha256Hash(CryptoJS.SHA256(text).toString());
  }, []);

  useEffect(() => {
    generateHashes(inputText);
  }, [inputText, generateHashes]);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleCopy = (text: string, type: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success(`${type} hash copied to clipboard!`);
    } else {
      toast.error(`No ${type} hash to copy.`);
    }
  };

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Input Section */}
        <div className="flex-1">
          <label htmlFor="inputText" className="block text-sm font-medium text-slate-300 mb-2">
            Input Text
          </label>
          <textarea
            id="inputText"
            className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y font-mono text-sm"
            placeholder="Enter text here to generate hashes..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col gap-6">
          {/* MD5 Hash */}
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-300">MD5 Hash</span>
              <button
                onClick={() => handleCopy(md5Hash, 'MD5')}
                className="p-2 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!md5Hash}
                aria-label="Copy MD5 hash"
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="bg-slate-900 p-3 rounded-md text-slate-200 font-mono text-sm break-all min-h-[40px] flex items-center">
              {md5Hash || <span className="text-slate-500">Generated MD5 hash will appear here...</span>}
            </div>
          </div>

          {/* SHA1 Hash */}
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-300">SHA1 Hash</span>
              <button
                onClick={() => handleCopy(sha1Hash, 'SHA1')}
                className="p-2 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!sha1Hash}
                aria-label="Copy SHA1 hash"
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="bg-slate-900 p-3 rounded-md text-slate-200 font-mono text-sm break-all min-h-[40px] flex items-center">
              {sha1Hash || <span className="text-slate-500">Generated SHA1 hash will appear here...</span>}
            </div>
          </div>

          {/* SHA256 Hash */}
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-300">SHA256 Hash</span>
              <button
                onClick={() => handleCopy(sha256Hash, 'SHA256')}
                className="p-2 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!sha256Hash}
                aria-label="Copy SHA256 hash"
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="bg-slate-900 p-3 rounded-md text-slate-200 font-mono text-sm break-all min-h-[40px] flex items-center">
              {sha256Hash || <span className="text-slate-500">Generated SHA256 hash will appear here...</span>}
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default HashGeneratorPage;