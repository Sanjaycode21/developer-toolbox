"use client";

import { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, RefreshCcw } from 'lucide-react';

export default function MetaTagGeneratorPage() {
  const { addToHistory } = useToolStore();
  const toolSlug = "meta-tag-generator";

  // State for general meta tags
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
  const [charset, setCharset] = useState('UTF-8');
  const [robots, setRobots] = useState('index, follow');

  // State for Open Graph (OG) tags
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [ogType, setOgType] = useState('website');
  const [ogSiteName, setOgSiteName] = useState('');

  // State for Twitter Card tags
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [twitterSite, setTwitterSite] = useState('');
  const [twitterCreator, setTwitterCreator] = useState('');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const generateMetaTags = useCallback(() => {
    const tags: string[] = [];

    // Title Tag (not a meta tag, but essential for the <head> section)
    if (title) {
      tags.push(`<title>${title}</title>`);
    }

    // General Meta Tags
    tags.push(`<meta charset="${charset}" />`);
    if (viewport) tags.push(`<meta name="viewport" content="${viewport}" />`);
    if (description) tags.push(`<meta name="description" content="${description}" />`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}" />`);
    if (author) tags.push(`<meta name="author" content="${author}" />`);
    if (robots) tags.push(`<meta name="robots" content="${robots}" />`);

    // Open Graph Tags
    if (ogTitle) tags.push(`<meta property="og:title" content="${ogTitle}" />`);
    if (ogDescription) tags.push(`<meta property="og:description" content="${ogDescription}" />`);
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}" />`);
    if (ogUrl) tags.push(`<meta property="og:url" content="${ogUrl}" />`);
    if (ogType) tags.push(`<meta property="og:type" content="${ogType}" />`);
    if (ogSiteName) tags.push(`<meta property="og:site_name" content="${ogSiteName}" />`);

    // Twitter Card Tags
    if (twitterCard) tags.push(`<meta name="twitter:card" content="${twitterCard}" />`);
    if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}" />`);
    if (twitterCreator) tags.push(`<meta name="twitter:creator" content="${twitterCreator}" />`);
    // Use specific twitter title/description/image if provided, otherwise fallback to OG
    if (twitterTitle || ogTitle) tags.push(`<meta name="twitter:title" content="${twitterTitle || ogTitle}" />`);
    if (twitterDescription || ogDescription) tags.push(`<meta name="twitter:description" content="${twitterDescription || ogDescription}" />`);
    if (twitterImage || ogImage) tags.push(`<meta name="twitter:image" content="${twitterImage || ogImage}" />`);

    return tags.join('\n');
  }, [title, description, keywords, author, viewport, charset, robots,
      ogTitle, ogDescription, ogImage, ogUrl, ogType, ogSiteName,
      twitterCard, twitterSite, twitterCreator, twitterTitle, twitterDescription, twitterImage]);

  const generatedHtml = generateMetaTags();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHtml)
      .then(() => toast.success('Meta tags copied to clipboard!'))
      .catch(() => toast.error('Failed to copy meta tags.'));
  };

  const resetFields = () => {
    setTitle('');
    setDescription('');
    setKeywords('');
    setAuthor('');
    setViewport('width=device-width, initial-scale=1.0');
    setCharset('UTF-8');
    setRobots('index, follow');
    setOgTitle('');
    setOgDescription('');
    setOgImage('');
    setOgUrl('');
    setOgType('website');
    setOgSiteName('');
    setTwitterCard('summary_large_image');
    setTwitterSite('');
    setTwitterCreator('');
    setTwitterTitle('');
    setTwitterDescription('');
    setTwitterImage('');
    toast.success('All fields reset!');
  };

  // Helper for input components
  const InputField = ({ label, value, onChange, placeholder, type = 'text', className = '' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; className?: string; }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors ${className}`}
      />
    </div>
  );

  const TextareaField = ({ label, value, onChange, placeholder, rows = 3, className = '' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; rows?: number; className?: string; }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors ${className}`}
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options, className = '' }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string; }[]; className?: string; }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 appearance-none focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors pr-8 ${className}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );

  const ogImagePreview = ogImage || 'https://via.placeholder.com/1200x630/1e293b/e2e8f0?text=DevForge+OG+Image';
  const ogTitlePreview = ogTitle || 'Your Page Title Here';
  const ogDescriptionPreview = ogDescription || 'A compelling description of your page content.';
  const ogUrlPreview = ogUrl || 'https://devforge.tools/your-page-slug';
  const ogSiteNamePreview = ogSiteName || 'DevForge';

  const twitterImagePreview = twitterImage || ogImagePreview;
  const twitterTitlePreview = twitterTitle || ogTitlePreview;
  const twitterDescriptionPreview = twitterDescription || ogDescriptionPreview;

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="Meta Tag Generator & OG Preview"
      description="Generate essential meta tags and preview Open Graph (OG) social media cards."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* General Meta Tags */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">General Meta Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Page Title" value={title} onChange={setTitle} placeholder="e.g., My Awesome Page" />
              <InputField label="Author" value={author} onChange={setAuthor} placeholder="e.g., John Doe" />
              <TextareaField label="Description" value={description} onChange={setDescription} placeholder="A brief summary of your page content." />
              <TextareaField label="Keywords (comma-separated)" value={keywords} onChange={setKeywords} placeholder="keyword1, keyword2, keyword3" />
              <InputField label="Viewport" value={viewport} onChange={setViewport} placeholder="width=device-width, initial-scale=1.0" />
              <SelectField
                label="Charset"
                value={charset}
                onChange={setCharset}
                options={[
                  { value: 'UTF-8', label: 'UTF-8' },
                  { value: 'ISO-8859-1', label: 'ISO-8859-1' },
                ]}
              />
              <SelectField
                label="Robots"
                value={robots}
                onChange={setRobots}
                options={[
                  { value: 'index, follow', label: 'index, follow' },
                  { value: 'noindex, nofollow', label: 'noindex, nofollow' },
                  { value: 'index, nofollow', label: 'index, nofollow' },
                  { value: 'noindex, follow', label: 'noindex, follow' },
                ]}
              />
            </div>
          </section>

          {/* Open Graph (OG) Tags */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Open Graph (OG) Tags</h2>
            <p className="text-sm text-slate-400 mb-4">Used by Facebook, LinkedIn, etc.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="OG Title" value={ogTitle} onChange={setOgTitle} placeholder="e.g., My Page for Social Media" />
              <InputField label="OG URL" value={ogUrl} onChange={setOgUrl} placeholder="e.g., https://example.com/my-page" type="url" />
              <TextareaField label="OG Description" value={ogDescription} onChange={setOgDescription} placeholder="A description for social media shares." />
              <InputField label="OG Image URL" value={ogImage} onChange={setOgImage} placeholder="e.g., https://example.com/image.jpg" type="url" />
              <SelectField
                label="OG Type"
                value={ogType}
                onChange={setOgType}
                options={[
                  { value: 'website', label: 'Website' },
                  { value: 'article', label: 'Article' },
                  { value: 'book', label: 'Book' },
                  { value: 'profile', label: 'Profile' },
                ]}
              />
              <InputField label="OG Site Name" value={ogSiteName} onChange={setOgSiteName} placeholder="e.g., My Website" />
            </div>
          </section>

          {/* Twitter Card Tags */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Twitter Card Tags</h2>
            <p className="text-sm text-slate-400 mb-4">Used by Twitter. Falls back to OG if not specified.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Twitter Card Type"
                value={twitterCard}
                onChange={setTwitterCard}
                options={[
                  { value: 'summary', label: 'Summary Card' },
                  { value: 'summary_large_image', label: 'Summary Card with Large Image' },
                  // { value: 'app', label: 'App Card' }, // More complex, omitting for now
                  // { value: 'player', label: 'Player Card' }, // More complex, omitting for now
                ]}
              />
              <InputField label="Twitter Site (@handle)" value={twitterSite} onChange={setTwitterSite} placeholder="e.g., @yourwebsite" />
              <InputField label="Twitter Creator (@handle)" value={twitterCreator} onChange={setTwitterCreator} placeholder="e.g., @yourprofile" />
              <InputField label="Twitter Title (optional)" value={twitterTitle} onChange={setTwitterTitle} placeholder="Overrides OG Title on Twitter" />
              <TextareaField label="Twitter Description (optional)" value={twitterDescription} onChange={setTwitterDescription} placeholder="Overrides OG Description on Twitter" />
              <InputField label="Twitter Image URL (optional)" value={twitterImage} onChange={setTwitterImage} placeholder="Overrides OG Image on Twitter" type="url" />
            </div>
          </section>
        </div>

        {/* Output & Preview Section */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Generated HTML Output */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg flex-1">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Generated Meta Tags</h2>
            <div className="relative">
              <textarea
                readOnly
                value={generatedHtml}
                rows={15}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-sm font-mono text-slate-200 resize-none focus:outline-none"
                placeholder="Generated meta tags will appear here..."
              />
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-slate-100 transition-colors"
                aria-label="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
            </div>
            <button
              onClick={resetFields}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-md text-sm font-medium transition-colors"
            >
              <RefreshCcw size={16} /> Reset All Fields
            </button>
          </section>

          {/* OG Preview */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Social Media Preview</h2>
            <div className="flex flex-col gap-4">
              {/* Facebook/LinkedIn Preview */}
              <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                <div className="p-3 text-sm text-slate-400 border-b border-slate-700">Facebook/LinkedIn Preview</div>
                <div className="flex flex-col">
                  <img src={ogImagePreview} alt="OG Image Preview" className="w-full h-auto object-cover max-h-60 bg-slate-700" />
                  <div className="p-4">
                    <p className="text-xs text-slate-400 uppercase mb-1">{ogUrlPreview.split('/')[2]}</p>
                    <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">{ogTitlePreview}</h3>
                    <p className="text-sm text-slate-300 line-clamp-3">{ogDescriptionPreview}</p>
                  </div>
                </div>
              </div>

              {/* Twitter Preview (Summary Card with Large Image) */}
              {twitterCard === 'summary_large_image' && (
                <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                  <div className="p-3 text-sm text-slate-400 border-b border-slate-700">Twitter Preview (Large Image)</div>
                  <div className="flex flex-col">
                    <img src={twitterImagePreview} alt="Twitter Image Preview" className="w-full h-auto object-cover max-h-60 bg-slate-700" />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">{twitterTitlePreview}</h3>
                      <p className="text-sm text-slate-300 line-clamp-3">{twitterDescriptionPreview}</p>
                      <p className="text-xs text-slate-400 mt-2">{twitterSite || ogSiteNamePreview}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Twitter Preview (Summary Card) */}
              {twitterCard === 'summary' && (
                <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                  <div className="p-3 text-sm text-slate-400 border-b border-slate-700">Twitter Preview (Summary)</div>
                  <div className="flex p-4 gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">{twitterTitlePreview}</h3>
                      <p className="text-sm text-slate-300 line-clamp-3">{twitterDescriptionPreview}</p>
                      <p className="text-xs text-slate-400 mt-2">{twitterSite || ogSiteNamePreview}</p>
                    </div>
                    <div className="w-24 h-24 flex-shrink-0">
                      <img src={twitterImagePreview} alt="Twitter Image Preview" className="w-full h-full object-cover rounded-md bg-slate-700" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </ToolPageWrapper>
  );
}