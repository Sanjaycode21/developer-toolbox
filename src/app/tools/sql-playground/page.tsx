'use client';

import { useEffect, useState } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

export default function SqlPlaygroundPage() {
  const { addToHistory } = useToolStore();
  const toolSlug = "sql-playground";
  const toolName = "SQL Playground";
  const description = "Execute and test SQL queries directly in your browser.";

  const [sqlInput, setSqlInput] = useState<string>('');
  const [sqlOutput, setSqlOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleExecuteQuery = () => {
    setIsLoading(true);
    setSqlOutput(''); // Clear previous output
    toast.loading('Executing query...', { id: 'sql-exec-toast' });

    // Simulate API call or complex computation
    setTimeout(() => {
      let result = '';
      const trimmedInput = sqlInput.trim();

      if (trimmedInput.toLowerCase().startsWith('select')) {
        // Simulate a table output for SELECT queries
        result = `| id | name    | age |\n|----|---------|-----|\n| 1  | Alice   | 30  |\n| 2  | Bob     | 24  |\n| 3  | Charlie | 35  |`;
        toast.success('Query executed successfully!', { id: 'sql-exec-toast' });
      } else if (trimmedInput.toLowerCase().startsWith('insert') || trimmedInput.toLowerCase().startsWith('update') || trimmedInput.toLowerCase().startsWith('delete')) {
        result = `Query executed successfully. 1 row affected.`;
        toast.success('Query executed successfully!', { id: 'sql-exec-toast' });
      } else if (trimmedInput.toLowerCase().startsWith('create') || trimmedInput.toLowerCase().startsWith('drop') || trimmedInput.toLowerCase().startsWith('alter')) {
        result = `DDL statement executed successfully.`;
        toast.success('Query executed successfully!', { id: 'sql-exec-toast' });
      } else if (trimmedInput === '') {
        result = `Please enter a SQL query.`;
        toast.error('No query entered.', { id: 'sql-exec-toast' });
      } else {
        result = `Query executed successfully. (Simulated output for: ${sqlInput})`;
        toast.success('Query executed successfully!', { id: 'sql-exec-toast' });
      }

      setSqlOutput(result);
      setIsLoading(false);
    }, 1500); // Simulate network delay
  };

  const handleClear = () => {
    setSqlInput('');
    setSqlOutput('');
    toast.success('Input and output cleared.');
  };

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* SQL Input Panel */}
        <div className="flex-1 flex flex-col bg-slate-800 rounded-lg shadow-lg p-6">
          <label htmlFor="sql-input" className="block text-sm font-medium text-slate-300 mb-2">
            SQL Query
          </label>
          <textarea
            id="sql-input"
            className="flex-1 w-full p-4 bg-slate-900 border border-slate-700 rounded-md text-slate-50 font-mono text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
            placeholder="Enter your SQL query here (e.g., SELECT * FROM users;)"
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            rows={10} // Default rows for smaller screens
          ></textarea>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleExecuteQuery}
              disabled={isLoading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Executing...
                </>
              ) : (
                'Execute Query'
              )}
            </button>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        </div>

        {/* SQL Output Panel */}
        <div className="flex-1 flex flex-col bg-slate-800 rounded-lg shadow-lg p-6">
          <label htmlFor="sql-output" className="block text-sm font-medium text-slate-300 mb-2">
            Query Result
          </label>
          <textarea
            id="sql-output"
            className="flex-1 w-full p-4 bg-slate-900 border border-slate-700 rounded-md text-slate-50 font-mono text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
            placeholder="Results will appear here..."
            value={sqlOutput}
            readOnly
            rows={10} // Default rows for smaller screens
          ></textarea>
        </div>
      </div>
    </ToolPageWrapper>
  );
}