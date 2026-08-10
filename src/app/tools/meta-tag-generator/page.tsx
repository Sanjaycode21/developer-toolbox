"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, RefreshCcw } from 'lucide-react';

const TOOL_SLUG = "meta-tag-generator-og-preview";
const TOOL_NAME = "Meta Tag Generator & OG Preview";
const TOOL_DESCRIPTION = "Generate essential meta tags for SEO and social media, and preview Open Graph cards.";

interface MetaTagsState {
  title: string;
  description: string;
  keywords: string;
  author: string;
  robots: string; // e.g., "index, follow", "noindex, nofollow"
  charset: string;
  viewport: string;
  refreshDelay: string; // in seconds, optional

  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogType: string;
  ogImage: string;
  ogSiteName: string;

  // Twitter Card
  twitterCard: string; // e.g., "summary", "summary_large_image"
  twitterSite: string;
  twitterCreator: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

const defaultState: MetaTagsState = {
  title: "",
  description: "",
  keywords: "",
  author: "",
  robots: "index, follow",
  charset: "UTF-8",
  viewport: "width=device-width, initial-scale=1.0",
  refreshDelay: "",

  ogTitle: "",
  ogDescription: "",
  ogUrl: "",
  ogType: "website",
  ogImage: "",
  ogSiteName: "",

  twitterCard: "summary_large_image",
  twitterSite: "",
  twitterCreator: "",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
};

const MetaTagGeneratorPage: React.FC = () => {
  const [state, setState] = useState<MetaTagsState>(defaultState);
  const [generatedHtml, setGeneratedHtml] = useState<string>("");
  const addToHistory = useToolStore((s) => s.addToHistory);

  useEffect(() => {
    addToHistory(TOOL_SLUG);
  }, [addToHistory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const generateMetaTags = useCallback(() => {
    let html = "";

    // Basic Meta Tags
    if (state.charset) html += `<meta charset="${state.charset}" />\n`;
    if (state.viewport) html += `<meta name="viewport" content="${state.viewport}" />\n`;
    if (state.title) html += `<title>${state.title}</title>\n`; // Title tag is not a meta tag, but often included here for convenience
    if (state.description) html += `<meta name="description" content="${state.description}" />\n`;
    if (state.keywords) html += `<meta name="keywords" content="${state.keywords}" />\n`;
    if (state.author) html += `<meta name="author" content="${state.author}" />\n`;
    if (state.robots) html += `<meta name="robots" content="${state.robots}" />\n`;
    if (state.refreshDelay) html += `<meta http-equiv="refresh" content="${state.refreshDelay}" />\n`;

    // Open Graph Tags
    if (state.ogTitle || state.title) html += `<meta property="og:title" content="${state.ogTitle || state.title}" />\n`;
    if (state.ogDescription || state.description) html += `<meta property="og:description" content="${state.ogDescription || state.description}" />\n`;
    if (state.ogUrl) html += `<meta property="og:url" content="${state.ogUrl}" />\n`;
    if (state.ogType) html += `<meta property="og:type" content="${state.ogType}" />\n`;
    if (state.ogImage) html += `<meta property="og:image" content="${state.ogImage}" />\n`;
    if (state.ogSiteName) html += `<meta property="og:site_name" content="${state.ogSiteName}" />\n`;

    // Twitter Card Tags
    if (state.twitterCard) html += `<meta name="twitter:card" content="${state.twitterCard}" />\n`;
    if (state.twitterSite) html += `<meta name="twitter:site" content="${state.twitterSite}" />\n`;
    if (state.twitterCreator) html += `<meta name="twitter:creator" content="${state.twitterCreator}" />\n`;
    if (state.twitterTitle || state.ogTitle || state.title) html += `<meta name="twitter:title" content="${state.twitterTitle || state.ogTitle || state.title}" />\n`;
    if (state.twitterDescription || state.ogDescription || state.description) html += `<meta name="twitter:description" content="${state.twitterDescription || state.ogDescription || state.description}" />\n`;
    if (state.twitterImage || state.ogImage) html += `<meta name="twitter:image" content="${state.twitterImage || state.ogImage}" />\n`;

    setGeneratedHtml(html.trim());
  }, [state]);

  useEffect(() => {
    generateMetaTags();
  }, [state, generateMetaTags]);

  const copyToClipboard = () => {
    if (generatedHtml) {
      navigator.clipboard.writeText(generatedHtml);
      toast.success("Meta tags copied to clipboard!");
    } else {
      toast.error("No meta tags to copy.");
    }
  };

  const resetFields = () => {
    setState(defaultState);
    toast.success("Fields reset to default!");
  };

  // Helper to truncate text for preview
  const truncate = (text: string, length: number) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const ogPreviewTitle = state.ogTitle || state.title || "Your Page Title";
  const ogPreviewDescription = state.ogDescription || state.description || "A short description of your page content.";
  const ogPreviewUrl = state.ogUrl || "https://example.com/your-page";
  const ogPreviewImage = state.ogImage || "https://via.placeholder.com/1200x630?text=Open+Graph+Image";
  const ogPreviewSiteName = state.ogSiteName || "Your Website Name";

  const twitterPreviewTitle = state.twitterTitle || ogPreviewTitle;
  const twitterPreviewDescription = state.twitterDescription || ogPreviewDescription;
  const twitterPreviewImage = state.twitterImage || ogPreviewImage;
  const twitterPreviewSite = state.twitterSite || "@YourTwitterHandle";
  const twitterPreviewCreator = state.twitterCreator || "@YourCreatorHandle";

  return (
    <ToolPageWrapper
      toolSlug={TOOL_SLUG}
      toolName={TOOL_NAME}
      description={TOOL_DESCRIPTION}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col gap-6">
          {/* Basic Meta Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-slate-200">Basic Meta Tags</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={state.title}
                  onChange={handleChange}
                  placeholder="e.g., My Awesome Page"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-slate-300 mb-1">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={state.author}
                  onChange={handleChange}
                  placeholder="e.g., John Doe"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={state.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="A concise summary of your page content for search engines."
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="keywords" className="block text-sm font-medium text-slate-300 mb-1">Keywords</label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={state.keywords}
                  onChange={handleChange}
                  placeholder="e.g., seo, web development, tools"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="robots" className="block text-sm font-medium text-slate-300 mb-1">Robots</label>
                <select
                  id="robots"
                  name="robots"
                  value={state.robots}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                >
                  <option value="index, follow">index, follow</option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="index, nofollow">index, nofollow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                </select>
              </div>
              <div>
                <label htmlFor="charset" className="block text-sm font-medium text-slate-300 mb-1">Charset</label>
                <input
                  type="text"
                  id="charset"
                  name="charset"
                  value={state.charset}
                  onChange={handleChange}
                  placeholder="e.g., UTF-8"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="viewport" className="block text-sm font-medium text-slate-300 mb-1">Viewport</label>
                <input
                  type="text"
                  id="viewport"
                  name="viewport"
                  value={state.viewport}
                  onChange={handleChange}
                  placeholder="e.g., width=device-width, initial-scale=1.0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="refreshDelay" className="block text-sm font-medium text-slate-300 mb-1">Refresh Delay (seconds, optional)</label>
                <input
                  type="number"
                  id="refreshDelay"
                  name="refreshDelay"
                  value={state.refreshDelay}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Open Graph Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-slate-200">Open Graph Tags (Facebook, LinkedIn, etc.)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ogTitle" className="block text-sm font-medium text-slate-300 mb-1">OG Title</label>
                <input
                  type="text"
                  id="ogTitle"
                  name="ogTitle"
                  value={state.ogTitle}
                  onChange={handleChange}
                  placeholder="e.g., My Page for Social Media"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="ogUrl" className="block text-sm font-medium text-slate-300 mb-1">OG URL</label>
                <input
                  type="url"
                  id="ogUrl"
                  name="ogUrl"
                  value={state.ogUrl}
                  onChange={handleChange}
                  placeholder="e.g., https://example.com/my-page"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="ogDescription" className="block text-sm font-medium text-slate-300 mb-1">OG Description</label>
                <textarea
                  id="ogDescription"
                  name="ogDescription"
                  value={state.ogDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="A compelling description for social media shares."
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                ></textarea>
              </div>
              <div>
                <label htmlFor="ogType" className="block text-sm font-medium text-slate-300 mb-1">OG Type</label>
                <select
                  id="ogType"
                  name="ogType"
                  value={state.ogType}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                >
                  <option value="website">website</option>
                  <option value="article">article</option>
                  <option value="book">book</option>
                  <option value="profile">profile</option>
                  <option value="video.movie">video.movie</option>
                  <option value="video.episode">video.episode</option>
                  <option value="video.tv_show">video.tv_show</option>
                  <option value="video.other">video.other</option>
                  <option value="music.song">music.song</option>
                  <option value="music.album">music.album</option>
                  <option value="music.playlist">music.playlist</option>
                  <option value="music.radio_station">music.radio_station</option>
                </select>
              </div>
              <div>
                <label htmlFor="ogSiteName" className="block text-sm font-medium text-slate-300 mb-1">OG Site Name</label>
                <input
                  type="text"
                  id="ogSiteName"
                  name="ogSiteName"
                  value={state.ogSiteName}
                  onChange={handleChange}
                  placeholder="e.g., DevForge Tools"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="ogImage" className="block text-sm font-medium text-slate-300 mb-1">OG Image URL</label>
                <input
                  type="url"
                  id="ogImage"
                  name="ogImage"
                  value={state.ogImage}
                  onChange={handleChange}
                  placeholder="e.g., https://example.com/image.jpg (1200x630 recommended)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Twitter Card Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-slate-200">Twitter Card Tags</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="twitterCard" className="block text-sm font-medium text-slate-300 mb-1">Twitter Card Type</label>
                <select
                  id="twitterCard"
                  name="twitterCard"
                  value={state.twitterCard}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                >
                  <option value="summary">Summary Card</option>
                  <option value="summary_large_image">Summary Card with Large Image</option>
                  <option value="app">App Card</option>
                  <option value="player">Player Card</option>
                </select>
              </div>
              <div>
                <label htmlFor="twitterSite" className="block text-sm font-medium text-slate-300 mb-1">Twitter Site (@handle)</label>
                <input
                  type="text"
                  id="twitterSite"
                  name="twitterSite"
                  value={state.twitterSite}
                  onChange={handleChange}
                  placeholder="e.g., @DevForgeTools"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="twitterCreator" className="block text-sm font-medium text-slate-300 mb-1">Twitter Creator (@handle)</label>
                <input
                  type="text"
                  id="twitterCreator"
                  name="twitterCreator"
                  value={state.twitterCreator}
                  onChange={handleChange}
                  placeholder="e.g., @YourHandle"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="twitterTitle" className="block text-sm font-medium text-slate-300 mb-1">Twitter Title</label>
                <input
                  type="text"
                  id="twitterTitle"
                  name="twitterTitle"
                  value={state.twitterTitle}
                  onChange={handleChange}
                  placeholder="e.g., My Twitter Card Title"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="twitterDescription" className="block text-sm font-medium text-slate-300 mb-1">Twitter Description</label>
                <textarea
                  id="twitterDescription"
                  name="twitterDescription"
                  value={state.twitterDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="A description for your Twitter card."
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="twitterImage" className="block text-sm font-medium text-slate-300 mb-1">Twitter Image URL</label>
                <input
                  type="url"
                  id="twitterImage"
                  name="twitterImage"
                  value={state.twitterImage}
                  onChange={handleChange}
                  placeholder="e.g., https://example.com/twitter-image.jpg (800x418 for large)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col gap-6">
          {/* Generated HTML */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-slate-200">Generated Meta Tags</h3>
            <div className="relative">
              <textarea
                value={generatedHtml}
                readOnly
                rows={15}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 font-mono text-sm text-slate-100 resize-y min-h-[200px]"
                placeholder="Generated meta tags will appear here..."
              ></textarea>
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-slate-50 transition-colors"
                  title="Copy to Clipboard"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={resetFields}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-slate-50 transition-colors"
                  title="Reset Fields"
                >
                  <RefreshCcw size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* OG Preview */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-slate-200">Open Graph Preview</h3>
            <div className="flex flex-col gap-6">
              {/* Generic Social Card Preview */}
              <div className="bg-slate-900 rounded-lg overflow-hidden shadow-lg border border-slate-700">
                <div className="relative w-full h-48 bg-slate-700 flex items-center justify-center text-slate-400 text-sm overflow-hidden">
                  {ogPreviewImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ogPreviewImage}
                      alt="Open Graph Image"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/1200x630?text=Image+Load+Error";
                        e.currentTarget.onerror = null;
                      }}
                    />
                  )}
                  {!ogPreviewImage && <span className="z-10">No OG Image</span>}
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-400 uppercase mb-1">{truncate(ogPreviewUrl.replace(/(^\w+:|^)\/\//, '').split('/')[0], 40)}</p>
                  <h4 className="text-lg font-semibold text-slate-100 mb-1">{truncate(ogPreviewTitle, 70)}</h4>
                  <p className="text-sm text-slate-300 line-clamp-2">{truncate(ogPreviewDescription, 150)}</p>
                </div>
              </div>

              {/* Twitter Card Preview */}
              <div className="bg-slate-900 rounded-lg overflow-hidden shadow-lg border border-slate-700">
                {state.twitterCard === "summary_large_image" && (
                  <div className="relative w-full h-48 bg-slate-700 flex items-center justify-center text-slate-400 text-sm overflow-hidden">
                    {twitterPreviewImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={twitterPreviewImage}
                        alt="Twitter Card Image"
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/800x418?text=Image+Load+Error";
                          e.currentTarget.onerror = null;
                        }}
                      />
                    )}
                    {!twitterPreviewImage && <span className="z-10">No Twitter Image</span>}
                  </div>
                )}
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-slate-100 mb-1">{truncate(twitterPreviewTitle, 70)}</h4>
                  <p className="text-sm text-slate-300 line-clamp-2 mb-2">{truncate(twitterPreviewDescription, 150)}</p>
                  <div className="flex items-center text-xs text-slate-400">
                    {twitterPreviewSite && <span>{twitterPreviewSite}</span>}
                    {twitterPreviewSite && twitterPreviewCreator && <span className="mx-1">•</span>}
                    {twitterPreviewCreator && <span>{twitterPreviewCreator}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default MetaTagGeneratorPage;