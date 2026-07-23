"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { FileText, Download, Copy, Image as ImageIcon } from 'lucide-react';

const Base64ImageEncoderDecoder: React.FC = () => {
  const addToHistory = useToolStore((state) => state.addToHistory);
  const toolSlug = "base64-image-encoder-decoder";

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [base64Input, setBase64Input] = useState<string>('');
  const [encodedBase64Output, setEncodedBase64Output] = useState<string>('');
  const [decodedImageSrc, setDecodedImageSrc] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('decoded_image.png'); // Default filename for download
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleFileChange = useCallback((file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (e.g., PNG, JPEG, GIF).');
      setImageFile(null);
      setUploadedImagePreview(null);
      setEncodedBase64Output('');
      return;
    }

    // Limit file size to 5MB
    const MAX_FILE_SIZE_MB = 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      setImageFile(null);
      setUploadedImagePreview(null);
      setEncodedBase64Output('');
      return;
    }

    setImageFile(file);
    setFileName(file.name); // Set original filename for potential download later

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setUploadedImagePreview(result);
      setEncodedBase64Output(result); // The data URL is already base64 encoded
      toast.success('Image loaded and encoded successfully!');
    };
    reader.onerror = () => {
      toast.error('Failed to read file.');
      setImageFile(null);
      setUploadedImagePreview(null);
      setEncodedBase64Output('');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleBase64Decode = useCallback(() => {
    if (!base64Input.trim()) {
      setDecodedImageSrc(null);
      toast.error('Please enter a Base64 string to decode.');
      return;
    }

    const tryDecode = (dataUrl: string) => {
      return new Promise<string>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(dataUrl);
        img.onerror = () => reject(new Error('Invalid image data URL.'));
        img.src = dataUrl;
      });
    };

    const decodeAndSet = async () => {
      let dataUrlToTry = base64Input;
      let detectedExtension = 'png'; // Default extension

      if (!base64Input.startsWith('data:image/')) {
        // If it's a raw base64 string, try common prefixes
        const commonPrefixes = [
          { prefix: 'data:image/png;base64,', ext: 'png' },
          { prefix: 'data:image/jpeg;base64,', ext: 'jpeg' },
          { prefix: 'data:image/gif;base64,', ext: 'gif' },
          { prefix: 'data:image/webp;base64,', ext: 'webp' },
          { prefix: 'data:image/svg+xml;base64,', ext: 'svg' },
        ];
        let decodedSuccessfully = false;
        for (const { prefix, ext } of commonPrefixes) {
          try {
            const potentialDataUrl = prefix + base64Input;
            await tryDecode(potentialDataUrl);
            dataUrlToTry = potentialDataUrl;
            detectedExtension = ext;
            decodedSuccessfully = true;
            break;
          } catch (e) {
            // Try next prefix
          }
        }
        if (!decodedSuccessfully) {
          throw new Error('Could not decode Base64 string with common image prefixes.');
        }
      } else {
        // If it's already a data URL, try to extract the extension
        const match = base64Input.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,/);
        if (match && match[1]) {
          // Clean up potential complex types like 'svg+xml' to 'svg'
          detectedExtension = match[1].split('+')[0];
        }
      }

      try {
        await tryDecode(dataUrlToTry); // Validate the final data URL
        setDecodedImageSrc(dataUrlToTry);
        setFileName(`decoded_image.${detectedExtension}`);
        toast.success('Base64 string decoded successfully!');
      } catch (error: any) {
        setDecodedImageSrc(null);
        setFileName('decoded_image.png'); // Reset to default on error
        toast.error(error.message || 'Error decoding Base64 string. It might be malformed or an unsupported format.');
        console.error('Base64 decode error:', error);
      }
    };

    decodeAndSet();
  }, [base64Input]);

  const copyToClipboard = useCallback((text: string, message: string) => {
    if (!text) {
      toast.error('Nothing to copy!');
      return;
    }
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('Failed to copy.'));
  }, []);

  const downloadDecodedImage = useCallback(() => {
    if (!decodedImageSrc) {
      toast.error('No image to download!');
      return;
    }

    const link = document.createElement('a');
    link.href = decodedImageSrc;
    link.download = fileName; // Use the original file name or a default
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded successfully!');
  }, [decodedImageSrc, fileName]);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="Base64 Image Encoder/Decoder"
      description="Encode images to Base64 strings and decode Base64 strings back to images."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Encoder Section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-400" /> Image to Base64 Encoder
          </h2>
          <div
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors
              ${isDragging ? 'border-indigo-500 bg-slate-800' : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'}
              cursor-pointer`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
            />
            <ImageIcon className="w-10 h-10 text-slate-400 mb-3" />
            <p className="text-slate-300 text-sm font-medium">
              Drag & drop an image here, or <span className="text-indigo-400">click to browse</span>
            </p>
            <p className="text-slate-500 text-xs mt-1">PNG, JPG, GIF, BMP, SVG up to 5MB</p>
          </div>

          {uploadedImagePreview && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col gap-4">
              <h3 className="text-lg font-medium text-slate-200">Uploaded Image Preview</h3>
              <div className="max-h-64 overflow-hidden rounded-md border border-slate-700 flex items-center justify-center bg-slate-900">
                <img src={uploadedImagePreview} alt="Uploaded Preview" className="max-w-full max-h-60 object-contain" />
              </div>
              <p className="text-sm text-slate-400">File: {imageFile?.name} ({imageFile ? (imageFile.size / 1024).toFixed(2) : '0.00'} KB)</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="encodedOutput" className="text-sm font-medium text-slate-300">Encoded Base64 Output</label>
            <div className="relative">
              <textarea
                id="encodedOutput"
                className="w-full h-40 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500 resize-y"
                value={encodedBase64Output}
                readOnly
                placeholder="Encoded Base64 string will appear here..."
              />
              <button
                onClick={() => copyToClipboard(encodedBase64Output, 'Encoded Base64 copied to clipboard!')}
                className="absolute top-3 right-3 p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                title="Copy to clipboard"
                disabled={!encodedBase64Output}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Base64 to Image Decoder Section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" /> Base64 to Image Decoder
          </h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="base64Input" className="text-sm font-medium text-slate-300">Base64 String Input</label>
            <div className="relative">
              <textarea
                id="base64Input"
                className="w-full h-40 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500 resize-y"
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                placeholder="Paste your Base64 image string here (e.g., data:image/png;base64,... or raw base64)..."
              />
              <button
                onClick={() => copyToClipboard(base64Input, 'Base64 input copied to clipboard!')}
                className="absolute top-3 right-3 p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                title="Copy to clipboard"
                disabled={!base64Input}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleBase64Decode}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!base64Input.trim()}
            >
              <ImageIcon className="w-4 h-4" /> Decode Base64 to Image
            </button>
          </div>

          {decodedImageSrc && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col gap-4">
              <h3 className="text-lg font-medium text-slate-200">Decoded Image Preview</h3>
              <div className="max-h-64 overflow-hidden rounded-md border border-slate-700 flex items-center justify-center bg-slate-900">
                <img src={decodedImageSrc} alt="Decoded Preview" className="max-w-full max-h-60 object-contain" />
              </div>
              <button
                onClick={downloadDecodedImage}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" /> Download Image ({fileName})
              </button>
            </div>
          )}
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default Base64ImageEncoderDecoder;