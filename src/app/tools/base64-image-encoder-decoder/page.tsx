"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';
import { Copy, Download, UploadCloud, Image as ImageIcon, Code, Eye } from 'lucide-react';
import { useToolStore } from '@/store/useToolStore';

const TOOL_SLUG = "base64-image-encoder-decoder";
const TOOL_NAME = "Base64 Image Encoder/Decoder";
const TOOL_DESCRIPTION = "Encode images to Base64 strings and decode Base64 strings back to images.";

export default function Base64ImageEncoderDecoderPage() {
  const [inputBase64, setInputBase64] = useState<string>('');
  const [outputImageSrc, setOutputImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('decoded_image');
  const [fileType, setFileType] = useState<string>('image/png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addToHistory } = useToolStore();

  useEffect(() => {
    addToHistory(TOOL_SLUG);
  }, [addToHistory]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file.');
        // Clear the file input to allow re-uploading the same file after an error
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setInputBase64(base64String);
        setOutputImageSrc(base64String);
        // Extract file name without extension, or use a default
        const nameParts = file.name.split('.');
        const nameWithoutExtension = nameParts.length > 1 ? nameParts.slice(0, -1).join('.') : file.name;
        setFileName(nameWithoutExtension || 'uploaded_image');
        setFileType(file.type);
        toast.success('Image encoded to Base64!');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleBase64InputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setInputBase64(value);

    if (value.startsWith('data:image/')) {
      setOutputImageSrc(value);
      // Try to infer file type from data URL
      const match = value.match(/^data:(image\/[a-zA-Z0-9\-\+\.]+);base64,/);
      if (match && match[1]) {
        const inferredType = match[1];
        setFileType(inferredType);
        // Set a default filename with inferred extension
        setFileName(`decoded_image.${inferredType.split('/')[1]}`);
      } else {
        setFileType('image/png'); // Default if type cannot be inferred
        setFileName('decoded_image.png');
      }
    } else if (value === '') {
      setOutputImageSrc(null);
      setFileName('decoded_image');
      setFileType('image/png');
    } else {
      setOutputImageSrc(null);
      // Optionally, show an error here if the user expects immediate decoding validation
      // toast.error('Invalid Base64 image data URL format.');
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (inputBase64) {
      navigator.clipboard.writeText(inputBase64);
      toast.success('Base64 string copied to clipboard!');
    } else {
      toast.error('Nothing to copy.');
    }
  }, [inputBase64]);

  const handleDownload = useCallback(() => {
    if (outputImageSrc) {
      const link = document.createElement('a');
      link.href = outputImageSrc;
      // Ensure filename has an extension, add if missing based on fileType
      const finalFileName = fileName.includes('.') ? fileName : `${fileName}.${fileType.split('/')[1]}`;
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded!');
    } else {
      toast.error('No image to download.');
    }
  }, [outputImageSrc, fileName, fileType]);

  return (
    <ToolPageWrapper
      toolSlug={TOOL_SLUG}
      toolName={TOOL_NAME}
      description={TOOL_DESCRIPTION}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Input Section */}
        <div className="flex-1 flex flex-col gap-6">
          {/* File Upload */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-400" /> Encode Image
            </h3>
            <div
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(e.dataTransfer.files[0]);
                  if (fileInputRef.current) {
                    fileInputRef.current.files = dataTransfer.files;
                    // Manually trigger change event for React to pick it up
                    const event = new Event('change', { bubbles: true });
                    fileInputRef.current.dispatchEvent(event);
                  }
                }
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <ImageIcon className="w-12 h-12 text-slate-400 mb-3" />
              <p className="text-slate-300 text-sm font-medium">Drag & drop an image here, or <span className="text-indigo-400 font-semibold">click to upload</span></p>
              <p className="text-slate-500 text-xs mt-1">Supports PNG, JPG, GIF, WebP, SVG</p>
            </div>
          </div>

          {/* Base64 Input */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg flex-1">
            <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-400" /> Decode Base64 String
            </h3>
            <textarea
              value={inputBase64}
              onChange={handleBase64InputChange}
              placeholder="Paste Base64 image string here (e.g., data:image/png;base64,...)"
              rows={10}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-sm resize-y"
            />
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg flex-1">
            <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-400" /> Output & Preview
            </h3>
            <div className="flex flex-col gap-4">
              {/* Base64 Output */}
              <div className="relative">
                <textarea
                  value={inputBase64}
                  readOnly
                  placeholder="Encoded Base64 string will appear here..."
                  rows={8}
                  className="w-full p-3 pr-12 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none font-mono text-sm resize-y"
                />
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-2 bg-slate-700 hover:bg-indigo-600 text-slate-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!inputBase64}
                  aria-label="Copy Base64 string"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Image Preview */}
              <div className="mt-4 p-4 bg-slate-900 border border-slate-700 rounded-md flex flex-col items-center justify-center min-h-[200px]">
                {outputImageSrc ? (
                  <>
                    <img
                      src={outputImageSrc}
                      alt="Encoded/Decoded Preview"
                      className="max-w-full max-h-64 object-contain rounded-md border border-slate-600"
                    />
                    <p className="text-slate-400 text-sm mt-3">
                      {fileName}.{fileType.split('/')[1]} ({Math.round(inputBase64.length * 0.75 / 1024)} KB)
                    </p>
                  </>
                ) : (
                  <div className="text-slate-500 text-center">
                    <ImageIcon className="w-10 h-10 mx-auto mb-2" />
                    <p>No image to preview</p>
                  </div>
                )}
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!outputImageSrc}
              >
                <Download className="w-5 h-5" /> Download Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}