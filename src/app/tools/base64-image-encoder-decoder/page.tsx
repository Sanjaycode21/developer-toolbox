'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, Download, UploadCloud, Image as ImageIcon, X } from 'lucide-react';

const TOOL_SLUG = 'base64-image-encoder-decoder';
const TOOL_NAME = 'Base64 Image Encoder / Decoder';
const TOOL_DESCRIPTION = 'Encode images to Base64 strings and decode Base64 strings back to images.';

export default function Base64ImageEncoderDecoderPage() {
  const addToHistory = useToolStore((state) => state.addToHistory);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [encodedBase64, setEncodedBase64] = useState<string>('');

  const [inputBase64, setInputBase64] = useState<string>('');
  const [decodedImageUrl, setDecodedImageUrl] = useState<string | null>(null);
  const [decodedImageMimeType, setDecodedImageMimeType] = useState<string | null>(null);

  useEffect(() => {
    addToHistory(TOOL_SLUG);
  }, [addToHistory]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // Max 5MB
        toast.error('File size exceeds 5MB limit.');
        setSelectedFile(null);
        setImagePreviewUrl(null);
        setEncodedBase64('');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setEncodedBase64(''); // Clear previous encoding
    } else {
      setSelectedFile(null);
      setImagePreviewUrl(null);
      toast.error('Please select a valid image file (PNG, JPG, JPEG, GIF, SVG).');
    }
  }, []);

  const encodeImage = useCallback(() => {
    if (!selectedFile) {
      toast.error('No image selected for encoding.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(';base64,')[1];
      setEncodedBase64(base64String);
      toast.success('Image encoded to Base64!');
    };
    reader.onerror = () => {
      toast.error('Failed to read file.');
    };
    reader.readAsDataURL(selectedFile);
  }, [selectedFile]);

  const decodeBase64 = useCallback(() => {
    if (!inputBase64.trim()) {
      toast.error('Please enter a Base64 string to decode.');
      setDecodedImageUrl(null);
      setDecodedImageMimeType(null);
      return;
    }

    let base64Content = inputBase64.trim();
    let mimeType = 'application/octet-stream'; // Default fallback

    // Check if it's a data URI
    const dataUriMatch = base64Content.match(/^data:(.*?);base64,(.*)$/);

    if (dataUriMatch) {
      mimeType = dataUriMatch[1];
      base64Content = dataUriMatch[2];
    } else {
      // If no data URI prefix, try to infer common image types or default
      // This is a heuristic. A more robust solution might involve checking magic bytes after decoding.
      // For now, we'll just assume image/png if no prefix is given.
      mimeType = 'image/png';
    }

    try {
      const decoded = atob(base64Content);
      const byteCharacters = decoded.split('').map(char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteCharacters);
      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);
      setDecodedImageUrl(url);
      setDecodedImageMimeType(mimeType);
      toast.success('Base64 string decoded to image!');
    } catch (error) {
      console.error('Decoding error:', error);
      toast.error('Invalid Base64 string or unsupported format.');
      setDecodedImageUrl(null);
      setDecodedImageMimeType(null);
    }
  }, [inputBase64]);

  const copyToClipboard = useCallback((text: string) => {
    if (!text) {
      toast.error('Nothing to copy.');
      return;
    }
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  }, []);

  const downloadDecodedImage = useCallback(() => {
    if (decodedImageUrl && decodedImageMimeType) {
      const link = document.createElement('a');
      link.href = decodedImageUrl;
      const extension = decodedImageMimeType.split('/')[1] || 'png';
      link.download = `decoded_image.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(decodedImageUrl); // Clean up the object URL
      toast.success('Image download initiated!');
    } else {
      toast.error('No decoded image to download.');
    }
  }, [decodedImageUrl, decodedImageMimeType]);

  return (
    <ToolPageWrapper
      toolSlug={TOOL_SLUG}
      toolName={TOOL_NAME}
      description={TOOL_DESCRIPTION}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Encoder Section */}
        <div className="flex flex-col gap-6 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-indigo-400" /> Encode Image to Base64
          </h2>
          <div className="flex flex-col gap-4">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-slate-500">PNG, JPG, JPEG, GIF, SVG (Max 5MB)</p>
              </div>
              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>

            {imagePreviewUrl && (
              <div className="relative w-full h-48 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-slate-700">
                <img src={imagePreviewUrl} alt="Image Preview" className="max-w-full max-h-full object-contain" />
                <span className="absolute bottom-2 left-2 text-xs text-slate-400 bg-slate-900/70 px-2 py-1 rounded-md">
                  {selectedFile?.name} ({Math.round(selectedFile!.size / 1024)} KB)
                </span>
              </div>
            )}

            <button
              onClick={encodeImage}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!selectedFile}
            >
              <ImageIcon className="w-5 h-5" /> Encode Image
            </button>

            <div className="relative">
              <textarea
                className="w-full h-48 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 font-mono resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                placeholder="Encoded Base64 string will appear here..."
                value={encodedBase64}
                readOnly
              />
              <button
                onClick={() => copyToClipboard(encodedBase64)}
                className="absolute top-3 right-3 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!encodedBase64}
                aria-label="Copy encoded Base64"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Decoder Section */}
        <div className="flex flex-col gap-6 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-400" /> Decode Base64 to Image
          </h2>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <textarea
                className="w-full h-48 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 font-mono resize-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                placeholder="Paste Base64 string here to decode..."
                value={inputBase64}
                onChange={(e) => setInputBase64(e.target.value)}
              />
              <button
                onClick={() => setInputBase64('')}
                className="absolute top-3 right-3 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!inputBase64}
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={decodeBase64}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!inputBase64.trim()}
            >
              <ImageIcon className="w-5 h-5" /> Decode Base64
            </button>

            {decodedImageUrl && (
              <div className="relative w-full h-48 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-slate-700">
                <img src={decodedImageUrl} alt="Decoded Image" className="max-w-full max-h-full object-contain" />
                <span className="absolute bottom-2 left-2 text-xs text-slate-400 bg-slate-900/70 px-2 py-1 rounded-md">
                  {decodedImageMimeType || 'Unknown Type'}
                </span>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => copyToClipboard(inputBase64)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={!inputBase64}
              >
                <Copy className="w-4 h-4" /> Copy Input
              </button>
              <button
                onClick={downloadDecodedImage}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={!decodedImageUrl}
              >
                <Download className="w-4 h-4" /> Download Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}