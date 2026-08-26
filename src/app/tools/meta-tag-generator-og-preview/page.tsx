'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const TOOL_SLUG = 'meta-tag-generator-og-preview';
const TOOL_NAME = 'Meta Tag Generator & OG Preview';
const TOOL_DESCRIPTION = 'Generate essential meta tags and preview Open Graph (OG) social media cards.';

const MetaTagGeneratorPage: React.FC = () => {
  const addToHistory = useToolStore((state) => state.addToHistory);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [robots, setRobots] = useState('index, follow');
  const [charset, setCharset] = useState('UTF-8');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');

  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogType, setOgType] = useState('website');
  const [ogSiteName, setOgSiteName] = useState('');

  const generateMetaTags = useCallback(() => {
    let html = '';

    // Standard Meta Tags
    if (charset) html += `<meta charset="${charset}" />\n`;
    if (viewport) html += `<meta name="viewport" content="${viewport}" />\n`;
    if (title) html += `<title>${title}</title>\n`; // Title is not a meta tag, but often included for context
    if (description) html += `<meta name="description" content="${description}" />\n`;
    if (keywords) html += `<meta name="keywords" content="${keywords}" />\n`;
    if (author) html += `<meta name="author" content="${author}" />\n`;
    if (robots) html += `<meta name="robots" content="${robots}" />\n`;

    // Open Graph Tags
    if (ogTitle) html += `<meta property="og:title" content="${ogTitle}" />\n`;
    if (ogDescription) html += `<meta property="og:description" content="${ogDescription}" />\n`;
    if (ogUrl) html += `<meta property="og:url" content="${ogUrl}" />\n`;
    if (ogImage) html += `<meta property="og:image" content="${ogImage}" />\n`;
    if (ogType) html += `<meta property="og:type" content="${ogType}" />\n`;
    if (ogSiteName) html += `<meta property="og:site_name" content="${ogSiteName}" />\n`;

    return html.trim();
  }, [title, description, keywords, author, robots, charset, viewport, ogTitle, ogDescription, ogUrl, ogImage, ogType, ogSiteName]);

  const generatedHtml = generateMetaTags();

  useEffect(() => {
    addToHistory(TOOL_SLUG);
  }, [addToHistory]);

  const handleCopy = () => {
    if (generatedHtml) {
      navigator.clipboard.writeText(generatedHtml);
      toast.success('Meta tags copied to clipboard!');
    } else {
      toast.error('No meta tags to copy!');
    }
  };

  const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm";
  const labelClass = "block text-slate-400 text-sm font-medium mb-1";
  const sectionTitleClass = "text-xl font-semibold text-slate-100 mb-4 border-b border-slate-700 pb-2";

  return (
    <ToolPageWrapper toolSlug={TOOL_SLUG} toolName={TOOL_NAME} description={TOOL_DESCRIPTION}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input Fields */}
        <div className="flex flex-col gap-6">
          {/* Standard Meta Tags */}
          <section>
            <h2 className={sectionTitleClass}>Standard Meta Tags</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className={labelClass}>Page Title</label>
                <input
                  type="text"
                  id="title"
                  className={inputClass}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., My Awesome Website"
                />
              </div>
              <div>
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea
                  id="description"
                  className={`${inputClass} h-24 resize-y`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief summary of your page content."
                ></textarea>
              </div>
              <div>
                <label htmlFor="keywords" className={labelClass}>Keywords (comma-separated)</label>
                <input
                  type="text"
                  id="keywords"
                  className={inputClass}
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., web development, tools, generator"
                />
              </div>
              <div>
                <label htmlFor="author" className={labelClass}>Author</label>
                <input
                  type="text"
                  id="author"
                  className={inputClass}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., DevForge Team"
                />
              </div>
              <div>
                <label htmlFor="robots" className={labelClass}>Robots</label>
                <select
                  id="robots"
                  className={inputClass}
                  value={robots}
                  onChange={(e) => setRobots(e.target.value)}
                >
                  <option value="index, follow">index, follow</option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="index, nofollow">index, nofollow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                </select>
              </div>
              <div>
                <label htmlFor="charset" className={labelClass}>Charset</label>
                <input
                  type="text"
                  id="charset"
                  className={inputClass}
                  value={charset}
                  onChange={(e) => setCharset(e.target.value)}
                  disabled
                />
              </div>
              <div>
                <label htmlFor="viewport" className={labelClass}>Viewport</label>
                <input
                  type="text"
                  id="viewport"
                  className={inputClass}
                  value={viewport}
                  onChange={(e) => setViewport(e.target.value)}
                  disabled
                />
              </div>
            </div>
          </section>

          {/* Open Graph Tags */}
          <section>
            <h2 className={sectionTitleClass}>Open Graph (OG) Tags</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="ogTitle" className={labelClass}>OG Title</label>
                <input
                  type="text"
                  id="ogTitle"
                  className={inputClass}
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder="e.g., DevForge - Developer Toolbox"
                />
              </div>
              <div>
                <label htmlFor="ogDescription" className={labelClass}>OG Description</label>
                <textarea
                  id="ogDescription"
                  className={`${inputClass} h-24 resize-y`}
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder="A short, engaging description for social media."
                ></textarea>
              </div>
              <div>
                <label htmlFor="ogUrl" className={labelClass}>OG URL</label>
                <input
                  type="url"
                  id="ogUrl"
                  className={inputClass}
                  value={ogUrl}
                  onChange={(e) => setOgUrl(e.target.value)}
                  placeholder="e.g., https://devforge.app/tools/meta-tag-generator"
                />
              </div>
              <div>
                <label htmlFor="ogImage" className={labelClass}>OG Image URL</label>
                <input
                  type="url"
                  id="ogImage"
                  className={inputClass}
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="e.g., https://devforge.app/og-image.jpg"
                />
              </div>
              <div>
                <label htmlFor="ogType" className={labelClass}>OG Type</label>
                <select
                  id="ogType"
                  className={inputClass}
                  value={ogType}
                  onChange={(e) => setOgType(e.target.value)}
                >
                  <option value="website">website</option>
                  <option value="article">article</option>
                  <option value="blog">blog</option>
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
                <label htmlFor="ogSiteName" className={labelClass}>OG Site Name</label>
                <input
                  type="text"
                  id="ogSiteName"
                  className={inputClass}
                  value={ogSiteName}
                  onChange={(e) => setOgSiteName(e.target.value)}
                  placeholder="e.g., DevForge"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: OG Preview & Generated HTML */}
        <div className="flex flex-col gap-6">
          {/* OG Preview */}
          <section className="sticky top-24"> {/* Make it sticky for better UX */}
            <h2 className={sectionTitleClass}>Open Graph Preview</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg">
              {ogImage && (
                <div className="relative w-full h-48 bg-slate-700 flex items-center justify-center text-slate-400 text-sm overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ogImage} alt="OG Image Preview" className="object-cover w-full h-full" onError={(e) => { e.currentTarget.src = '/file.svg'; e.currentTarget.alt = 'Image failed to load'; }} />
                </div>
              )}
              <div className="p-4">
                <p className="text-slate-400 text-xs mb-1">{ogUrl || 'https://example.com'}</p>
                <h3 className="text-slate-50 text-lg font-semibold mb-1 line-clamp-2">{ogTitle || 'Your Page Title Here'}</h3>
                <p className="text-slate-300 text-sm line-clamp-3">{ogDescription || 'A compelling description of your content for social media sharing.'}</p>
              </div>
            </div>
          </section>

          {/* Generated HTML Output */}
          <section>
            <h2 className={sectionTitleClass}>Generated HTML</h2>
            <div className="relative">
              <textarea
                readOnly
                className={`${inputClass} font-mono h-96 resize-y bg-slate-900 text-slate-300`}
                value={generatedHtml}
                placeholder="Your meta tags will appear here..."
              ></textarea>
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
              >
                Copy
              </button>
            </div>
          </section>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default MetaTagGeneratorPage;