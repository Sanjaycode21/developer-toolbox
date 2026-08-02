"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Plus, X, Copy, RotateCcw } from 'lucide-react';

interface Rule {
  type: 'Allow' | 'Disallow';
  path: string;
}

const RobotsTxtGeneratorPage: React.FC = () => {
  const [userAgent, setUserAgent] = useState<string>('*');
  const [rules, setRules] = useState<Rule[]>([{ type: 'Disallow', path: '/' }]);
  const [sitemaps, setSitemaps] = useState<string[]>([]);
  const [crawlDelay, setCrawlDelay] = useState<string>('');
  const [generatedRobotsTxt, setGeneratedRobotsTxt] = useState<string>('');

  const addToHistory = useToolStore((state) => state.addToHistory);

  useEffect(() => {
    addToHistory('robots-txt-generator');
  }, [addToHistory]);

  const generateRobotsTxt = useCallback(() => {
    let content = `User-agent: ${userAgent}\n`;

    rules.forEach(rule => {
      if (rule.path.trim()) {
        content += `${rule.type}: ${rule.path.trim()}\n`;
      }
    });

    if (crawlDelay.trim() && !isNaN(Number(crawlDelay))) {
      content += `Crawl-delay: ${crawlDelay.trim()}\n`;
    }

    sitemaps.forEach(sitemap => {
      if (sitemap.trim()) {
        content += `Sitemap: ${sitemap.trim()}\n`;
      }
    });

    setGeneratedRobotsTxt(content.trim());
  }, [userAgent, rules, sitemaps, crawlDelay]);

  useEffect(() => {
    generateRobotsTxt();
  }, [generateRobotsTxt]);

  const handleAddRule = () => {
    setRules([...rules, { type: 'Allow', path: '' }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index: number, field: keyof Rule, value: string) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const handleAddSitemap = () => {
    setSitemaps([...sitemaps, '']);
  };

  const handleRemoveSitemap = (index: number) => {
    setSitemaps(sitemaps.filter((_, i) => i !== index));
  };

  const handleSitemapChange = (index: number, value: string) => {
    const newSitemaps = [...sitemaps];
    newSitemaps[index] = value;
    setSitemaps(newSitemaps);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedRobotsTxt);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy!');
      console.error('Failed to copy:', err);
    }
  };

  const handleClear = () => {
    setUserAgent('*');
    setRules([{ type: 'Disallow', path: '/' }]);
    setSitemaps([]);
    setCrawlDelay('');
    toast.success('Settings cleared!');
  };

  return (
    <ToolPageWrapper
      toolSlug="robots-txt-generator"
      toolName="Robots.txt Generator"
      description="Generate a custom robots.txt file to control web crawler access to your site."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col space-y-6">
          {/* User-agent */}
          <div>
            <label htmlFor="userAgent" className="block text-sm font-medium text-slate-300 mb-2">
              User-agent
            </label>
            <input
              type="text"
              id="userAgent"
              value={userAgent}
              onChange={(e) => setUserAgent(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="e.g., *, Googlebot, Bingbot"
            />
            <p className="mt-1 text-xs text-slate-400">
              Specify the web crawler this rule applies to. Use '*' for all crawlers.
            </p>
          </div>

          {/* Rules (Allow/Disallow) */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Allow/Disallow Rules
            </label>
            <div className="space-y-3">
              {rules.map((rule, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={rule.type}
                    onChange={(e) => handleRuleChange(index, 'type', e.target.value as 'Allow' | 'Disallow')}
                    className="flex-shrink-0 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  >
                    <option value="Allow">Allow</option>
                    <option value="Disallow">Disallow</option>
                  </select>
                  <input
                    type="text"
                    value={rule.path}
                    onChange={(e) => handleRuleChange(index, 'path', e.target.value)}
                    className="flex-grow px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="e.g., /private/, /wp-admin/"
                  />
                  <button
                    onClick={() => handleRemoveRule(index)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    aria-label="Remove rule"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddRule}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
            >
              <Plus size={18} /> Add Rule
            </button>
            <p className="mt-1 text-xs text-slate-400">
              Define paths that crawlers should or should not access.
            </p>
          </div>

          {/* Sitemap URLs */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sitemap URLs (Optional)
            </label>
            <div className="space-y-3">
              {sitemaps.map((sitemap, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={sitemap}
                    onChange={(e) => handleSitemapChange(index, e.target.value)}
                    className="flex-grow px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="e.g., https://example.com/sitemap.xml"
                  />
                  <button
                    onClick={() => handleRemoveSitemap(index)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    aria-label="Remove sitemap"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddSitemap}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
            >
              <Plus size={18} /> Add Sitemap
            </button>
            <p className="mt-1 text-xs text-slate-400">
              Inform crawlers about the location of your XML sitemap(s).
            </p>
          </div>

          {/* Crawl-delay */}
          <div>
            <label htmlFor="crawlDelay" className="block text-sm font-medium text-slate-300 mb-2">
              Crawl-delay (Optional)
            </label>
            <input
              type="number"
              id="crawlDelay"
              value={crawlDelay}
              onChange={(e) => setCrawlDelay(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="e.g., 10 (seconds)"
              min="0"
            />
            <p className="mt-1 text-xs text-slate-400">
              Request a delay between consecutive crawls (not supported by all bots).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-50 rounded-lg transition-colors duration-200"
            >
              <RotateCcw size={18} /> Clear All
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col space-y-4">
          <label htmlFor="generatedRobotsTxt" className="block text-sm font-medium text-slate-300">
            Generated robots.txt
          </label>
          <textarea
            id="generatedRobotsTxt"
            value={generatedRobotsTxt}
            readOnly
            rows={15}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm resize-none focus:outline-none"
            placeholder="Your robots.txt content will appear here..."
          />
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
          >
            <Copy size={18} /> Copy to Clipboard
          </button>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default RobotsTxtGeneratorPage;