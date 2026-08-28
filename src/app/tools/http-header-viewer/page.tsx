"use client";

import React, { useState } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

interface Header {
  key: string;
  value: string;
}

const TOOL_SLUG = "http-header-viewer";
const TOOL_NAME = "HTTP Header Viewer";
const TOOL_DESCRIPTION = "View HTTP headers for any URL.";

export default function HttpHeaderViewerPage() {
  const [url, setUrl] = useState<string>('');
  const [headers, setHeaders] = useState<Header[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { addToHistory } = useToolStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setHeaders(null);
    setLoading(true);
    addToHistory(TOOL_SLUG);

    try {
      const response = await fetch('/api/fetch-headers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'An unknown error occurred.');
        toast.error(data.error || 'Failed to fetch headers.');
        return;
      }

      const fetchedHeaders: Header[] = Object.entries(data.headers).map(([key, value]) => ({
        key,
        value: value as string,
      }));
      setHeaders(fetchedHeaders);
      toast.success('Headers fetched successfully!');

    } catch (err: any) {
      console.error('Client-side fetch error:', err);
      setError('Network error or server is unreachable. Please check your internet connection or try again later.');
      toast.error('Network error or server is unreachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageWrapper toolSlug={TOOL_SLUG} toolName={TOOL_NAME} description={TOOL_DESCRIPTION}>
      <div className="flex flex-col space-y-6">
        {/* Input Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
          <label htmlFor="url-input" className="block text-sm font-medium text-slate-300">
            Enter URL
          </label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g., https://www.example.com"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
            required
          />
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={loading || !url.trim()}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Fetching...
              </span>
            ) : (
              'Fetch Headers'
            )}
          </button>
        </form>

        {/* Output Section */}
        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 shadow-lg min-h-[200px] flex flex-col">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">Results</h2>

          {loading && (
            <div className="flex items-center justify-center h-full text-slate-400">
              <svg className="animate-spin h-5 w-5 mr-3 text-indigo-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching headers...
            </div>
          )}

          {error && (
            <div className="text-red-400 bg-red-900/20 p-4 rounded-md border border-red-800">
              <p className="font-medium">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {headers && headers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Header
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                  {headers.map((header, index) => (
                    <tr key={index} className="hover:bg-slate-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">
                        {header.key}
                      </td>
                      <td className="px-6 py-4 break-all text-sm text-slate-300">
                        {header.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {headers && headers.length === 0 && !loading && !error && (
            <div className="text-slate-400 text-center py-8">
              No headers found for this URL.
            </div>
          )}

          {!headers && !loading && !error && (
            <div className="text-slate-400 text-center py-8">
              Enter a URL and click "Fetch Headers" to see the results.
            </div>
          )}
        </div>
      </div>
    </ToolPageWrapper>
  );
}