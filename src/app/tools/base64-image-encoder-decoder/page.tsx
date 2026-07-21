"use client";

import React, { useState, useCallback, useRef } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, Download, Image as ImageIcon, Upload, XCircle } from 'lucide-react';

const TOOL_SLUG = "base64-image-encoder-decoder";
const TOOL_NAME = "Base64 Image Encoder/Decoder";
const TOOL_DESCRIPTION = "Encode images to Base64 strings and decode Base64 strings back to images.";

export default function Base64ImageEncoderDecoderPage() {
  const addToHistory = useToolStore((state) => state.addToHistory);

  const [inputImageFile, setInputImageFile] = useState<File | null>(null);
  const [encodedBase64, setEncodedBase64] = useState<string>('');
  const [inputBase64String, setInputBase64String] = useState<string>('');
  const [decodedImageSrc, setDecodedImageSrc] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (e.g., PNG, JPEG, GIF).');
        setEncodedBase64('');
        setInputImageFile(null);
        return;
      }
      setInputImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEncodedBase64(base64String);
        addToHistory(TOOL_SLUG);
        toast.success('Image encoded to Base64!');
      };
      reader.onerror = () => {
        setError('Failed to read file.');
        setEncodedBase64('');
      };
      reader.readAsDataURL(file);
    } else {
      setInputImageFile(null);
      setEncodedBase64('');
    }
  }, [addToHistory]);

  const handleBase64InputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputBase64String(event.target.value);
    setError(null);
    setDecodedImageSrc(''); // Clear decoded image on input change
  }, []);

  const decodeBase64Image = useCallback(() => {
    setError(null);
    setDecodedImageSrc(''); // Clear previous decoded image
    if (!inputBase64String.trim()) {
      setError('Please enter a Base64 string to decode.');
      return;
    }

    // Basic validation for Base64 image format (data:image/...)
    if (!inputBase64String.startsWith('data:image/')) {
      setError('Invalid Base64 image string format. It should start with "data:image/".');
      return;
    }

    try {
      // Attempt to create an image to check validity
      const img = new Image();
      img.onload = () => {
        setDecodedImageSrc(inputBase64String);
        addToHistory(TOOL_SLUG);
        toast.success('Base64 string decoded to image!');
      };
      img.onerror = () => {
        setError('Failed to decode Base64 string. It might be corrupted or not a valid image.');
        setDecodedImageSrc('');
      };
      img.src = inputBase64String;
    } catch (e) {
      setError('An unexpected error occurred during decoding.');
      setDecodedImageSrc('');
    }
  }, [inputBase64String, addToHistory]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  }, []);

  const downloadImage = useCallback((base64: string, filename: string) => {
    if (!base64) {
      toast.error('No image to download.');
      return;
    }
    try {
      const link = document.createElement('a');
      link.href = base64;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded!');
    } catch (e) {
      toast.error('Failed to download image.');
    }
  }, []);

  const clearEncodeInputs = useCallback(() => {
    setInputImageFile(null);
    setEncodedBase64('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const clearDecodeInputs = useCallback(() => {
    setInputBase64String('');
    setDecodedImageSrc('');
    setError(null);
  }, []);

  return (
    <ToolPageWrapper
      toolSlug={TOOL_SLUG}
      toolName={TOOL_NAME}
      description={TOOL_DESCRIPTION}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Encode Image to Base64 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" /> Encode Image to Base64
          </h2>
          <div className="relative border border-slate-700 rounded-lg p-6 bg-slate-800/50 hover:border-indigo-500 transition-colors duration-200 flex flex-col items-center justify-center text-center cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              ref={fileInputRef}
            />
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-10 h-10 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <p className="text-slate-300 font-medium">Drag & drop an image or <span className="text-indigo-400 group-hover:underline">browse</span></p>
              <p className="text-sm text-slate-500">PNG, JPG, GIF, SVG up to 5MB</p>
            </div>
            {inputImageFile && (
              <div className="mt-4 text-sm text-slate-400 flex items-center gap-2">
                <span>Selected: {inputImageFile.name} ({Math.round(inputImageFile.size / 1024)} KB)</span>
                <button
                  onClick={(e) => { e.stopPropagation(); clearEncodeInputs(); }}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                  title="Clear selected image"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="encodedOutput" className="text-sm font-medium text-slate-300">Base64 Output</label>
            <div className="relative">
              <textarea
                id="encodedOutput"
                className="w-full min-h-[150px] bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 font-mono focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none resize-y"
                value={encodedBase64}
                readOnly
                placeholder="Encoded Base64 string will appear here..."
              />
              {encodedBase64 && (
                <button
                  onClick={() => copyToClipboard(encodedBase64)}
                  className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={clearEncodeInputs}
            className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 font-medium transition-colors"
          >
            Clear Encoder
          </button>
        </div>

        {/* Decode Base64 to Image */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-400" /> Decode Base64 to Image
          </h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="base64Input" className="text-sm font-medium text-slate-300">Base64 Input</label>
            <textarea
              id="base64Input"
              className="w-full min-h-[150px] bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 font-mono focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none resize-y"
              value={inputBase64String}
              onChange={handleBase64InputChange}
              placeholder="Paste your Base64 image string here (e.g., data:image/png;base64,...)"
            />
          </div>
          <button
            onClick={decodeBase64Image}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
          >
            Decode Image
          </button>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Decoded Image Output</label>
            <div className="relative w-full min-h-[150px] bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-center justify-center overflow-hidden">
              {decodedImageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={decodedImageSrc}
                  alt="Decoded Image"
                  className="max-w-full max-h-[300px] object-contain rounded-md"
                />
              ) : (
                <span className="text-slate-500 text-sm">Decoded image will appear here.</span>
              )}
              {decodedImageSrc && (
                <button
                  onClick={() => downloadImage(decodedImageSrc, 'decoded_image.png')}
                  className="absolute bottom-3 right-3 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                  title="Download image"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={clearDecodeInputs}
            className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 font-medium transition-colors"
          >
            Clear Decoder
          </button>
        </div>
      </div>
    </ToolPageWrapper>
  );
}