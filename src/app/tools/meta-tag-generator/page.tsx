"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy } from 'lucide-react';

// Reusable Input Component
const Input = ({ label, id, value, onChange, placeholder, type = 'text', className = '' }: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium text-slate-300">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors ${className}`}
    />
  </div>
);

// Reusable Textarea Component
const Textarea = ({ label, id, value, onChange, placeholder, rows = 3, className = '' }: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium text-slate-300">
      {label}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors ${className}`}
    ></textarea>
  </div>
);

// Reusable Select Component
const Select = ({ label, id, value, onChange, options, className = '' }: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium text-slate-300">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors appearance-none cursor-pointer ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const MetaTagGeneratorPage = () => {
  const SLUG = "meta-tag-generator";
  const addToHistory = useToolStore((state) => state.addToHistory);

  useEffect(() => {
    addToHistory(SLUG);
  }, [addToHistory]);

  // Basic Meta Tags
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [robotsIndex, setRobotsIndex] = useState('index');
  const [robotsFollow, setRobotsFollow] = useState('follow');
  const [charset, setCharset] = useState('UTF-8');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
  const [refreshDelay, setRefreshDelay] = useState('');
  const [refreshUrl, setRefreshUrl] = useState('');

  // Open Graph Tags
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogType, setOgType] = useState('website');
  const [ogUrl, setOgUrl] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogSiteName, setOgSiteName] = useState('');
  const [ogLocale, setOgLocale] = useState('en_US');

  // Twitter Card Tags
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [twitterSite, setTwitterSite] = useState('');
  const [twitterCreator, setTwitterCreator] = useState('');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');

  const generateMetaTags = useCallback(() => {
    let tags: string[] = [];

    // Title (not a meta tag, but essential for SEO)
    if (title) tags.push(`<title>${title}</title>`);

    // Basic Meta Tags
    if (charset) tags.push(`<meta charset="${charset}" />`);
    if (viewport) tags.push(`<meta name="viewport" content="${viewport}" />`);
    if (description) tags.push(`<meta name="description" content="${description}" />`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}" />`);
    if (author) tags.push(`<meta name="author" content="${author}" />`);
    tags.push(`<meta name="robots" content="${robotsIndex},${robotsFollow}" />`);
    if (refreshDelay && refreshUrl) tags.push(`<meta http-equiv="refresh" content="${refreshDelay};url=${refreshUrl}" />`);

    // Open Graph Tags
    if (ogTitle) tags.push(`<meta property="og:title" content="${ogTitle}" />`);
    if (ogDescription) tags.push(`<meta property="og:description" content="${ogDescription}" />`);
    if (ogType) tags.push(`<meta property="og:type" content="${ogType}" />`);
    if (ogUrl) tags.push(`<meta property="og:url" content="${ogUrl}" />`);
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}" />`);
    if (ogSiteName) tags.push(`<meta property="og:site_name" content="${ogSiteName}" />`);
    if (ogLocale) tags.push(`<meta property="og:locale" content="${ogLocale}" />`);

    // Twitter Card Tags
    if (twitterCard) tags.push(`<meta name="twitter:card" content="${twitterCard}" />`);
    if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}" />`);
    if (twitterCreator) tags.push(`<meta name="twitter:creator" content="${twitterCreator}" />`);
    if (twitterTitle) tags.push(`<meta name="twitter:title" content="${twitterTitle}" />`);
    if (twitterDescription) tags.push(`<meta name="twitter:description" content="${twitterDescription}" />`);
    if (twitterImage) tags.push(`<meta name="twitter:image" content="${twitterImage}" />`);

    return tags.join('\n');
  }, [
    title, description, keywords, author, robotsIndex, robotsFollow, charset, viewport, refreshDelay, refreshUrl,
    ogTitle, ogDescription, ogType, ogUrl, ogImage, ogSiteName, ogLocale,
    twitterCard, twitterSite, twitterCreator, twitterTitle, twitterDescription, twitterImage
  ]);

  const generatedHtml = useMemo(() => generateMetaTags(), [generateMetaTags]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedHtml);
      toast.success('Meta tags copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy meta tags.');
      console.error('Failed to copy: ', err);
    }
  };

  const ogPreviewTitle = ogTitle || title || 'Your Website Title';
  const ogPreviewDescription = ogDescription || description || 'A short description of your website.';
  const ogPreviewImage = ogImage || 'https://via.placeholder.com/1200x630/1e293b/94a3b8?text=OG+Image+Placeholder';
  const ogPreviewUrl = ogUrl || 'https://example.com';
  const ogPreviewSiteName = ogSiteName || 'Example.com';

  const twitterPreviewTitle = twitterTitle || ogTitle || title || 'Your Website Title';
  const twitterPreviewDescription = twitterDescription || ogDescription || description || 'A short description of your website.';
  const twitterPreviewImage = twitterImage || ogImage || 'https://via.placeholder.com/1200x675/1e293b/94a3b8?text=Twitter+Image+Placeholder';
  const twitterPreviewSite = twitterSite || '@yourwebsite';
  const twitterPreviewCreator = twitterCreator || '@yourcreator';

  return (
    <ToolPageWrapper
      toolSlug={SLUG}
      toolName="Meta Tag Generator & OG Preview"
      description="Generate SEO-friendly meta tags and preview Open Graph & Twitter cards."
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Input Forms */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Basic Meta Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Basic Meta Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title" id="title" value={title} onChange={setTitle} placeholder="e.g., My Awesome Website" />
              <Input label="Author" id="author" value={author} onChange={setAuthor} placeholder="e.g., John Doe" />
              <Textarea label="Description" id="description" value={description} onChange={setDescription} placeholder="A brief summary of your page content." rows={2} />
              <Textarea label="Keywords" id="keywords" value={keywords} onChange={setKeywords} placeholder="comma, separated, keywords" rows={2} />
              <Select
                label="Robots Index"
                id="robotsIndex"
                value={robotsIndex}
                onChange={setRobotsIndex}
                options={[
                  { value: 'index', label: 'index' },
                  { value: 'noindex', label: 'noindex' },
                ]}
              />
              <Select
                label="Robots Follow"
                id="robotsFollow"
                value={robotsFollow}
                onChange={setRobotsFollow}
                options={[
                  { value: 'follow', label: 'follow' },
                  { value: 'nofollow', label: 'nofollow' },
                ]}
              />
              <Input label="Charset" id="charset" value={charset} onChange={setCharset} placeholder="e.g., UTF-8" />
              <Input label="Viewport" id="viewport" value={viewport} onChange={setViewport} placeholder="e.g., width=device-width, initial-scale=1.0" />
              <Input label="Refresh Delay (seconds)" id="refreshDelay" type="number" value={refreshDelay} onChange={setRefreshDelay} placeholder="e.g., 5" />
              <Input label="Refresh URL" id="refreshUrl" value={refreshUrl} onChange={setRefreshUrl} placeholder="e.g., https://example.com/new-page" />
            </div>
          </div>

          {/* Open Graph Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Open Graph Tags (Facebook, LinkedIn, etc.)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="OG Title" id="ogTitle" value={ogTitle} onChange={setOgTitle} placeholder="e.g., My Awesome Website" />
              <Input label="OG URL" id="ogUrl" value={ogUrl} onChange={setOgUrl} placeholder="e.g., https://example.com" />
              <Textarea label="OG Description" id="ogDescription" value={ogDescription} onChange={setOgDescription} placeholder="A compelling description for social media." rows={2} />
              <Input label="OG Image URL" id="ogImage" value={ogImage} onChange={setOgImage} placeholder="e.g., https://example.com/image.jpg" />
              <Select
                label="OG Type"
                id="ogType"
                value={ogType}
                onChange={setOgType}
                options={[
                  { value: 'website', label: 'website' },
                  { value: 'article', label: 'article' },
                  { value: 'book', label: 'book' },
                  { value: 'profile', label: 'profile' },
                ]}
              />
              <Input label="OG Site Name" id="ogSiteName" value={ogSiteName} onChange={setOgSiteName} placeholder="e.g., My Company" />
              <Input label="OG Locale" id="ogLocale" value={ogLocale} onChange={setOgLocale} placeholder="e.g., en_US" />
            </div>
          </div>

          {/* Twitter Card Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Twitter Card Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Twitter Card Type"
                id="twitterCard"
                value={twitterCard}
                onChange={setTwitterCard}
                options={[
                  { value: 'summary', label: 'Summary Card' },
                  { value: 'summary_large_image', label: 'Summary Card with Large Image' },
                  { value: 'app', label: 'App Card' },
                  { value: 'player', label: 'Player Card' },
                ]}
              />
              <Input label="Twitter Site" id="twitterSite" value={twitterSite} onChange={setTwitterSite} placeholder="e.g., @yourwebsite" />
              <Input label="Twitter Creator" id="twitterCreator" value={twitterCreator} onChange={setTwitterCreator} placeholder="e.g., @yourcreator" />
              <Input label="Twitter Title" id="twitterTitle" value={twitterTitle} onChange={setTwitterTitle} placeholder="e.g., My Awesome Tweet Title" />
              <Textarea label="Twitter Description" id="twitterDescription" value={twitterDescription} onChange={setTwitterDescription} placeholder="A concise description for Twitter." rows={2} />
              <Input label="Twitter Image URL" id="twitterImage" value={twitterImage} onChange={setTwitterImage} placeholder="e.g., https://example.com/twitter-image.jpg" />
            </div>
          </div>
        </div>

        {/* Output and Preview */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Generated HTML */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Generated Meta Tags</h2>
            <div className="relative">
              <textarea
                value={generatedHtml}
                readOnly
                rows={15}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 font-mono text-sm text-slate-200 resize-y focus:outline-none"
              ></textarea>
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded-md transition-colors"
                aria-label="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          {/* OG Preview */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Open Graph Preview</h2>
            <div className="bg-slate-900 rounded-lg shadow-lg overflow-hidden border border-slate-700 max-w-md mx-auto">
              {/* Image */}
              <div className="w-full h-48 bg-slate-700 flex items-center justify-center text-slate-400 text-sm overflow-hidden">
                {ogPreviewImage ? (
                  <img src={ogPreviewImage} alt="OG Image Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1200x630/1e293b/94a3b8?text=OG+Image+Placeholder'; }} />
                ) : (
                  <span>No OG Image</span>
                )}
              </div>
              <div className="p-4">
                {/* URL */}
                <p className="text-xs text-slate-400 mb-1 truncate">{ogPreviewUrl}</p>
                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">
                  {ogPreviewTitle}
                </h3>
                {/* Description */}
                <p className="text-sm text-slate-300 line-clamp-3">
                  {ogPreviewDescription}
                </p>
                {/* Site Name */}
                <p className="text-xs text-slate-400 mt-2">{ogPreviewSiteName}</p>
              </div>
            </div>
          </div>

          {/* Twitter Preview */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Twitter Card Preview</h2>
            <div className="bg-slate-900 rounded-lg shadow-lg overflow-hidden border border-slate-700 max-w-md mx-auto">
              {/* Image */}
              {(twitterCard === 'summary_large_image' || twitterCard === 'summary') && (
                <div className="w-full h-48 bg-slate-700 flex items-center justify-center text-slate-400 text-sm overflow-hidden">
                  {twitterPreviewImage ? (
                    <img src={twitterPreviewImage} alt="Twitter Image Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1200x675/1e293b/94a3b8?text=Twitter+Image+Placeholder'; }} />
                  ) : (
                    <span>No Twitter Image</span>
                  )}
                </div>
              )}
              <div className="p-4">
                {/* Site/Creator */}
                <p className="text-xs text-slate-400 mb-1">
                  {twitterPreviewSite} {twitterPreviewCreator && `• ${twitterPreviewCreator}`}
                </p>
                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">
                  {twitterPreviewTitle}
                </h3>
                {/* Description */}
                <p className="text-sm text-slate-300 line-clamp-3">
                  {twitterPreviewDescription}
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