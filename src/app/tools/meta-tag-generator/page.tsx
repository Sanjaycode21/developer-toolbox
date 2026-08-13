"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, Star, StarOff } from 'lucide-react';

const MetaTagGeneratorPage = () => {
  const toolSlug = "meta-tag-generator";
  const { addToHistory, addFavorite, removeFavorite, isFavorite } = useToolStore();

  // State for basic meta tags
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

  // State for Open Graph tags
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [ogType, setOgType] = useState('website');
  const [ogSiteName, setOgSiteName] = useState('');
  const [ogLocale, setOgLocale] = useState('en_US');

  // State for Twitter Card tags
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [twitterSite, setTwitterSite] = useState('');
  const [twitterCreator, setTwitterCreator] = useState('');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImageUrl, setTwitterImageUrl] = useState('');

  // Generated HTML
  const [generatedHtml, setGeneratedHtml] = useState('');

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const generateMetaTagsHtml = useCallback(() => {
    let html = '';

    // Basic Meta Tags
    if (charset) html += `<meta charset="${charset}" />\n`;
    if (viewport) html += `<meta name="viewport" content="${viewport}" />\n`;
    if (title) html += `<title>${title}</title>\n`; // Title is not a meta tag, but usually goes here
    if (description) html += `<meta name="description" content="${description}" />\n`;
    if (keywords) html += `<meta name="keywords" content="${keywords}" />\n`;
    if (author) html += `<meta name="author" content="${author}" />\n`;

    const robotsContent = [];
    if (robotsIndex) robotsContent.push('index'); else robotsContent.push('noindex');
    if (robotsFollow) robotsContent.push('follow'); else robotsContent.push('nofollow');
    html += `<meta name="robots" content="${robotsContent.join(', ')}" />\n`;

    if (refreshEnabled && refreshDelay > 0) {
      html += `<meta http-equiv="refresh" content="${refreshDelay}" />\n`;
    }

    // Open Graph Tags
    if (ogTitle) html += `<meta property="og:title" content="${ogTitle}" />\n`;
    if (ogDescription) html += `<meta property="og:description" content="${ogDescription}" />\n`;
    if (ogImageUrl) html += `<meta property="og:image" content="${ogImageUrl}" />\n`;
    if (ogUrl) html += `<meta property="og:url" content="${ogUrl}" />\n`;
    if (ogType) html += `<meta property="og:type" content="${ogType}" />\n`;
    if (ogSiteName) html += `<meta property="og:site_name" content="${ogSiteName}" />\n`;
    if (ogLocale) html += `<meta property="og:locale" content="${ogLocale}" />\n`;

    // Twitter Card Tags
    if (twitterCard) html += `<meta name="twitter:card" content="${twitterCard}" />\n`;
    if (twitterSite) html += `<meta name="twitter:site" content="${twitterSite}" />\n`;
    if (twitterCreator) html += `<meta name="twitter:creator" content="${twitterCreator}" />\n`;
    if (twitterTitle) html += `<meta name="twitter:title" content="${twitterTitle}" />\n`;
    if (twitterDescription) html += `<meta name="twitter:description" content="${twitterDescription}" />\n`;
    if (twitterImageUrl) html += `<meta name="twitter:image" content="${twitterImageUrl}" />\n`;

    setGeneratedHtml(html.trim());
  }, [
    title, description, keywords, author, robotsIndex, robotsFollow, charset, viewport,
    refreshEnabled, refreshDelay,
    ogTitle, ogDescription, ogImageUrl, ogUrl, ogType, ogSiteName, ogLocale,
    twitterCard, twitterSite, twitterCreator, twitterTitle, twitterDescription, twitterImageUrl
  ]);

  useEffect(() => {
    generateMetaTagsHtml();
  }, [generateMetaTagsHtml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml);
    toast.success('Meta tags copied to clipboard!');
  };

  const toggleFavorite = () => {
    if (isFavorite(toolSlug)) {
      removeFavorite(toolSlug);
      toast.success('Removed from favorites!');
    } else {
      addFavorite(toolSlug);
      toast.success('Added to favorites!');
    }
  };

  const FavoriteIcon = isFavorite(toolSlug) ? Star : StarOff;

  const defaultOgImage = "https://via.placeholder.com/1200x630?text=Open+Graph+Image";
  const defaultTwitterImage = "https://via.placeholder.com/800x418?text=Twitter+Card+Image";

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="Meta Tag Generator & OG Preview"
      description="Generate essential meta tags for SEO and preview how your content will appear on social media."
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Input Section */}
        <div className="flex-1 space-y-6">
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center justify-between">
              Basic Meta Tags
              <button
                onClick={toggleFavorite}
                className="p-2 rounded-full text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                aria-label={isFavorite(toolSlug) ? "Remove from favorites" : "Add to favorites"}
              >
                <FavoriteIcon size={20} fill={isFavorite(toolSlug) ? "#6366f1" : "none"} stroke={isFavorite(toolSlug) ? "#6366f1" : "currentColor"} />
              </button>
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-400 mb-1">Page Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., My Awesome Website"
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="A brief summary of your page content."
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                ></textarea>
              </div>
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-slate-400 mb-1">Keywords (comma-separated)</label>
                <input
                  type="text"
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., web development, tools, generator"
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-slate-400 mb-1">Author</label>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., John Doe"
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="robotsIndex"
                    checked={robotsIndex}
                    onChange={(e) => setRobotsIndex(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="robotsIndex" className="ml-2 text-sm text-slate-300">Index</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="robotsFollow"
                    checked={robotsFollow}
                    onChange={(e) => setRobotsFollow(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="robotsFollow" className="ml-2 text-sm text-slate-300">Follow</label>
                </div>
              </div>
              <div>
                <label htmlFor="charset" className="block text-sm font-medium text-slate-400 mb-1">Charset</label>
                <input
                  type="text"
                  id="charset"
                  value={charset}
                  onChange={(e) => setCharset(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div>
                <label htmlFor="viewport" className="block text-sm font-medium text-slate-400 mb-1">Viewport</label>
                <input
                  type="text"
                  id="viewport"
                  value={viewport}
                  onChange={(e) => setViewport(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="refreshEnabled"
                    checked={refreshEnabled}
                    onChange={(e) => setRefreshEnabled(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="refreshEnabled" className="ml-2 text-sm text-slate-300">Enable Refresh</label>
                </div>
                {refreshEnabled && (
                  <div className="flex items-center">
                    <label htmlFor="refreshDelay" className="text-sm font-medium text-slate-400 mr-2">Delay (s)</label>
                    <input
                      type="number"
                      id="refreshDelay"
                      value={refreshDelay}
                      onChange={(e) => setRefreshDelay(Number(e.target.value))}
                      min="1"
                      className="w-20 p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Open Graph Tags</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="ogTitle" className="block text-sm font-medium text-slate-400 mb-1">OG Title</label>
                <input
                  type="text"
                  id="ogTitle"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder="e.g., My Awesome Website"
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div>
                <label htmlFor="ogDescription" className="block text-sm font-medium text-slate-400 mb-1">OG Description</label>
                <textarea
                  id="ogDescription"
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  rows={3}
                  placeholder="A brief summary for social media."
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                ></textarea>
              </div>
              <div>
                <label htmlFor="ogImageUrl" className="block text-sm font-medium text-slate-400 mb-1">OG Image URL</label>
                <input
                  type="url"
                  id="ogImageUrl"
                  value={ogImageUrl}
                  onChange={(e) => setOgImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div>
                <label htmlFor="ogUrl" className="block text-sm font-medium text-slate-400 mb-1">OG URL</label>
                <input
                  type="url"
                  id="ogUrl"
                  value={ogUrl}
                  onChange={(e) => setOgUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div>
                <label htmlFor="ogType" className="block text-sm font-medium text-slate-400 mb-1">OG Type</label>
                <select
                  id="ogType"
                  value={ogType}
                  onChange={(e) => setOgType(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100"
                >
                  <option value="website">website</option>
                  <option value="article">article</option>
                  <option value="book">book</option>
                  <option value="profile">profile</option>
                  <option value="video.movie">video.movie</option>
                  <option value="video.episode">video.episode</option>
                  <option value="video.tv_show">video.tv_show</option>
                  <option value="video.other">video.other</option>
                </select>
              </div>
              <div>
                <label htmlFor="ogSiteName" className="block text-sm font-medium text-slate-400 mb-1">OG Site Name</label>
                <input
                  type="text"
                  id="ogSiteName"
                  value={ogSiteName}
                  onChange={(e) => setOgSiteName(e.target.value)}
                  placeholder="e.g., DevForge"
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div>
                <label htmlFor="ogLocale" className="block text-sm font-medium text-slate-400 mb-1">OG Locale</label>
                <input
                  type="text"
                  id="ogLocale"
                  value={ogLocale}
                  onChange={(e) => setOgLocale(e.target.value)}
                  placeholder="e.g., en_US"
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Twitter Card Tags</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="twitterCard" className="block text-sm font-medium text-slate-400 mb-1">Twitter Card Type</label>
                <select
                  id="twitterCard"
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100"
                >
                  <option value="summary">summary</option>
                  <option value="summary_large_image">summary_large_image</option>
                  <option value="app">app</option>
                  <option value="player">player</option>
                </select>
              </div>
              <div>
                <label htmlFor="twitterSite" className="block text-sm font-medium text-slate-400 mb-1">Twitter Site (@username)</label>
                <input
                  type="text"
                  id="twitterSite"
                  value={twitterSite}
                  onChange={(e) => setTwitterSite(e.target.value)}
                  placeholder="e.g., @devforge"
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div>
                <label htmlFor="twitterCreator" className="block text-sm font-medium text-slate-400 mb-1">Twitter Creator (@username)</label>
                <input
                  type="text"
                  id="twitterCreator"
                  value={twitterCreator}
                  onChange={(e) => setTwitterCreator(e.target.value)}
                  placeholder="e.g., @johndoe"
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div>
                <label htmlFor="twitterTitle" className="block text-sm font-medium text-slate-400 mb-1">Twitter Title</label>
                <input
                  type="text"
                  id="twitterTitle"
                  value={twitterTitle}
                  onChange={(e) => setTwitterTitle(e.target.value)}
                  placeholder="e.g., My Awesome Website"
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div>
                <label htmlFor="twitterDescription" className="block text-sm font-medium text-slate-400 mb-1">Twitter Description</label>
                <textarea
                  id="twitterDescription"
                  value={twitterDescription}
                  onChange={(e) => setTwitterDescription(e.target.value)}
                  rows={3}
                  placeholder="A brief summary for Twitter."
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                ></textarea>
              </div>
              <div>
                <label htmlFor="twitterImageUrl" className="block text-sm font-medium text-slate-400 mb-1">Twitter Image URL</label>
                <input
                  type="url"
                  id="twitterImageUrl"
                  value={twitterImageUrl}
                  onChange={(e) => setTwitterImageUrl(e.target.value)}
                  placeholder="https://example.com/twitter-image.jpg"
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Output and Preview Section */}
        <div className="flex-1 space-y-6">
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Generated Meta Tags</h2>
            <div className="relative">
              <textarea
                readOnly
                value={generatedHtml}
                rows={15}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-md font-mono text-sm text-slate-200 focus:outline-none resize-none"
              ></textarea>
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                aria-label="Copy to clipboard"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Open Graph Preview</h2>
            <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-lg max-w-md mx-auto">
              {ogImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ogImageUrl} alt="OG Image" className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-slate-700 flex items-center justify-center text-slate-400 text-sm">
                  <span className="text-center">No OG Image URL provided.<br/>Using placeholder.</span>
                </div>
              )}
              <div className="p-4">
                <p className="text-slate-400 text-xs mb-1 truncate">{ogUrl || 'https://example.com'}</p>
                <h3 className="text-lg font-semibold text-slate-50 mb-1 line-clamp-1">{ogTitle || title || 'Your Page Title'}</h3>
                <p className="text-slate-300 text-sm line-clamp-2">{ogDescription || description || 'A short description of your page content.'}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Twitter Card Preview</h2>
            <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-lg max-w-md mx-auto">
              {(twitterCard === 'summary_large_image' || twitterCard === 'summary') && (twitterImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={twitterImageUrl} alt="Twitter Image" className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-slate-700 flex items-center justify-center text-slate-400 text-sm">
                  <span className="text-center">No Twitter Image URL provided.<br/>Using placeholder.</span>
                </div>
              ))}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-50 mb-1 line-clamp-1">{twitterTitle || title || 'Your Page Title'}</h3>
                <p className="text-slate-300 text-sm line-clamp-2">{twitterDescription || description || 'A short description of your page content.'}</p>
                <p className="text-slate-400 text-xs mt-2">
                  {twitterCreator ? `By ${twitterCreator}` : ''} {twitterSite ? `on ${twitterSite}` : ''}
                  {(!twitterCreator && !twitterSite) && 'By @username on Your Site'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default MetaTagGeneratorPage;