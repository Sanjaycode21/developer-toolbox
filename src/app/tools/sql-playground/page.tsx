'use client';

import React, { useState, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const toolSlug = 'sql-playground';
const toolName = 'SQL Playground';
const description = 'Execute and test SQL queries in a browser-based environment.';

const SqlPlaygroundPage: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<string>('');
  const addToHistory = useToolStore((state) => state.addToHistory);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory]);

  const handleExecute = () => {
    if (!query.trim()) {
      toast.error('Please enter an SQL query to execute.');
      return;
    }

    // Simulate SQL execution
    // In a real application, this would involve sending the query to a backend
    // and processing the response. For this UI, we'll just show a mock result.
    let mockResults = '';
    const lowerCaseQuery = query.toLowerCase();

    if (lowerCaseQuery.includes('select * from users')) {
      mockResults = `id,name,email
1,Alice Smith,alice@example.com
2,Bob Johnson,bob@example.com
3,Charlie Brown,charlie@example.com`;
    } else if (lowerCaseQuery.includes('insert into products')) {
      mockResults = 'Query executed successfully. 1 row affected.';
    } else if (lowerCaseQuery.includes('update orders')) {
      mockResults = 'Query executed successfully. 2 rows affected.';
    } else if (lowerCaseQuery.includes('delete from items')) {
      mockResults = 'Query executed successfully. 5 rows affected.';
    } else if (lowerCaseQuery.includes('create table')) {
      mockResults = 'Table created successfully.';
    } else if (lowerCaseQuery.includes('drop table')) {
      mockResults = 'Table dropped successfully.';
    } else {
      mockResults = `Query executed successfully (simulated).
---
Your query:
${query}`;
    }

    setResults(mockResults);
    toast.success('Query executed (simulated)!');
  };

  const handleClear = () => {
    setQuery('');
    setResults('');
    toast.success('Playground cleared!');
  };

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* SQL Query Input */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-2">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="flex-1 w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-none transition-colors"
            placeholder="Enter your SQL query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={10} // Default rows for smaller screens
          ></textarea>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleExecute}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-md"
            >
              Execute Query
            </button>
            <button
              onClick={handleClear}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors shadow-md"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Output */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-results" className="block text-sm font-medium text-slate-300 mb-2">
            Results
          </label>
          <textarea
            id="sql-results"
            className="flex-1 w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none resize-none transition-colors"
            value={results}
            readOnly
            placeholder="Query results will appear here..."
            rows={10} // Default rows for smaller screens
          ></textarea>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SqlPlaygroundPage;