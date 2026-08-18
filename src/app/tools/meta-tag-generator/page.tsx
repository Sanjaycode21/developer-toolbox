"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';
import { useToolStore } from '@/store/useToolStore';

const MetaTagGeneratorPage: React.FC = () => {
  const addToHistory = useToolStore((state) => state.addToHistory);

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
  const [refreshDelay, setRefreshDelay] = useState(5);

  // Open Graph Tags
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [ogType, setOgType] = useState('website');
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
    let tags = [];

    // Basic Meta Tags
    if (charset) tags.push(`<meta charset="${charset}" />`);
    if (viewport) tags.push(`<meta name="viewport" content="${viewport}" />`);
    if (title) tags.push(`<title>${title}</title>`); // Title is not a meta tag, but usually included in the head
    if (description) tags.push(`<meta name="description" content="${description}" />`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}" />`);
    if (author) tags.push(`<meta name="author" content="${author}" />`);

    let robotsContent = [];
    if (robotsIndex) robotsContent.push('index');
    else robotsContent.push('noindex');
    if (robotsFollow) robotsContent.push('follow');
    else robotsContent.push('nofollow');
    tags.push(`<meta name="robots" content="${robotsContent.join(', ')}" />`);

    if (refreshEnabled && refreshDelay > 0) {
      tags.push(`<meta http-equiv="refresh" content="${refreshDelay}" />`);
    }

    // Open Graph Tags
    if (ogTitle) tags.push(`<meta property="og:title" content="${ogTitle}" />`);
    if (ogDescription) tags.push(`<meta property="og:description" content="${ogDescription}" />`);
    if (ogUrl) tags.push(`<meta property="og:url" content="${ogUrl}" />`);
    if (ogType) tags.push(`<meta property="og:type" content="${ogType}" />`);
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}" />`);
    if (ogSiteName) tags.push(`<meta property="og:site_name" content="${ogSiteName}" />`);
    if (ogLocale) tags.push(`<meta property="og:locale" content="${ogLocale}" />`);

    // Twitter Card Tags
    if (twitterCard) tags.push(`<meta name="twitter:card" content="${twitterCard}" />`);
    if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}" />`);
    if (twitterCreator) tags.push(`<meta name="twitter:creator" content="${twitterCreator}" />`);
    // Fallback for Twitter tags if not explicitly set
    const finalTwitterTitle = twitterTitle || ogTitle || title;
    if (finalTwitterTitle) tags.push(`<meta name="twitter:title" content="${finalTwitterTitle}" />`);
    const finalTwitterDescription = twitterDescription || ogDescription || description;
    if (finalTwitterDescription) tags.push(`<meta name="twitter:description" content="${finalTwitterDescription}" />`);
    const finalTwitterImage = twitterImage || ogImage;
    if (finalTwitterImage) tags.push(`<meta name="twitter:image" content="${finalTwitterImage}" />`);

    return tags.join('\n');
  }, [
    title, description, keywords, author, robotsIndex, robotsFollow, charset, viewport, refreshEnabled, refreshDelay,
    ogTitle, ogDescription, ogUrl, ogType, ogImage, ogSiteName, ogLocale,
    twitterCard, twitterSite, twitterCreator, twitterTitle, twitterDescription, twitterImage
  ]);

  const [generatedHtml, setGeneratedHtml] = useState('');

  useEffect(() => {
    setGeneratedHtml(generateMetaTags());
  }, [generateMetaTags]);

  useEffect(() => {
    addToHistory('meta-tag-generator');
  }, [addToHistory]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml);
    toast.success('Meta tags copied to clipboard!');
  };

  const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; placeholder?: string; type?: string; className?: string }> = ({ label, value, onChange, placeholder, type = 'text', className }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className={`w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${className}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${className}`}
        />
      )}
    </div>
  );

  const SelectField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[]; className?: string }> = ({ label, value, onChange, options, className }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none pr-8 ${className}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );

  const CheckboxField: React.FC<{ label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; className?: string }> = ({ label, checked, onChange, className }) => (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`h-4 w-4 text-indigo-600 bg-slate-800 border-slate-700 rounded focus:ring-indigo-500 ${className}`}
      />
      <label className="text-sm font-medium text-slate-300">{label}</label>
    </div>
  );

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-semibold text-slate-200 mb-4 border-b border-slate-700 pb-2">{children}</h3>
  );

  const renderPreviewCard = (
    image: string,
    titleText: string,
    descriptionText: string,
    urlText: string,
    type: 'facebook' | 'twitter'
  ) => {
    const defaultImage = type === 'facebook' ? 'https://via.placeholder.com/1200x630/1e293b/e2e8f0?text=OpenGraph+Image' : 'https://via.placeholder.com/800x418/1e293b/e2e8f0?text=Twitter+Image';
    const displayImage = image || defaultImage;
    const displayTitle = titleText || `Your ${type} Title Here`;
    const displayDescription = descriptionText || `This is a preview of your ${type} description.`;
    const displayUrl = urlText || 'https://yourwebsite.com';

    let hostname = '';
    try {
      hostname = new URL(displayUrl).hostname;
    } catch (error) {
      hostname = 'yourwebsite.com'; // Fallback for invalid URLs
    }

    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg">
        <img src={displayImage} alt="Preview" className="w-full object-cover" style={{ aspectRatio: type === 'facebook' ? '1.91/1' : '2/1' }} />
        <div className="p-4">
          <p className="text-xs text-slate-400 mb-1">{hostname}</p>
          <h4 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">{displayTitle}</h4>
          <p className="text-sm text-slate-300 line-clamp-2">{displayDescription}</p>
        </div>
      </div>
    );
  };


  return (
    <ToolPageWrapper
      toolSlug="meta-tag-generator"
      toolName="Meta Tag Generator & OG Preview"
      description="Generate essential meta tags for SEO and social media, including Open Graph and Twitter cards, with live previews."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col gap-8">
          {/* Basic Meta Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-md">
            <SectionTitle>Basic Meta Tags</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Page Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., My Awesome Website" />
              <InputField label="Author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g., John Doe" />
              <div className="md:col-span-2">
                <InputField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief summary of your page content." type="textarea" />
              </div>
              <div className="md:col-span-2">
                <InputField label="Keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="comma, separated, keywords" />
              </div>
              <InputField label="Charset" value={charset} onChange={(e) => setCharset(e.target.value)} />
              <InputField label="Viewport" value={viewport} onChange={(e) => setViewport(e.target.value)} />
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-300">Robots</label>
                <div className="flex gap-4">
                  <CheckboxField label="Index" checked={robotsIndex} onChange={(e) => setRobotsIndex(e.target.checked)} />
                  <CheckboxField label="Follow" checked={robotsFollow} onChange={(e) => setRobotsFollow(e.target.checked)} />
                </div>
              </div>
              <div className="flex items-center gap-4 md:col-span-2">
                <CheckboxField label="Enable Refresh" checked={refreshEnabled} onChange={(e) => setRefreshEnabled(e.target.checked)} />
                {refreshEnabled && (
                  <InputField label="Refresh Delay (seconds)" value={String(refreshDelay)} onChange={(e) => setRefreshDelay(Number(e.target.value))} type="number" className="w-32" />
                )}
              </div>
            </div>
          </div>

          {/* Open Graph Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-md">
            <SectionTitle>Open Graph Tags (Facebook, LinkedIn, etc.)</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="OG Title" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder="e.g., My Page for Social Media" />
              <InputField label="OG URL" value={ogUrl} onChange={(e) => setOgUrl(e.target.value)} placeholder="e.g., https://example.com/page" type="url" />
              <div className="md:col-span-2">
                <InputField label="OG Description" value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} placeholder="A description for social media shares." type="textarea" />
              </div>
              <InputField label="OG Image URL" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="e.g., https://example.com/image.jpg" type="url" />
              <SelectField
                label="OG Type"
                value={ogType}
                onChange={(e) => setOgType(e.target.value)}
                options={[
                  { value: 'website', label: 'Website' },
                  { value: 'article', label: 'Article' },
                  { value: 'book', label: 'Book' },
                  { value: 'profile', label: 'Profile' },
                  { value: 'video.movie', label: 'Video: Movie' },
                  { value: 'video.episode', label: 'Video: Episode' },
                  { value: 'video.tv_show', label: 'Video: TV Show' },
                  { value: 'music.song', label: 'Music: Song' },
                  { value: 'music.album', label: 'Music: Album' },
                ]}
              />
              <InputField label="OG Site Name" value={ogSiteName} onChange={(e) => setOgSiteName(e.target.value)} placeholder="e.g., My Company" />
              <InputField label="OG Locale" value={ogLocale} onChange={(e) => setOgLocale(e.target.value)} placeholder="e.g., en_US" />
            </div>
          </div>

          {/* Twitter Card Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-md">
            <SectionTitle>Twitter Card Tags</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Twitter Card Type"
                value={twitterCard}
                onChange={(e) => setTwitterCard(e.target.value)}
                options={[
                  { value: 'summary', label: 'Summary Card' },
                  { value: 'summary_large_image', label: 'Summary Card with Large Image' },
                  { value: 'app', label: 'App Card' },
                  { value: 'player', label: 'Player Card' },
                ]}
              />
              <InputField label="Twitter Site (@username)" value={twitterSite} onChange={(e) => setTwitterSite(e.target.value)} placeholder="e.g., @yourcompany" />
              <InputField label="Twitter Creator (@username)" value={twitterCreator} onChange={(e) => setTwitterCreator(e.target.value)} placeholder="e.g., @yourprofile" />
              <InputField label="Twitter Title" value={twitterTitle} onChange={(e) => setTwitterTitle(e.target.value)} placeholder="Defaults to OG Title" />
              <InputField label="Twitter Image URL" value={twitterImage} onChange={(e) => setTwitterImage(e.target.value)} placeholder="Defaults to OG Image" type="url" />
              <div className="md:col-span-2">
                <InputField label="Twitter Description" value={twitterDescription} onChange={(e) => setTwitterDescription(e.target.value)} placeholder="Defaults to OG Description" type="textarea" />
              </div>
            </div>
          </div>
        </div>

        {/* Output and Preview Section */}
        <div className="flex flex-col gap-8">
          {/* Generated HTML */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-md">
            <SectionTitle>Generated Meta Tags</SectionTitle>
            <textarea
              value={generatedHtml}
              readOnly
              rows={15}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-4 text-slate-200 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleCopy}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Copy to Clipboard
            </button>
          </div>

          {/* OG & Twitter Card Preview */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-md">
            <SectionTitle>Social Media Card Previews</SectionTitle>
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-md font-semibold text-slate-200 mb-3">Facebook / LinkedIn Preview (Open Graph)</h4>
                {renderPreviewCard(
                  ogImage,
                  ogTitle || title,
                  ogDescription || description,
                  ogUrl,
                  'facebook'
                )}
              </div>
              <div>
                <h4 className="text-md font-semibold text-slate-200 mb-3">Twitter Preview</h4>
                {renderPreviewCard(
                  twitterImage || ogImage,
                  twitterTitle || ogTitle || title,
                  twitterDescription || ogDescription || description,
                  ogUrl, // Twitter card often uses the same URL as OG
                  'twitter'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default MetaTagGeneratorPage;