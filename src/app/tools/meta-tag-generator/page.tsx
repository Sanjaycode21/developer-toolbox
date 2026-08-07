"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, ExternalLink } from 'lucide-react';

const MetaTagGeneratorPage: React.FC = () => {
    const toolSlug = "meta-tag-generator";
    const { addToHistory } = useToolStore();

    // General Meta Tags
    const [pageTitle, setPageTitle] = useState(''); // Renamed from 'title' to avoid conflict with HTML <title>
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [author, setAuthor] = useState('');
    const [robotsIndex, setRobotsIndex] = useState('index');
    const [robotsFollow, setRobotsFollow] = useState('follow');
    const [charset, setCharset] = useState('UTF-8');
    const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
    const [refreshDelay, setRefreshDelay] = useState('');
    const [refreshUrl, setRefreshUrl] = useState('');

    // Open Graph Tags
    const [ogTitle, setOgTitle] = useState('');
    const [ogDescription, setOgDescription] = useState('');
    const [ogUrl, setOgUrl] = useState('');
    const [ogType, setOgType] = useState('website');
    const [ogImage, setOgImage] = useState('');
    const [ogImageAlt, setOgImageAlt] = useState('');

    // Twitter Card Tags
    const [twitterCard, setTwitterCard] = useState('summary_large_image');
    const [twitterSite, setTwitterSite] = useState('');
    const [twitterCreator, setTwitterCreator] = useState('');
    const [twitterTitle, setTwitterTitle] = useState('');
    const [twitterDescription, setTwitterDescription] = useState('');
    const [twitterImage, setTwitterImage] = useState('');
    const [twitterImageAlt, setTwitterImageAlt] = useState('');

    useEffect(() => {
        addToHistory(toolSlug);
    }, [addToHistory, toolSlug]);

    const generatedMetaTags = useCallback(() => {
        let tags: string[] = [];

        // Standard Meta Tags
        if (charset) tags.push(`<meta charset="${charset}" />`);
        if (viewport) tags.push(`<meta name="viewport" content="${viewport}" />`);
        if (pageTitle) tags.push(`<title>${pageTitle}</title>`); // <title> tag is not a meta tag, but essential for SEO
        if (description) tags.push(`<meta name="description" content="${description}" />`);
        if (keywords) tags.push(`<meta name="keywords" content="${keywords}" />`);
        if (author) tags.push(`<meta name="author" content="${author}" />`);
        tags.push(`<meta name="robots" content="${robotsIndex}, ${robotsFollow}" />`);
        if (refreshDelay && refreshUrl) tags.push(`<meta http-equiv="refresh" content="${refreshDelay};url=${refreshUrl}" />`);
        else if (refreshDelay) tags.push(`<meta http-equiv="refresh" content="${refreshDelay}" />`);

        // Open Graph Tags
        if (ogTitle) tags.push(`<meta property="og:title" content="${ogTitle}" />`);
        if (ogDescription) tags.push(`<meta property="og:description" content="${ogDescription}" />`);
        if (ogUrl) tags.push(`<meta property="og:url" content="${ogUrl}" />`);
        if (ogType) tags.push(`<meta property="og:type" content="${ogType}" />`);
        if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}" />`);
        if (ogImageAlt) tags.push(`<meta property="og:image:alt" content="${ogImageAlt}" />`);

        // Twitter Card Tags
        if (twitterCard) tags.push(`<meta name="twitter:card" content="${twitterCard}" />`);
        if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}" />`);
        if (twitterCreator) tags.push(`<meta name="twitter:creator" content="${twitterCreator}" />`);
        if (twitterTitle) tags.push(`<meta name="twitter:title" content="${twitterTitle}" />`);
        if (twitterDescription) tags.push(`<meta name="twitter:description" content="${twitterDescription}" />`);
        if (twitterImage) tags.push(`<meta name="twitter:image" content="${twitterImage}" />`);
        if (twitterImageAlt) tags.push(`<meta name="twitter:image:alt" content="${twitterImageAlt}" />`);

        return tags.join('\n');
    }, [
        pageTitle, description, keywords, author, robotsIndex, robotsFollow, charset, viewport,
        refreshDelay, refreshUrl,
        ogTitle, ogDescription, ogUrl, ogType, ogImage, ogImageAlt,
        twitterCard, twitterSite, twitterCreator, twitterTitle, twitterDescription, twitterImage, twitterImageAlt
    ]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedMetaTags());
        toast.success('Meta tags copied to clipboard!');
    };

    const commonInputClasses = "w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";
    const commonLabelClasses = "block text-sm font-medium text-slate-400 mb-1";
    const sectionTitleClasses = "text-lg font-semibold text-slate-100 mb-4 border-b border-slate-700 pb-2";

    const defaultOgImage = "https://via.placeholder.com/1200x630/1e293b/e2e8f0?text=DevForge+OG+Image";
    const defaultTwitterImage = "https://via.placeholder.com/800x418/1e293b/e2e8f0?text=DevForge+Twitter+Image";

    const getHostname = (url: string) => {
        try {
            return new URL(url).hostname;
        } catch {
            return url; // Fallback to raw URL if invalid
        }
    };

    return (
        <ToolPageWrapper
            toolSlug={toolSlug}
            toolName="Meta Tag Generator & OG Preview"
            description="Generate essential meta tags for SEO and social media, and preview Open Graph & Twitter cards."
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Forms */}
                <div className="space-y-8">
                    {/* General Meta Tags */}
                    <section className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                        <h2 className={sectionTitleClasses}>General Meta Tags</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="pageTitle" className={commonLabelClasses}>Page Title</label>
                                <input
                                    type="text"
                                    id="pageTitle"
                                    className={commonInputClasses}
                                    value={pageTitle}
                                    onChange={(e) => setPageTitle(e.target.value)}
                                    placeholder="e.g., My Awesome Website"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className={commonLabelClasses}>Description</label>
                                <textarea
                                    id="description"
                                    className={`${commonInputClasses} h-20`}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="A brief summary of your page content."
                                />
                            </div>
                            <div>
                                <label htmlFor="keywords" className={commonLabelClasses}>Keywords (comma-separated)</label>
                                <input
                                    type="text"
                                    id="keywords"
                                    className={commonInputClasses}
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    placeholder="e.g., web development, tools, utility"
                                />
                            </div>
                            <div>
                                <label htmlFor="author" className={commonLabelClasses}>Author</label>
                                <input
                                    type="text"
                                    id="author"
                                    className={commonInputClasses}
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="e.g., John Doe"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="robotsIndex" className={commonLabelClasses}>Robots Index</label>
                                    <select
                                        id="robotsIndex"
                                        className={commonInputClasses}
                                        value={robotsIndex}
                                        onChange={(e) => setRobotsIndex(e.target.value)}
                                    >
                                        <option value="index">index</option>
                                        <option value="noindex">noindex</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="robotsFollow" className={commonLabelClasses}>Robots Follow</label>
                                    <select
                                        id="robotsFollow"
                                        className={commonInputClasses}
                                        value={robotsFollow}
                                        onChange={(e) => setRobotsFollow(e.target.value)}
                                    >
                                        <option value="follow">follow</option>
                                        <option value="nofollow">nofollow</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="charset" className={commonLabelClasses}>Charset</label>
                                <input
                                    type="text"
                                    id="charset"
                                    className={commonInputClasses}
                                    value={charset}
                                    onChange={(e) => setCharset(e.target.value)}
                                    placeholder="e.g., UTF-8"
                                />
                            </div>
                            <div>
                                <label htmlFor="viewport" className={commonLabelClasses}>Viewport</label>
                                <input
                                    type="text"
                                    id="viewport"
                                    className={commonInputClasses}
                                    value={viewport}
                                    onChange={(e) => setViewport(e.target.value)}
                                    placeholder="e.g., width=device-width, initial-scale=1.0"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="refreshDelay" className={commonLabelClasses}>Refresh Delay (seconds)</label>
                                    <input
                                        type="number"
                                        id="refreshDelay"
                                        className={commonInputClasses}
                                        value={refreshDelay}
                                        onChange={(e) => setRefreshDelay(e.target.value)}
                                        placeholder="e.g., 5"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="refreshUrl" className={commonLabelClasses}>Refresh URL (optional)</label>
                                    <input
                                        type="url"
                                        id="refreshUrl"
                                        className={commonInputClasses}
                                        value={refreshUrl}
                                        onChange={(e) => setRefreshUrl(e.target.value)}
                                        placeholder="e.g., https://example.com/new-page"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Open Graph Tags */}
                    <section className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                        <h2 className={sectionTitleClasses}>Open Graph Tags (Facebook, LinkedIn, etc.)</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="ogTitle" className={commonLabelClasses}>OG Title</label>
                                <input
                                    type="text"
                                    id="ogTitle"
                                    className={commonInputClasses}
                                    value={ogTitle}
                                    onChange={(e) => setOgTitle(e.target.value)}
                                    placeholder="e.g., My Awesome Website for Developers"
                                />
                            </div>
                            <div>
                                <label htmlFor="ogDescription" className={commonLabelClasses}>OG Description</label>
                                <textarea
                                    id="ogDescription"
                                    className={`${commonInputClasses} h-20`}
                                    value={ogDescription}
                                    onChange={(e) => setOgDescription(e.target.value)}
                                    placeholder="A compelling description for social media shares."
                                />
                            </div>
                            <div>
                                <label htmlFor="ogUrl" className={commonLabelClasses}>OG URL</label>
                                <input
                                    type="url"
                                    id="ogUrl"
                                    className={commonInputClasses}
                                    value={ogUrl}
                                    onChange={(e) => setOgUrl(e.target.value)}
                                    placeholder="e.g., https://devforge.com/my-page"
                                />
                            </div>
                            <div>
                                <label htmlFor="ogType" className={commonLabelClasses}>OG Type</label>
                                <select
                                    id="ogType"
                                    className={commonInputClasses}
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
                                <label htmlFor="ogImage" className={commonLabelClasses}>OG Image URL</label>
                                <input
                                    type="url"
                                    id="ogImage"
                                    className={commonInputClasses}
                                    value={ogImage}
                                    onChange={(e) => setOgImage(e.target.value)}
                                    placeholder="e.g., https://example.com/og-image.jpg"
                                />
                            </div>
                            <div>
                                <label htmlFor="ogImageAlt" className={commonLabelClasses}>OG Image Alt Text</label>
                                <input
                                    type="text"
                                    id="ogImageAlt"
                                    className={commonInputClasses}
                                    value={ogImageAlt}
                                    onChange={(e) => setOgImageAlt(e.target.value)}
                                    placeholder="e.g., A descriptive alt text for the image"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Twitter Card Tags */}
                    <section className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                        <h2 className={sectionTitleClasses}>Twitter Card Tags</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="twitterCard" className={commonLabelClasses}>Twitter Card Type</label>
                                <select
                                    id="twitterCard"
                                    className={commonInputClasses}
                                    value={twitterCard}
                                    onChange={(e) => setTwitterCard(e.target.value)}
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
                                    className={commonInputClasses}
                                    value={twitterSite}
                                    onChange={(e) => setTwitterSite(e.target.value)}
                                    placeholder="e.g., @DevForgeApp"
                                />
                            </div>
                            <div>
                                <label htmlFor="twitterCreator" className={commonLabelClasses}>Twitter Creator (@username)</label>
                                <input
                                    type="text"
                                    id="twitterCreator"
                                    className={commonInputClasses}
                                    value={twitterCreator}
                                    onChange={(e) => setTwitterCreator(e.target.value)}
                                    placeholder="e.g., @YourHandle"
                                />
                            </div>
                            <div>
                                <label htmlFor="twitterTitle" className={commonLabelClasses}>Twitter Title</label>
                                <input
                                    type="text"
                                    id="twitterTitle"
                                    className={commonInputClasses}
                                    value={twitterTitle}
                                    onChange={(e) => setTwitterTitle(e.target.value)}
                                    placeholder="e.g., Check out this awesome tool!"
                                />
                            </div>
                            <div>
                                <label htmlFor="twitterDescription" className={commonLabelClasses}>Twitter Description</label>
                                <textarea
                                    id="twitterDescription"
                                    className={`${commonInputClasses} h-20`}
                                    value={twitterDescription}
                                    onChange={(e) => setTwitterDescription(e.target.value)}
                                    placeholder="A concise description for Twitter."
                                />
                            </div>
                            <div>
                                <label htmlFor="twitterImage" className={commonLabelClasses}>Twitter Image URL</label>
                                <input
                                    type="url"
                                    id="twitterImage"
                                    className={commonInputClasses}
                                    value={twitterImage}
                                    onChange={(e) => setTwitterImage(e.target.value)}
                                    placeholder="e.g., https://example.com/twitter-image.jpg"
                                />
                            </div>
                            <div>
                                <label htmlFor="twitterImageAlt" className={commonLabelClasses}>Twitter Image Alt Text</label>
                                <input
                                    type="text"
                                    id="twitterImageAlt"
                                    className={commonInputClasses}
                                    value={twitterImageAlt}
                                    onChange={(e) => setTwitterImageAlt(e.target.value)}
                                    placeholder="e.g., Alt text for the Twitter image"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Output & Preview */}
                <div className="space-y-8">
                    {/* Generated Meta Tags */}
                    <section className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                        <h2 className={sectionTitleClasses}>Generated Meta Tags</h2>
                        <div className="relative">
                            <textarea
                                readOnly
                                className={`${commonInputClasses} font-mono text-xs h-96 resize-y`}
                                value={generatedMetaTags()}
                            />
                            <button
                                onClick={handleCopy}
                                className="absolute top-3 right-3 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center gap-1 text-xs"
                            >
                                <Copy size={14} /> Copy
                            </button>
                        </div>
                    </section>

                    {/* Open Graph Preview */}
                    <section className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                        <h2 className={sectionTitleClasses}>Open Graph Preview</h2>
                        <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-lg max-w-md mx-auto">
                            <div className="relative w-full h-48 bg-slate-700 flex items-center justify-center text-slate-400 text-sm overflow-hidden">
                                {ogImage ? (
                                    <img src={ogImage} alt={ogImageAlt || "Open Graph Image"} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={defaultOgImage} alt="Default Open Graph Image" className="w-full h-full object-cover" />
                                )}
                                {ogImage && (
                                    <a href={ogImage} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                            <div className="p-4 space-y-1">
                                <p className="text-xs text-slate-400 uppercase">
                                    {ogUrl ? getHostname(ogUrl) : 'example.com'}
                                </p>
                                <h3 className="text-lg font-semibold text-slate-100 line-clamp-2">
                                    {ogTitle || pageTitle || 'Your Page Title Here'}
                                </h3>
                                <p className="text-sm text-slate-300 line-clamp-3">
                                    {ogDescription || description || 'A compelling description of your content.'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Twitter Card Preview */}
                    <section className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                        <h2 className={sectionTitleClasses}>Twitter Card Preview</h2>
                        <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-lg max-w-md mx-auto">
                            {twitterCard === 'summary_large_image' && (
                                <div className="relative w-full h-48 bg-slate-700 flex items-center justify-center text-slate-400 text-sm overflow-hidden">
                                    {twitterImage ? (
                                        <img src={twitterImage} alt={twitterImageAlt || "Twitter Image"} className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={defaultTwitterImage} alt="Default Twitter Image" className="w-full h-full object-cover" />
                                    )}
                                    {twitterImage && (
                                        <a href={twitterImage} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            )}
                            <div className="p-4 space-y-1">
                                <h3 className="text-lg font-semibold text-slate-100 line-clamp-2">
                                    {twitterTitle || ogTitle || pageTitle || 'Your Page Title Here'}
                                </h3>
                                <p className="text-sm text-slate-300 line-clamp-3">
                                    {twitterDescription || ogDescription || description || 'A concise description for Twitter.'}
                                </p>
                                <div className="flex items-center text-xs text-slate-400 mt-2">
                                    {twitterSite && <span className="mr-2">{twitterSite}</span>}
                                    {ogUrl && (
                                        <a href={ogUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
                                            <ExternalLink size={12} />
                                            {getHostname(ogUrl)}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </ToolPageWrapper>
    );
};

export default MetaTagGeneratorPage;