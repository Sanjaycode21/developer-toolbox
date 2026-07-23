"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, Download, UploadCloud, XCircle } from 'lucide-react';

const TOOL_SLUG = "base64-image-encoder-decoder";
const TOOL_NAME = "Base64 Image Encoder/Decoder";
const TOOL_DESCRIPTION = "Encode images to Base64 strings and decode Base64 strings back to images.";

export default function Base64ImageEncoderDecoderPage() {
  const { addToHistory } = useToolStore();

  const [inputImageFile, setInputImageFile] = useState<File | null>(null);
  const [inputBase64, setInputBase64] = useState<string>('');
  const [outputBase64, setOutputBase64] = useState<string>('');
  const [outputImageSrc, setOutputImageSrc] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    addToHistory(TOOL_SLUG);
  }, [addToHistory]);

  const handleFileChange = useCallback((file: File | null) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (e.g., PNG, JPEG, GIF).');
        setInputImageFile(null);
        setOutputBase64('');
        setOutputImageSrc('');
        return;
      }
      setError(null);
      setInputImageFile(file);
      setInputBase64(''); // Clear base64 input when a new file is uploaded
      setOutputImageSrc(URL.createObjectURL(file)); // Show preview of uploaded image
    } else {
      setInputImageFile(null);
      setOutputBase64('');
      setOutputImageSrc('');
      setError(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleEncode = useCallback(() => {
    if (!inputImageFile) {
      setError('Please upload an image file first.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setOutputBase64(base64String);
      toast.success('Image encoded to Base64!');
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
      toast.error('Failed to encode image.');
    };
    reader.readAsDataURL(inputImageFile);
  }, [inputImageFile]);

  const handleDecode = useCallback(() => {
    if (!inputBase64.trim()) {
      setError('Please enter a Base64 string to decode.');
      return;
    }

    setError(null);
    try {
      // Basic validation for data URL format
      if (!inputBase64.startsWith('data:image/')) {
        setError('Invalid Base64 image string. It should start with "data:image/".');
        setOutputImageSrc('');
        return;
      }

      // Attempt to create an image to check validity
      const img = new Image();
      img.onload = () => {
        setOutputImageSrc(inputBase64);
        setInputImageFile(null); // Clear file input when decoding base64
        setOutputBase64(''); // Clear output base64 when decoding
        toast.success('Base64 string decoded to image!');
      };
      img.onerror = () => {
        setError('Invalid Base64 string or unsupported image format.');
        setOutputImageSrc('');
        toast.error('Failed to decode Base64 string.');
      };
      img.src = inputBase64;

    } catch (e: any) {
      setError('Error decoding Base64 string: ' + e.message);
      setOutputImageSrc('');
      toast.error('Failed to decode Base64 string.');
    }
  }, [inputBase64]);

  const handleCopyBase64 = useCallback(() => {
    if (outputBase64) {
      navigator.clipboard.writeText(outputBase64);
      toast.success('Base64 string copied to clipboard!');
    } else {
      toast.error('No Base64 string to copy.');
    }
  }, [outputBase64]);

  const handleDownloadImage = useCallback(() => {
    if (outputImageSrc) {
      const link = document.createElement('a');
      link.href = outputImageSrc;
      link.download = `decoded_image_${Date.now()}.png`; // Default to PNG, could parse type from data URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded!');
    } else {
      toast.error('No image to download.');
    }
  }, [outputImageSrc]);

  const clearInputs = useCallback(() => {
    setInputImageFile(null);
    setInputBase64('');
    setOutputBase64('');
    setOutputImageSrc('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Inputs cleared!');
  }, []);

  return (
    <ToolPageWrapper
      toolSlug={TOOL_SLUG}
      toolName={TOOL_NAME}
      description={TOOL_DESCRIPTION}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-slate-200">Input</h2>

          {/* Image Upload */}
          <div
            className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
            />
            {inputImageFile ? (
              <div className="flex flex-col items-center text-slate-300">
                <img src={URL.createObjectURL(inputImageFile)} alt="Preview" className="max-h-32 max-w-full object-contain rounded-md mb-2" />
                <p className="text-sm font-medium">{inputImageFile.name}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleFileChange(null); }}
                  className="mt-2 text-red-400 hover:text-red-500 text-xs flex items-center gap-1"
                >
                  <XCircle size={14} /> Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <UploadCloud size={32} className="mb-2" />
                <p className="text-sm font-medium">Drag & drop an image here, or click to select</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF, SVG, etc.</p>
              </div>
            )}
          </div>

          <button
            onClick={handleEncode}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!inputImageFile}
          >
            Encode Image to Base64
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-sm">OR</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          {/* Base64 Input */}
          <textarea
            className="w-full h-48 bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-y font-mono text-sm"
            placeholder="Paste Base64 string here to decode..."
            value={inputBase64}
            onChange={(e) => {
              setInputBase64(e.target.value);
              setInputImageFile(null); // Clear file input when typing in base64
              setOutputImageSrc(''); // Clear image preview when typing in base64
            }}
          />
          <button
            onClick={handleDecode}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!inputBase64.trim()}
          >
            Decode Base64 to Image
          </button>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg text-sm flex items-center gap-2">
              <XCircle size={18} /> {error}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-slate-200">Output</h2>

          {/* Base64 Output */}
          <div className="relative">
            <textarea
              className="w-full h-48 bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-y font-mono text-sm"
              placeholder="Encoded Base64 string will appear here..."
              value={outputBase64}
              readOnly
            />
            <button
              onClick={handleCopyBase64}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 transition-colors"
              title="Copy to clipboard"
              disabled={!outputBase64}
            >
              <Copy size={18} />
            </button>
          </div>

          {/* Image Output */}
          <div className="relative flex flex-col items-center justify-center w-full min-h-48 border-2 border-dashed border-slate-700 rounded-lg bg-slate-800 p-4">
            {outputImageSrc ? (
              <>
                <img src={outputImageSrc} alt="Decoded Preview" className="max-h-64 max-w-full object-contain rounded-md" />
                <button
                  onClick={handleDownloadImage}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download size={18} /> Download Image
                </button>
              </>
            ) : (
              <p className="text-slate-500 text-sm">Decoded image will appear here</p>
            )}
          </div>

          <button
            onClick={clearInputs}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-lg transition-colors mt-4"
          >
            Clear All
          </button>
        </div>
      </div>
    </ToolPageWrapper>
  );
}