"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Play, XCircle, RefreshCw } from 'lucide-react';

const SQLPlaygroundPage: React.FC = () => {
  const toolSlug = "sql-playground";
  const addToHistory = useToolStore((state) => state.addToHistory);

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleRunQuery = useCallback(() => {
    setError("");
    setResults("");

    if (!query.trim()) {
      setError("Please enter an SQL query.");
      toast.error("Query cannot be empty.");
      return;
    }

    // Placeholder for actual SQL execution.
    // In a real scenario, you'd integrate a client-side SQL engine like sql.js here.
    try {
      // Simulate different outcomes based on query content
      if (query.toLowerCase().includes("drop table")) {
        throw new Error("DROP TABLE statements are not allowed in this playground.");
      } else if (query.toLowerCase().includes("select * from users")) {
        setResults(JSON.stringify([
          { id: 1, name: "Alice", email: "alice@example.com" },
          { id: 2, name: "Bob", email: "bob@example.com" }
        ], null, 2));
        toast.success("Query executed successfully (mock data).");
      } else if (query.toLowerCase().includes("insert into products")) {
        setResults("1 row affected (mock data).");
        toast.success("Query executed successfully (mock data).");
      } else if (query.toLowerCase().includes("update users")) {
        setResults("1 row affected (mock data).");
        toast.success("Query executed successfully (mock data).");
      } else if (query.toLowerCase().includes("delete from users")) {
        setResults("1 row affected (mock data).");
        toast.success("Query executed successfully (mock data).");
      } else if (query.toLowerCase().includes("create table")) {
        setResults("Table created (mock data).");
        toast.success("Query executed successfully (mock data).");
      }
      else {
        setResults(`Query executed: "${query.trim()}"\n\n(No specific mock data for this query. This is a placeholder result.)`);
        toast.success("Query executed successfully (mock data).");
      }
    } catch (e: any) {
      setError(e.message || "An unknown error occurred during query execution.");
      toast.error("Query execution failed.");
    }
  }, [query]);

  const handleClearQuery = useCallback(() => {
    setQuery("");
    setResults("");
    setError("");
    toast.success("Query editor cleared.");
  }, []);

  const handleResetSchema = useCallback(() => {
    // In a real implementation, this would re-initialize the in-browser database schema.
    toast("Schema reset is a placeholder. No actual database reset occurred.", { icon: 'ℹ️' });
  }, []);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Execute and test SQL queries directly in your browser. (Client-side only, no actual database connection)"
    >
      <div className="flex flex-col gap-6">
        {/* Query Editor */}
        <div className="flex flex-col gap-2">
          <label htmlFor="sql-query" className="text-sm font-medium text-slate-300">SQL Query</label>
          <textarea
            id="sql-query"
            className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-y"
            placeholder="SELECT * FROM users WHERE id = 1;"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck="false"
          ></textarea>
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleRunQuery}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Play size={16} /> Run Query
            </button>
            <button
              onClick={handleClearQuery}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <XCircle size={16} /> Clear
            </button>
            <button
              onClick={handleResetSchema}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} /> Reset Schema
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-200">Results</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 min-h-[150px] overflow-auto">
            {results ? (
              <pre className="text-slate-50 font-mono text-sm whitespace-pre-wrap">
                {results}
              </pre>
            ) : (
              <p className="text-slate-400 text-sm">Run a query to see results here.</p>
            )}
          </div>
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg p-3 text-sm mt-2">
              <p className="font-medium">Error:</p>
              <pre className="font-mono whitespace-pre-wrap">{error}</pre>
            </div>
          )}
        </div>

        {/* Schema Info (Placeholder) */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-200">Schema Information</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 min-h-[100px] overflow-auto">
            <p className="text-slate-400 text-sm">
              This playground simulates SQL execution client-side. No actual database connection is made.
              The "Reset Schema" button is a placeholder for re-initializing an in-browser database.
            </p>
            <pre className="text-slate-50 font-mono text-sm mt-2">
              {`-- Example Schema (SQLite syntax)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL
);

-- Initial Data
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
INSERT INTO products (name, price) VALUES ('Laptop', 1200.00);
INSERT INTO products (name, price) VALUES ('Mouse', 25.00);
`}
            </pre>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;