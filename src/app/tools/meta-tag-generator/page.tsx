"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";
import { Copy, RefreshCcw } from "lucide-react";

interface OGPreviewProps {
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  ogUrl: string;
  ogSiteName: string;
  ogType: string;
}

const OGPreview: React.FC<OGPreviewProps> = ({
  ogTitle,
  ogDescription,
  ogImageUrl,
  ogUrl,
  ogSiteName,
  ogType,
}) => {
  const displayUrl = ogUrl || "https://example.com";
  const displaySiteName = ogSiteName || "Example Site";
  const displayTitle = ogTitle || "Default Title";
  const displayDescription = ogDescription || "Default description for your content.";
  const displayImage = ogImageUrl || "/next.svg"; // A placeholder image

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg max-w-md mx-auto">
      {displayImage && (
        <div className="relative w-full h-48 bg-slate-700 flex items-center justify-center overflow-hidden">
          <img
            src={displayImage}
            alt="Open Graph Preview"
            className="object-cover w-full h-full"
            onError={(e) => {
              e.currentTarget.src = "/next.svg"; // Fallback to a default image
              e.currentTarget.onerror = null;
            }}
          />
        </div>
      )}
      <div className="p-4">
        <p className="text-xs text-slate-400 mb-1">
          {new URL(displayUrl).hostname.toUpperCase()} {ogType && `• ${ogType.toUpperCase()}`}
        </p>
        <h3 className="text-lg font-semibold text-slate-100 mb-2 line-clamp-2">{displayTitle}</h3>
        <p className="text-sm text-slate-300 line-clamp-3">{displayDescription}</p>
        <p className="text-xs text-indigo-400 mt-3 truncate">{displayUrl}</p>
      </div>
    </div>
  );
};

const MetaTagGeneratorPage: React.FC = () => {
  const toolSlug = "meta-tag-generator";
  const { addToHistory } = useToolStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [viewport, setViewport] = useState("width=device-width, initial-scale=1.0");
  const [charset, setCharset] = useState("UTF-8");
  const [robots, setRobots] = useState("index, follow");
  const [canonicalUrl, setCanonicalUrl] = useState("");

  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [ogType, setOgType] = useState("website");
  const [ogUrl, setOgUrl] = useState("");
  const [ogSiteName, setOgSiteName] = useState("");
  const [ogLocale, setOgLocale] = useState("en_US");

  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [twitterSite, setTwitterSite] = useState("");
  const [twitterCreator, setTwitterCreator] = useState("");
  const [twitterTitle, setTwitterTitle] = useState("");
  const [twitterDescription, setTwitterDescription] = useState("");
  const [twitterImageUrl, setTwitterImageUrl] = useState("");

  const [generatedTags, setGeneratedTags] = useState("");

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const generateMetaTags = useCallback(() => {
    let tags = [];

    // Basic Meta Tags
    tags.push(`<meta charset="${charset}" />`);
    if (viewport) tags.push(`<meta name="viewport" content="${viewport}" />`);
    if (title) tags.push(`<title>${title}</title>`);
    if (description) tags.push(`<meta name="description" content="${description}" />`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}" />`);
    if (author) tags.push(`<meta name="author" content="${author}" />`);
    if (robots) tags.push(`<meta name="robots" content="${robots}" />`);
    if (canonicalUrl) tags.push(`<link rel="canonical" href="${canonicalUrl}" />`);

    // Open Graph Tags
    const finalOgTitle = ogTitle || title;
    const finalOgDescription = ogDescription || description;
    const finalOgUrl = ogUrl || canonicalUrl;
    const finalOgImageUrl = ogImageUrl;

    if (finalOgTitle) tags.push(`<meta property="og:title" content="${finalOgTitle}" />`);
    if (finalOgDescription) tags.push(`<meta property="og:description" content="${finalOgDescription}" />`);
    if (finalOgImageUrl) tags.push(`<meta property="og:image" content="${finalOgImageUrl}" />`);
    if (ogType) tags.push(`<meta property="og:type" content="${ogType}" />`);
    if (finalOgUrl) tags.push(`<meta property="og:url" content="${finalOgUrl}" />`);
    if (ogSiteName) tags.push(`<meta property="og:site_name" content="${ogSiteName}" />`);
    if (ogLocale) tags.push(`<meta property="og:locale" content="${ogLocale}" />`);

    // Twitter Card Tags
    const finalTwitterTitle = twitterTitle || finalOgTitle;
    const finalTwitterDescription = twitterDescription || finalOgDescription;
    const finalTwitterImageUrl = twitterImageUrl || finalOgImageUrl;

    if (twitterCard) tags.push(`<meta name="twitter:card" content="${twitterCard}" />`);
    if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}" />`);
    if (twitterCreator) tags.push(`<meta name="twitter:creator" content="${twitterCreator}" />`);
    if (finalTwitterTitle) tags.push(`<meta name="twitter:title" content="${finalTwitterTitle}" />`);
    if (finalTwitterDescription) tags.push(`<meta name="twitter:description" content="${finalTwitterDescription}" />`);
    if (finalTwitterImageUrl) tags.push(`<meta name="twitter:image" content="${finalTwitterImageUrl}" />`);

    setGeneratedTags(tags.join("\n"));
  }, [
    title, description, keywords, author, viewport, charset, robots, canonicalUrl,
    ogTitle, ogDescription, ogImageUrl, ogType, ogUrl, ogSiteName, ogLocale,
    twitterCard, twitterSite, twitterCreator, twitterTitle, twitterDescription, twitterImageUrl
  ]);

  useEffect(() => {
    generateMetaTags();
  }, [generateMetaTags]);

  const handleCopy = () => {
    if (generatedTags) {
      navigator.clipboard.writeText(generatedTags);
      toast.success("Meta tags copied to clipboard!");
    } else {
      toast.error("No tags to copy.");
    }
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setKeywords("");
    setAuthor("");
    setViewport("width=device-width, initial-scale=1.0");
    setCharset("UTF-8");
    setRobots("index, follow");
    setCanonicalUrl("");
    setOgTitle("");
    setOgDescription("");
    setOgImageUrl("");
    setOgType("website");
    setOgUrl("");
    setOgSiteName("");
    setOgLocale("en_US");
    setTwitterCard("summary_large_image");
    setTwitterSite("");
    setTwitterCreator("");
    setTwitterTitle("");
    setTwitterDescription("");
    setTwitterImageUrl("");
    toast.success("All fields reset!");
  };

  const commonInputClasses = "w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 rounded-md px-3 py-2 text-sm text-slate-200 placeholder-slate-500 transition-colors";
  const commonLabelClasses = "block text-sm font-medium text-slate-400 mb-1";
  const commonButtonClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors";

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="Meta Tag Generator & OG Preview"
      description="Generate essential meta tags for SEO and social media, including Open Graph and Twitter Cards, with a live preview."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col gap-6">
          {/* Basic Meta Tags */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Basic Meta Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className={commonLabelClasses}>Page Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., My Awesome Page"
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="description" className={commonLabelClasses}>Description</label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., A short description of my page."
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="keywords" className={commonLabelClasses}>Keywords (comma-separated)</label>
                <input
                  type="text"
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., web, dev, tool"
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="author" className={commonLabelClasses}>Author</label>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., John Doe"
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="viewport" className={commonLabelClasses}>Viewport</label>
                <input
                  type="text"
                  id="viewport"
                  value={viewport}
                  onChange={(e) => setViewport(e.target.value)}
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="charset" className={commonLabelClasses}>Charset</label>
                <input
                  type="text"
                  id="charset"
                  value={charset}
                  onChange={(e) => setCharset(e.target.value)}
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="robots" className={commonLabelClasses}>Robots</label>
                <input
                  type="text"
                  id="robots"
                  value={robots}
                  onChange={(e) => setRobots(e.target.value)}
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="canonicalUrl" className={commonLabelClasses}>Canonical URL</label>
                <input
                  type="url"
                  id="canonicalUrl"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="e.g., https://example.com/page"
                  className={commonInputClasses}
                />
              </div>
            </div>
          </section>

          {/* Open Graph Tags */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Open Graph Tags (Facebook, LinkedIn, etc.)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ogTitle" className={commonLabelClasses}>OG Title (defaults to Page Title)</label>
                <input
                  type="text"
                  id="ogTitle"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder="e.g., My Awesome Page for Social"
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="ogDescription" className={commonLabelClasses}>OG Description (defaults to Description)</label>
                <input
                  type="text"
                  id="ogDescription"
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder="e.g., A compelling description for social media."
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="ogImageUrl" className={commonLabelClasses}>OG Image URL</label>
                <input
                  type="url"
                  id="ogImageUrl"
                  value={ogImageUrl}
                  onChange={(e) => setOgImageUrl(e.target.value)}
                  placeholder="e.g., https://example.com/image.jpg"
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="ogType" className={commonLabelClasses}>OG Type</label>
                <select
                  id="ogType"
                  value={ogType}
                  onChange={(e) => setOgType(e.target.value)}
                  className={commonInputClasses}
                >
                  <option value="website">website</option>
                  <option value="article">article</option>
                  <option value="book">book</option>
                  <option value="profile">profile</option>
                  <option value="video.movie">video.movie</option>
                  <option value="video.episode">video.episode</option>
                  <option value="video.tv_show">video.tv_show</option>
                  <option value="video.other">video.other</option>
                </select>
              </div>
              <div>
                <label htmlFor="ogUrl" className={commonLabelClasses}>OG URL (defaults to Canonical URL)</label>
                <input
                  type="url"
                  id="ogUrl"
                  value={ogUrl}
                  onChange={(e) => setOgUrl(e.target.value)}
                  placeholder="e.g., https://example.com/page"
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="ogSiteName" className={commonLabelClasses}>OG Site Name</label>
                <input
                  type="text"
                  id="ogSiteName"
                  value={ogSiteName}
                  onChange={(e) => setOgSiteName(e.target.value)}
                  placeholder="e.g., My Company"
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="ogLocale" className={commonLabelClasses}>OG Locale</label>
                <input
                  type="text"
                  id="ogLocale"
                  value={ogLocale}
                  onChange={(e) => setOgLocale(e.target.value)}
                  placeholder="e.g., en_US"
                  className={commonInputClasses}
                />
              </div>
            </div>
          </section>

          {/* Twitter Card Tags */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Twitter Card Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="twitterCard" className={commonLabelClasses}>Twitter Card Type</label>
                <select
                  id="twitterCard"
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value)}
                  className={commonInputClasses}
                >
                  <option value="summary">summary</option>
                  <option value="summary_large_image">summary_large_image</option>
                  <option value="app">app</option>
                  <option value="player">player</option>
                </select>
              </div>
              <div>
                <label htmlFor="twitterSite" className={commonLabelClasses}>Twitter Site (@username)</label>
                <input
                  type="text"
                  id="twitterSite"
                  value={twitterSite}
                  onChange={(e) => setTwitterSite(e.target.value)}
                  placeholder="e.g., @YourCompany"
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="twitterCreator" className={commonLabelClasses}>Twitter Creator (@username)</label>
                <input
                  type="text"
                  id="twitterCreator"
                  value={twitterCreator}
                  onChange={(e) => setTwitterCreator(e.target.value)}
                  placeholder="e.g., @YourProfile"
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="twitterTitle" className={commonLabelClasses}>Twitter Title (defaults to OG Title)</label>
                <input
                  type="text"
                  id="twitterTitle"
                  value={twitterTitle}
                  onChange={(e) => setTwitterTitle(e.target.value)}
                  placeholder="e.g., My Awesome Tweet Title"
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="twitterDescription" className={commonLabelClasses}>Twitter Description (defaults to OG Description)</label>
                <input
                  type="text"
                  id="twitterDescription"
                  value={twitterDescription}
                  onChange={(e) => setTwitterDescription(e.target.value)}
                  placeholder="e.g., A concise description for Twitter."
                  className={commonInputClasses}
                />
              </div>
              <div>
                <label htmlFor="twitterImageUrl" className={commonLabelClasses}>Twitter Image URL (defaults to OG Image URL)</label>
                <input
                  type="url"
                  id="twitterImageUrl"
                  value={twitterImageUrl}
                  onChange={(e) => setTwitterImageUrl(e.target.value)}
                  placeholder="e.g., https://example.com/twitter-image.jpg"
                  className={commonInputClasses}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Output and Preview Section */}
        <div className="flex flex-col gap-6">
          {/* Generated Tags */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex-1">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Generated Meta Tags</h2>
            <textarea
              value={generatedTags}
              readOnly
              rows={15}
              className={`${commonInputClasses} font-mono text-xs resize-y min-h-[200px]`}
              placeholder="Generated meta tags will appear here..."
            ></textarea>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCopy}
                className={`${commonButtonClasses} bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2`}
              >
                <Copy size={16} /> Copy Tags
              </button>
              <button
                onClick={handleReset}
                className={`${commonButtonClasses} bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center gap-2`}
              >
                <RefreshCcw size={16} /> Reset All
              </button>
            </div>
          </section>

          {/* Open Graph Preview */}
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Open Graph Preview</h2>
            <OGPreview
              ogTitle={ogTitle || title}
              ogDescription={ogDescription || description}
              ogImageUrl={ogImageUrl}
              ogUrl={ogUrl || canonicalUrl}
              ogSiteName={ogSiteName}
              ogType={ogType}
            />
            <p className="text-sm text-slate-400 mt-4">
              This is a simplified preview. Actual rendering may vary slightly across platforms.
            </p>
          </section>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default MetaTagGeneratorPage;