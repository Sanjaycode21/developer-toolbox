"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';
import { Copy } from 'lucide-react';

const MetaTagGeneratorPage: React.FC = () => {
  // Basic Meta Tags
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);
  const [charset, setCharset] = useState('UTF-8');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');

  // Open Graph Tags
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogType, setOgType] = useState('website');
  const [ogUrl, setOgUrl] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogSiteName, setOgSiteName] = useState('');

  // Twitter Card Tags
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [twitterSite, setTwitterSite] = useState('');
  const [twitterCreator, setTwitterCreator] = useState('');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');

  const [generatedMetaTags, setGeneratedMetaTags] = useState('');

  const generateMetaTags = useCallback(() => {
    let tags: string[] = [];

    // Title Tag (not a meta tag, but essential for <head>)
    if (title) tags.push(`<title>${title}</title>`);

    // Basic Meta Tags
    if (charset) tags.push(`<meta charset="${charset}" />`);
    if (viewport) tags.push(`<meta name="viewport" content="${viewport}" />`);
    if (description) tags.push(`<meta name="description" content="${description}" />`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}" />`);
    if (author) tags.push(`<meta name="author" content="${author}" />`);

    const robotsContent = [
      robotsIndex ? 'index' : 'noindex',
      robotsFollow ? 'follow' : 'nofollow'
    ].join(', ');
    tags.push(`<meta name="robots" content="${robotsContent}" />`);

    // Open Graph Tags
    if (ogTitle) tags.push(`<meta property="og:title" content="${ogTitle}" />`);
    if (ogDescription) tags.push(`<meta property="og:description" content="${ogDescription}" />`);
    if (ogType) tags.push(`<meta property="og:type" content="${ogType}" />`);
    if (ogUrl) tags.push(`<meta property="og:url" content="${ogUrl}" />`);
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}" />`);
    if (ogSiteName) tags.push(`<meta property="og:site_name" content="${ogSiteName}" />`);

    // Twitter Card Tags
    if (twitterCard) tags.push(`<meta name="twitter:card" content="${twitterCard}" />`);
    if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}" />`);
    if (twitterCreator) tags.push(`<meta name="twitter:creator" content="${twitterCreator}" />`);
    if (twitterTitle) tags.push(`<meta name="twitter:title" content="${twitterTitle}" />`);
    if (twitterDescription) tags.push(`<meta name="twitter:description" content="${twitterDescription}" />`);
    if (twitterImage) tags.push(`<meta name="twitter:image" content="${twitterImage}" />`);

    return tags.join('\n');
  }, [
    title, description, keywords, author, robotsIndex, robotsFollow, charset, viewport,
    ogTitle, ogDescription, ogType, ogUrl, ogImage, ogSiteName,
    twitterCard, twitterSite, twitterCreator, twitterTitle, twitterDescription, twitterImage
  ]);

  useEffect(() => {
    setGeneratedMetaTags(generateMetaTags());
  }, [generateMetaTags]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMetaTags)
      .then(() => toast.success('Meta tags copied to clipboard!'))
      .catch(() => toast.error('Failed to copy meta tags.'));
  };

  const defaultOgImage = "https://via.placeholder.com/1200x630?text=Open+Graph+Image";
  const defaultTwitterLargeImage = "https://via.placeholder.com/800x418?text=Twitter+Image";
  const defaultTwitterSummaryImage = "https://via.placeholder.com/120x120?text=Twitter+Image";

  return (
    <ToolPageWrapper
      toolSlug="meta-tag-generator"
      toolName="Meta Tag Generator & OG Preview"
      description="Generate essential meta tags for SEO and social media, and preview Open Graph and Twitter cards."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col gap-6">
          {/* Basic Meta Tags */}
          <section className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Basic Meta Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., My Awesome Website"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                  placeholder="e.g., A comprehensive suite of developer tools."
                ></textarea>
              </div>
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-slate-400 mb-1">Keywords</label>
                <input
                  type="text"
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., dev tools, utilities, web development"
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-slate-400 mb-1">Author</label>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., DevForge Team"
                />
              </div>
              <div className="flex items-center gap-4 col-span-full">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="robotsIndex"
                    checked={robotsIndex}
                    onChange={(e) => setRobotsIndex(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 bg-slate-900 border-slate-700 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="robotsIndex" className="ml-2 text-sm text-slate-300">Index</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="robotsFollow"
                    checked={robotsFollow}
                    onChange={(e) => setRobotsFollow(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 bg-slate-900 border-slate-700 rounded focus:ring-indigo-500"
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
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., UTF-8"
                />
              </div>
              <div>
                <label htmlFor="viewport" className="block text-sm font-medium text-slate-400 mb-1">Viewport</label>
                <input
                  type="text"
                  id="viewport"
                  value={viewport}
                  onChange={(e) => setViewport(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., width=device-width, initial-scale=1.0"
                />
              </div>
            </div>
          </section>

          {/* Open Graph Tags */}
          <section className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Open Graph Tags (Facebook, LinkedIn, etc.)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ogTitle" className="block text-sm font-medium text-slate-400 mb-1">OG Title</label>
                <input
                  type="text"
                  id="ogTitle"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., DevForge - Developer Toolbox"
                />
              </div>
              <div>
                <label htmlFor="ogDescription" className="block text-sm font-medium text-slate-400 mb-1">OG Description</label>
                <textarea
                  id="ogDescription"
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                  placeholder="e.g., The ultimate suite of tools for developers."
                ></textarea>
              </div>
              <div>
                <label htmlFor="ogType" className="block text-sm font-medium text-slate-400 mb-1">OG Type</label>
                <select
                  id="ogType"
                  value={ogType}
                  onChange={(e) => setOgType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
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
                <label htmlFor="ogUrl" className="block text-sm font-medium text-slate-400 mb-1">OG URL</label>
                <input
                  type="url"
                  id="ogUrl"
                  value={ogUrl}
                  onChange={(e) => setOgUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., https://devforge.com"
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="ogImage" className="block text-sm font-medium text-slate-400 mb-1">OG Image URL</label>
                <input
                  type="url"
                  id="ogImage"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., https://devforge.com/og-image.jpg"
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="ogSiteName" className="block text-sm font-medium text-slate-400 mb-1">OG Site Name</label>
                <input
                  type="text"
                  id="ogSiteName"
                  value={ogSiteName}
                  onChange={(e) => setOgSiteName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., DevForge"
                />
              </div>
            </div>
          </section>

          {/* Twitter Card Tags */}
          <section className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Twitter Card Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="twitterCard" className="block text-sm font-medium text-slate-400 mb-1">Twitter Card Type</label>
                <select
                  id="twitterCard"
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., @devforgeapp"
                />
              </div>
              <div>
                <label htmlFor="twitterCreator" className="block text-sm font-medium text-slate-400 mb-1">Twitter Creator (@username)</label>
                <input
                  type="text"
                  id="twitterCreator"
                  value={twitterCreator}
                  onChange={(e) => setTwitterCreator(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., @yourhandle"
                />
              </div>
              <div>
                <label htmlFor="twitterTitle" className="block text-sm font-medium text-slate-400 mb-1">Twitter Title</label>
                <input
                  type="text"
                  id="twitterTitle"
                  value={twitterTitle}
                  onChange={(e) => setTwitterTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., DevForge - The Ultimate Toolbox"
                />
              </div>
              <div>
                <label htmlFor="twitterDescription" className="block text-sm font-medium text-slate-400 mb-1">Twitter Description</label>
                <textarea
                  id="twitterDescription"
                  value={twitterDescription}
                  onChange={(e) => setTwitterDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                  placeholder="e.g., A comprehensive suite of developer tools."
                ></textarea>
              </div>
              <div className="col-span-full">
                <label htmlFor="twitterImage" className="block text-sm font-medium text-slate-400 mb-1">Twitter Image URL</label>
                <input
                  type="url"
                  id="twitterImage"
                  value={twitterImage}
                  onChange={(e) => setTwitterImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., https://devforge.com/twitter-image.jpg"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Output & Preview Section */}
        <div className="flex flex-col gap-6">
          {/* Generated Meta Tags */}
          <section className="p-6 bg-slate-800 rounded-lg border border-slate-700 flex-1">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Generated Meta Tags</h2>
            <div className="relative">
              <textarea
                value={generatedMetaTags}
                readOnly
                rows={15}
                className="w-full p-4 bg-slate-900 border border-slate-700 rounded-md text-slate-200 font-mono text-sm resize-none focus:outline-none"
              ></textarea>
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-slate-100 transition-colors flex items-center gap-1 text-sm"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
                <span className="sr-only md:not-sr-only">Copy</span>
              </button>
            </div>
          </section>

          {/* OG Preview */}
          <section className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Open Graph Preview</h2>
            <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-lg">
              <img
                src={ogImage || defaultOgImage}
                alt="Open Graph Preview"
                className="w-full h-auto object-cover max-h-64"
                onError={(e) => { (e.target as HTMLImageElement).src = defaultOgImage; }}
              />
              <div className="p-4">
                <p className="text-xs text-slate-400 mb-1 uppercase">{ogUrl ? new URL(ogUrl).hostname : 'example.com'}</p>
                <h3 className="text-lg font-semibold text-slate-100 mb-1">{ogTitle || title || 'Your Page Title'}</h3>
                <p className="text-sm text-slate-300 line-clamp-2">{ogDescription || description || 'Your page description goes here.'}</p>
              </div>
            </div>
          </section>

          {/* Twitter Card Preview */}
          <section className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Twitter Card Preview</h2>
            {twitterCard === 'summary_large_image' && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={twitterImage || ogImage || defaultTwitterLargeImage}
                  alt="Twitter Card Preview"
                  className="w-full h-auto object-cover max-h-64"
                  onError={(e) => { (e.target as HTMLImageElement).src = defaultTwitterLargeImage; }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-100 mb-1">{twitterTitle || ogTitle || title || 'Your Page Title'}</h3>
                  <p className="text-sm text-slate-300 line-clamp-2">{twitterDescription || ogDescription || description || 'Your page description goes here.'}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {twitterSite || ogSiteName || 'example.com'}
                    {twitterCreator && ` by ${twitterCreator}`}
                  </p>
                </div>
              </div>
            )}
            {twitterCard === 'summary' && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-lg flex">
                <div className="p-4 flex-1">
                  <h3 className="text-base font-semibold text-slate-100 mb-1">{twitterTitle || ogTitle || title || 'Your Page Title'}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2">{twitterDescription || ogDescription || description || 'Your page description goes here.'}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {twitterSite || ogSiteName || 'example.com'}
                    {twitterCreator && ` by ${twitterCreator}`}
                  </p>
                </div>
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={twitterImage || ogImage || defaultTwitterSummaryImage}
                    alt="Twitter Card Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = defaultTwitterSummaryImage; }}
                  />
                </div>
              </div>
            )}
            {(twitterCard === 'app' || twitterCard === 'player') && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-400 text-sm italic">
                Preview for "{twitterCard}" card type is not visually simulated.
                Please refer to Twitter's documentation for exact rendering.
              </div>
            )}
          </section>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default MetaTagGeneratorPage;