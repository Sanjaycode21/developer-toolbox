"use client";

import React, { useState, useEffect, useCallback } from "react";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";

interface TableResult {
  columns: string[];
  rows: (string | number | null)[][];
}

const sampleData = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age INTEGER
);

INSERT INTO users (name, email, age) VALUES
('Alice Smith', 'alice@example.com', 30),
('Bob Johnson', 'bob@example.com', 24),
('Charlie Brown', 'charlie@example.com', 35);

CREATE TABLE IF NOT EXISTS products (
  product_id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_name TEXT NOT NULL,
  price REAL NOT NULL
);

INSERT INTO products (product_name, price) VALUES
('Laptop', 1200.00),
('Mouse', 25.50),
('Keyboard', 75.00);

SELECT * FROM users;
`;

const SQLPlaygroundPage: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState<string>("");
  const [results, setResults] = useState<TableResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { addToHistory } = useToolStore();
  const toolSlug = "sql-playground";

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const executeQuery = useCallback(async () => {
    setError(null);
    setMessage(null);
    setResults(null);
    setIsLoading(true);

    const trimmedQuery = sqlQuery.trim();
    if (!trimmedQuery) {
      setError("Please enter an SQL query.");
      setIsLoading(false);
      return;
    }

    // Simulate SQL execution
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network/processing delay

    try {
      const lowerCaseQuery = trimmedQuery.toLowerCase();

      if (lowerCaseQuery.startsWith("select")) {
        // Mock SELECT results
        if (lowerCaseQuery.includes("from users")) {
          setResults({
            columns: ["id", "name", "email", "age"],
            rows: [
              [1, "Alice Smith", "alice@example.com", 30],
              [2, "Bob Johnson", "bob@example.com", 24],
              [3, "Charlie Brown", "charlie@example.com", 35],
            ],
          });
          setMessage("Query executed successfully. Displaying mock data for 'users'.");
        } else if (lowerCaseQuery.includes("from products")) {
          setResults({
            columns: ["product_id", "product_name", "price"],
            rows: [
              [1, "Laptop", 1200.00],
              [2, "Mouse", 25.50],
              [3, "Keyboard", 75.00],
            ],
          });
          setMessage("Query executed successfully. Displaying mock data for 'products'.");
        } else {
          setResults({
            columns: ["message"],
            rows: [["No specific mock data for this SELECT query. Showing generic success."]],
          });
          setMessage("SELECT query executed successfully. Showing generic mock data.");
        }
      } else if (
        lowerCaseQuery.startsWith("insert") ||
        lowerCaseQuery.startsWith("update") ||
        lowerCaseQuery.startsWith("delete") ||
        lowerCaseQuery.startsWith("create table") ||
        lowerCaseQuery.startsWith("drop table") ||
        lowerCaseQuery.startsWith("alter table")
      ) {
        setMessage(`Command executed successfully: "${trimmedQuery.split(' ')[0].toUpperCase()}". (Mock execution)`);
      } else {
        setError("Unsupported or invalid SQL command for this mock playground.");
      }
    } catch (e: any) {
      setError(`Error executing query: ${e.message || "An unknown error occurred."}`);
      toast.error("Failed to execute query.");
    } finally {
      setIsLoading(false);
    }
  }, [sqlQuery]);

  const handleClear = useCallback(() => {
    setSqlQuery("");
    setResults(null);
    setMessage(null);
    setError(null);
    toast.success("Playground cleared!");
  }, []);

  const handleLoadSampleData = useCallback(() => {
    setSqlQuery(sampleData.trim());
    setResults(null);
    setMessage("Sample data loaded into query editor. Click 'Execute Query' to run.");
    setError(null);
    toast.success("Sample data loaded!");
  }, []);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Experiment with SQL queries in a browser-based environment. (Mock functionality)"
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Query Input Section */}
        <div className="flex-1 flex flex-col space-y-4">
          <label htmlFor="sql-query" className="text-sm font-medium text-slate-300">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="w-full flex-1 min-h-[200px] lg:min-h-[unset] font-mono text-sm bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-y"
            placeholder="Enter your SQL query here, e.g., SELECT * FROM users;"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            spellCheck="false"
          />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={executeQuery}
              disabled={isLoading}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isLoading ? "Executing..." : "Execute Query"}
            </button>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="px-5 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Clear
            </button>
            <button
              onClick={handleLoadSampleData}
              disabled={isLoading}
              className="px-5 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Load Sample Data
            </button>
          </div>
        </div>

        {/* Results Display Section */}
        <div className="flex-1 flex flex-col space-y-4">
          <label className="text-sm font-medium text-slate-300">
            Results
          </label>
          <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-auto min-h-[200px] lg:min-h-[unset]">
            {isLoading && (
              <div className="flex items-center justify-center h-full text-slate-400">
                <svg className="animate-spin h-5 w-5 mr-3 text-indigo-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing query...
              </div>
            )}

            {!isLoading && error && (
              <div className="text-red-400 text-sm font-mono whitespace-pre-wrap">
                Error: {error}
              </div>
            )}

            {!isLoading && message && !error && (
              <div className="text-emerald-400 text-sm mb-4">
                {message}
              </div>
            )}

            {!isLoading && results && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300 border-collapse">
                  <thead className="bg-slate-700">
                    <tr>
                      {results.columns.map((col, index) => (
                        <th key={index} className="px-4 py-2 border border-slate-600 font-semibold">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="even:bg-slate-800 odd:bg-slate-850">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 border border-slate-700">
                            {cell === null ? <span className="text-slate-500 italic">NULL</span> : String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && !error && !message && !results && (
              <div className="flex items-center justify-center h-full text-slate-500">
                Enter an SQL query and click 'Execute Query' to see results.
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;