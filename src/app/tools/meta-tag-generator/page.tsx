"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, RefreshCcw } from 'lucide-react';

const MetaTagGeneratorPage: React.FC = () => {
  const toolSlug = "meta-tag-generator";
  const { addToHistory } = useToolStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [ogType, setOgType] = useState('website');
  const [twitterCard, setTwitterCard] = useState('summary');
  const [twitterSite, setTwitterSite] = useState('');
  const [twitterCreator, setTwitterCreator] = useState('');
  const [favicon, setFavicon] = useState('');
  const [canonical, setCanonical] = useState('');
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);
  const [lang, setLang] = useState('en');
  const [themeColor, setThemeColor] = useState('');

  const [generatedMetaTags, setGeneratedMetaTags] = useState('');

  // Use ogTitle and ogDescription for Twitter and OG if not explicitly set
  const ogTitle = title || '';
  const ogDescription = description || '';

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
    if (themeColor) tags.push(`<meta name="theme-color" content="${themeColor}" />`);

    // Robots
    const robotsContent = `${robotsIndex ? 'index' : 'noindex'},${robotsFollow ? 'follow' : 'nofollow'}`;
    tags.push(`<meta name="robots" content="${robotsContent}" />`);

    // Canonical
    if (canonical) tags.push(`<link rel="canonical" href="${canonical}" />`);

    // Favicon
    if (favicon) tags.push(`<link rel="icon" href="${favicon}" />`);

    // Open Graph Tags
    if (ogTitle) tags.push(`<meta property="og:title" content="${ogTitle}" />`);
    if (ogDescription) tags.push(`<meta property="og:description" content="${ogDescription}" />`);
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}" />`);
    if (ogUrl) tags.push(`<meta property="og:url" content="${ogUrl}" />`);
    if (ogType) tags.push(`<meta property="og:type" content="${ogType}" />`);
    if (lang) tags.push(`<meta property="og:locale" content="${lang}" />`);

    // Twitter Card Tags
    if (twitterCard) tags.push(`<meta name="twitter:card" content="${twitterCard}" />`);
    if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}" />`);
    if (twitterCreator) tags.push(`<meta name="twitter:creator" content="${twitterCreator}" />`);
    if (ogTitle) tags.push(`<meta name="twitter:title" content="${ogTitle}" />`);
    if (ogDescription) tags.push(`<meta name="twitter:description" content="${ogDescription}" />`);
    if (ogImage) tags.push(`<meta name="twitter:image" content="${ogImage}" />`);


    setGeneratedMetaTags(tags.filter(Boolean).join('\n'));
  }, [
    title, description, keywords, author, ogImage, ogUrl, ogType,
    twitterCard, twitterSite, twitterCreator, favicon, canonical,
    robotsIndex, robotsFollow, lang, themeColor, ogTitle, ogDescription
  ]);

  useEffect(() => {
    generateMetaTags();
  }, [generateMetaTags]);

  const handleCopy = () => {
    if (generatedMetaTags) {
      navigator.clipboard.writeText(generatedMetaTags);
      toast.success('Meta tags copied to clipboard!');
    } else {
      toast.error('No meta tags to copy.');
    }
  };

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setKeywords('');
    setAuthor('');
    setOgImage('');
    setOgUrl('');
    setOgType('website');
    setTwitterCard('summary');
    setTwitterSite('');
    setTwitterCreator('');
    setFavicon('');
    setCanonical('');
    setRobotsIndex(true);
    setRobotsFollow(true);
    setLang('en');
    setThemeColor('');
    toast.success('All fields cleared!');
  };

  const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    placeholder?: string;
    type?: string;
    textarea?: boolean;
    selectOptions?: { value: string; label: string }[];
  }> = ({ label, value, onChange, placeholder, type = 'text', textarea = false, selectOptions }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      {textarea ? (
        <textarea
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
        />
      ) : selectOptions ? (
        <div className="relative">
          <select
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-50 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors appearance-none pr-8"
            value={value}
            onChange={onChange}
          >
            {selectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      ) : (
        <input
          type={type}
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );

  const CheckboxField: React.FC<{
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }> = ({ label, checked, onChange }) => (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
        checked={checked}
        onChange={onChange}
      />
      <label className="text-sm text-slate-300">{label}</label>
    </div>
  );

  const OgPreviewCard: React.FC<{
    title: string;
    description: string;
    imageUrl: string;
    url: string;
  }> = ({ title, description, imageUrl, url }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg max-w-md w-full">
      {imageUrl && (
        <div className="h-48 bg-slate-700 flex items-center justify-center overflow-hidden">
          <img src={imageUrl} alt="Open Graph Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found')} />
        </div>
      )}
      <div className="p-4">
        <div className="text-xs text-slate-400 mb-1">{new URL(url || 'https://example.com').hostname}</div>
        <h3 className="text-lg font-semibold text-slate-50 mb-1 line-clamp-2">{title || 'Your Page Title'}</h3>
        <p className="text-sm text-slate-300 line-clamp-3">{description || 'A short description of your page content.'}</p>
      </div>
    </div>
  );

  const TwitterPreviewCard: React.FC<{
    title: string;
    description: string;
    imageUrl: string;
    site: string;
    cardType: string;
  }> = ({ title, description, imageUrl, site, cardType }) => {
    const displayImage = (cardType === 'summary_large_image' || cardType === 'summary') && imageUrl ? imageUrl : '';
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg max-w-md w-full">
        {displayImage && (
          <div className="h-48 bg-slate-700 flex items-center justify-center overflow-hidden">
            <img src={displayImage} alt="Twitter Card Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found')} />
          </div>
        )}
        <div className="p-4">
          <div className="text-xs text-slate-400 mb-1">{site || '@yourwebsite'}</div>
          <h3 className="text-lg font-semibold text-slate-50 mb-1 line-clamp-2">{title || 'Your Page Title'}</h3>
          <p className="text-sm text-slate-300 line-clamp-3">{description || 'A short description of your page content.'}</p>
        </div>
      </div>
    );
  };


  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="Meta Tag Generator & OG Preview"
      description="Generate essential meta tags for SEO and social media, and preview how your content will appear."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-slate-200">Meta Tag Inputs</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Page Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., My Awesome Page" />
            <InputField label="Author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g., John Doe" />
            <InputField label="Keywords (comma-separated)" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., seo, meta, generator" />
            <InputField label="Canonical URL" value={canonical} onChange={(e) => setCanonical(e.target.value)} placeholder="e.g., https://example.com/page" type="url" />
            <InputField label="Favicon URL" value={favicon} onChange={(e) => setFavicon(e.target.value)} placeholder="e.g., https://example.com/favicon.ico" type="url" />
            <InputField label="Language (e.g., en, es)" value={lang} onChange={(e) => setLang(e.target.value)} placeholder="e.g., en" />
            <InputField label="Theme Color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} placeholder="e.g., #4F46E5" type="color" />
          </div>

          <InputField label="Page Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief summary of your page content." textarea />

          <div className="flex flex-col gap-4 p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <h3 className="text-lg font-medium text-slate-200">Open Graph (Social Media)</h3>
            <InputField label="OG Title" value={ogTitle} onChange={(e) => setTitle(e.target.value)} placeholder="Defaults to Page Title" />
            <InputField label="OG Description" value={ogDescription} onChange={(e) => setDescription(e.target.value)} placeholder="Defaults to Page Description" textarea />
            <InputField label="OG Image URL" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="e.g., https://example.com/image.jpg" type="url" />
            <InputField label="OG URL" value={ogUrl} onChange={(e) => setOgUrl(e.target.value)} placeholder="e.g., https://example.com/page" type="url" />
            <InputField
              label="OG Type"
              value={ogType}
              onChange={(e) => setOgType(e.target.value)}
              selectOptions={[
                { value: 'website', label: 'Website' },
                { value: 'article', label: 'Article' },
                { value: 'book', label: 'Book' },
                { value: 'profile', label: 'Profile' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-4 p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <h3 className="text-lg font-medium text-slate-200">Twitter Card</h3>
            <InputField
              label="Twitter Card Type"
              value={twitterCard}
              onChange={(e) => setTwitterCard(e.target.value)}
              selectOptions={[
                { value: 'summary', label: 'Summary Card' },
                { value: 'summary_large_image', label: 'Summary Card with Large Image' },
                // { value: 'app', label: 'App Card' }, // Not implementing preview for these complex types
                // { value: 'player', label: 'Player Card' },
              ]}
            />
            <InputField label="Twitter Site (@username)" value={twitterSite} onChange={(e) => setTwitterSite(e.target.value)} placeholder="e.g., @devforge" />
            <InputField label="Twitter Creator (@username)" value={twitterCreator} onChange={(e) => setTwitterCreator(e.target.value)} placeholder="e.g., @yourhandle" />
          </div>

          <div className="flex flex-col gap-2 p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <h3 className="text-lg font-medium text-slate-200">Robots</h3>
            <CheckboxField label="Index Page" checked={robotsIndex} onChange={(e) => setRobotsIndex(e.target.checked)} />
            <CheckboxField label="Follow Links" checked={robotsFollow} onChange={(e) => setRobotsFollow(e.target.checked)} />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors shadow-md"
            >
              <Copy size={18} /> Copy Tags
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-md transition-colors shadow-md"
            >
              <RefreshCcw size={18} /> Clear All
            </button>
          </div>
        </div>

        {/* Output & Preview Section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-slate-200">Generated Meta Tags & Preview</h2>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium text-slate-200">Open Graph Preview</h3>
            <OgPreviewCard
              title={ogTitle}
              description={ogDescription}
              imageUrl={ogImage}
              url={ogUrl || 'https://example.com'}
            />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium text-slate-200">Twitter Card Preview</h3>
            <TwitterPreviewCard
              title={ogTitle}
              description={ogDescription}
              imageUrl={ogImage}
              site={twitterSite}
              cardType={twitterCard}
            />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium text-slate-200">Generated HTML</h3>
            <textarea
              readOnly
              value={generatedMetaTags}
              className="w-full h-96 bg-slate-800 border border-slate-700 rounded-md p-4 text-sm text-slate-50 font-mono resize-y focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors"
              placeholder="Generated meta tags will appear here..."
            />
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default MetaTagGeneratorPage;