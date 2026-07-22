"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { Upload, Copy, Download, Image as ImageIcon, XCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useToolStore } from '@/store/useToolStore';

const MAX_FILE_SIZE_MB = 5; // 5 MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const Base64ImageEncoderDecoderPage = () => {
  const { addToHistory } = useToolStore();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [encodedBase64, setEncodedBase64] = useState<string>('');
  const [decodedBase64Input, setDecodedBase64Input] = useState<string>('');
  const [decodedImageUrl, setDecodedImageUrl] = useState<string | null>(null);
  const [encodeLoading, setEncodeLoading] = useState(false);
  const [decodeLoading, setDecodeLoading] = useState(false);
  const [encodeError, setEncodeError] = useState<string | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    addToHistory('base64-image-encoder-decoder');
  }, [addToHistory]);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setEncodeError('Please upload an image file.');
      setImageFile(null);
      setEncodedBase64('');
      return false;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setEncodeError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      setImageFile(null);
      setEncodedBase64('');
      return false;
    }

    setImageFile(file);
    setEncodeError(null);
    setEncodeLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setEncodedBase64(base64String);
      setEncodeLoading(false);
      toast.success('Image encoded to Base64!');
    };
    reader.onerror = () => {
      setEncodeError('Failed to read file.');
      setEncodeLoading(false);
      toast.error('Failed to read file.');
    };
    reader.readAsDataURL(file);
    return true;
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    } else {
      handleClearEncode();
    }
  }, [processFile]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleCopy = useCallback(() => {
    if (encodedBase64) {
      navigator.clipboard.writeText(encodedBase64);
      toast.success('Base64 string copied to clipboard!');
    }
  }, [encodedBase64]);

  const handleDecodeBase64 = useCallback(() => {
    setDecodeError(null);
    setDecodedImageUrl(null);
    if (!decodedBase64Input.trim()) {
      setDecodeError('Please enter a Base64 string to decode.');
      return;
    }

    setDecodeLoading(true);
    try {
      let base64Data = decodedBase64Input.trim();

      if (!base64Data.startsWith('data:')) {
        // Assume it's raw base64, try to prepend common image type
        base64Data = `data:image/png;base64,${base64Data}`;
      } else if (!base64Data.startsWith('data:image/')) {
        // It's a data URL but not an image, e.g., data:text/plain
        setDecodeError('The provided Base64 string is not an image data URL.');
        setDecodedImageUrl(null);
        setDecodeLoading(false);
        toast.error('Not an image data URL.');
        return;
      }

      const img = new Image();
      img.onload = () => {
        setDecodedImageUrl(base64Data);
        setDecodeLoading(false);
        toast.success('Base64 string decoded to image!');
      };
      img.onerror = () => {
        setDecodeError('Invalid Base64 image data or unsupported format.');
        setDecodedImageUrl(null);
        setDecodeLoading(false);
        toast.error('Invalid Base64 image data.');
      };
      img.src = base64Data;

    } catch (error) {
      setDecodeError('Error decoding Base64 string.');
      setDecodedImageUrl(null);
      setDecodeLoading(false);
      toast.error('Error decoding Base64 string.');
    }
  }, [decodedBase64Input]);

  const handleDownload = useCallback(() => {
    if (decodedImageUrl) {
      const link = document.createElement('a');
      link.href = decodedImageUrl;
      // Try to infer file type from data URL, default to png
      const mimeTypeMatch = decodedImageUrl.match(/^data:(image\/[^;]+);base64,/);
      const extension = mimeTypeMatch ? mimeTypeMatch[1].split('/')[1] : 'png';
      link.download = `decoded_image_${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded!');
    }
  }, [decodedImageUrl]);

  const handleClearEncode = useCallback(() => {
    setImageFile(null);
    setEncodedBase64('');
    setEncodeError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleClearDecode = useCallback(() => {
    setDecodedBase64Input('');
    setDecodedImageUrl(null);
    setDecodeError(null);
  }, []);

  return (
    <ToolPageWrapper
      toolSlug="base64-image-encoder-decoder"
      toolName="Base64 Image Encoder/Decoder"
      description="Encode and decode images to/from Base64 strings. Supports common image formats."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Encode Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-slate-200">Encode Image to Base64</h2>
          <div
            className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {imageFile ? (
              <div className="flex flex-col items-center text-center text-slate-300 px-4">
                <ImageIcon className="w-8 h-8 text-indigo-400 mb-2" />
                <p className="text-sm font-medium truncate w-full">{imageFile.name}</p>
                <p className="text-xs text-slate-400">({(imageFile.size / 1024).toFixed(2)} KB)</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center text-slate-400 px-4">
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-sm font-medium">Drag & drop an image here, or click to select</p>
                <p className="text-xs text-slate-500">Max file size: {MAX_FILE_SIZE_MB}MB</p>
              </div>
            )}
            {encodeLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            )}
          </div>
          {encodeError && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <XCircle className="w-4 h-4" />
              <span>{encodeError}</span>
            </div>
          )}

          {encodedBase64 && (
            <div className="flex flex-col gap-2">
              <label htmlFor="encodedBase64" className="text-sm font-medium text-slate-300">
                Encoded Base64 String
              </label>
              <div className="relative">
                <textarea
                  id="encodedBase64"
                  className="w-full h-40 p-3 text-sm font-mono bg-slate-800 border border-slate-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-y text-slate-200"
                  value={encodedBase64}
                  readOnly
                  placeholder="Base64 string will appear here..."
                />
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-400">
                  Size: {(new TextEncoder().encode(encodedBase64).length / 1024).toFixed(2)} KB
                </span>
                <button
                  onClick={handleClearEncode}
                  className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Clear
                </button>
              </div>
            </div>
          )}

          {imageFile && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Image Preview</label>
              <div className="w-full max-h-64 overflow-hidden rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center p-2">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Decode Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-slate-200">Decode Base64 to Image</h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="decodedBase64Input" className="text-sm font-medium text-slate-300">
              Base64 String
            </label>
            <textarea
              id="decodedBase64Input"
              className="w-full h-40 p-3 text-sm font-mono bg-slate-800 border border-slate-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-y text-slate-200"
              value={decodedBase64Input}
              onChange={(e) => setDecodedBase64Input(e.target.value)}
              placeholder="Paste your Base64 image string here (e.g., data:image/png;base64,iVBORw0KGgo... or just the raw Base64 data)..."
            />
            {decodeError && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <XCircle className="w-4 h-4" />
                <span>{decodeError}</span>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleClearDecode}
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Clear
              </button>
              <button
                onClick={handleDecodeBase64}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={decodeLoading || !decodedBase64Input.trim()}
              >
                {decodeLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Decoding...
                  </>
                ) : (
                  'Decode Image'
                )}
              </button>
            </div>
          </div>

          {decodedImageUrl && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Decoded Image Preview</label>
              <div className="w-full max-h-64 overflow-hidden rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center p-2">
                <img
                  src={decodedImageUrl}
                  alt="Decoded Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <button
                onClick={handleDownload}
                className="mt-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Image
              </button>
            </div>
          )}
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default Base64ImageEncoderDecoderPage;