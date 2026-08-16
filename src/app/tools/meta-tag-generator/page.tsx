"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, RefreshCcw } from 'lucide-react';

// Helper component for input fields
const InputField: React.FC<{
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
  description?: string;
}> = ({ label, id, value, onChange, placeholder, type = 'text', textarea = false, rows = 3, description }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
      {label}
    </label>
    {textarea ? (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-y"
      />
    ) : (
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      />
    )}
    {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
  </div>
);

// Helper component for select fields
const SelectField: React.FC<{
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  description?: string;
}> = ({ label, id, value, onChange, options, description }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none pr-8"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
  </div>
);

// Social Media Card Preview Component
const SocialCardPreview: React.FC<{
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  type: 'og' | 'twitter';
}> = ({ title, description, imageUrl, url, type }) => {
  const defaultImage = "/next.svg"; // A placeholder image
  const displayImage = imageUrl || defaultImage;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg w-full max-w-md mx-auto">
      <div className="relative w-full h-48 bg-slate-700 flex items-center justify-center overflow-hidden">
        {displayImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayImage} alt="Preview Image" className="object-cover w-full h-full" />
        ) : (
          <span className="text-slate-400 text-sm">No Image Provided</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-slate-500 mb-1 truncate">{url || 'https://example.com/your-page'}</p>
        <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">{title || 'Your Page Title Here'}</h3>
        <p className="text-sm text-slate-300 line-clamp-3">{description || 'A compelling description of your page content.'}</p>
      </div>
      <div className="p-4 border-t border-slate-700 bg-slate-700/30 text-xs text-slate-400">
        {type === 'og' ? 'Open Graph Preview' : 'Twitter Card Preview'}
      </div>
    </div>
  );
};


const MetaTagGeneratorPage: React.FC = () => {
  const toolSlug = "meta-tag-generator";
  const { addToHistory } = useToolStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
  const [charset, setCharset] = useState('UTF-8');

  // Open Graph
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [ogType, setOgType] = useState('website');
  const [ogSiteName, setOgSiteName] = useState('');
  const [ogLocale, setOgLocale] = useState('en_US');

  // Twitter Card
  const [twitterCard, setTwitterCard] = useState('summary');
  const [twitterSite, setTwitterSite] = useState('');
  const [twitterCreator, setTwitterCreator] = useState('');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');

  const [generatedHtml, setGeneratedHtml] = useState('');

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const generateMetaTags = useCallback(() => {
    let tags = [];

    // Basic Meta Tags
    tags.push(`<meta charset="${charset}" />`);
    if (title) tags.push(`<title>${title}</title>`);
    if (description) tags.push(`<meta name="description" content="${description}" />`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}" />`);
    if (author) tags.push(`<meta name="author" content="${author}" />`);
    if (viewport) tags.push(`<meta name="viewport" content="${viewport}" />`);

    // Open Graph Tags
    if (ogTitle) tags.push(`<meta property="og:title" content="${ogTitle}" />`);
    if (ogDescription) tags.push(`<meta property="og:description" content="${ogDescription}" />`);
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}" />`);
    if (ogUrl) tags.push(`<meta property="og:url" content="${ogUrl}" />`);
    if (ogType) tags.push(`<meta property="og:type" content="${ogType}" />`);
    if (ogSiteName) tags.push(`<meta property="og:site_name" content="${ogSiteName}" />`);
    if (ogLocale) tags.push(`<meta property="og:locale" content="${ogLocale}" />`);

    // Twitter Card Tags
    if (twitterCard) tags.push(`<meta name="twitter:card" content="${twitterCard}" />`);
    if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}" />`);
    if (twitterCreator) tags.push(`<meta name="twitter:creator" content="${twitterCreator}" />`);
    if (twitterTitle) tags.push(`<meta name="twitter:title" content="${twitterTitle}" />`);
    if (twitterDescription) tags.push(`<meta name="twitter:description" content="${twitterDescription}" />`);
    if (twitterImage) tags.push(`<meta name="twitter:image" content="${twitterImage}" />`);

    setGeneratedHtml(tags.join('\n'));
  }, [
    title, description, keywords, author, viewport, charset,
    ogTitle, ogDescription, ogImage, ogUrl, ogType, ogSiteName, ogLocale,
    twitterCard, twitterSite, twitterCreator, twitterTitle, twitterDescription, twitterImage
  ]);

  useEffect(() => {
    generateMetaTags();
  }, [generateMetaTags]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml);
    toast.success('Meta tags copied to clipboard!');
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setKeywords('');
    setAuthor('');
    setViewport('width=device-width, initial-scale=1.0');
    setCharset('UTF-8');

    setOgTitle('');
    setOgDescription('');
    setOgImage('');
    setOgUrl('');
    setOgType('website');
    setOgSiteName('');
    setOgLocale('en_US');

    setTwitterCard('summary');
    setTwitterSite('');
    setTwitterCreator('');
    setTwitterTitle('');
    setTwitterDescription('');
    setTwitterImage('');

    toast.success('All fields reset!');
  };

  // Determine preview content
  const previewTitle = ogTitle || title;
  const previewDescription = ogDescription || description;
  const previewImageUrl = ogImage;
  const previewUrl = ogUrl;

  const twitterPreviewTitle = twitterTitle || ogTitle || title;
  const twitterPreviewDescription = twitterDescription || ogDescription || description;
  const twitterPreviewImageUrl = twitterImage || ogImage;
  const twitterPreviewUrl = ogUrl; // Twitter often uses the OG URL

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="Meta Tag Generator & OG Preview"
      description="Generate essential HTML meta tags and preview Open Graph & Twitter cards for social sharing."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Meta Tag Inputs</h2>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 mb-6">
            <h3 className="text-lg font-medium text-slate-200 mb-3">Basic Meta Tags</h3>
            <InputField label="Page Title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., My Awesome Website" />
            <InputField label="Description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short, accurate summary of the page content." textarea rows={2} />
            <InputField label="Keywords" id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="comma, separated, keywords" />
            <InputField label="Author" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g., John Doe" />
            <InputField label="Viewport" id="viewport" value={viewport} onChange={(e) => setViewport(e.target.value)} placeholder="width=device-width, initial-scale=1.0" description="Controls how the page is displayed on mobile devices." />
            <InputField label="Charset" id="charset" value={charset} onChange={(e) => setCharset(e.target.value)} placeholder="UTF-8" description="Character encoding for the document." />
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 mb-6">
            <h3 className="text-lg font-medium text-slate-200 mb-3">Open Graph (OG) Tags <span className="text-sm text-slate-500">(for Facebook, LinkedIn, etc.)</span></h3>
            <InputField label="OG Title" id="ogTitle" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder="e.g., My Awesome Article" />
            <InputField label="OG Description" id="ogDescription" value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} placeholder="A description for social media shares." textarea rows={2} />
            <InputField label="OG Image URL" id="ogImage" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://example.com/image.jpg" type="url" description="Absolute URL to an image. Recommended size: 1200x630px." />
            <InputField label="OG URL" id="ogUrl" value={ogUrl} onChange={(e) => setOgUrl(e.target.value)} placeholder="https://example.com/your-page" type="url" description="The canonical URL of your page." />
            <SelectField
              label="OG Type"
              id="ogType"
              value={ogType}
              onChange={(e) => setOgType(e.target.value)}
              options={[
                { value: 'website', label: 'Website' },
                { value: 'article', label: 'Article' },
                { value: 'book', label: 'Book' },
                { value: 'profile', label: 'Profile' },
                { value: 'video.movie', label: 'Video Movie' },
                { value: 'video.episode', label: 'Video Episode' },
                { value: 'video.tv_show', label: 'Video TV Show' },
                { value: 'video.other', label: 'Video Other' },
              ]}
              description="The type of content you are sharing."
            />
            <InputField label="OG Site Name" id="ogSiteName" value={ogSiteName} onChange={(e) => setOgSiteName(e.target.value)} placeholder="e.g., DevForge" />
            <InputField label="OG Locale" id="ogLocale" value={ogLocale} onChange={(e) => setOgLocale(e.target.value)} placeholder="en_US" />
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 mb-6">
            <h3 className="text-lg font-medium text-slate-200 mb-3">Twitter Card Tags <span className="text-sm text-slate-500">(for Twitter)</span></h3>
            <SelectField
              label="Twitter Card Type"
              id="twitterCard"
              value={twitterCard}
              onChange={(e) => setTwitterCard(e.target.value)}
              options={[
                { value: 'summary', label: 'Summary Card' },
                { value: 'summary_large_image', label: 'Summary Card with Large Image' },
                { value: 'app', label: 'App Card' },
                { value: 'player', label: 'Player Card' },
              ]}
              description="The type of Twitter card to display."
            />
            <InputField label="Twitter Site" id="twitterSite" value={twitterSite} onChange={(e) => setTwitterSite(e.target.value)} placeholder="@yourtwitterhandle" description="The Twitter @username of the website." />
            <InputField label="Twitter Creator" id="twitterCreator" value={twitterCreator} onChange={(e) => setTwitterCreator(e.target.value)} placeholder="@authortwitterhandle" description="The Twitter @username of the content creator." />
            <InputField label="Twitter Title" id="twitterTitle" value={twitterTitle} onChange={(e) => setTwitterTitle(e.target.value)} placeholder="e.g., My Tweetable Article" />
            <InputField label="Twitter Description" id="twitterDescription" value={twitterDescription} onChange={(e) => setTwitterDescription(e.target.value)} placeholder="A description for your tweet." textarea rows={2} />
            <InputField label="Twitter Image URL" id="twitterImage" value={twitterImage} onChange={(e) => setTwitterImage(e.target.value)} placeholder="https://example.com/tweet-image.jpg" type="url" description="Absolute URL to an image. Recommended size: 1200x675px for large image cards." />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition-colors text-sm"
            >
              <RefreshCcw size={16} /> Reset
            </button>
          </div>
        </div>

        {/* Output & Preview Section */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Output & Preview</h2>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 mb-6">
            <h3 className="text-lg font-medium text-slate-200 mb-3">Generated HTML Meta Tags</h3>
            <div className="relative">
              <textarea
                readOnly
                value={generatedHtml}
                rows={15}
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 font-mono text-sm resize-y"
                placeholder="Generated meta tags will appear here..."
              />
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition-colors"
                aria-label="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 mb-6">
            <h3 className="text-lg font-medium text-slate-200 mb-3">Open Graph Preview</h3>
            <SocialCardPreview
              title={previewTitle}
              description={previewDescription}
              imageUrl={previewImageUrl}
              url={previewUrl}
              type="og"
            />
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h3 className="text-lg font-medium text-slate-200 mb-3">Twitter Card Preview</h3>
            <SocialCardPreview
              title={twitterPreviewTitle}
              description={twitterPreviewDescription}
              imageUrl={twitterPreviewImageUrl}
              url={twitterPreviewUrl}
              type="twitter"
            />
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default MetaTagGeneratorPage;