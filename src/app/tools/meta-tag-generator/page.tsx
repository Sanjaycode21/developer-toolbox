"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, RefreshCcw } from 'lucide-react';

interface MetaState {
  title: string;
  description: string;
  keywords: string;
  author: string;
  robotsIndex: 'index' | 'noindex';
  robotsFollow: 'follow' | 'nofollow';
  charset: string;
  viewport: string;
  refreshDelay: number | '';
  refreshUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogUrl: string;
  ogImage: string;
  ogSiteName: string;
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite: string;
  twitterCreator: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

const initialMetaState: MetaState = {
  title: '',
  description: '',
  keywords: '',
  author: '',
  robotsIndex: 'index',
  robotsFollow: 'follow',
  charset: 'UTF-8',
  viewport: 'width=device-width, initial-scale=1.0',
  refreshDelay: '',
  refreshUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogType: 'website',
  ogUrl: '',
  ogImage: '',
  ogSiteName: '',
  twitterCard: 'summary',
  twitterSite: '',
  twitterCreator: '',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
};

const MetaTagGeneratorPage: React.FC = () => {
  const [metaState, setMetaState] = useState<MetaState>(initialMetaState);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const { addToHistory } = useToolStore();

  useEffect(() => {
    addToHistory('meta-tag-generator');
  }, [addToHistory]);

  const generateMetaTags = useCallback(() => {
    const tags: string[] = [];

    // Basic Meta Tags
    tags.push(`<meta charset="${metaState.charset}">`);
    tags.push(`<meta name="viewport" content="${metaState.viewport}">`);
    if (metaState.title) tags.push(`<title>${metaState.title}</title>`);
    if (metaState.description) tags.push(`<meta name="description" content="${metaState.description}">`);
    if (metaState.keywords) tags.push(`<meta name="keywords" content="${metaState.keywords}">`);
    if (metaState.author) tags.push(`<meta name="author" content="${metaState.author}">`);

    const robotsContent = [];
    if (metaState.robotsIndex === 'noindex') robotsContent.push('noindex'); else robotsContent.push('index');
    if (metaState.robotsFollow === 'nofollow') robotsContent.push('nofollow'); else robotsContent.push('follow');
    tags.push(`<meta name="robots" content="${robotsContent.join(', ')}">`);

    if (metaState.refreshDelay && metaState.refreshDelay > 0) {
      let content = `${metaState.refreshDelay}`;
      if (metaState.refreshUrl) {
        content += `;url=${metaState.refreshUrl}`;
      }
      tags.push(`<meta http-equiv="refresh" content="${content}">`);
    }

    // Open Graph Tags
    if (metaState.ogTitle || metaState.title) tags.push(`<meta property="og:title" content="${metaState.ogTitle || metaState.title}">`);
    if (metaState.ogDescription || metaState.description) tags.push(`<meta property="og:description" content="${metaState.ogDescription || metaState.description}">`);
    if (metaState.ogType) tags.push(`<meta property="og:type" content="${metaState.ogType}">`);
    if (metaState.ogUrl) tags.push(`<meta property="og:url" content="${metaState.ogUrl}">`);
    if (metaState.ogImage) tags.push(`<meta property="og:image" content="${metaState.ogImage}">`);
    if (metaState.ogSiteName) tags.push(`<meta property="og:site_name" content="${metaState.ogSiteName}">`);

    // Twitter Card Tags
    if (metaState.twitterCard) tags.push(`<meta name="twitter:card" content="${metaState.twitterCard}">`);
    if (metaState.twitterSite) tags.push(`<meta name="twitter:site" content="${metaState.twitterSite}">`);
    if (metaState.twitterCreator) tags.push(`<meta name="twitter:creator" content="${metaState.twitterCreator}">`);
    if (metaState.twitterTitle || metaState.ogTitle || metaState.title) tags.push(`<meta name="twitter:title" content="${metaState.twitterTitle || metaState.ogTitle || metaState.title}">`);
    if (metaState.twitterDescription || metaState.ogDescription || metaState.description) tags.push(`<meta name="twitter:description" content="${metaState.twitterDescription || metaState.ogDescription || metaState.description}">`);
    if (metaState.twitterImage || metaState.ogImage) tags.push(`<meta name="twitter:image" content="${metaState.twitterImage || metaState.ogImage}">`);

    setGeneratedHtml(tags.map(tag => tag.trim()).join('\n'));
  }, [metaState]);

  useEffect(() => {
    generateMetaTags();
  }, [metaState, generateMetaTags]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml);
    toast.success('Meta tags copied to clipboard!');
  };

  const handleReset = () => {
    setMetaState(initialMetaState);
    toast.success('Form reset to default values!');
  };

  const renderInput = (id: keyof MetaState, label: string, type: string = 'text', placeholder: string = '', rows: number = 1) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-300">{label}</label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={metaState[id] as string}
          onChange={(e) => setMetaState({ ...metaState, [id]: e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors resize-y"
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={metaState[id] as string | number}
          onChange={(e) => setMetaState({ ...metaState, [id]: type === 'number' ? (e.target.value ? parseInt(e.target.value) : '') : e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors"
          placeholder={placeholder}
          min={type === 'number' ? "0" : undefined}
        />
      )}
    </div>
  );

  const renderSelect = (id: keyof MetaState, label: string, options: { value: string; label: string }[]) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-300">{label}</label>
      <div className="relative">
        <select
          id={id}
          value={metaState[id] as string}
          onChange={(e) => setMetaState({ ...metaState, [id]: e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-50 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors appearance-none cursor-pointer pr-10"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
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

  const ogPreviewTitle = metaState.ogTitle || metaState.title || 'Your Website Title';
  const ogPreviewDescription = metaState.ogDescription || metaState.description || 'A compelling description of your website content.';
  const ogPreviewUrl = metaState.ogUrl || 'https://example.com';
  const ogPreviewSiteName = metaState.ogSiteName || 'Example.com';
  const ogPreviewImage = metaState.ogImage || 'https://via.placeholder.com/1200x630.png?text=Open+Graph+Image';

  const twitterPreviewTitle = metaState.twitterTitle || ogPreviewTitle;
  const twitterPreviewDescription = metaState.twitterDescription || ogPreviewDescription;
  const twitterPreviewImage = metaState.twitterImage || ogPreviewImage;

  return (
    <ToolPageWrapper
      toolSlug="meta-tag-generator"
      toolName="Meta Tag Generator & OG Preview"
      description="Generate essential meta tags for SEO and social media, with a live Open Graph preview."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Inputs */}
        <div className="flex flex-col gap-6">
          {/* Basic Meta Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold text-slate-200 mb-4">Basic Meta Tags</h3>
            <div className="flex flex-col gap-4">
              {renderInput('title', 'Title', 'text', 'e.g., My Awesome Website')}
              {renderInput('description', 'Description', 'textarea', 'A brief summary of your page content.', 3)}
              {renderInput('keywords', 'Keywords', 'text', 'e.g., web development, tools, SEO')}
              {renderInput('author', 'Author', 'text', 'e.g., John Doe')}

              <div className="flex gap-4">
                {renderSelect('robotsIndex', 'Robots Indexing', [
                  { value: 'index', label: 'Index' },
                  { value: 'noindex', label: 'Noindex' },
                ])}
                {renderSelect('robotsFollow', 'Robots Following', [
                  { value: 'follow', label: 'Follow' },
                  { value: 'nofollow', label: 'Nofollow' },
                ])}
              </div>

              {renderSelect('charset', 'Charset', [
                { value: 'UTF-8', label: 'UTF-8' },
                { value: 'ISO-8859-1', label: 'ISO-8859-1' },
              ])}
              {renderInput('viewport', 'Viewport', 'text', 'width=device-width, initial-scale=1.0')}

              <div className="flex flex-col gap-1">
                <label htmlFor="refreshDelay" className="text-sm font-medium text-slate-300">Refresh Delay (seconds)</label>
                <input
                  type="number"
                  id="refreshDelay"
                  value={metaState.refreshDelay}
                  onChange={(e) => setMetaState({ ...metaState, refreshDelay: e.target.value ? parseInt(e.target.value) : '' })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors"
                  placeholder="e.g., 5"
                  min="0"
                />
              </div>
              {metaState.refreshDelay !== '' && (
                renderInput('refreshUrl', 'Refresh URL (optional)', 'text', 'e.g., https://example.com/new-page')
              )}
            </div>
          </div>

          {/* Open Graph Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold text-slate-200 mb-4">Open Graph Tags (Facebook, LinkedIn, etc.)</h3>
            <div className="flex flex-col gap-4">
              {renderInput('ogTitle', 'OG Title (defaults to Title)', 'text', 'e.g., My Awesome OG Title')}
              {renderInput('ogDescription', 'OG Description (defaults to Description)', 'textarea', 'A detailed description for social media shares.', 3)}
              {renderSelect('ogType', 'OG Type', [
                { value: 'website', label: 'Website' },
                { value: 'article', label: 'Article' },
                { value: 'book', label: 'Book' },
                { value: 'profile', label: 'Profile' },
                { value: 'video.movie', label: 'Video (Movie)' },
                { value: 'video.episode', label: 'Video (Episode)' },
              ])}
              {renderInput('ogUrl', 'OG URL', 'text', 'e.g., https://example.com/page')}
              {renderInput('ogImage', 'OG Image URL (1200x630 recommended)', 'text', 'e.g., https://example.com/image.jpg')}
              {renderInput('ogSiteName', 'OG Site Name', 'text', 'e.g., My Awesome Site')}
            </div>
          </div>

          {/* Twitter Card Tags */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold text-slate-200 mb-4">Twitter Card Tags</h3>
            <div className="flex flex-col gap-4">
              {renderSelect('twitterCard', 'Twitter Card Type', [
                { value: 'summary', label: 'Summary Card' },
                { value: 'summary_large_image', label: 'Summary Card with Large Image' },
                { value: 'app', label: 'App Card' },
                { value: 'player', label: 'Player Card' },
              ])}
              {renderInput('twitterSite', 'Twitter Site (@username)', 'text', 'e.g., @yourtwitterhandle')}
              {renderInput('twitterCreator', 'Twitter Creator (@username)', 'text', 'e.g., @yourcreatorhandle')}
              {renderInput('twitterTitle', 'Twitter Title (defaults to OG Title)', 'text', 'e.g., My Awesome Twitter Title')}
              {renderInput('twitterDescription', 'Twitter Description (defaults to OG Description)', 'textarea', 'A detailed description for Twitter shares.', 3)}
              {renderInput('twitterImage', 'Twitter Image URL (defaults to OG Image)', 'text', 'e.g., https://example.com/twitter-image.jpg')}
            </div>
          </div>
        </div>

        {/* Right Column: Output & Preview */}
        <div className="flex flex-col gap-6">
          {/* Generated HTML */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold text-slate-200 mb-4">Generated HTML</h3>
            <div className="relative">
              <textarea
                value={generatedHtml}
                readOnly
                rows={15}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-4 text-sm text-slate-50 font-mono focus:outline-none resize-none"
              />
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-slate-50 transition-colors"
                aria-label="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
            >
              <RefreshCcw size={18} /> Reset All Fields
            </button>
          </div>

          {/* OG Preview */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold text-slate-200 mb-4">Open Graph Preview (Facebook/LinkedIn)</h3>
            <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
              <img
                src={ogPreviewImage}
                alt="Open Graph Preview"
                className="w-full h-auto object-cover max-h-60"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1200x630.png?text=Open+Graph+Image'; }}
              />
              <div className="p-4">
                <p className="text-xs text-slate-400 uppercase font-medium mb-1">{ogPreviewSiteName}</p>
                <h4 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">{ogPreviewTitle}</h4>
                <p className="text-sm text-slate-300 line-clamp-3">{ogPreviewDescription}</p>
                <p className="text-xs text-indigo-400 mt-2 truncate">{ogPreviewUrl}</p>
              </div>
            </div>
          </div>

          {/* Twitter Card Preview */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold text-slate-200 mb-4">Twitter Card Preview</h3>
            <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
              {metaState.twitterCard === 'summary_large_image' && (
                <img
                  src={twitterPreviewImage}
                  alt="Twitter Card Preview"
                  className="w-full h-auto object-cover max-h-60"
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800x400.png?text=Twitter+Card+Image'; }}
                />
              )}
              <div className="p-4 flex gap-4">
                {metaState.twitterCard === 'summary' && (
                  <img
                    src={twitterPreviewImage}
                    alt="Twitter Card Preview"
                    className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/120x120.png?text=Twitter+Image'; }}
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">{twitterPreviewTitle}</h4>
                  <p className="text-sm text-slate-300 line-clamp-3">{twitterPreviewDescription}</p>
                  <p className="text-xs text-slate-400 mt-2 truncate">
                    {metaState.twitterSite || metaState.twitterCreator ? `${metaState.twitterSite || metaState.twitterCreator} / ` : ''}
                    {ogPreviewSiteName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default MetaTagGeneratorPage;