"use client";

import React, { useState, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const SQLPlaygroundPage: React.FC = () => {
  const toolSlug = "sql-playground";
  const { addToHistory } = useToolStore();

  const [sqlQuery, setSqlQuery] = useState<string>(`-- Example Queries:\n-- SELECT id, name FROM users WHERE age > 30;\n-- INSERT INTO products (name, price) VALUES ('New Item', 99.99);\n-- UPDATE orders SET status = 'shipped' WHERE id = 123;\n\nSELECT id, name FROM customers WHERE country = 'USA';`);
  const [queryResult, setQueryResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) {
      toast.error("Please enter an SQL query.");
      return;
    }

    setIsLoading(true);
    setQueryResult(''); // Clear previous results

    try {
      // Simulate an API call or complex computation
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // For a UI-only task, we'll just echo the query or provide a mock result
      const mockResult = `Query executed successfully!\n\n--- Simulated Results ---\n\n${sqlQuery.trim()}\n\n(Note: This is a simulated environment. No actual database interaction occurs.)`;
      setQueryResult(mockResult);
      toast.success("Query simulated successfully!");

    } catch (error) {
      console.error("Error simulating query:", error);
      setQueryResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
      toast.error("Failed to simulate query.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Execute and test SQL queries in a simulated environment."
    >
      <div className="flex flex-col gap-6">
        {/* SQL Query Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="sql-query" className="text-sm font-medium text-slate-300">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y placeholder:text-slate-500"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="Enter your SQL query here, e.g., SELECT * FROM users;"
            spellCheck="false"
          />
          <button
            onClick={handleRunQuery}
            disabled={isLoading}
            className="mt-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running Query...
              </span>
            ) : 'Run Query'}
          </button>
        </div>

        {/* Query Results Output */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-slate-300">
            Results
          </h2>
          <div
            className="w-full min-h-[150px] h-auto max-h-[500px] overflow-auto p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm whitespace-pre-wrap break-words"
          >
            {queryResult ? queryResult : (
              <span className="text-slate-500">
                {isLoading ? 'Executing query...' : 'Results will appear here after you run a query.'}
              </span>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;