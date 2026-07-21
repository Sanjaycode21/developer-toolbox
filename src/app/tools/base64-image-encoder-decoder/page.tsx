"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, Download, Upload, X, Image as ImageIcon } from 'lucide-react';
import NextImage from 'next/image'; // Renamed to avoid conflict with HTML ImageElement

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];

export default function Base64ImageEncoderDecoderPage() {
  const toolSlug = "base64-image-encoder-decoder";
  const addToHistory = useToolStore((state) => state.addToHistory);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [encodedBase64, setEncodedBase64] = useState<string>('');
  const [base64Input, setBase64Input] = useState<string>('');
  const [decodedImageSrc, setDecodedImageSrc] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const encodeFileToBase64 = useCallback((file: File) => {
    setError(null);
    if (!file) {
      setEncodedBase64('');
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload an image (PNG, JPEG, GIF, WebP, SVG).');
      setEncodedBase64('');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setEncodedBase64(result);
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setEncodedBase64('');
    };
    reader.readAsDataURL(file);
  }, []);

  const decodeBase64ToImage = useCallback((base64: string) => {
    setError(null);
    setDecodedImageSrc('');
    if (!base64.trim()) {
      return;
    }

    try {
      // Basic validation for data URL format
      if (!base64.startsWith('data:')) {
        // Try to prepend common image data URL prefix if missing
        const possiblePrefixes = [
          'data:image/png;base64,',
          'data:image/jpeg;base64,',
          'data:image/gif;base64,',
          'data:image/webp;base64,',
          'data:image/svg+xml;base64,',
        ];
        let foundPrefix = false;
        for (const prefix of possiblePrefixes) {
          if (base64.startsWith(prefix)) {
            foundPrefix = true;
            break;
          }
        }
        if (!foundPrefix) {
          // If no prefix, assume it's just the base64 string and try to decode as PNG
          // This is a heuristic, might not always be correct
          base64 = 'data:image/png;base64,' + base64;
        }
      }

      // Further validation: check if it's a valid base64 string after the prefix
      const parts = base64.split(',');
      if (parts.length < 2) {
        setError('Invalid Base64 string format. Missing data URL prefix.');
        return;
      }
      const base64Data = parts[1];
      // Attempt to decode to check validity
      atob(base64Data); // This will throw if not valid base64

      setDecodedImageSrc(base64);
    } catch (e) {
      setError('Invalid Base64 string. Could not decode image.');
      setDecodedImageSrc('');
    }
  }, []);

  useEffect(() => {
    if (imageFile) {
      encodeFileToBase64(imageFile);
    } else {
      setEncodedBase64('');
    }
  }, [imageFile, encodeFileToBase64]);

  useEffect(() => {
    decodeBase64ToImage(base64Input);
  }, [base64Input, decodeBase64ToImage]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    setError(null);
    let files: FileList | null = null;

    if ('dataTransfer' in event) { // Drag event
      files = event.dataTransfer.files;
    } else if ('files' in event.target) { // Input change event
      files = event.target.files;
    }

    if (files && files.length > 0) {
      const file = files[0];
      if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setImageFile(file);
      } else {
        setError('Invalid file type. Please upload an image (PNG, JPEG, GIF, WebP, SVG).');
        setImageFile(null);
        setEncodedBase64('');
      }
    } else {
      setImageFile(null);
      setEncodedBase64('');
    }
  }, [encodeFileToBase64]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileChange(event);
  }, [handleFileChange]);

  const handleCopy = useCallback((text: string, message: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success(message);
    } else {
      toast.error('Nothing to copy.');
    }
  }, []);

  const handleDownloadImage = useCallback(() => {
    if (decodedImageSrc) {
      const link = document.createElement('a');
      link.href = decodedImageSrc;
      link.download = `decoded_image_${Date.now()}.${decodedImageSrc.split(';')[0].split('/')[1]}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded successfully!');
    } else {
      toast.error('No image to download.');
    }
  }, [decodedImageSrc]);

  const handleClearEncode = useCallback(() => {
    setImageFile(null);
    setEncodedBase64('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleClearDecode = useCallback(() => {
    setBase64Input('');
    setDecodedImageSrc('');
    setError(null);
  }, []);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="Base64 Image Encoder/Decoder"
      description="Encode images to Base64 strings and decode Base64 strings back to images."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Encode Image to Base64 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-slate-200">Encode Image to Base64</h2>
          <div
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors
              ${isDragging ? 'border-indigo-500 bg-indigo-900/20' : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'}
              cursor-pointer`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="w-10 h-10 text-slate-400 mb-3" />
            <p className="text-slate-300 text-sm font-medium">
              {isDragging ? 'Drop your image here' : 'Drag & drop an image or click to upload'}
            </p>
            <p className="text-slate-500 text-xs mt-1">
              PNG, JPEG, GIF, WebP, SVG (Max 5MB recommended for performance)
            </p>
            {imageFile && (
              <p className="text-indigo-400 text-sm mt-2">Selected: {imageFile.name}</p>
            )}
          </div>

          {imageFile && (
            <div className="relative w-full h-48 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
              <NextImage
                src={URL.createObjectURL(imageFile)}
                alt="Selected image preview"
                layout="fill"
                objectFit="contain"
                className="p-2"
              />
            </div>
          )}

          <div className="relative">
            <textarea
              className="w-full min-h-[150px] bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none resize-y font-mono"
              placeholder="Base64 encoded image will appear here..."
              value={encodedBase64}
              readOnly
            />
            <button
              onClick={() => handleCopy(encodedBase64, 'Base64 string copied!')}
              className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
              aria-label="Copy Base64 string"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleClearEncode}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium"
          >
            <X className="w-4 h-4" /> Clear Encoder
          </button>
        </div>

        {/* Decode Base64 to Image */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-slate-200">Decode Base64 to Image</h2>
          <div className="relative">
            <textarea
              className="w-full min-h-[200px] bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none resize-y font-mono"
              placeholder="Paste Base64 string here..."
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
            />
            <button
              onClick={() => handleCopy(base64Input, 'Input Base64 string copied!')}
              className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
              aria-label="Copy input Base64 string"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {decodedImageSrc ? (
            <div className="relative w-full h-48 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
              <NextImage
                src={decodedImageSrc}
                alt="Decoded image preview"
                layout="fill"
                objectFit="contain"
                className="p-2"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-slate-500 text-sm">
              <ImageIcon className="w-8 h-8 mr-2" /> Decoded image preview
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleDownloadImage}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!decodedImageSrc}
            >
              <Download className="w-4 h-4" /> Download Image
            </button>
            <button
              onClick={handleClearDecode}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium"
            >
              <X className="w-4 h-4" /> Clear Decoder
            </button>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}