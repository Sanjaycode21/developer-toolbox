'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

// Extend the Window interface to include initSqlJs
declare global {
  interface Window {
    initSqlJs: (config?: { locateFile?: (filename: string) => string }) => Promise<any>;
  }
}

interface SQLResult {
  columns: string[];
  values: any[][];
}

export default function SqlPlaygroundPage() {
  const [sqlInput, setSqlInput] = useState<string>('');
  const [results, setResults] = useState<SQLResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [db, setDb] = useState<any | null>(null); // SQL.js database instance
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const addToHistory = useToolStore((state) => state.addToHistory);

  const SQL = useRef<any>(null); // To hold the SQL.js module

  useEffect(() => {
    const loadScriptAndInit = async () => {
      if (typeof window === 'undefined') return; // Ensure client-side execution

      const initializeSqlJs = async () => {
        try {
          // @ts-ignore - initSqlJs is globally available after sql-wasm.js loads
          SQL.current = await window.initSqlJs({
            locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
          });
          const newDb = new SQL.current.Database();

          // Initialize with some default data
          newDb.run(`
            CREATE TABLE users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              email TEXT UNIQUE NOT NULL,
              age INTEGER
            );
            INSERT INTO users (name, email, age) VALUES ('Alice', 'alice@example.com', 30);
            INSERT INTO users (name, email, age) VALUES ('Bob', 'bob@example.com', 24);
            INSERT INTO users (name, email, age) VALUES ('Charlie', 'charlie@example.com', 35);
            INSERT INTO users (name, email, age) VALUES ('David', 'david@example.com', 29);

            CREATE TABLE products (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              price REAL NOT NULL
            );
            INSERT INTO products (name, price) VALUES ('Laptop', 1200.00);
            INSERT INTO products (name, price) VALUES ('Mouse', 25.00);
            INSERT INTO products (name, price) VALUES ('Keyboard', 75.00);
          `);
          setDb(newDb);
          setSqlInput("SELECT * FROM users;"); // Default query
          toast.success("SQL Playground ready!");
        } catch (e: any) {
          console.error("Error initializing SQL.js:", e);
          setError(`Failed to load SQL engine: ${e.message}`);
          toast.error(`Failed to load SQL engine: ${e.message}`);
        } finally {
          setIsLoading(false);
        }
      };

      if (!window.initSqlJs) {
        // If sql-wasm.js script is not loaded, load it dynamically
        const script = document.createElement('script');
        script.src = 'https://sql.js.org/dist/sql-wasm.js';
        script.async = true;
        script.onload = initializeSqlJs;
        script.onerror = (e) => {
          console.error("Failed to load sql-wasm.js script:", e);
          setError("Failed to load SQL engine script.");
          setIsLoading(false);
          toast.error("Failed to load SQL engine script.");
        };
        document.head.appendChild(script);
      } else {
        // If script is already loaded (e.g., during hot reload), just initialize
        initializeSqlJs();
      }
    };

    setIsLoading(true);
    loadScriptAndInit();

    return () => {
      if (db) {
        db.close(); // Close the database connection on component unmount
      }
    };
  }, []); // Empty dependency array to run once on mount

  const handleRunQuery = () => {
    if (!db) {
      setError("SQL engine not loaded.");
      toast.error("SQL engine not loaded.");
      return;
    }
    if (!sqlInput.trim()) {
      setError("Please enter an SQL query.");
      toast.error("Please enter an SQL query.");
      return;
    }

    setResults(null);
    setError(null);
    addToHistory('sql-playground');

    try {
      const res = db.exec(sqlInput);
      if (res.length === 0) {
        setResults([]); // No results, e.g., for INSERT, UPDATE, DELETE
        toast.success("Query executed successfully (no results returned).");
      } else {
        setResults(res);
        toast.success("Query executed successfully!");
      }
    } catch (e: any) {
      setError(`SQL Error: ${e.message}`);
      toast.error(`SQL Error: ${e.message}`);
    }
  };

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute SQL queries directly in your browser with an in-memory SQLite database."
    >
      <div className="flex flex-col space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center p-8 text-indigo-400">
            <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading SQL engine...
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg font-mono text-sm">
            <h3 className="font-bold mb-2">Error:</h3>
            <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="flex flex-col space-y-2">
              <label htmlFor="sql-input" className="text-sm font-medium text-slate-300">
                SQL Query:
              </label>
              <textarea
                id="sql-input"
                className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
                placeholder="Enter your SQL query here (e.g., SELECT * FROM users;)"
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
                spellCheck="false"
              />
              <button
                onClick={handleRunQuery}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors self-start disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !db}
              >
                Run Query
              </button>
            </div>

            {results && results.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-200">Results:</h3>
                {results.map((result, index) => (
                  <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-700">
                      <thead className="bg-slate-700">
                        <tr>
                          {result.columns.map((col, colIndex) => (
                            <th
                              key={colIndex}
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {result.values.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-slate-700/50 transition-colors">
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-6 py-4 whitespace-nowrap text-sm text-slate-200 font-mono"
                              >
                                {String(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}

            {results && results.length === 0 && (
              <div className="bg-slate-800 border border-slate-700 text-slate-300 p-4 rounded-lg text-sm">
                Query executed successfully. No results returned (e.g., INSERT, UPDATE, DELETE statements).
              </div>
            )}
          </>
        )}
      </div>
    </ToolPageWrapper>
  );
}