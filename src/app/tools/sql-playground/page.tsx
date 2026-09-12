"use client";

import React, { useState, useEffect } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const SQLPlaygroundPage: React.FC = () => {
  const toolSlug = "sql-playground";
  const toolName = "SQL Playground";
  const description = "Execute and test SQL queries in a simulated environment.";

  const addToHistory = useToolStore((state) => state.addToHistory);

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleRunQuery = async () => {
    setError("");
    setResults("");
    setIsLoading(true);

    if (!query.trim()) {
      setError("Please enter an SQL query.");
      toast.error("Query cannot be empty.");
      setIsLoading(false);
      return;
    }

    // Simulate SQL execution
    // In a real scenario, you would integrate with a client-side SQL engine
    // like sql.js-wasm or send to a backend API.
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simple simulation based on keywords
      const lowerCaseQuery = query.toLowerCase();

      if (lowerCaseQuery.includes("drop table") || lowerCaseQuery.includes("delete from") && !lowerCaseQuery.includes("where")) {
        setError("Dangerous statements like 'DROP TABLE' or 'DELETE FROM' without WHERE are not allowed in this playground.");
        toast.error("Dangerous query detected!");
      } else if (lowerCaseQuery.includes("select * from users")) {
        setResults(JSON.stringify([
          { id: 1, name: "Alice", email: "alice@example.com", created_at: "2023-01-15" },
          { id: 2, name: "Bob", email: "bob@example.com", created_at: "2023-02-20" },
          { id: 3, name: "Charlie", email: "charlie@example.com", created_at: "2023-03-10" },
        ], null, 2));
        toast.success("Query executed successfully!");
      } else if (lowerCaseQuery.includes("insert into products")) {
        setResults("1 row affected. (Simulated)");
        toast.success("Query executed successfully!");
      } else if (lowerCaseQuery.includes("update orders")) {
        setResults("2 rows affected. (Simulated)");
        toast.success("Query executed successfully!");
      } else if (lowerCaseQuery.includes("create table")) {
        setResults("Table 'new_table' created successfully. (Simulated)");
        toast.success("Query executed successfully!");
      } else if (lowerCaseQuery.includes("select")) {
        setResults("Query executed. No specific results for this simulated SELECT query.");
        toast.success("Query executed successfully!");
      } else if (lowerCaseQuery.includes("insert") || lowerCaseQuery.includes("update") || lowerCaseQuery.includes("delete")) {
        setResults("Query executed. 1 row affected. (Simulated)");
        toast.success("Query executed successfully!");
      } else {
        setResults("Query executed. No specific results for this simulated query.");
        toast.success("Query executed successfully!");
      }
    } catch (err: any) {
      setError(`Execution failed: ${err.message || "Unknown error"}`);
      toast.error("Query execution failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Query Input Area */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-2">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm placeholder-slate-500 transition-colors"
            placeholder="Enter your SQL query here (e.g., SELECT * FROM users;)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={10}
            spellCheck="false"
          ></textarea>
          <button
            onClick={handleRunQuery}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Executing...' : 'Run Query'}
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-results" className="block text-sm font-medium text-slate-300 mb-2">
            Results
          </label>
          <div
            id="sql-results"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm overflow-auto whitespace-pre-wrap break-all"
          >
            {isLoading && <p className="text-slate-400">Executing query...</p>}
            {error && <p className="text-red-400">{error}</p>}
            {results && <pre className="text-green-400">{results}</pre>}
            {!isLoading && !error && !results && (
              <p className="text-slate-400">Query results will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;