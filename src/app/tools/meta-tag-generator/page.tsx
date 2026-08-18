"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, Code } from 'lucide-react';

interface MetaTags {
  title: string;
  description: string;
  keywords: string;
  author: string;
  charset: string;
  viewport: string;
  robotsIndex: 'index' | 'noindex';
  robotsFollow: 'follow' | 'nofollow';
  refreshContent: string;
}

interface OpenGraphTags {
  ogTitle: string;
  ogType: string;
  ogUrl: string;
  ogDescription: string;
  ogImage: string;
  ogSiteName: string;
  ogLocale: string;
}

interface TwitterCardTags {
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite: string;
  twitterCreator: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium text-slate-300">
      {label}
    </label>
    <input
      id={id}
      className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 transition-colors"
      {...props}
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, id, options, ...props }) => (
  <div className="flex flex-col gap-1 relative">
    <label htmlFor={id} className="text-sm font-medium text-slate-300">
      {label}
    </label>
    <select
      id={id}
      className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-md px-3 py-2 text-sm text-slate-100 transition-colors appearance-none pr-8"
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 mt-6">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, ...props }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium text-slate-300">
      {label}
    </label>
    <textarea
      id={id}
      className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 transition-colors min-h-[80px]"
      {...props}
    />
  </div>
);

const OGPreview: React.FC<{ og: OpenGraphTags }> = ({ og }) => {
  const displayTitle = og.ogTitle || "Your Website Title";
  const displayDescription = og.ogDescription || "A short description of your website or content.";
  const displayUrl = og.ogUrl || "https://example.com";
  const displayImage = og.ogImage || "https://via.placeholder.com/1200x630?text=Open+Graph+Image";

  let hostname = "example.com";
  try {
    hostname = new URL(displayUrl).hostname;
  } catch (error) {
    // Fallback to default if URL is invalid
  }

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700 max-w-md mx-auto">
      {og.ogImage && (
        <div className="h-48 bg-slate-700 flex items-center justify-center overflow-hidden">
          <img src={displayImage} alt="Open Graph Preview" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <p className="text-xs text-slate-400 mb-1">{hostname}</p>
        <h3 className="text-lg font-semibold text-slate-50 mb-2 line-clamp-2">{displayTitle}</h3>
        <p className="text-sm text-slate-300 line-clamp-3">{displayDescription}</p>
      </div>
    </div>
  );
};

const MetaTagGeneratorPage: React.FC = () => {
  const toolSlug = "meta-tag-generator";
  const { addToHistory } = useToolStore();

  const [meta, setMeta] = useState<MetaTags>({
    title: '',
    description: '',
    keywords: '',
    author: '',
    charset: 'UTF-8',
    viewport: 'width=device-width, initial-scale=1.0',
    robotsIndex: 'index',
    robotsFollow: 'follow',
    refreshContent: '',
  });

  const [og, setOg] = useState<OpenGraphTags>({
    ogTitle: '',
    ogType: 'website',
    ogUrl: '',
    ogDescription: '',
    ogImage: '',
    ogSiteName: '',
    ogLocale: 'en_US',
  });

  const [twitter, setTwitter] = useState<TwitterCardTags>({
    twitterCard: 'summary_large_image',
    twitterSite: '',
    twitterCreator: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
  });

  const [generatedHtml, setGeneratedHtml] = useState('');

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const generateMetaHtml = useCallback(() => {
    let html = '';

    // Title Tag (not a meta tag, but crucial)
    if (meta.title) html += `<title>${meta.title}</title>\n`;

    // Standard Meta Tags
    html += `<meta charset="${meta.charset}" />\n`;
    html += `<meta name="viewport" content="${meta.viewport}" />\n`;
    if (meta.description) html += `<meta name="description" content="${meta.description}" />\n`;
    if (meta.keywords) html += `<meta name="keywords" content="${meta.keywords}" />\n`;
    if (meta.author) html += `<meta name="author" content="${meta.author}" />\n`;
    html += `<meta name="robots" content="${meta.robotsIndex}, ${meta.robotsFollow}" />\n`;
    if (meta.refreshContent) html += `<meta http-equiv="refresh" content="${meta.refreshContent}" />\n`;

    // Open Graph Tags
    if (og.ogTitle) html += `<meta property="og:title" content="${og.ogTitle}" />\n`;
    if (og.ogType) html += `<meta property="og:type" content="${og.ogType}" />\n`;
    if (og.ogUrl) html += `<meta property="og:url" content="${og.ogUrl}" />\n`;
    if (og.ogDescription) html += `<meta property="og:description" content="${og.ogDescription}" />\n`;
    if (og.ogImage) html += `<meta property="og:image" content="${og.ogImage}" />\n`;
    if (og.ogSiteName) html += `<meta property="og:site_name" content="${og.ogSiteName}" />\n`;
    if (og.ogLocale) html += `<meta property="og:locale" content="${og.ogLocale}" />\n`;

    // Twitter Card Tags
    if (twitter.twitterCard) html += `<meta name="twitter:card" content="${twitter.twitterCard}" />\n`;
    if (twitter.twitterSite) html += `<meta name="twitter:site" content="${twitter.twitterSite}" />\n`;
    if (twitter.twitterCreator) html += `<meta name="twitter:creator" content="${twitter.twitterCreator}" />\n`;
    if (twitter.twitterTitle) html += `<meta name="twitter:title" content="${twitter.twitterTitle}" />\n`;
    if (twitter.twitterDescription) html += `<meta name="twitter:description" content="${twitter.twitterDescription}" />\n`;
    if (twitter.twitterImage) html += `<meta name="twitter:image" content="${twitter.twitterImage}" />\n`;

    setGeneratedHtml(html.trim());
  }, [meta, og, twitter]);

  useEffect(() => {
    generateMetaHtml();
  }, [generateMetaHtml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml);
    toast.success("Meta tags copied to clipboard!");
  };

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="Meta Tag Generator & OG Preview"
      description="Generate essential meta tags and preview Open Graph content for SEO and social media."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col gap-6">
          {/* General Meta Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">General Meta Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title" id="title" value={meta.title} onChange={e => setMeta(prev => ({ ...prev, title: e.target.value }))} placeholder="Your Website Title" />
              <Input label="Author" id="author" value={meta.author} onChange={e => setMeta(prev => ({ ...prev, author: e.target.value }))} placeholder="Author Name" />
              <Textarea label="Description" id="description" value={meta.description} onChange={e => setMeta(prev => ({ ...prev, description: e.target.value }))} placeholder="A brief description of your page content." />
              <Textarea label="Keywords" id="keywords" value={meta.keywords} onChange={e => setMeta(prev => ({ ...prev, keywords: e.target.value }))} placeholder="keyword1, keyword2, keyword3" />
              <Input label="Charset" id="charset" value={meta.charset} onChange={e => setMeta(prev => ({ ...prev, charset: e.target.value }))} />
              <Input label="Viewport" id="viewport" value={meta.viewport} onChange={e => setMeta(prev => ({ ...prev, viewport: e.target.value }))} />
              <Select label="Robots Index" id="robotsIndex" value={meta.robotsIndex} onChange={e => setMeta(prev => ({ ...prev, robotsIndex: e.target.value as 'index' | 'noindex' }))} options={[{ value: 'index', label: 'Index' }, { value: 'noindex', label: 'No Index' }]} />
              <Select label="Robots Follow" id="robotsFollow" value={meta.robotsFollow} onChange={e => setMeta(prev => ({ ...prev, robotsFollow: e.target.value as 'follow' | 'nofollow' }))} options={[{ value: 'follow', label: 'Follow' }, { value: 'nofollow', label: 'No Follow' }]} />
              <Input label="Refresh Content (e.g., 5;url=...)" id="refreshContent" value={meta.refreshContent} onChange={e => setMeta(prev => ({ ...prev, refreshContent: e.target.value }))} placeholder="e.g., 5;url=https://example.com" />
            </div>
          </div>

          {/* Open Graph Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Open Graph Tags (Facebook, LinkedIn, etc.)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="OG Title" id="ogTitle" value={og.ogTitle} onChange={e => setOg(prev => ({ ...prev, ogTitle: e.target.value }))} placeholder="Open Graph Title" />
              <Select label="OG Type" id="ogType" value={og.ogType} onChange={e => setOg(prev => ({ ...prev, ogType: e.target.value }))} options={[
                { value: 'website', label: 'Website' }, { value: 'article', label: 'Article' }, { value: 'book', label: 'Book' },
                { value: 'profile', label: 'Profile' }, { value: 'video.movie', label: 'Video Movie' }, { value: 'video.episode', label: 'Video Episode' },
                { value: 'video.tv_show', label: 'Video TV Show' }, { value: 'video.other', label: 'Video Other' }, { value: 'music.song', label: 'Music Song' },
                { value: 'music.album', label: 'Music Album' }, { value: 'music.playlist', label: 'Music Playlist' }, { value: 'music.radio_station', label: 'Music Radio Station' }
              ]} />
              <Input label="OG URL" id="ogUrl" value={og.ogUrl} onChange={e => setOg(prev => ({ ...prev, ogUrl: e.target.value }))} placeholder="https://example.com/page" />
              <Input label="OG Image URL" id="ogImage" value={og.ogImage} onChange={e => setOg(prev => ({ ...prev, ogImage: e.target.value }))} placeholder="https://example.com/image.jpg" />
              <Textarea label="OG Description" id="ogDescription" value={og.ogDescription} onChange={e => setOg(prev => ({ ...prev, ogDescription: e.target.value }))} placeholder="A short description for social media." />
              <Input label="OG Site Name" id="ogSiteName" value={og.ogSiteName} onChange={e => setOg(prev => ({ ...prev, ogSiteName: e.target.value }))} placeholder="Your Site Name" />
              <Input label="OG Locale" id="ogLocale" value={og.ogLocale} onChange={e => setOg(prev => ({ ...prev, ogLocale: e.target.value }))} placeholder="en_US" />
            </div>
          </div>

          {/* Twitter Card Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Twitter Card Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Twitter Card Type" id="twitterCard" value={twitter.twitterCard} onChange={e => setTwitter(prev => ({ ...prev, twitterCard: e.target.value as TwitterCardTags['twitterCard'] }))} options={[
                { value: 'summary', label: 'Summary Card' }, { value: 'summary_large_image', label: 'Summary Card with Large Image' },
                { value: 'app', label: 'App Card' }, { value: 'player', label: 'Player Card' }
              ]} />
              <Input label="Twitter Site (@username)" id="twitterSite" value={twitter.twitterSite} onChange={e => setTwitter(prev => ({ ...prev, twitterSite: e.target.value }))} placeholder="@yourtwitterhandle" />
              <Input label="Twitter Creator (@username)" id="twitterCreator" value={twitter.twitterCreator} onChange={e => setTwitter(prev => ({ ...prev, twitterCreator: e.target.value }))} placeholder="@creatorhandle" />
              <Input label="Twitter Title" id="twitterTitle" value={twitter.twitterTitle} onChange={e => setTwitter(prev => ({ ...prev, twitterTitle: e.target.value }))} placeholder="Twitter Card Title" />
              <Input label="Twitter Image URL" id="twitterImage" value={twitter.twitterImage} onChange={e => setTwitter(prev => ({ ...prev, twitterImage: e.target.value }))} placeholder="https://example.com/twitter-image.jpg" />
              <Textarea label="Twitter Description" id="twitterDescription" value={twitter.twitterDescription} onChange={e => setTwitter(prev => ({ ...prev, twitterDescription: e.target.value }))} placeholder="A short description for Twitter." />
            </div>
          </div>
        </div>

        {/* Output & Preview Section */}
        <div className="flex flex-col gap-6">
          {/* Generated HTML */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Generated HTML</h2>
            <div className="relative">
              <textarea
                readOnly
                value={generatedHtml}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-4 font-mono text-sm text-slate-200 min-h-[300px] resize-y focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors"
                title="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          {/* Open Graph Preview */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Open Graph Preview</h2>
            <OGPreview og={og} />
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default MetaTagGeneratorPage;