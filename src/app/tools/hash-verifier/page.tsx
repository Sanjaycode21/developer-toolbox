"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';
import { FileText, Hash, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';

type Algorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

// Helper function to convert ArrayBuffer to CryptoJS WordArray
function arrayBufferToWordArray(ab: ArrayBuffer) {
  const i8a = new Uint8Array(ab);
  const wordArr = CryptoJS.lib.WordArray.create(i8a as any);
  return wordArr;
}

const HashVerifierPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA-256');
  const [generatedHash, setGeneratedHash] = useState<string>('');
  const [expectedHash, setExpectedHash] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<'match' | 'mismatch' | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const addToHistory = useToolStore((state) => state.addToHistory);
  const toolSlug = "hash-verifier";

  const handleGenerateHash = useCallback(async () => {
    addToHistory(toolSlug);
    setGeneratedHash('');
    setComparisonResult(null);
    setIsGenerating(true);

    try {
      let dataToHash: string | CryptoJS.lib.WordArray | null = null;

      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          dataToHash = arrayBufferToWordArray(arrayBuffer);
          let hash;
          switch (algorithm) {
            case 'MD5': hash = CryptoJS.MD5(dataToHash).toString(); break;
            case 'SHA-1': hash = CryptoJS.SHA1(dataToHash).toString(); break;
            case 'SHA-256': hash = CryptoJS.SHA256(dataToHash).toString(); break;
            case 'SHA-512': hash = CryptoJS.SHA512(dataToHash).toString(); break;
            default: throw new Error('Unsupported algorithm');
          }
          setGeneratedHash(hash);
          toast.success('Hash generated successfully!');
          setIsGenerating(false);
        };
        reader.onerror = () => {
          toast.error('Failed to read file.');
          setIsGenerating(false);
        };
        reader.readAsArrayBuffer(selectedFile);
      } else if (inputText.trim()) {
        dataToHash = inputText;
        let hash;
        switch (algorithm) {
          case 'MD5': hash = CryptoJS.MD5(dataToHash).toString(); break;
          case 'SHA-1': hash = CryptoJS.SHA1(dataToHash).toString(); break;
          case 'SHA-256': hash = CryptoJS.SHA256(dataToHash).toString(); break;
          case 'SHA-512': hash = CryptoJS.SHA512(dataToHash).toString(); break;
          default: throw new Error('Unsupported algorithm');
        }
        setGeneratedHash(hash);
        toast.success('Hash generated successfully!');
        setIsGenerating(false);
      } else {
        toast.error('Please enter text or select a file to generate a hash.');
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Error generating hash:', error);
      toast.error('An error occurred during hash generation.');
      setIsGenerating(false);
    }
  }, [inputText, selectedFile, algorithm, addToHistory, toolSlug]);

  const handleCompareHashes = useCallback(() => {
    if (!generatedHash) {
      toast.error('Please generate a hash first.');
      return;
    }
    if (!expectedHash.trim()) {
      toast.error('Please enter an expected hash to compare.');
      return;
    }

    if (generatedHash.toLowerCase() === expectedHash.trim().toLowerCase()) {
      setComparisonResult('match');
      toast.success('Hashes match!');
    } else {
      setComparisonResult('mismatch');
      toast.error('Hashes do NOT match!');
    }
  }, [generatedHash, expectedHash]);

  const handleClear = useCallback(() => {
    setInputText('');
    setSelectedFile(null);
    setAlgorithm('SHA-256');
    setGeneratedHash('');
    setExpectedHash('');
    setComparisonResult(null);
    setIsGenerating(false);
    toast.success('Cleared all inputs and results.');
  }, []);

  const inputPlaceholder = useMemo(() => {
    if (selectedFile) {
      return `File selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`;
    }
    return 'Enter text here to generate its hash...';
  }, [selectedFile]);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="Hash Verifier"
      description="Generate and verify cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512) for text or files."
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Input & Controls */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="input-content" className="text-sm font-medium text-slate-300">
              Input Content (Text or File)
            </label>
            <textarea
              id="input-content"
              className="w-full h-40 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y font-mono text-sm"
              placeholder={inputPlaceholder}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setSelectedFile(null); // Clear file selection if text is entered
              }}
              disabled={!!selectedFile}
            />
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-16 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <FileText className="w-5 h-5" />
                  <p className="font-medium">
                    {selectedFile ? `File: ${selectedFile.name}` : 'Drag & drop a file here, or click to browse'}
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                      setInputText(''); // Clear text input if file is selected
                    } else {
                      setSelectedFile(null);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="algorithm-select" className="text-sm font-medium text-slate-300">
              Hashing Algorithm
            </label>
            <select
              id="algorithm-select"
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none custom-select"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            >
              <option value="MD5">MD5</option>
              <option value="SHA-1">SHA-1</option>
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </div>

          <div className="flex gap-4 mt-2">
            <button
              onClick={handleGenerateHash}
              className="flex-1 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isGenerating || (!inputText.trim() && !selectedFile)}
            >
              {isGenerating ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4" /> Generate Hash
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>

        {/* Output & Verification */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="generated-hash" className="text-sm font-medium text-slate-300">
              Generated Hash
            </label>
            <div className="relative">
              <textarea
                id="generated-hash"
                className="w-full h-24 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y font-mono text-sm"
                readOnly
                value={generatedHash}
                placeholder="Generated hash will appear here..."
              />
              {generatedHash && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedHash);
                    toast.success('Generated hash copied to clipboard!');
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 text-xs transition-colors"
                  title="Copy to clipboard"
                >
                  Copy
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="expected-hash" className="text-sm font-medium text-slate-300">
              Expected Hash (for comparison)
            </label>
            <input
              id="expected-hash"
              type="text"
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-sm"
              placeholder="Enter the hash you expect to match..."
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
            />
          </div>

          <button
            onClick={handleCompareHashes}
            className="w-full px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!generatedHash || !expectedHash.trim()}
          >
            <CheckCircle className="w-4 h-4" /> Compare Hashes
          </button>

          {comparisonResult && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${
                comparisonResult === 'match'
                  ? 'bg-emerald-900/30 border border-emerald-700 text-emerald-300'
                  : 'bg-red-900/30 border border-red-700 text-red-300'
              }`}
            >
              {comparisonResult === 'match' ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span>
                {comparisonResult === 'match'
                  ? 'The generated hash MATCHES the expected hash!'
                  : 'The generated hash DOES NOT MATCH the expected hash!'}
              </span>
            </div>
          )}
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default HashVerifierPage;