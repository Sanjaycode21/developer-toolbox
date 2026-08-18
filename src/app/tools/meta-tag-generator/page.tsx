"use client";

import { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, Code } from 'lucide-react';

const MetaTagGeneratorPage = () => {
  const { addToHistory } = useToolStore();

  // Standard Meta Tags
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [index, setIndex] = useState(true);
  const [follow, setFollow] = useState(true);
  const [charset, setCharset] = useState('UTF-8');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
  const [refreshDelay, setRefreshDelay] = useState<number | ''>('');

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
    let tags = '';

    // Standard Meta Tags
    tags += `<meta charset="${charset}" />\n`;
    tags += `<meta name="viewport" content="${viewport}" />\n`;
    if (title) tags += `<title>${title}</title>\n`; // Title is not a meta tag, but often included here for convenience
    if (description) tags += `<meta name="description" content="${description}" />\n`;
    if (keywords) tags += `<meta name="keywords" content="${keywords}" />\n`;
    if (author) tags += `<meta name="author" content="${author}" />\n`;
    tags += `<meta name="robots" content="${index ? 'index' : 'noindex'},${follow ? 'follow' : 'nofollow'}" />\n`;
    if (refreshDelay && refreshDelay > 0) tags += `<meta http-equiv="refresh" content="${refreshDelay}" />\n`;

    // Open Graph Tags
    if (ogTitle) tags += `<meta property="og:title" content="${ogTitle}" />\n`;
    if (ogDescription) tags += `<meta property="og:description" content="${ogDescription}" />\n`;
    if (ogType) tags += `<meta property="og:type" content="${ogType}" />\n`;
    if (ogUrl) tags += `<meta property="og:url" content="${ogUrl}" />\n`;
    if (ogImage) tags += `<meta property="og:image" content="${ogImage}" />\n`;
    if (ogSiteName) tags += `<meta property="og:site_name" content="${ogSiteName}" />\n`;
    if (ogLocale) tags += `<meta property="og:locale" content="${ogLocale}" />\n`;

    // Twitter Card Tags
    if (twitterCard) tags += `<meta name="twitter:card" content="${twitterCard}" />\n`;
    if (twitterSite) tags += `<meta name="twitter:site" content="${twitterSite}" />\n`;
    if (twitterCreator) tags += `<meta name="twitter:creator" content="${twitterCreator}" />\n`;
    if (twitterTitle) tags += `<meta name="twitter:title" content="${twitterTitle}" />\n`;
    if (twitterDescription) tags += `<meta name="twitter:description" content="${twitterDescription}" />\n`;
    if (twitterImage) tags += `<meta name="twitter:image" content="${twitterImage}" />\n`;

    return tags.trim();
  }, [
    title, description, keywords, author, index, follow, charset, viewport, refreshDelay,
    ogTitle, ogDescription, ogType, ogUrl, ogImage, ogSiteName, ogLocale,
    twitterCard, twitterSite, twitterCreator, twitterTitle, twitterDescription, twitterImage
  ]);

  const generatedHtml = generateMetaTags();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHtml);
    toast.success('Meta tags copied to clipboard!');
  };

  useEffect(() => {
    addToHistory('meta-tag-generator');
  }, [addToHistory]);

  return (
    <ToolPageWrapper
      toolSlug="meta-tag-generator"
      toolName="Meta Tag Generator & OG Preview"
      description="Generate essential meta tags for SEO and social media, with Open Graph and Twitter card previews."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Standard Meta Tags */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Standard Meta Tags</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., My Awesome Website"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  id="description"
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., A comprehensive suite of developer tools."
                ></textarea>
              </div>
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-slate-300 mb-1">Keywords</label>
                <input
                  type="text"
                  id="keywords"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., dev tools, web utilities, code formatter"
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-slate-300 mb-1">Author</label>
                <input
                  type="text"
                  id="author"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., DevForge Team"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="index"
                    className="h-4 w-4 text-indigo-600 bg-slate-900 border-slate-700 rounded focus:ring-indigo-500"
                    checked={index}
                    onChange={(e) => setIndex(e.target.checked)}
                  />
                  <label htmlFor="index" className="ml-2 text-sm text-slate-300">Index (Allow search engines to index this page)</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="follow"
                    className="h-4 w-4 text-indigo-600 bg-slate-900 border-slate-700 rounded focus:ring-indigo-500"
                    checked={follow}
                    onChange={(e) => setFollow(e.target.checked)}
                  />
                  <label htmlFor="follow" className="ml-2 text-sm text-slate-300">Follow (Allow search engines to follow links on this page)</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="charset" className="block text-sm font-medium text-slate-300 mb-1">Charset</label>
                  <input
                    type="text"
                    id="charset"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                    value={charset}
                    onChange={(e) => setCharset(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="viewport" className="block text-sm font-medium text-slate-300 mb-1">Viewport</label>
                  <input
                    type="text"
                    id="viewport"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                    value={viewport}
                    onChange={(e) => setViewport(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="refreshDelay" className="block text-sm font-medium text-slate-300 mb-1">Refresh Delay (seconds, optional)</label>
                <input
                  type="number"
                  id="refreshDelay"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={refreshDelay}
                  onChange={(e) => setRefreshDelay(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g., 5 (for 5-second refresh)"
                />
              </div>
            </div>
          </section>

          {/* Open Graph Tags */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Open Graph Tags (for Facebook, LinkedIn, etc.)</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="ogTitle" className="block text-sm font-medium text-slate-300 mb-1">OG Title</label>
                <input
                  type="text"
                  id="ogTitle"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder="e.g., DevForge: The Ultimate Developer Toolbox"
                />
              </div>
              <div>
                <label htmlFor="ogDescription" className="block text-sm font-medium text-slate-300 mb-1">OG Description</label>
                <textarea
                  id="ogDescription"
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder="e.g., A comprehensive, high-performance web suite of essential developer utilities."
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ogType" className="block text-sm font-medium text-slate-300 mb-1">OG Type</label>
                  <select
                    id="ogType"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                    value={ogType}
                    onChange={(e) => setOgType(e.target.value)}
                  >
                    <option value="website">website</option>
                    <option value="article">article</option>
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
                  <label htmlFor="ogUrl" className="block text-sm font-medium text-slate-300 mb-1">OG URL</label>
                  <input
                    type="url"
                    id="ogUrl"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                    value={ogUrl}
                    onChange={(e) => setOgUrl(e.target.value)}
                    placeholder="e.g., https://devforge.app"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="ogImage" className="block text-sm font-medium text-slate-300 mb-1">OG Image URL</label>
                <input
                  type="url"
                  id="ogImage"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="e.g., https://devforge.app/og-image.jpg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ogSiteName" className="block text-sm font-medium text-slate-300 mb-1">OG Site Name</label>
                  <input
                    type="text"
                    id="ogSiteName"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                    value={ogSiteName}
                    onChange={(e) => setOgSiteName(e.target.value)}
                    placeholder="e.g., DevForge"
                  />
                </div>
                <div>
                  <label htmlFor="ogLocale" className="block text-sm font-medium text-slate-300 mb-1">OG Locale</label>
                  <input
                    type="text"
                    id="ogLocale"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                    value={ogLocale}
                    onChange={(e) => setOgLocale(e.target.value)}
                    placeholder="e.g., en_US"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Twitter Card Tags */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Twitter Card Tags</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="twitterCard" className="block text-sm font-medium text-slate-300 mb-1">Twitter Card Type</label>
                <select
                  id="twitterCard"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value)}
                >
                  <option value="summary">summary</option>
                  <option value="summary_large_image">summary_large_image</option>
                  <option value="app">app</option>
                  <option value="player">player</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="twitterSite" className="block text-sm font-medium text-slate-300 mb-1">Twitter Site (@username)</label>
                  <input
                    type="text"
                    id="twitterSite"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                    value={twitterSite}
                    onChange={(e) => setTwitterSite(e.target.value)}
                    placeholder="e.g., @devforgeapp"
                  />
                </div>
                <div>
                  <label htmlFor="twitterCreator" className="block text-sm font-medium text-slate-300 mb-1">Twitter Creator (@username)</label>
                  <input
                    type="text"
                    id="twitterCreator"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                    value={twitterCreator}
                    onChange={(e) => setTwitterCreator(e.target.value)}
                    placeholder="e.g., @yourhandle"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="twitterTitle" className="block text-sm font-medium text-slate-300 mb-1">Twitter Title</label>
                <input
                  type="text"
                  id="twitterTitle"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={twitterTitle}
                  onChange={(e) => setTwitterTitle(e.target.value)}
                  placeholder="e.g., DevForge: The Ultimate Developer Toolbox"
                />
              </div>
              <div>
                <label htmlFor="twitterDescription" className="block text-sm font-medium text-slate-300 mb-1">Twitter Description</label>
                <textarea
                  id="twitterDescription"
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={twitterDescription}
                  onChange={(e) => setTwitterDescription(e.target.value)}
                  placeholder="e.g., A comprehensive, high-performance web suite of essential developer utilities."
                ></textarea>
              </div>
              <div>
                <label htmlFor="twitterImage" className="block text-sm font-medium text-slate-300 mb-1">Twitter Image URL</label>
                <input
                  type="url"
                  id="twitterImage"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={twitterImage}
                  onChange={(e) => setTwitterImage(e.target.value)}
                  placeholder="e.g., https://devforge.app/twitter-image.jpg"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Output & Preview Section */}
        <div className="lg:col-span-1 space-y-8">
          {/* Generated HTML */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Generated HTML</h2>
            <div className="relative">
              <textarea
                readOnly
                rows={15}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 font-mono text-sm text-slate-100 resize-y focus:ring-indigo-500 focus:border-indigo-500"
                value={generatedHtml}
              ></textarea>
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-slate-50 transition-colors"
                aria-label="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* OG Preview */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Open Graph Preview</h2>
            <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-lg max-w-md mx-auto">
              {ogImage && (
                <div className="h-48 bg-slate-700 flex items-center justify-center overflow-hidden">
                  <img src={ogImage} alt="OG Image" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                {ogUrl && (
                  <p className="text-xs text-slate-400 mb-1 truncate">
                    {(() => {
                      try {
                        return new URL(ogUrl).hostname;
                      } catch {
                        return ogUrl;
                      }
                    })()}
                  </p>
                )}
                <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">
                  {ogTitle || 'Your OG Title Here'}
                </h3>
                <p className="text-sm text-slate-300 line-clamp-3">
                  {ogDescription || 'Your OG description will appear here. This is a preview of how your content might look when shared on social media platforms.'}
                </p>
              </div>
            </div>
          </section>

          {/* Twitter Card Preview */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Twitter Card Preview</h2>
            <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-lg max-w-md mx-auto">
              {twitterCard === 'summary_large_image' && twitterImage && (
                <div className="h-48 bg-slate-700 flex items-center justify-center overflow-hidden">
                  <img src={twitterImage} alt="Twitter Image" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                {twitterCard === 'summary' && twitterImage ? (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">
                        {twitterTitle || 'Your Twitter Title Here'}
                      </h3>
                      <p className="text-sm text-slate-300 line-clamp-3">
                        {twitterDescription || 'Your Twitter description will appear here.'}
                      </p>
                    </div>
                    <div className="w-24 h-24 flex-shrink-0 bg-slate-700 rounded-md overflow-hidden">
                      <img src={twitterImage} alt="Twitter Image" className="w-full h-full object-cover" />
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">
                      {twitterTitle || 'Your Twitter Title Here'}
                    </h3>
                    <p className="text-sm text-slate-300 line-clamp-3">
                      {twitterDescription || 'Your Twitter description will appear here.'}
                    </p>
                  </>
                )}
                {(twitterSite || twitterCreator) && (
                  <p className="text-xs text-slate-400 mt-2">
                    {twitterSite && <span>{twitterSite.startsWith('@') ? twitterSite : `@${twitterSite}`}</span>}
                    {twitterSite && twitterCreator && <span className="mx-1">•</span>}
                    {twitterCreator && <span>By {twitterCreator.startsWith('@') ? twitterCreator : `@${twitterCreator}`}</span>}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default MetaTagGeneratorPage;