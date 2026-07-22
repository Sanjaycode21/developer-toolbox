"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";
import { Image, Upload, Copy, Download, XCircle } from "lucide-react";

const TOOL_SLUG = "base64-image-encoder-decoder";
const TOOL_NAME = "Base64 Image Encoder/Decoder";
const TOOL_DESCRIPTION = "Encode images to Base64 strings and decode Base64 strings back to images.";

export default function Base64ImageEncoderDecoderPage() {
  const addToHistory = useToolStore((state) => state.addToHistory);

  // Encode state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [base64Output, setBase64Output] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Decode state
  const [base64Input, setBase64Input] = useState<string>("");
  const [decodedImagePreviewUrl, setDecodedImagePreviewUrl] = useState<string | null>(null);
  const [decodedImageMimeType, setDecodedImageMimeType] = useState<string | null>(null);

  useEffect(() => {
    addToHistory(TOOL_SLUG);
  }, [addToHistory]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file.");
        setSelectedFile(null);
        setImagePreviewUrl(null);
        setBase64Output("");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreviewUrl(result);
        setBase64Output(result); // Data URL is already Base64 encoded
      };
      reader.onerror = () => {
        toast.error("Failed to read file.");
        setSelectedFile(null);
        setImagePreviewUrl(null);
        setBase64Output("");
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreviewUrl(null);
      setBase64Output("");
    }
  }, []);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setBase64Output("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleCopyBase64 = useCallback(() => {
    if (base64Output) {
      navigator.clipboard.writeText(base64Output);
      toast.success("Base64 string copied to clipboard!");
    } else {
      toast.error("No Base64 string to copy.");
    }
  }, [base64Output]);

  const handleDecodeBase64 = useCallback(() => {
    if (!base64Input.trim()) {
      setDecodedImagePreviewUrl(null);
      setDecodedImageMimeType(null);
      toast.error("Please enter a Base64 string to decode.");
      return;
    }

    try {
      // Basic validation for data URL format
      if (!base64Input.startsWith("data:image/")) {
        toast.error("Invalid Base64 image format. It should start with 'data:image/'.");
        setDecodedImagePreviewUrl(null);
        setDecodedImageMimeType(null);
        return;
      }

      // Extract MIME type
      const mimeMatch = base64Input.match(/^data:(image\/[a-zA-Z0-9\+\-\.]+);base64,/);
      if (!mimeMatch) {
        toast.error("Could not determine image MIME type from Base64 string.");
        setDecodedImagePreviewUrl(null);
        setDecodedImageMimeType(null);
        return;
      }
      setDecodedImageMimeType(mimeMatch[1]);

      // Attempt to create an image to validate
      const img = new window.Image();
      img.onload = () => {
        setDecodedImagePreviewUrl(base64Input);
        toast.success("Image decoded successfully!");
      };
      img.onerror = () => {
        toast.error("Failed to decode Base64 string into a valid image.");
        setDecodedImagePreviewUrl(null);
        setDecodedImageMimeType(null);
      };
      img.src = base64Input;
    } catch (error) {
      toast.error("An error occurred during decoding.");
      setDecodedImagePreviewUrl(null);
      setDecodedImageMimeType(null);
      console.error("Decode error:", error);
    }
  }, [base64Input]);

  const handleDownloadDecodedImage = useCallback(() => {
    if (decodedImagePreviewUrl && decodedImageMimeType) {
      const link = document.createElement("a");
      link.href = decodedImagePreviewUrl;
      const extension = decodedImageMimeType.split("/")[1].split(";")[0]; // e.g., "png", "jpeg"
      link.download = `decoded_image.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded!");
    } else {
      toast.error("No decoded image available for download.");
    }
  }, [decodedImagePreviewUrl, decodedImageMimeType]);

  return (
    <ToolPageWrapper toolSlug={TOOL_SLUG} toolName={TOOL_NAME} description={TOOL_DESCRIPTION}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Encode Image to Base64 */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" /> Encode Image to Base64
          </h2>
          <div className="relative border border-slate-700 rounded-lg p-6 bg-slate-800/50 flex flex-col items-center justify-center min-h-[150px]">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {imagePreviewUrl ? (
              <div className="flex flex-col items-center gap-4">
                <img src={imagePreviewUrl} alt="Image Preview" className="max-w-full max-h-48 object-contain rounded-md border border-slate-700" />
                <p className="text-sm text-slate-400 truncate w-full text-center">{selectedFile?.name}</p>
                <button
                  onClick={handleClearFile}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-300 bg-red-800 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Clear Image
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Image className="mx-auto h-12 w-12 text-slate-500" />
                <p className="mt-2 text-sm text-slate-400">Drag 'n' drop an image here, or <span className="font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer">click to select one</span></p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF, BMP, SVG up to 5MB</p>
              </div>
            )}
          </div>

          <label htmlFor="base64Output" className="block text-sm font-medium text-slate-300">
            Base64 Output
          </label>
          <div className="relative">
            <textarea
              id="base64Output"
              rows={10}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y"
              value={base64Output}
              readOnly
              placeholder="Base64 encoded image will appear here..."
            />
            <button
              onClick={handleCopyBase64}
              disabled={!base64Output}
              className="absolute top-3 right-3 p-2 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decode Base64 to Image */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" /> Decode Base64 to Image
          </h2>
          <label htmlFor="base64Input" className="block text-sm font-medium text-slate-300">
            Base64 Input
          </label>
          <textarea
            id="base64Input"
            rows={10}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm focus:ring-emerald-500 focus:border-emerald-500 resize-y"
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            placeholder="Paste your Base64 image string here (e.g., data:image/png;base64,...)"
          />
          <button
            onClick={handleDecodeBase64}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            <Image className="w-4 h-4 mr-2" /> Decode Image
          </button>

          <label className="block text-sm font-medium text-slate-300 mt-4">
            Decoded Image Preview
          </label>
          <div className="relative border border-slate-700 rounded-lg p-4 bg-slate-800/50 flex flex-col items-center justify-center min-h-[150px]">
            {decodedImagePreviewUrl ? (
              <div className="flex flex-col items-center gap-4">
                <img src={decodedImagePreviewUrl} alt="Decoded Image" className="max-w-full max-h-48 object-contain rounded-md border border-slate-700" />
                <button
                  onClick={handleDownloadDecodedImage}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-300 bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Image
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Image className="mx-auto h-12 w-12 text-slate-500" />
                <p className="mt-2 text-sm text-slate-400">Decoded image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}