"use client";

import React, { useState, useCallback, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";
import { FileText, Copy } from "lucide-react";

const SitemapXmlGenerator: React.FC = () => {
  const toolSlug = "sitemap-xml-generator";
  const { addToHistory } = useToolStore();

  const [baseUrl, setBaseUrl] = useState<string>("");
  const [lastMod, setLastMod] = useState<string>(new Date().toISOString().split("T")[0]);
  const [changeFreq, setChangeFreq] = useState<string>("daily");
  const [priority, setPriority] = useState<string>("0.8");
  const [additionalUrls, setAdditionalUrls] = useState<string>("");
  const [generatedSitemap, setGeneratedSitemap] = useState<string>("");

  const changeFrequencyOptions = useMemo(() => [
    "always", "hourly", "daily", "weekly", "monthly", "yearly", "never"
  ], []);

  const generateSitemap = useCallback(() => {
    addToHistory(toolSlug);

    if (!baseUrl.trim()) {
      toast.error("Base URL is required.");
      return;
    }

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add base URL
    sitemapXml += `  <url>\n`;
    sitemapXml += `    <loc>${baseUrl.trim()}</loc>\n`;
    if (lastMod) {
      sitemapXml += `    <lastmod>${lastMod}</lastmod>\n`;
    }
    if (changeFreq) {
      sitemapXml += `    <changefreq>${changeFreq}</changefreq>\n`;
    }
    const parsedPriority = parseFloat(priority);
    if (!isNaN(parsedPriority) && parsedPriority >= 0.0 && parsedPriority <= 1.0) {
      sitemapXml += `    <priority>${parsedPriority.toFixed(1)}</priority>\n`;
    }
    sitemapXml += `  </url>\n`;

    // Add additional URLs
    const urls = additionalUrls.split("\n").map((url) => url.trim()).filter(Boolean);
    urls.forEach((url) => {
      sitemapXml += `  <url>\n`;
      sitemapXml += `    <loc>${url}</loc>\n`;
      // For additional URLs, we don't apply the global lastmod/changefreq/priority by default
      // unless specific logic is added to parse them per-URL.
      // For simplicity, we'll just add the loc.
      sitemapXml += `  </url>\n`;
    });

    sitemapXml += `</urlset>`;
    setGeneratedSitemap(sitemapXml);
    toast.success("Sitemap generated successfully!");
  }, [baseUrl, lastMod, changeFreq, priority, additionalUrls, addToHistory, toolSlug]);

  const copyToClipboard = useCallback(() => {
    if (generatedSitemap) {
      navigator.clipboard.writeText(generatedSitemap);
      toast.success("Sitemap copied to clipboard!");
    } else {
      toast.error("Nothing to copy!");
    }
  }, [generatedSitemap]);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="Sitemap.xml Generator"
      description="Generate a sitemap.xml file for your website to help search engines crawl your site more efficiently."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col">
            <label htmlFor="baseUrl" className="text-sm font-medium text-slate-300 mb-1">
              Base URL <span className="text-red-500">*</span>
            </label>
            <input
              id="baseUrl"
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="e.g., https://www.example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-slate-50 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 outline-none transition-colors text-sm"
              required
            />
            <p className="text-xs text-slate-500 mt-1">The main URL of your website.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label htmlFor="lastMod" className="text-sm font-medium text-slate-300 mb-1">
                Last Modified Date
              </label>
              <input
                id="lastMod"
                type="date"
                value={lastMod}
                onChange={(e) => setLastMod(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-slate-50 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 outline-none transition-colors text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">Date of last modification (YYYY-MM-DD).</p>
            </div>

            <div className="flex flex-col">
              <label htmlFor="changeFreq" className="text-sm font-medium text-slate-300 mb-1">
                Change Frequency
              </label>
              <select
                id="changeFreq"
                value={changeFreq}
                onChange={(e) => setChangeFreq(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-slate-50 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 outline-none transition-colors text-sm appearance-none pr-8"
              >
                {changeFrequencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">How frequently the page is likely to change.</p>
            </div>

            <div className="flex flex-col">
              <label htmlFor="priority" className="text-sm font-medium text-slate-300 mb-1">
                Priority
              </label>
              <input
                id="priority"
                type="number"
                step="0.1"
                min="0.0"
                max="1.0"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder="0.8"
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-slate-50 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 outline-none transition-colors text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">Priority of this URL relative to others (0.0 - 1.0).</p>
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <label htmlFor="additionalUrls" className="text-sm font-medium text-slate-300 mb-1">
              Additional URLs (one per line)
            </label>
            <textarea
              id="additionalUrls"
              value={additionalUrls}
              onChange={(e) => setAdditionalUrls(e.target.value)}
              rows={8}
              placeholder="e.g.,
https://www.example.com/about
https://www.example.com/contact
https://www.example.com/products/item1"
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-slate-50 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 outline-none transition-colors text-sm font-mono resize-y flex-1"
            />
            <p className="text-xs text-slate-500 mt-1">List any other pages you want to include in the sitemap.</p>
          </div>

          <button
            onClick={generateSitemap}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FileText size={18} /> Generate Sitemap
          </button>
        </div>

        {/* Output Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-200">Generated Sitemap.xml</h3>
            <button
              onClick={copyToClipboard}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium py-1.5 px-3 rounded-md transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              disabled={!generatedSitemap}
            >
              <Copy size={16} /> Copy
            </button>
          </div>
          <textarea
            value={generatedSitemap}
            readOnly
            rows={20}
            placeholder="Your sitemap.xml will appear here..."
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-3 text-slate-50 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 outline-none transition-colors text-sm font-mono resize-y flex-1"
          />
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SitemapXmlGenerator;