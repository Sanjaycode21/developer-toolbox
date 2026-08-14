"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { ClipboardCopy } from 'lucide-react';

const TOOL_SLUG = "meta-tag-generator";
const TOOL_NAME = "Meta Tag Generator & OG Preview";
const TOOL_DESCRIPTION = "Generate essential meta tags for SEO and social media, and preview Open Graph (OG) cards.";

export default function MetaTagGeneratorPage() {
  const { addToHistory } = useToolStore();

  // Basic Meta Tags
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);
  const [charset, setCharset] = useState('UTF-8');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
  const [refreshEnabled, setRefreshEnabled] = useState(false);
  const [refreshDelay, setRefreshDelay] = useState(5); // seconds

  // Open Graph Tags
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [ogType, setOgType] = useState('website');
  const [ogSiteName, setOgSiteName] = useState('');
  const [ogLocale, setOgLocale] = useState('en_US');

  // Twitter Card Tags
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [twitterSite, setTwitterSite] = useState('');
  const [twitterCreator, setTwitterCreator] = useState('');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');

  useEffect(() => {
    addToHistory(TOOL_SLUG);
  }, [addToHistory]);

  const generateMetaTags = useCallback(() => {
    let tags = [];

    // Basic Meta Tags
    tags.push(`<meta charset="${charset}" />`);
    tags.push(`<meta name="viewport" content="${viewport}" />`);
    if (title) tags.push(`<title>${title}</title>`);
    if (description) tags.push(`<meta name="description" content="${description}" />`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}" />`);
    if (author) tags.push(`<meta name="author" content="${author}" />`);

    const robotsContent = `${robotsIndex ? 'index' : 'noindex'},${robotsFollow ? 'follow' : 'nofollow'}`;
    tags.push(`<meta name="robots" content="${robotsContent}" />`);

    if (refreshEnabled && refreshDelay > 0) {
      tags.push(`<meta http-equiv="refresh" content="${refreshDelay}" />`);
    }

    // Open Graph Tags
    const finalOgTitle = ogTitle || title;
    const finalOgDescription = ogDescription || description;
    const finalOgImage = ogImage;
    const finalOgUrl = ogUrl;

    if (finalOgTitle) tags.push(`<meta property="og:title" content="${finalOgTitle}" />`);
    if (finalOgDescription) tags.push(`<meta property="og:description" content="${finalOgDescription}" />`);
    if (finalOgImage) tags.push(`<meta property="og:image" content="${finalOgImage}" />`);
    if (finalOgUrl) tags.push(`<meta property="og:url" content="${finalOgUrl}" />`);
    if (ogType) tags.push(`<meta property="og:type" content="${ogType}" />`);
    if (ogSiteName) tags.push(`<meta property="og:site_name" content="${ogSiteName}" />`);
    if (ogLocale) tags.push(`<meta property="og:locale" content="${ogLocale}" />`);

    // Twitter Card Tags
    const finalTwitterTitle = twitterTitle || ogTitle || title;
    const finalTwitterDescription = twitterDescription || ogDescription || description;
    const finalTwitterImage = twitterImage || ogImage;

    if (twitterCard) tags.push(`<meta name="twitter:card" content="${twitterCard}" />`);
    if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}" />`);
    if (twitterCreator) tags.push(`<meta name="twitter:creator" content="${twitterCreator}" />`);
    if (finalTwitterTitle) tags.push(`<meta name="twitter:title" content="${finalTwitterTitle}" />`);
    if (finalTwitterDescription) tags.push(`<meta name="twitter:description" content="${finalTwitterDescription}" />`);
    if (finalTwitterImage) tags.push(`<meta name="twitter:image" content="${finalTwitterImage}" />`);

    return tags.map(tag => `  ${tag}`).join('\n'); // Indent for readability
  }, [
    title, description, keywords, author, robotsIndex, robotsFollow, charset, viewport,
    refreshEnabled, refreshDelay,
    ogTitle, ogDescription, ogImage, ogUrl, ogType, ogSiteName, ogLocale,
    twitterCard, twitterSite, twitterCreator, twitterTitle, twitterDescription, twitterImage
  ]);

  const generatedHtml = generateMetaTags();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHtml)
      .then(() => toast.success('Meta tags copied to clipboard!'))
      .catch(() => toast.error('Failed to copy meta tags.'));
  };

  // OG Preview content
  const previewOgTitle = ogTitle || title || 'Your Website Title';
  const previewOgDescription = ogDescription || description || 'A compelling description of your website content.';
  const previewOgImage = ogImage || 'https://via.placeholder.com/1200x630/1e293b/e2e8f0?text=OG+Image+Placeholder';
  const previewOgUrl = ogUrl || 'https://yourwebsite.com';
  const previewOgSiteName = ogSiteName || 'Your Website Name';

  // Twitter Preview content
  const previewTwitterTitle = twitterTitle || ogTitle || title || 'Your Website Title';
  const previewTwitterDescription = twitterDescription || ogDescription || description || 'A compelling description of your website content.';
  const previewTwitterImage = twitterImage || ogImage || 'https://via.placeholder.com/600x315/1e293b/e2e8f0?text=Twitter+Image+Placeholder';
  const previewTwitterSite = twitterSite || '@yourwebsite';

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
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Basic Meta Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., My Awesome Website"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  id="description"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Discover amazing tools for developers."
                />
              </div>
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-slate-300 mb-1">Keywords</label>
                <input
                  type="text"
                  id="keywords"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., devtools, web, programming"
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-slate-300 mb-1">Author</label>
                <input
                  type="text"
                  id="author"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div className="col-span-full flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="robotsIndex"
                    className="h-4 w-4 text-indigo-600 bg-slate-900 border-slate-700 rounded focus:ring-indigo-500"
                    checked={robotsIndex}
                    onChange={(e) => setRobotsIndex(e.target.checked)}
                  />
                  <label htmlFor="robotsIndex" className="ml-2 text-sm text-slate-300">Index</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="robotsFollow"
                    className="h-4 w-4 text-indigo-600 bg-slate-900 border-slate-700 rounded focus:ring-indigo-500"
                    checked={robotsFollow}
                    onChange={(e) => setRobotsFollow(e.target.checked)}
                  />
                  <label htmlFor="robotsFollow" className="ml-2 text-sm text-slate-300">Follow</label>
                </div>
              </div>
              <div>
                <label htmlFor="charset" className="block text-sm font-medium text-slate-300 mb-1">Charset</label>
                <input
                  type="text"
                  id="charset"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={charset}
                  onChange={(e) => setCharset(e.target.value)}
                  placeholder="e.g., UTF-8"
                />
              </div>
              <div>
                <label htmlFor="viewport" className="block text-sm font-medium text-slate-300 mb-1">Viewport</label>
                <input
                  type="text"
                  id="viewport"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={viewport}
                  onChange={(e) => setViewport(e.target.value)}
                  placeholder="e.g., width=device-width, initial-scale=1.0"
                />
              </div>
              <div className="col-span-full flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="refreshEnabled"
                    className="h-4 w-4 text-indigo-600 bg-slate-900 border-slate-700 rounded focus:ring-indigo-500"
                    checked={refreshEnabled}
                    onChange={(e) => setRefreshEnabled(e.target.checked)}
                  />
                  <label htmlFor="refreshEnabled" className="ml-2 text-sm text-slate-300">Auto Refresh</label>
                </div>
                {refreshEnabled && (
                  <div>
                    <label htmlFor="refreshDelay" className="sr-only">Refresh Delay (seconds)</label>
                    <input
                      type="number"
                      id="refreshDelay"
                      className="w-24 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                      value={refreshDelay}
                      onChange={(e) => setRefreshDelay(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                    />
                    <span className="ml-2 text-sm text-slate-400">seconds</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Open Graph Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Open Graph (OG) Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ogTitle" className="block text-sm font-medium text-slate-300 mb-1">OG Title (Fallback: Title)</label>
                <input
                  type="text"
                  id="ogTitle"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder="e.g., My Awesome Website for Devs"
                />
              </div>
              <div>
                <label htmlFor="ogDescription" className="block text-sm font-medium text-slate-300 mb-1">OG Description (Fallback: Description)</label>
                <input
                  type="text"
                  id="ogDescription"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder="e.g., The ultimate toolbox for developers."
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="ogImage" className="block text-sm font-medium text-slate-300 mb-1">OG Image URL</label>
                <input
                  type="url"
                  id="ogImage"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="e.g., https://example.com/og-image.jpg"
                />
              </div>
              <div>
                <label htmlFor="ogUrl" className="block text-sm font-medium text-slate-300 mb-1">OG URL</label>
                <input
                  type="url"
                  id="ogUrl"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={ogUrl}
                  onChange={(e) => setOgUrl(e.target.value)}
                  placeholder="e.g., https://example.com/page"
                />
              </div>
              <div>
                <label htmlFor="ogType" className="block text-sm font-medium text-slate-300 mb-1">OG Type</label>
                <select
                  id="ogType"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={ogType}
                  onChange={(e) => setOgType(e.target.value)}
                >
                  <option value="website">website</option>
                  <option value="article">article</option>
                  <option value="book">book</option>
                  <option value="profile">profile</option>
                </select>
              </div>
              <div>
                <label htmlFor="ogSiteName" className="block text-sm font-medium text-slate-300 mb-1">OG Site Name</label>
                <input
                  type="text"
                  id="ogSiteName"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={ogSiteName}
                  onChange={(e) => setOgSiteName(e.target.value)}
                  placeholder="e.g., DevForge"
                />
              </div>
              <div>
                <label htmlFor="ogLocale" className="block text-sm font-medium text-slate-300 mb-1">OG Locale</label>
                <input
                  type="text"
                  id="ogLocale"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={ogLocale}
                  onChange={(e) => setOgLocale(e.target.value)}
                  placeholder="e.g., en_US"
                />
              </div>
            </div>
          </div>

          {/* Twitter Card Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Twitter Card Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="twitterCard" className="block text-sm font-medium text-slate-300 mb-1">Twitter Card Type</label>
                <select
                  id="twitterCard"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value)}
                >
                  <option value="summary">summary</option>
                  <option value="summary_large_image">summary_large_image</option>
                  <option value="app">app</option>
                  <option value="player">player</option>
                </select>
              </div>
              <div>
                <label htmlFor="twitterSite" className="block text-sm font-medium text-slate-300 mb-1">Twitter Site (@username)</label>
                <input
                  type="text"
                  id="twitterSite"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={twitterSite}
                  onChange={(e) => setTwitterSite(e.target.value)}
                  placeholder="e.g., @devforge"
                />
              </div>
              <div>
                <label htmlFor="twitterCreator" className="block text-sm font-medium text-slate-300 mb-1">Twitter Creator (@username)</label>
                <input
                  type="text"
                  id="twitterCreator"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={twitterCreator}
                  onChange={(e) => setTwitterCreator(e.target.value)}
                  placeholder="e.g., @johndoe"
                />
              </div>
              <div>
                <label htmlFor="twitterTitle" className="block text-sm font-medium text-slate-300 mb-1">Twitter Title (Fallback: OG Title)</label>
                <input
                  type="text"
                  id="twitterTitle"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={twitterTitle}
                  onChange={(e) => setTwitterTitle(e.target.value)}
                  placeholder="e.g., DevForge: The Ultimate Toolbox"
                />
              </div>
              <div>
                <label htmlFor="twitterDescription" className="block text-sm font-medium text-slate-300 mb-1">Twitter Description (Fallback: OG Desc)</label>
                <input
                  type="text"
                  id="twitterDescription"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={twitterDescription}
                  onChange={(e) => setTwitterDescription(e.target.value)}
                  placeholder="e.g., Essential tools for every developer."
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="twitterImage" className="block text-sm font-medium text-slate-300 mb-1">Twitter Image URL (Fallback: OG Image)</label>
                <input
                  type="url"
                  id="twitterImage"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={twitterImage}
                  onChange={(e) => setTwitterImage(e.target.value)}
                  placeholder="e.g., https://example.com/twitter-image.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Output & Preview Section */}
        <div className="flex flex-col gap-6">
          {/* Generated HTML */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Generated Meta Tags</h2>
            <div className="relative">
              <textarea
                className="w-full h-64 bg-slate-900 border border-slate-700 rounded-md p-3 font-mono text-sm text-slate-100 resize-none focus:border-indigo-500 focus:ring-indigo-500"
                value={generatedHtml}
                readOnly
              />
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-slate-50 transition-colors"
                aria-label="Copy to clipboard"
              >
                <ClipboardCopy size={16} />
              </button>
            </div>
          </div>

          {/* OG Preview */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Open Graph (OG) Preview</h2>
            <div className="flex flex-col gap-4">
              {/* Generic Social Card Preview */}
              <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
                <img
                  src={previewOgImage}
                  alt="OG Image Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/1200x630/1e293b/e2e8f0?text=OG+Image+Placeholder';
                    e.currentTarget.alt = 'Placeholder Image';
                  }}
                />
                <div className="p-4">
                  <p className="text-xs text-slate-400 mb-1">{previewOgUrl.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]}</p>
                  <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">{previewOgTitle}</h3>
                  <p className="text-sm text-slate-300 line-clamp-3">{previewOgDescription}</p>
                </div>
              </div>

              {/* Twitter Card Preview (Summary Large Image) */}
              {twitterCard === 'summary_large_image' && (
                <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
                  <img
                    src={previewTwitterImage}
                    alt="Twitter Image Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/600x315/1e293b/e2e8f0?text=Twitter+Image+Placeholder';
                      e.currentTarget.alt = 'Placeholder Image';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">{previewTwitterTitle}</h3>
                    <p className="text-sm text-slate-300 line-clamp-3">{previewTwitterDescription}</p>
                    <p className="text-xs text-slate-400 mt-2">{previewTwitterSite}</p>
                  </div>
                </div>
              )}

              {/* Twitter Card Preview (Summary) */}
              {twitterCard === 'summary' && (
                <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-lg flex">
                  <div className="p-4 flex-1">
                    <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">{previewTwitterTitle}</h3>
                    <p className="text-sm text-slate-300 line-clamp-3">{previewTwitterDescription}</p>
                    <p className="text-xs text-slate-400 mt-2">{previewTwitterSite}</p>
                  </div>
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={previewTwitterImage}
                      alt="Twitter Image Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/120x120/1e293b/e2e8f0?text=Img';
                        e.currentTarget.alt = 'Placeholder Image';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}