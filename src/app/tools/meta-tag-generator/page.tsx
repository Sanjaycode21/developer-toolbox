"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";
import { Copy, Star, StarOff } from "lucide-react";

const TOOL_SLUG = "meta-tag-generator";
const TOOL_NAME = "Meta Tag Generator & OG Preview";
const TOOL_DESCRIPTION = "Generate essential meta tags for SEO and social media, with an Open Graph preview.";

export default function MetaTagGeneratorPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogUrl, setOgUrl] = useState("");
  const [twitterCard, setTwitterCard] = useState("summary");
  const [twitterSite, setTwitterSite] = useState("");
  const [twitterCreator, setTwitterCreator] = useState("");
  const [twitterImage, setTwitterImage] = useState("");

  const { addToHistory, addFavorite, removeFavorite, isFavorite } = useToolStore();
  const isToolFavorite = isFavorite(TOOL_SLUG);

  useEffect(() => {
    addToHistory(TOOL_SLUG);
  }, [addToHistory]);

  const generateMetaTags = useCallback(() => {
    let tags = "";

    // Basic Meta Tags
    if (title) tags += `<meta name="title" content="${title}" />\n`;
    if (description) tags += `<meta name="description" content="${description}" />\n`;
    if (keywords) tags += `<meta name="keywords" content="${keywords}" />\n`;
    if (author) tags += `<meta name="author" content="${author}" />\n`;
    tags += `<meta name="viewport" content="width=device-width, initial-scale=1" />\n`;
    tags += `<meta charset="utf-8" />\n`;

    // Open Graph Tags
    if (ogTitle || title) tags += `<meta property="og:title" content="${ogTitle || title}" />\n`;
    if (ogDescription || description) tags += `<meta property="og:description" content="${ogDescription || description}" />\n`;
    if (ogImage) tags += `<meta property="og:image" content="${ogImage}" />\n`;
    if (ogUrl) tags += `<meta property="og:url" content="${ogUrl}" />\n`;
    tags += `<meta property="og:type" content="website" />\n`;

    // Twitter Card Tags
    tags += `<meta name="twitter:card" content="${twitterCard}" />\n`;
    if (twitterSite) tags += `<meta name="twitter:site" content="${twitterSite}" />\n`;
    if (twitterCreator) tags += `<meta name="twitter:creator" content="${twitterCreator}" />\n`;
    if (twitterImage || ogImage) tags += `<meta name="twitter:image" content="${twitterImage || ogImage}" />\n`;
    if (ogTitle || title) tags += `<meta name="twitter:title" content="${ogTitle || title}" />\n`;
    if (ogDescription || description) tags += `<meta name="twitter:description" content="${ogDescription || description}" />\n`;


    return tags.trim();
  }, [title, description, keywords, author, ogTitle, ogDescription, ogImage, ogUrl, twitterCard, twitterSite, twitterCreator, twitterImage]);

  const generatedTags = generateMetaTags();

  const handleCopy = useCallback(() => {
    if (generatedTags) {
      navigator.clipboard.writeText(generatedTags);
      toast.success("Meta tags copied to clipboard!");
    } else {
      toast.error("No tags to copy.");
    }
  }, [generatedTags]);

  const handleClear = useCallback(() => {
    setTitle("");
    setDescription("");
    setKeywords("");
    setAuthor("");
    setOgTitle("");
    setOgDescription("");
    setOgImage("");
    setOgUrl("");
    setTwitterCard("summary");
    setTwitterSite("");
    setTwitterCreator("");
    setTwitterImage("");
    toast.success("All fields cleared!");
  }, []);

  const handleFavoriteToggle = useCallback(() => {
    if (isToolFavorite) {
      removeFavorite(TOOL_SLUG);
      toast.success(`Removed ${TOOL_NAME} from favorites!`);
    } else {
      addFavorite(TOOL_SLUG);
      toast.success(`Added ${TOOL_NAME} to favorites!`);
    }
  }, [isToolFavorite, addFavorite, removeFavorite]);

  const renderInputField = (label: string, value: string, setValue: (v: string) => void, placeholder: string = "", type: string = "text") => (
    <div className="flex flex-col gap-2">
      <label htmlFor={label.toLowerCase().replace(/\s/g, "-")} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={label.toLowerCase().replace(/\s/g, "-")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors"
        />
      ) : (
        <input
          type={type}
          id={label.toLowerCase().replace(/\s/g, "-")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors"
        />
      )}
    </div>
  );

  const ogPreviewTitle = ogTitle || title || "Your Website Title";
  const ogPreviewDescription = ogDescription || description || "A compelling description of your website content.";
  const ogPreviewImage = ogImage || "https://via.placeholder.com/1200x630/1e293b/e2e8f0?text=Open+Graph+Image";
  const ogPreviewUrl = ogUrl || "https://yourwebsite.com";

  return (
    <ToolPageWrapper
      toolSlug={TOOL_SLUG}
      toolName={TOOL_NAME}
      description={TOOL_DESCRIPTION}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Input Section */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-200">Meta Tag Inputs</h2>
            <button
              onClick={handleFavoriteToggle}
              className="p-2 rounded-full text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
              aria-label={isToolFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isToolFavorite ? <StarOff size={20} fill="currentColor" /> : <Star size={20} />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInputField("Title", title, setTitle, "e.g., My Awesome Website")}
            {renderInputField("Author", author, setAuthor, "e.g., John Doe")}
            {renderInputField("Description", description, setDescription, "A brief summary of your page content.", "textarea")}
            {renderInputField("Keywords", keywords, setKeywords, "comma, separated, keywords", "textarea")}
          </div>

          <h3 className="text-lg font-semibold text-slate-200 mt-4">Open Graph (Social Media) Tags</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInputField("OG Title", ogTitle, setOgTitle, "e.g., My Website for Social Media")}
            {renderInputField("OG URL", ogUrl, setOgUrl, "e.g., https://yourwebsite.com/page")}
            {renderInputField("OG Description", ogDescription, setOgDescription, "Description for social media shares.", "textarea")}
            {renderInputField("OG Image URL", ogImage, setOgImage, "e.g., https://yourwebsite.com/image.jpg")}
          </div>

          <h3 className="text-lg font-semibold text-slate-200 mt-4">Twitter Card Tags</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="twitter-card-type" className="text-sm font-medium text-slate-300">
                Twitter Card Type
              </label>
              <select
                id="twitter-card-type"
                value={twitterCard}
                onChange={(e) => setTwitterCard(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="summary">Summary Card</option>
                <option value="summary_large_image">Summary Card with Large Image</option>
                <option value="app">App Card</option>
                <option value="player">Player Card</option>
              </select>
            </div>
            {renderInputField("Twitter Site", twitterSite, setTwitterSite, "e.g., @yourtwitterhandle")}
            {renderInputField("Twitter Creator", twitterCreator, setTwitterCreator, "e.g., @yourcreatorhandle")}
            {renderInputField("Twitter Image URL", twitterImage, setTwitterImage, "e.g., https://yourwebsite.com/twitter-image.jpg")}
          </div>
        </div>

        {/* Output & Preview Section */}
        <div className="flex-1 flex flex-col gap-6 lg:max-w-[50%]">
          <h2 className="text-xl font-semibold text-slate-200">Generated Meta Tags</h2>
          <textarea
            value={generatedTags}
            readOnly
            rows={15}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-100 font-mono resize-y focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors"
            placeholder="Generated meta tags will appear here..."
          />
          <div className="flex gap-4">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-md"
            >
              <Copy size={18} /> Copy Tags
            </button>
            <button
              onClick={handleClear}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors shadow-md"
            >
              Clear All
            </button>
          </div>

          <h2 className="text-xl font-semibold text-slate-200 mt-6">Open Graph Preview</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg">
            {ogPreviewImage && (
              <div className="relative w-full h-48 bg-slate-900 flex items-center justify-center overflow-hidden">
                <img
                  src={ogPreviewImage}
                  alt="Open Graph Preview"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/1200x630/1e293b/e2e8f0?text=Image+Not+Found";
                    e.currentTarget.alt = "Image not found";
                  }}
                />
              </div>
            )}
            <div className="p-4 flex flex-col gap-2">
              <p className="text-xs text-slate-400 truncate">{ogPreviewUrl}</p>
              <h4 className="text-lg font-semibold text-slate-100 line-clamp-2">{ogPreviewTitle}</h4>
              <p className="text-sm text-slate-300 line-clamp-3">{ogPreviewDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}