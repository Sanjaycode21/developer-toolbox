"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const MetaTagGeneratorPage: React.FC = () => {
  const toolSlug = "meta-tag-generator";
  const { addToHistory } = useToolStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');

  // Open Graph (OG) Tags
  const [ogUrl, setOgUrl] = useState('');
  const [ogType, setOgType] = useState('website');
  const [ogImage, setOgImage] = useState('');
  const [ogImageAlt, setOgImageAlt] = useState('');
  const [ogLocale, setOgLocale] = useState('en_US');

  // Twitter Card Tags
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [twitterSite, setTwitterSite] = useState('');
  const [twitterCreator, setTwitterCreator] = useState('');
  const [twitterImage, setTwitterImage] = useState('');
  const [twitterImageAlt, setTwitterImageAlt] = useState('');

  const [generatedMetaTags, setGeneratedMetaTags] = useState('');

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const generateMetaTags = useCallback(() => {
    let tags = [];

    // Basic Meta Tags
    if (title) tags.push(`<title>${title}</title>`);
    if (description) tags.push(`<meta name="description" content="${description}" />`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}" />`);
    if (author) tags.push(`<meta name="author" content="${author}" />`);
    if (viewport) tags.push(`<meta name="viewport" content="${viewport}" />`);

    // Open Graph Tags
    if (ogUrl) tags.push(`<meta property="og:url" content="${ogUrl}" />`);
    if (ogType) tags.push(`<meta property="og:type" content="${ogType}" />`);
    if (title) tags.push(`<meta property="og:title" content="${title}" />`);
    if (description) tags.push(`<meta property="og:description" content="${description}" />`);
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}" />`);
    if (ogImageAlt) tags.push(`<meta property="og:image:alt" content="${ogImageAlt}" />`);
    if (ogLocale) tags.push(`<meta property="og:locale" content="${ogLocale}" />`);

    // Twitter Card Tags
    if (twitterCard) tags.push(`<meta name="twitter:card" content="${twitterCard}" />`);
    if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}" />`);
    if (twitterCreator) tags.push(`<meta name="twitter:creator" content="${twitterCreator}" />`);
    if (title) tags.push(`<meta name="twitter:title" content="${title}" />`);
    if (description) tags.push(`<meta name="twitter:description" content="${description}" />`);
    const finalTwitterImage = twitterImage || ogImage;
    if (finalTwitterImage) tags.push(`<meta name="twitter:image" content="${finalTwitterImage}" />`);
    if (twitterImageAlt) tags.push(`<meta name="twitter:image:alt" content="${twitterImageAlt}" />`);


    setGeneratedMetaTags(tags.join('\n'));
  }, [title, description, keywords, author, viewport, ogUrl, ogType, ogImage, ogImageAlt, ogLocale, twitterCard, twitterSite, twitterCreator, twitterImage, twitterImageAlt]);

  useEffect(() => {
    generateMetaTags();
  }, [generateMetaTags]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMetaTags);
    toast.success('Meta tags copied to clipboard!');
  };

  const renderOgPreview = () => {
    const displayTitle = title || 'Your Page Title';
    const displayDescription = description || 'A compelling description of your page content.';
    const displayImage = ogImage || 'https://via.placeholder.com/1200x630?text=Open+Graph+Image';
    const displayUrl = ogUrl || 'https://yourwebsite.com/page';

    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg">
        {ogImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayImage} alt={ogImageAlt || displayTitle} className="w-full h-48 object-cover" />
        )}
        <div className="p-4">
          <p className="text-xs text-slate-400 mb-1">{new URL(displayUrl).hostname}</p>
          <h3 className="text-lg font-semibold text-slate-50 mb-1 line-clamp-1">{displayTitle}</h3>
          <p className="text-sm text-slate-300 line-clamp-2">{displayDescription}</p>
        </div>
      </div>
    );
  };

  const renderTwitterPreview = () => {
    const displayTitle = title || 'Your Page Title';
    const displayDescription = description || 'A compelling description of your page content.';
    const displayImage = twitterImage || ogImage || 'https://via.placeholder.com/600x314?text=Twitter+Image';
    const displaySite = twitterSite || '@yourhandle';

    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg">
        {twitterCard === 'summary_large_image' && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayImage} alt={twitterImageAlt || displayTitle} className="w-full h-48 object-cover" />
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-50 mb-1 line-clamp-1">{displayTitle}</h3>
          <p className="text-sm text-slate-300 line-clamp-2">{displayDescription}</p>
          <p className="text-xs text-slate-400 mt-2">{displaySite}</p>
        </div>
      </div>
    );
  };


  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="Meta Tag Generator & OG Preview"
      description="Generate essential meta tags and preview Open Graph & Twitter cards for SEO and social sharing."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Meta Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Basic Meta Tags</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Page Title</label>
                <input
                  type="text"
                  id="title"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., My Awesome Website"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  id="description"
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Discover the best tools for developers."
                ></textarea>
              </div>
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-slate-300 mb-1">Keywords (comma-separated)</label>
                <input
                  type="text"
                  id="keywords"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., dev tools, web utilities, developer toolbox"
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-slate-300 mb-1">Author</label>
                <input
                  type="text"
                  id="author"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., DevForge Team"
                />
              </div>
              <div>
                <label htmlFor="viewport" className="block text-sm font-medium text-slate-300 mb-1">Viewport</label>
                <input
                  type="text"
                  id="viewport"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={viewport}
                  onChange={(e) => setViewport(e.target.value)}
                  placeholder="e.g., width=device-width, initial-scale=1.0"
                />
              </div>
            </div>
          </div>

          {/* Open Graph Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Open Graph (OG) Tags</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="ogUrl" className="block text-sm font-medium text-slate-300 mb-1">OG URL</label>
                <input
                  type="url"
                  id="ogUrl"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={ogUrl}
                  onChange={(e) => setOgUrl(e.target.value)}
                  placeholder="e.g., https://devforge.com/tools/meta-tag-generator"
                />
              </div>
              <div>
                <label htmlFor="ogType" className="block text-sm font-medium text-slate-300 mb-1">OG Type</label>
                <select
                  id="ogType"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={ogType}
                  onChange={(e) => setOgType(e.target.value)}
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
                <label htmlFor="ogImage" className="block text-sm font-medium text-slate-300 mb-1">OG Image URL</label>
                <input
                  type="url"
                  id="ogImage"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="e.g., https://devforge.com/images/og-image.jpg"
                />
              </div>
              <div>
                <label htmlFor="ogImageAlt" className="block text-sm font-medium text-slate-300 mb-1">OG Image Alt Text</label>
                <input
                  type="text"
                  id="ogImageAlt"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={ogImageAlt}
                  onChange={(e) => setOgImageAlt(e.target.value)}
                  placeholder="e.g., DevForge Meta Tag Generator Tool"
                />
              </div>
              <div>
                <label htmlFor="ogLocale" className="block text-sm font-medium text-slate-300 mb-1">OG Locale</label>
                <input
                  type="text"
                  id="ogLocale"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={ogLocale}
                  onChange={(e) => setOgLocale(e.target.value)}
                  placeholder="e.g., en_US"
                />
              </div>
            </div>
          </div>

          {/* Twitter Card Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Twitter Card Tags</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="twitterCard" className="block text-sm font-medium text-slate-300 mb-1">Twitter Card Type</label>
                <select
                  id="twitterCard"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <label htmlFor="twitterSite" className="block text-sm font-medium text-slate-300 mb-1">Twitter Site (@handle)</label>
                <input
                  type="text"
                  id="twitterSite"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={twitterSite}
                  onChange={(e) => setTwitterSite(e.target.value)}
                  placeholder="e.g., @DevForgeApp"
                />
              </div>
              <div>
                <label htmlFor="twitterCreator" className="block text-sm font-medium text-slate-300 mb-1">Twitter Creator (@handle)</label>
                <input
                  type="text"
                  id="twitterCreator"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={twitterCreator}
                  onChange={(e) => setTwitterCreator(e.target.value)}
                  placeholder="e.g., @YourPersonalHandle"
                />
              </div>
              <div>
                <label htmlFor="twitterImage" className="block text-sm font-medium text-slate-300 mb-1">Twitter Image URL (optional, defaults to OG Image)</label>
                <input
                  type="url"
                  id="twitterImage"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={twitterImage}
                  onChange={(e) => setTwitterImage(e.target.value)}
                  placeholder="e.g., https://devforge.com/images/twitter-image.jpg"
                />
              </div>
              <div>
                <label htmlFor="twitterImageAlt" className="block text-sm font-medium text-slate-300 mb-1">Twitter Image Alt Text</label>
                <input
                  type="text"
                  id="twitterImageAlt"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={twitterImageAlt}
                  onChange={(e) => setTwitterImageAlt(e.target.value)}
                  placeholder="e.g., DevForge Meta Tag Generator Tool"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Output & Preview Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Generated Meta Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Generated Meta Tags</h2>
            <textarea
              readOnly
              rows={15}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={generatedMetaTags}
            ></textarea>
            <button
              onClick={copyToClipboard}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Copy to Clipboard
            </button>
          </div>

          {/* OG Preview */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Open Graph Preview</h2>
            {renderOgPreview()}
          </div>

          {/* Twitter Preview */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Twitter Card Preview</h2>
            {renderTwitterPreview()}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default MetaTagGeneratorPage;