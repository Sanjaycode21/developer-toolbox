"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";
import { Image, Copy, Download, UploadCloud, XCircle, FileWarning } from "lucide-react";

const TOOL_SLUG = "base64-image-encoder-decoder";
const TOOL_NAME = "Base64 Image Encoder/Decoder";
const TOOL_DESCRIPTION = "Encode images to Base64 strings and decode Base64 strings back to images.";

export default function Base64ImageEncoderDecoderPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState<string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [detectedImageType, setDetectedImageType] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToHistory } = useToolStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDecodeError(null);
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDetectedImageType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBase64String(result);
        setImagePreviewUrl(result);
      };
      reader.onerror = () => {
        toast.error("Failed to read file.");
        clearAll();
      };
      reader.readAsDataURL(file);
    } else {
      clearAll();
    }
  };

  const handleBase64InputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    setBase64String(input);
    decodeBase64Image(input);
  };

  const decodeBase64Image = useCallback((base64Str: string) => {
    setImagePreviewUrl(null);
    setDecodeError(null);
    setDetectedImageType(null);
    setSelectedFile(null);

    if (!base64Str.trim()) {
      return;
    }

    // Basic validation for data URI scheme
    const dataUriRegex = /^data:(image\/(png|jpeg|gif|webp|svg\+xml));base64,([A-Za-z0-9+/=]+)$/;
    const match = base64Str.match(dataUriRegex);

    let effectiveBase64 = base64Str;
    let type = "image/png"; // Default type if not specified in data URI

    if (match) {
      type = match[1];
      effectiveBase64 = base64Str; // Use the full data URI
    } else {
      // If no data URI prefix, assume it's raw base64 and try to prepend a common one
      // This might not always be correct, but provides a fallback for common cases
      effectiveBase64 = `data:${type};base64,${base64Str}`;
    }

    const img = new window.Image();
    img.onload = () => {
      setImagePreviewUrl(effectiveBase64);
      setDetectedImageType(type);
      setDecodeError(null);
    };
    img.onerror = () => {
      setImagePreviewUrl(null);
      setDecodeError("Invalid Base64 image string or unsupported format.");
      setDetectedImageType(null);
    };
    img.src = effectiveBase64;
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Base64 string copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy Base64 string.");
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadImage = () => {
    if (!imagePreviewUrl || !detectedImageType) {
      toast.error("No image to download.");
      return;
    }

    const link = document.createElement("a");
    link.href = imagePreviewUrl;
    const extension = detectedImageType.split("/")[1].replace("+xml", ""); // e.g., png, jpeg, svg
    link.download = `decoded-image.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  const clearAll = () => {
    setSelectedFile(null);
    setBase64String("");
    setImagePreviewUrl(null);
    setDecodeError(null);
    setDetectedImageType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (base64String.length > 0 && !decodeError) {
      addToHistory(TOOL_SLUG);
    }
  }, [base64String, decodeError, addToHistory]);

  return (
    <ToolPageWrapper toolSlug={TOOL_SLUG} toolName={TOOL_NAME} description={TOOL_DESCRIPTION}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Encode Section */}
        <div className="flex flex-col gap-6 p-6 bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-indigo-400" /> Encode Image to Base64
          </h2>
          <div
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/gif, image/webp, image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />
            <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
            <p className="text-slate-300 text-sm font-medium">
              Drag & drop an image here, or <span className="text-indigo-400">click to upload</span>
            </p>
            <p className="text-slate-500 text-xs mt-1">PNG, JPG, GIF, WebP, SVG (Max 5MB)</p>
            {selectedFile && (
              <p className="text-slate-400 text-xs mt-2">
                Selected: <span className="font-medium text-indigo-300">{selectedFile.name}</span> (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {imagePreviewUrl && selectedFile && (
            <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
              <h3 className="text-lg font-medium text-slate-200 mb-3">Image Preview</h3>
              <div className="max-h-64 overflow-auto flex justify-center items-center bg-slate-950 p-2 rounded">
                <img src={imagePreviewUrl} alt="Uploaded preview" className="max-w-full max-h-60 object-contain" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="base64Output" className="text-sm font-medium text-slate-300">
              Base64 Output
            </label>
            <textarea
              id="base64Output"
              className="w-full h-40 p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500 resize-y"
              value={base64String}
              placeholder="Upload an image to see its Base64 representation here..."
              readOnly
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => copyToClipboard(base64String)}
                disabled={!base64String}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-sm font-medium"
              >
                <Copy className="w-4 h-4" /> Copy Base64
              </button>
              <button
                onClick={clearAll}
                disabled={!base64String && !selectedFile}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-sm font-medium"
              >
                <XCircle className="w-4 h-4" /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Decode Section */}
        <div className="flex flex-col gap-6 p-6 bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
            <Image className="w-5 h-5 text-green-400" /> Decode Base64 to Image
          </h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="base64Input" className="text-sm font-medium text-slate-300">
              Paste Base64 String
            </label>
            <textarea
              id="base64Input"
              className="w-full h-40 p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm font-mono focus:outline-none focus:border-green-500 resize-y"
              value={base64String}
              onChange={handleBase64InputChange}
              placeholder="Paste your Base64 image string here to decode..."
            />
          </div>

          {decodeError && (
            <div className="p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-lg flex items-center gap-2 text-sm">
              <FileWarning className="w-5 h-5" /> {decodeError}
            </div>
          )}

          {imagePreviewUrl && !decodeError && (
            <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
              <h3 className="text-lg font-medium text-slate-200 mb-3">Decoded Image Preview</h3>
              <div className="max-h-64 overflow-auto flex justify-center items-center bg-slate-950 p-2 rounded">
                <img src={imagePreviewUrl} alt="Decoded preview" className="max-w-full max-h-60 object-contain" />
              </div>
              {detectedImageType && (
                <p className="text-slate-400 text-xs mt-3 text-center">
                  Detected Type: <span className="font-medium text-green-300">{detectedImageType}</span>
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleDownloadImage}
              disabled={!imagePreviewUrl || !!decodeError}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Download className="w-4 h-4" /> Download Image
            </button>
            <button
              onClick={clearAll}
              disabled={!base64String && !selectedFile}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-sm font-medium"
            >
              <XCircle className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}