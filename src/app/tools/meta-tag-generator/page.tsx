'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy } from 'lucide-react';

const TOOL_SLUG = 'meta-tag-generator';
const TOOL_NAME = 'Meta Tag Generator & OG Preview';
const TOOL_DESCRIPTION = 'Generate essential meta tags for SEO and social media, and preview Open Graph cards.';

const MetaTagGeneratorPage: React.FC = () => {
  const { addToHistory } = useToolStore();

  // Basic Meta Tags
  const [pageTitle, setPageTitle] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);
  const [charset, setCharset] = useState('UTF-8');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
  const [refreshEnabled, setRefreshEnabled] = useState(false);
  const [refreshDelay, setRefreshDelay] = useState(5);
  const [refreshUrl, setRefreshUrl] = useState('');

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
  const [twitterUrl, setTwitterUrl] = useState('');

  const [generatedMetaTags, setGeneratedMetaTags] = useState('');

  useEffect(() => {
    addToHistory(TOOL_SLUG);
  }, [addToHistory]);

  const generateMetaTags = useCallback(() => {
    let tags = [];

    // Basic Meta Tags
    tags.push(`<meta charset="${charset}">`);
    tags.push(`<meta name="viewport" content="${viewport}">`);
    if (pageTitle) tags.push(`<title>${pageTitle}</title>`);
    if (pageDescription) tags.push(`<meta name="description" content="${pageDescription}">`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}">`);
    if (author) tags.push(`<meta name="author" content="${author}">`);

    const robotsContent = `${robotsIndex ? 'index' : 'noindex'}, ${robotsFollow ? 'follow' : 'nofollow'}`;
    tags.push(`<meta name="robots" content="${robotsContent}">`);

    if (refreshEnabled && refreshDelay > 0) {
      tags.push(`<meta http-equiv="refresh" content="${refreshDelay}${refreshUrl ? `;url=${refreshUrl}` : ''}">`);
    }

    // Open Graph Tags
    if (ogType) tags.push(`<meta property="og:type" content="${ogType}">`);
    if (ogUrl) tags.push(`<meta property="og:url" content="${ogUrl}">`);
    if (ogTitle || pageTitle) tags.push(`<meta property="og:title" content="${ogTitle || pageTitle}">`);
    if (ogDescription || pageDescription) tags.push(`<meta property="og:description" content="${ogDescription || pageDescription}">`);
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}">`);
    if (ogSiteName) tags.push(`<meta property="og:site_name" content="${ogSiteName}">`);
    if (ogLocale) tags.push(`<meta property="og:locale" content="${ogLocale}">`);

    // Twitter Card Tags
    if (twitterCard) tags.push(`<meta name="twitter:card" content="${twitterCard}">`);
    if (twitterUrl || ogUrl) tags.push(`<meta name="twitter:url" content="${twitterUrl || ogUrl}">`);
    if (twitterTitle || ogTitle || pageTitle) tags.push(`<meta name="twitter:title" content="${twitterTitle || ogTitle || pageTitle}">`);
    if (twitterDescription || ogDescription || pageDescription) tags.push(`<meta name="twitter:description" content="${twitterDescription || ogDescription || pageDescription}">`);
    if (twitterImage || ogImage) tags.push(`<meta name="twitter:image" content="${twitterImage || ogImage}">`);
    if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}">`);
    if (twitterCreator) tags.push(`<meta name="twitter:creator" content="${twitterCreator}">`);

    setGeneratedMetaTags(tags.join('\n'));
  }, [
    pageTitle, pageDescription, keywords, author, robotsIndex, robotsFollow,
    charset, viewport, refreshEnabled, refreshDelay, refreshUrl,
    ogTitle, ogDescription, ogUrl, ogType, ogImage, ogSiteName, ogLocale,
    twitterCard, twitterSite, twitterCreator, twitterTitle, twitterDescription, twitterImage, twitterUrl
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

  // Helper for input styling
  const inputClasses = "w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";
  const labelClasses = "block text-sm font-medium text-slate-400 mb-1";
  const sectionTitleClasses = "text-lg font-semibold text-slate-100 mb-4 border-b border-slate-700 pb-2";
  const checkboxClasses = "h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500";

  const renderInput = (label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, type: string = 'text', placeholder?: string, rows?: number) => (
    <div>
      <label className={labelClasses}>{label}</label>
      {type === 'textarea' ? (
        <textarea
          className={inputClasses}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 3}
        />
      ) : (
        <input
          type={type}
          className={inputClasses}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );

  const renderSelect = (label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: { value: string; label: string }[]) => (
    <div>
      <label className={labelClasses}>{label}</label>
      <select className={inputClasses} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderCheckbox = (label: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
    <div className="flex items-center">
      <input
        type="checkbox"
        className={checkboxClasses}
        checked={checked}
        onChange={onChange}
        id={`checkbox-${label.toLowerCase().replace(/\s/g, '-')}`}
      />
      <label htmlFor={`checkbox-${label.toLowerCase().replace(/\s/g, '-')}`} className="ml-2 text-sm text-slate-300 cursor-pointer">
        {label}
      </label>
    </div>
  );

  const getDisplayUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch {
      return url; // Fallback to raw URL if invalid
    }
  };

  const ogPreviewTitle = ogTitle || pageTitle || 'Your Page Title';
  const ogPreviewDescription = ogDescription || pageDescription || 'A compelling description of your page content.';
  const ogPreviewUrl = ogUrl || 'https://example.com/your-page';
  const ogPreviewImage = ogImage || 'https://via.placeholder.com/1200x630/1e293b/e2e8f0?text=Open+Graph+Image'; // Default placeholder image

  return (
    <ToolPageWrapper toolSlug={TOOL_SLUG} toolName={TOOL_NAME} description={TOOL_DESCRIPTION}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Forms */}
        <div className="space-y-8">
          {/* Basic Meta Tags */}
          <section className="p-6 bg-slate-900 rounded-lg border border-slate-800 shadow-lg">
            <h2 className={sectionTitleClasses}>Basic Meta Tags</h2>
            <div className="space-y-4">
              {renderInput('Page Title', pageTitle, (e) => setPageTitle(e.target.value), 'text', 'e.g., My Awesome Website')}
              {renderInput('Page Description', pageDescription, (e) => setPageDescription(e.target.value), 'textarea', 'A brief summary of your page content.', 3)}
              {renderInput('Keywords (comma-separated)', keywords, (e) => setKeywords(e.target.value), 'text', 'e.g., web development, tools, utility')}
              {renderInput('Author', author, (e) => setAuthor(e.target.value), 'text', 'e.g., John Doe')}

              <div>
                <label className={labelClasses}>Robots</label>
                <div className="flex gap-4 mt-1">
                  {renderCheckbox('Index', robotsIndex, (e) => setRobotsIndex(e.target.checked))}
                  {renderCheckbox('Follow', robotsFollow, (e) => setRobotsFollow(e.target.checked))}
                </div>
              </div>

              {renderInput('Charset', charset, (e) => setCharset(e.target.value), 'text', 'e.g., UTF-8')}
              {renderInput('Viewport', viewport, (e) => setViewport(e.target.value), 'text', 'e.g., width=device-width, initial-scale=1.0')}

              <div>
                <label className={labelClasses}>Refresh (Optional)</label>
                <div className="flex items-center gap-4 mt-1">
                  {renderCheckbox('Enable Refresh', refreshEnabled, (e) => setRefreshEnabled(e.target.checked))}
                  {refreshEnabled && (
                    <>
                      <input
                        type="number"
                        className={`${inputClasses} w-24`}
                        value={refreshDelay}
                        onChange={(e) => setRefreshDelay(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                      />
                      <span className="text-slate-400 text-sm">seconds</span>
                      <input
                        type="text"
                        className={inputClasses}
                        value={refreshUrl}
                        onChange={(e) => setRefreshUrl(e.target.value)}
                        placeholder="Redirect URL (optional)"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Open Graph Tags */}
          <section className="p-6 bg-slate-900 rounded-lg border border-slate-800 shadow-lg">
            <h2 className={sectionTitleClasses}>Open Graph (OG) Tags</h2>
            <div className="space-y-4">
              {renderInput('OG Title', ogTitle, (e) => setOgTitle(e.target.value), 'text', 'e.g., My Page for Social Media')}
              {renderInput('OG Description', ogDescription, (e) => setOgDescription(e.target.value), 'textarea', 'A description optimized for social sharing.', 3)}
              {renderInput('OG URL', ogUrl, (e) => setOgUrl(e.target.value), 'text', 'e.g., https://example.com/my-page')}
              {renderSelect('OG Type', ogType, (e) => setOgType(e.target.value), [
                { value: 'website', label: 'website' },
                { value: 'article', label: 'article' },
                { value: 'book', label: 'book' },
                { value: 'profile', label: 'profile' },
                { value: 'video.movie', label: 'video.movie' },
                { value: 'video.episode', label: 'video.episode' },
                { value: 'video.tv_show', label: 'video.tv_show' },
                { value: 'video.other', label: 'video.other' },
                { value: 'music.song', label: 'music.song' },
                { value: 'music.album', label: 'music.album' },
                { value: 'music.playlist', label: 'music.playlist' },
                { value: 'music.radio_station', label: 'music.radio_station' },
              ])}
              {renderInput('OG Image URL', ogImage, (e) => setOgImage(e.target.value), 'text', 'e.g., https://example.com/image.jpg')}
              {renderInput('OG Site Name', ogSiteName, (e) => setOgSiteName(e.target.value), 'text', 'e.g., DevForge')}
              {renderInput('OG Locale', ogLocale, (e) => setOgLocale(e.target.value), 'text', 'e.g., en_US')}
            </div>
          </section>

          {/* Twitter Card Tags */}
          <section className="p-6 bg-slate-900 rounded-lg border border-slate-800 shadow-lg">
            <h2 className={sectionTitleClasses}>Twitter Card Tags</h2>
            <div className="space-y-4">
              {renderSelect('Twitter Card Type', twitterCard, (e) => setTwitterCard(e.target.value), [
                { value: 'summary', label: 'summary' },
                { value: 'summary_large_image', label: 'summary_large_image' },
                { value: 'app', label: 'app' },
                { value: 'player', label: 'player' },
              ])}
              {renderInput('Twitter URL', twitterUrl, (e) => setTwitterUrl(e.target.value), 'text', 'e.g., https://example.com/my-tweet-page')}
              {renderInput('Twitter Site (@username)', twitterSite, (e) => setTwitterSite(e.target.value), 'text', 'e.g., @devforgeapp')}
              {renderInput('Twitter Creator (@username)', twitterCreator, (e) => setTwitterCreator(e.target.value), 'text', 'e.g., @yourhandle')}
              {renderInput('Twitter Title', twitterTitle, (e) => setTwitterTitle(e.target.value), 'text', 'e.g., My Tweet Title')}
              {renderInput('Twitter Description', twitterDescription, (e) => setTwitterDescription(e.target.value), 'textarea', 'A description for Twitter.', 3)}
              {renderInput('Twitter Image URL', twitterImage, (e) => setTwitterImage(e.target.value), 'text', 'e.g., https://example.com/twitter-image.jpg')}
            </div>
          </section>
        </div>

        {/* Output and Preview */}
        <div className="space-y-8">
          {/* Generated Meta Tags Output */}
          <section className="p-6 bg-slate-900 rounded-lg border border-slate-800 shadow-lg">
            <h2 className={sectionTitleClasses}>Generated Meta Tags</h2>
            <div className="relative">
              <textarea
                className={`${inputClasses} font-mono text-xs h-96 resize-y`}
                value={generatedMetaTags}
                readOnly
                placeholder="Generated meta tags will appear here..."
              />
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors"
                aria-label="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
            </div>
          </section>

          {/* OG Preview */}
          <section className="p-6 bg-slate-900 rounded-lg border border-slate-800 shadow-lg">
            <h2 className={sectionTitleClasses}>Open Graph (OG) Preview</h2>
            <div className="flex flex-col gap-4">
              {/* Generic Social Card Preview */}
              <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-md">
                <img
                  src={ogPreviewImage}
                  alt="OG Preview"
                  className="w-full h-48 object-cover bg-slate-700"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/1200x630/1e293b/e2e8f0?text=Image+Load+Error';
                    e.currentTarget.alt = 'Image Load Error';
                  }}
                />
                <div className="p-4">
                  <p className="text-xs text-slate-400 mb-1 truncate">{getDisplayUrl(ogPreviewUrl)}</p>
                  <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">{ogPreviewTitle}</h3>
                  <p className="text-sm text-slate-300 line-clamp-3">{ogPreviewDescription}</p>
                </div>
              </div>

              {/* Twitter Card Preview (Summary Large Image) */}
              {twitterCard === 'summary_large_image' && (
                <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-md">
                  <img
                    src={twitterImage || ogPreviewImage}
                    alt="Twitter Card Preview"
                    className="w-full h-48 object-cover bg-slate-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x418/1e293b/e2e8f0?text=Twitter+Large+Image+Load+Error';
                      e.currentTarget.alt = 'Image Load Error';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">{twitterTitle || ogPreviewTitle}</h3>
                    <p className="text-sm text-slate-300 line-clamp-3">{twitterDescription || ogPreviewDescription}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {twitterSite && <span className="mr-1">{twitterSite}</span>}
                      {getDisplayUrl(twitterUrl || ogPreviewUrl)}
                    </p>
                  </div>
                </div>
              )}

              {/* Twitter Card Preview (Summary) */}
              {twitterCard === 'summary' && (
                <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-md flex">
                  <div className="p-4 flex-1">
                    <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">{twitterTitle || ogPreviewTitle}</h3>
                    <p className="text-sm text-slate-300 line-clamp-3">{twitterDescription || ogPreviewDescription}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {twitterSite && <span className="mr-1">{twitterSite}</span>}
                      {getDisplayUrl(twitterUrl || ogPreviewUrl)}
                    </p>
                  </div>
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={twitterImage || ogPreviewImage}
                      alt="Twitter Card Preview"
                      className="w-full h-full object-cover bg-slate-700"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/120x120/1e293b/e2e8f0?text=Image+Load+Error';
                        e.currentTarget.alt = 'Image Load Error';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default MetaTagGeneratorPage;