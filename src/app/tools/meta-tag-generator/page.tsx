"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';
import { useToolStore } from '@/store/useToolStore';

const MetaTagGeneratorPage: React.FC = () => {
  const toolSlug = "meta-tag-generator";
  const { addToHistory } = useToolStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);
  const [charset, setCharset] = useState('UTF-8');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
  const [refreshDelay, setRefreshDelay] = useState(''); // in seconds, optional

  // Open Graph
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogType, setOgType] = useState('website');
  const [ogUrl, setOgUrl] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogSiteName, setOgSiteName] = useState('');
  const [ogLocale, setOgLocale] = useState('en_US');

  // Twitter Card
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [twitterSite, setTwitterSite] = useState('');
  const [twitterCreator, setTwitterCreator] = useState('');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');

  const generateMetaTags = useCallback(() => {
    let tags = [];

    // Basic Meta Tags
    // Title tag is not a meta tag, but is essential for <head> and often generated alongside meta tags
    if (title) tags.push(`<title>${title}</title>`);
    tags.push(`<meta charset="${charset}" />`);
    tags.push(`<meta name="viewport" content="${viewport}" />`);
    if (description) tags.push(`<meta name="description" content="${description}" />`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}" />`);
    if (author) tags.push(`<meta name="author" content="${author}" />`);

    const robotsContent = [
      robotsIndex ? 'index' : 'noindex',
      robotsFollow ? 'follow' : 'nofollow'
    ].join(', ');
    tags.push(`<meta name="robots" content="${robotsContent}" />`);

    if (refreshDelay && !isNaN(parseInt(refreshDelay))) {
      tags.push(`<meta http-equiv="refresh" content="${refreshDelay}" />`);
    }

    // Open Graph Tags
    if (ogTitle || title) tags.push(`<meta property="og:title" content="${ogTitle || title}" />`);
    if (ogDescription || description) tags.push(`<meta property="og:description" content="${ogDescription || description}" />`);
    if (ogType) tags.push(`<meta property="og:type" content="${ogType}" />`);
    if (ogUrl) tags.push(`<meta property="og:url" content="${ogUrl}" />`);
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}" />`);
    if (ogSiteName) tags.push(`<meta property="og:site_name" content="${ogSiteName}" />`);
    if (ogLocale) tags.push(`<meta property="og:locale" content="${ogLocale}" />`);

    // Twitter Card Tags
    if (twitterCard) tags.push(`<meta name="twitter:card" content="${twitterCard}" />`);
    if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}" />`);
    if (twitterCreator) tags.push(`<meta name="twitter:creator" content="${twitterCreator}" />`);
    if (twitterTitle || ogTitle || title) tags.push(`<meta name="twitter:title" content="${twitterTitle || ogTitle || title}" />`);
    if (twitterDescription || ogDescription || description) tags.push(`<meta name="twitter:description" content="${twitterDescription || ogDescription || description}" />`);
    if (twitterImage || ogImage) tags.push(`<meta name="twitter:image" content="${twitterImage || ogImage}" />`);

    return tags.filter(Boolean).join('\n');
  }, [
    title, description, keywords, author, robotsIndex, robotsFollow, charset, viewport, refreshDelay,
    ogTitle, ogDescription, ogType, ogUrl, ogImage, ogSiteName, ogLocale,
    twitterCard, twitterSite, twitterCreator, twitterTitle, twitterDescription, twitterImage
  ]);

  const [generatedHtml, setGeneratedHtml] = useState('');

  useEffect(() => {
    setGeneratedHtml(generateMetaTags());
    addToHistory(toolSlug);
  }, [generateMetaTags, addToHistory, toolSlug]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHtml);
    toast.success('Meta tags copied to clipboard!');
  };

  const renderInput = (label: string, value: string, setValue: (v: string) => void, type: string = 'text', placeholder?: string, rows?: number) => (
    <div className="mb-4">
      <label className="block text-slate-300 text-sm font-medium mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-50 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition-colors text-sm"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          rows={rows || 3}
        />
      ) : (
        <input
          type={type}
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-50 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition-colors text-sm"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );

  const renderSelect = (label: string, value: string, setValue: (v: string) => void, options: { value: string; label: string }[]) => (
    <div className="mb-4">
      <label className="block text-slate-300 text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <select
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-50 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition-colors text-sm appearance-none pr-8"
          value={value}
          onChange={(e) => setValue(e.target.value)}
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

  const renderCheckbox = (label: string, checked: boolean, setChecked: (v: boolean) => void) => (
    <div className="mb-4 flex items-center">
      <input
        type="checkbox"
        id={label.toLowerCase().replace(/\s/g, '-')}
        className="h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <label htmlFor={label.toLowerCase().replace(/\s/g, '-')} className="ml-2 text-slate-300 text-sm font-medium">
        {label}
      </label>
    </div>
  );

  const renderSectionTitle = (title: string) => (
    <h2 className="text-xl font-semibold text-indigo-400 mb-4 border-b border-slate-700 pb-2">{title}</h2>
  );

  const ogPreviewTitle = ogTitle || title || 'Your Website Title';
  const ogPreviewDescription = ogDescription || description || 'A compelling description of your content.';
  const ogPreviewUrl = ogUrl || 'https://example.com';
  const ogPreviewImage = ogImage || 'https://via.placeholder.com/1200x630/1e293b/e2e8f0?text=OG+Image+Placeholder'; // Default placeholder image

  const twitterPreviewTitle = twitterTitle || ogTitle || title || 'Your Website Title';
  const twitterPreviewDescription = twitterDescription || ogDescription || description || 'A compelling description of your content.';
  const twitterPreviewImage = twitterImage || ogImage || 'https://via.placeholder.com/800x418/1e293b/e2e8f0?text=Twitter+Image+Placeholder'; // Default placeholder image

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="Meta Tag Generator & OG Preview"
      description="Generate essential meta tags for SEO and social media, and preview how your content will appear on platforms like Facebook and Twitter."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
            {renderSectionTitle('Basic Meta Tags')}
            {renderInput('Page Title', title, setTitle, 'text', 'e.g., My Awesome Website')}
            {renderInput('Description', description, setDescription, 'textarea', 'A short and accurate summary of your page content.', 3)}
            {renderInput('Keywords', keywords, setKeywords, 'text', 'comma, separated, keywords')}
            {renderInput('Author', author, setAuthor, 'text', 'e.g., John Doe')}
            <div className="flex gap-4 mb-4">
              {renderCheckbox('Index Page', robotsIndex, setRobotsIndex)}
              {renderCheckbox('Follow Links', robotsFollow, setRobotsFollow)}
            </div>
            {renderInput('Charset', charset, setCharset, 'text', 'UTF-8', 1)}
            {renderInput('Viewport', viewport, setViewport, 'text', 'width=device-width, initial-scale=1.0', 1)}
            {renderInput('Refresh Delay (seconds, optional)', refreshDelay, setRefreshDelay, 'number', 'e.g., 5')}
          </div>

          <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
            {renderSectionTitle('Open Graph (Facebook, LinkedIn, etc.)')}
            {renderInput('OG Title', ogTitle, setOgTitle, 'text', 'e.g., My Article Title')}
            {renderInput('OG Description', ogDescription, setOgDescription, 'textarea', 'A description for social media shares.', 3)}
            {renderSelect('OG Type', ogType, setOgType, [
              { value: 'website', label: 'Website' },
              { value: 'article', label: 'Article' },
              { value: 'book', label: 'Book' },
              { value: 'profile', label: 'Profile' },
              { value: 'video.movie', label: 'Video Movie' },
              { value: 'video.episode', label: 'Video Episode' },
              { value: 'video.tv_show', label: 'Video TV Show' },
              { value: 'video.other', label: 'Video Other' },
              { value: 'music.song', label: 'Music Song' },
              { value: 'music.album', label: 'Music Album' },
              { value: 'music.playlist', label: 'Music Playlist' },
              { value: 'music.radio_station', label: 'Music Radio Station' },
            ])}
            {renderInput('OG URL', ogUrl, setOgUrl, 'text', 'https://example.com/my-page')}
            {renderInput('OG Image URL', ogImage, setOgImage, 'text', 'https://example.com/image.jpg')}
            {renderInput('OG Site Name', ogSiteName, setOgSiteName, 'text', 'e.g., DevForge Blog')}
            {renderInput('OG Locale', ogLocale, setOgLocale, 'text', 'en_US')}
          </div>

          <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
            {renderSectionTitle('Twitter Card')}
            {renderSelect('Twitter Card Type', twitterCard, setTwitterCard, [
              { value: 'summary', label: 'Summary Card' },
              { value: 'summary_large_image', label: 'Summary Card with Large Image' },
              { value: 'app', label: 'App Card' },
              { value: 'player', label: 'Player Card' },
            ])}
            {renderInput('Twitter Site (@username)', twitterSite, setTwitterSite, 'text', '@yourtwitterhandle')}
            {renderInput('Twitter Creator (@username)', twitterCreator, setTwitterCreator, 'text', '@authorstwitterhandle')}
            {renderInput('Twitter Title', twitterTitle, setTwitterTitle, 'text', 'e.g., My Tweet Title')}
            {renderInput('Twitter Description', twitterDescription, setTwitterDescription, 'textarea', 'A description for your tweet.', 3)}
            {renderInput('Twitter Image URL', twitterImage, setTwitterImage, 'text', 'https://example.com/twitter-image.jpg')}
          </div>
        </div>

        {/* Output & Preview Section */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
            {renderSectionTitle('Generated Meta Tags')}
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-4 text-slate-50 font-mono text-sm resize-none"
              rows={15}
              readOnly
              value={generatedHtml}
            />
            <button
              onClick={copyToClipboard}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Copy to Clipboard
            </button>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
            {renderSectionTitle('Open Graph Preview (Facebook/LinkedIn)')}
            <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden max-w-md mx-auto">
              <img
                src={ogPreviewImage}
                alt="OG Preview"
                className="w-full h-auto object-cover max-h-60"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/1200x630/1e293b/e2e8f0?text=OG+Image+Placeholder';
                  e.currentTarget.alt = 'Image not available';
                }}
              />
              <div className="p-4">
                <p className="text-xs text-slate-400 uppercase mb-1 truncate">{ogPreviewUrl.replace(/(^\w+:|^)\/\//, '').split('/')[0]}</p>
                <h3 className="text-lg font-semibold text-slate-50 mb-1 line-clamp-2">{ogPreviewTitle}</h3>
                <p className="text-sm text-slate-300 line-clamp-3">{ogPreviewDescription}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
            {renderSectionTitle('Twitter Card Preview')}
            <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden max-w-md mx-auto">
              {twitterCard === 'summary_large_image' && (
                <img
                  src={twitterPreviewImage}
                  alt="Twitter Card Preview"
                  className="w-full h-auto object-cover max-h-60"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x418/1e293b/e2e8f0?text=Twitter+Image+Placeholder';
                    e.currentTarget.alt = 'Image not available';
                  }}
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-50 mb-1 line-clamp-2">{twitterPreviewTitle}</h3>
                <p className="text-sm text-slate-300 mb-2 line-clamp-3">{twitterPreviewDescription}</p>
                <p className="text-xs text-slate-400">
                  {twitterSite || '@yourhandle'} &bull; {new URL(ogPreviewUrl).hostname}
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