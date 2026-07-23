'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Image, Copy, Download, UploadCloud, XCircle, RefreshCcw } from 'lucide-react';

const TOOL_SLUG = 'base64-image-encoder-decoder';
const TOOL_NAME = 'Base64 Image Encoder/Decoder';
const TOOL_DESCRIPTION = 'Encode images to Base64 data URLs and decode Base64 strings back to images.';

const allowedImageTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function Base64ImageEncoderDecoderPage() {
  const { addToHistory } = useToolStore();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [base64Input, setBase64Input] = useState<string>('');
  const [encodedBase64, setEncodedBase64] = useState<string>('');
  const [decodedImageSrc, setDecodedImageSrc] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    addToHistory(TOOL_SLUG);
  }, [addToHistory]);

  const resetState = useCallback(() => {
    setUploadedFile(null);
    setBase64Input('');
    setEncodedBase64('');
    setDecodedImageSrc('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleFileChange = useCallback((files: FileList | null) => {
    resetState();
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    if (!allowedImageTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PNG, JPEG, GIF, WebP, or SVG image.');
      toast.error('Invalid file type.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setEncodedBase64(result);
      setDecodedImageSrc(result); // Also show preview of the uploaded image
      setError(null);
      toast.success('Image encoded to Base64!');
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      toast.error('Failed to read file.');
    };
    reader.readAsDataURL(file);
  }, [resetState]);

  const handleBase64InputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    resetState();
    const value = e.target.value;
    setBase64Input(value);

    if (!value) {
      setDecodedImageSrc('');
      return;
    }

    if (value.startsWith('data:image/') && value.includes(';base64,')) {
      setDecodedImageSrc(value);
      setError(null);
      toast.success('Base64 string decoded to image!');
    } else {
      setDecodedImageSrc('');
      setError('Invalid Base64 image data URL format. It should start with "data:image/...;base64,"');
    }
  }, [resetState]);

  const handleCopy = useCallback(async (text: string) => {
    if (!text) {
      toast.error('Nothing to copy!');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy.');
      console.error('Failed to copy:', err);
    }
  }, []);

  const handleDownload = useCallback(() => {
    const srcToDownload = decodedImageSrc || encodedBase64;
    if (!srcToDownload) {
      toast.error('No image to download!');
      return;
    }

    const link = document.createElement('a');
    link.href = srcToDownload;

    let filename = 'download';
    let extension = 'png'; // Default

    const mimeMatch = srcToDownload.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,/);
    if (mimeMatch && mimeMatch[1]) {
      extension = mimeMatch[1].toLowerCase();
      if (extension === 'jpeg') extension = 'jpg';
      if (extension === 'svg+xml') extension = 'svg';
    }

    if (uploadedFile) {
      filename = uploadedFile.name.split('.').slice(0, -1).join('.') || 'image';
      if (!filename) filename = 'image';
      const originalExt = uploadedFile.name.split('.').pop()?.toLowerCase();
      if (originalExt && allowedImageTypes.some(type => type.includes(originalExt))) {
        extension = originalExt;
      }
    } else if (base64Input) {
      filename = 'decoded_image';
    }

    link.download = `${filename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
  }, [decodedImageSrc, encodedBase64, uploadedFile, base64Input]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const hasOutput = encodedBase64 || (base64Input.startsWith('data:image/') && base64Input.includes(';base64,') ? base64Input : '');

  return (
    <ToolPageWrapper
      toolSlug={TOOL_SLUG}
      toolName={TOOL_NAME}
      description={TOOL_DESCRIPTION}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-slate-200">Input</h2>

          {/* Image Upload */}
          <div
            className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors
              ${isDragging ? 'border-indigo-500 bg-indigo-900/20' : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'}
              cursor-pointer`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files)}
              accept={allowedImageTypes.join(',')}
              className="hidden"
            />
            <UploadCloud className={`w-12 h-12 ${isDragging ? 'text-indigo-400' : 'text-slate-500'} mb-3`} />
            <p className={`text-sm font-medium ${isDragging ? 'text-indigo-300' : 'text-slate-400'}`}>
              Drag & drop an image here, or <span className="text-indigo-400 hover:text-indigo-300">click to upload</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">PNG, JPEG, GIF, WebP, SVG (Max {MAX_FILE_SIZE_MB}MB)</p>
            {uploadedFile && (
              <div className="absolute top-2 right-2 flex items-center gap-2 text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-md">
                <Image className="w-3 h-3" />
                <span>{uploadedFile.name}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); resetState(); }}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                  title="Clear uploaded file"
                >
                  <XCircle className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Base64 String Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="base64-input" className="text-sm font-medium text-slate-300">
              Or paste Base64 Data URL
            </label>
            <textarea
              id="base64-input"
              value={base64Input}
              onChange={handleBase64InputChange}
              rows={8}
              placeholder="Paste your Base64 image data URL here (e.g., data:image/png;base64,iVBORw0KGgo...)"
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-sm resize-y"
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={resetState}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-slate-200">Output</h2>

          {/* Encoded Base64 Output */}
          <div className="flex flex-col gap-2">
            <label htmlFor="encoded-base64-output" className="text-sm font-medium text-slate-300">
              Encoded Base64 Data URL
            </label>
            <div className="relative">
              <textarea
                id="encoded-base64-output"
                value={encodedBase64 || (base64Input.startsWith('data:image/') ? base64Input : '')}
                readOnly
                rows={8}
                placeholder="Encoded Base64 data URL will appear here..."
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-sm resize-y"
              />
              <button
                onClick={() => handleCopy(hasOutput)}
                disabled={!hasOutput}
                className="absolute top-3 right-3 p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decoded Image Preview */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              Decoded Image Preview
            </label>
            <div className="relative w-full min-h-[200px] bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center overflow-hidden p-4">
              {decodedImageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={decodedImageSrc}
                  alt="Decoded Image Preview"
                  className="max-w-full max-h-[300px] object-contain rounded-md"
                />
              ) : (
                <div className="text-slate-500 text-sm flex flex-col items-center gap-2">
                  <Image className="w-8 h-8" />
                  <span>No image to display</span>
                </div>
              )}
              {decodedImageSrc && (
                <button
                  onClick={handleDownload}
                  className="absolute bottom-3 right-3 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors"
                  title="Download image"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}