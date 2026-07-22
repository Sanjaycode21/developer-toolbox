"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';
import { Copy, Download, Upload, XCircle } from 'lucide-react';

const Base64ImageEncoderDecoder: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState<string>('');
  const [decodedImageSrc, setDecodedImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const encodeFileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }, []);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file.');
        setSelectedFile(null);
        setBase64String('');
        setFileName('');
        setDecodedImageSrc(null);
        return;
      }
      setSelectedFile(file);
      setFileName(file.name);
      try {
        const encodedString = await encodeFileToBase64(file);
        setBase64String(encodedString);
        setDecodedImageSrc(encodedString); // Show preview of the uploaded image
        toast.success('Image encoded to Base64!');
      } catch (error) {
        toast.error('Failed to encode image.');
        console.error('Error encoding file:', error);
        setBase64String('');
        setDecodedImageSrc(null);
      }
    } else {
      setSelectedFile(null);
      setBase64String('');
      setFileName('');
      setDecodedImageSrc(null);
    }
  }, [encodeFileToBase64]);

  const handleBase64InputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBase64String(event.target.value);
    setDecodedImageSrc(null); // Clear decoded image when input changes
  }, []);

  const handleDecode = useCallback(() => {
    if (!base64String) {
      toast.error('Please enter a Base64 string to decode.');
      return;
    }
    try {
      // Basic validation for Base64 string structure
      if (!base64String.startsWith('data:image/') || !base64String.includes(';base64,')) {
        toast.error('Invalid Base64 image string format. Expected "data:image/...;base64,..."');
        setDecodedImageSrc(null);
        return;
      }
      setDecodedImageSrc(base64String);
      toast.success('Base64 string decoded to image!');
    } catch (error) {
      toast.error('Failed to decode Base64 string. It might be invalid.');
      console.error('Error decoding Base64:', error);
      setDecodedImageSrc(null);
    }
  }, [base64String]);

  const copyToBase64 = useCallback(() => {
    if (base64String) {
      navigator.clipboard.writeText(base64String);
      toast.success('Base64 string copied to clipboard!');
    } else {
      toast.error('Nothing to copy.');
    }
  }, [base64String]);

  const downloadImage = useCallback(() => {
    if (decodedImageSrc) {
      const link = document.createElement('a');
      link.href = decodedImageSrc;
      // Try to infer extension from mime type, or default to png
      const mimeTypeMatch = decodedImageSrc.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
      const extension = mimeTypeMatch ? mimeTypeMatch[1] : 'png';
      link.download = fileName ? `${fileName.split('.').slice(0, -1).join('.') || 'decoded-image'}.${extension}` : `decoded-image.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded!');
    } else {
      toast.error('No image to download.');
    }
  }, [decodedImageSrc, fileName]);

  const clearInputs = useCallback(() => {
    setSelectedFile(null);
    setBase64String('');
    setDecodedImageSrc(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear file input
    }
    toast.success('Inputs cleared!');
  }, []);

  return (
    <ToolPageWrapper
      toolSlug="base64-image-encoder-decoder"
      toolName="Base64 Image Encoder/Decoder"
      description="Encode images to Base64 strings and decode Base64 strings back to images."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Encoder Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-slate-200">Encode Image to Base64</h2>
          <div
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="w-10 h-10 text-slate-400" />
            <p className="mt-2 text-sm text-slate-400">
              {selectedFile ? (
                <span className="font-medium text-indigo-400">{selectedFile.name}</span>
              ) : (
                <>
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </>
              )}
            </p>
            <p className="text-xs text-slate-500">PNG, JPG, GIF, SVG, etc.</p>
          </div>

          <label htmlFor="encoded-output" className="block text-sm font-medium text-slate-300">
            Base64 Output
          </label>
          <div className="relative">
            <textarea
              id="encoded-output"
              className="w-full h-48 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-indigo-500 focus:border-indigo-500 resize-y font-mono text-sm"
              placeholder="Encoded Base64 string will appear here..."
              value={base64String}
              readOnly
            />
            <button
              onClick={copyToBase64}
              className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-slate-100 transition-colors"
              title="Copy to clipboard"
              disabled={!base64String}
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decoder Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-slate-200">Decode Base64 to Image</h2>
          <label htmlFor="base64-input" className="block text-sm font-medium text-slate-300">
            Base64 Input
          </label>
          <div className="relative">
            <textarea
              id="base64-input"
              className="w-full h-48 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-indigo-500 focus:border-indigo-500 resize-y font-mono text-sm"
              placeholder="Paste your Base64 image string here (e.g., data:image/png;base64,...)"
              value={base64String}
              onChange={handleBase64InputChange}
            />
            {base64String && (
              <button
                onClick={() => setBase64String('')}
                className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-slate-100 transition-colors"
                title="Clear input"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDecode}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!base64String}
            >
              Decode
            </button>
            <button
              onClick={clearInputs}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>

          <label className="block text-sm font-medium text-slate-300">
            Decoded Image Preview
          </label>
          <div className="w-full min-h-[12rem] flex items-center justify-center bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-hidden relative">
            {decodedImageSrc ? (
              <>
                <img
                  src={decodedImageSrc}
                  alt="Decoded Preview"
                  className="max-w-full max-h-64 object-contain rounded-md"
                />
                <button
                  onClick={downloadImage}
                  className="absolute bottom-3 right-3 p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  title="Download Image"
                >
                  <Download className="w-5 h-5" />
                </button>
              </>
            ) : (
              <p className="text-slate-500">No image to display.</p>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default Base64ImageEncoderDecoder;