"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';
import { Copy, XCircle } from 'lucide-react';

const HashGeneratorPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [md5Hash, setMd5Hash] = useState<string>('');
  const [sha1Hash, setSha1Hash] = useState<string>('');
  const [sha256Hash, setSha256Hash] = useState<string>('');

  const addToHistory = useToolStore((state) => state.addToHistory);
  const toolSlug = "hash-generator";

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleClearInput = () => {
    setInputText('');
    toast.success('Input cleared!');
  };

  const copyToClipboard = async (text: string, hashType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${hashType} hash copied to clipboard!`);
    } catch (err) {
      toast.error('Failed to copy hash.');
      console.error('Failed to copy: ', err);
    }
  };

  const HashOutputField: React.FC<{ label: string; value: string; hashType: string }> = ({ label, value, hashType }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <div className="relative">
        <textarea
          readOnly
          value={value}
          placeholder={`Generated ${hashType} hash...`}
          className="w-full min-h-[60px] bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 font-mono resize-none focus:outline-none focus:border-indigo-500 transition-colors pr-10"
          rows={2}
        />
        {value && (
          <button
            onClick={() => copyToClipboard(value, hashType)}
            className="absolute top-3 right-3 text-slate-400 hover:text-indigo-400 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label={`Copy ${hashType} hash`}
          >
            <Copy size={16} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="Hash Generator"
      description="Generate MD5, SHA-1, and SHA-256 hashes from your text."
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Input Section */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label htmlFor="inputText" className="text-lg font-semibold text-slate-100">Input Text</label>
            {inputText && (
              <button
                onClick={handleClearInput}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md p-1"
              >
                <XCircle size={16} /> Clear
              </button>
            )}
          </div>
          <div className="relative">
            <textarea
              id="inputText"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter text to generate hashes..."
              className="w-full h-48 bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-200 resize-y focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-slate-100">Generated Hashes</h2>
          <div className="grid grid-cols-1 gap-4">
            <HashOutputField label="MD5 Hash" value={md5Hash} hashType="MD5" />
            <HashOutputField label="SHA-1 Hash" value={sha1Hash} hashType="SHA-1" />
            <HashOutputField label="SHA-256 Hash" value={sha256Hash} hashType="SHA-256" />
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default HashGeneratorPage;