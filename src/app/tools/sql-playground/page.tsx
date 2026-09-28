"use client";

import React, { useState, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const SQLPlaygroundPage: React.FC = () => {
  const toolSlug = "sql-playground";
  const toolName = "SQL Playground";
  const description = "Execute and test SQL queries in a client-side environment.";

  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<string>('Run a query to see results here.');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addToHistory = useToolStore((state) => state.addToHistory);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleRunQuery = () => {
    setError(null);
    setQueryResult('');
    setIsLoading(true);

    // Simulate a network request or database execution
    setTimeout(() => {
      try {
        // Basic mock SQL execution logic
        let result = '';

        const lowerCaseQuery = sqlQuery.toLowerCase().trim();

        if (!lowerCaseQuery) {
          throw new Error("Query cannot be empty.");
        }

        if (lowerCaseQuery.includes('select * from users')) {
          result = JSON.stringify([
            { id: 1, name: 'Alice', email: 'alice@example.com', created_at: '2023-01-15' },
            { id: 2, name: 'Bob', email: 'bob@example.com', created_at: '2023-02-20' },
            { id: 3, name: 'Charlie', email: 'charlie@example.com', created_at: '2023-03-10' },
          ], null, 2);
        } else if (lowerCaseQuery.includes('insert into products')) {
          result = 'Query OK, 1 row affected (0.01 sec)';
        } else if (lowerCaseQuery.includes('update orders set status')) {
          result = 'Query OK, 2 rows affected (0.02 sec)';
        } else if (lowerCaseQuery.includes('delete from logs')) {
          result = 'Query OK, 5 rows affected (0.03 sec)';
        } else if (lowerCaseQuery.includes('create table')) {
          result = 'Query OK, 0 rows affected (0.05 sec)';
        } else if (lowerCaseQuery.includes('drop table')) {
          result = 'Query OK, 0 rows affected (0.04 sec)';
        } else if (lowerCaseQuery.includes('error') || lowerCaseQuery.includes('syntax error')) {
          throw new Error("Syntax error detected. Please check your query.");
        }
        else {
          result = `Mock execution: Query received:\n${sqlQuery}\n\n(No specific mock result for this query. Try "SELECT * FROM users;" or "INSERT INTO products (name) VALUES ('New Product');")`;
        }

        setQueryResult(result);
        toast.success('Query executed successfully!');
      } catch (e: any) {
        setError(e.message);
        setQueryResult('');
        toast.error(`Query failed: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Simulate 1 second delay
  };

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* SQL Input Area */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-input" className="block text-sm font-medium text-slate-300 mb-2">
            SQL Query
          </label>
          <textarea
            id="sql-input"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
            placeholder={`-- Enter your SQL query here\nSELECT * FROM users;`}
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            rows={10} // Default rows for smaller screens, flex-1 handles height on larger
          ></textarea>
          <button
            onClick={handleRunQuery}
            disabled={isLoading}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Run Query
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 flex flex-col">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Results
          </label>
          <div className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm overflow-auto relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/70 backdrop-blur-sm z-10 rounded-lg">
                <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            {error ? (
              <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
            ) : (
              <pre className="whitespace-pre-wrap">{queryResult}</pre>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;