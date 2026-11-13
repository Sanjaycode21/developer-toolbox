"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";
import { Database, Play } from "lucide-react";

interface TableColumn {
  name: string;
  type: string;
}

interface TableSchema {
  name: string;
  columns: TableColumn[];
  data: Record<string, any>[]; // Sample data
}

interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  message?: string;
}

const sampleDatabase: TableSchema[] = [
  {
    name: "users",
    columns: [
      { name: "id", type: "INTEGER" },
      { name: "name", type: "TEXT" },
      { name: "email", type: "TEXT" },
      { name: "age", type: "INTEGER" },
    ],
    data: [
      { id: 1, name: "Alice", email: "alice@example.com", age: 30 },
      { id: 2, name: "Bob", email: "bob@example.com", age: 24 },
      { id: 3, name: "Charlie", email: "charlie@example.com", age: 35 },
      { id: 4, name: "David", email: "david@example.com", age: 28 },
      { id: 5, name: "Eve", email: "eve@example.com", age: 42 },
    ],
  },
  {
    name: "products",
    columns: [
      { name: "product_id", type: "INTEGER" },
      { name: "name", type: "TEXT" },
      { name: "price", type: "REAL" },
      { name: "stock", type: "INTEGER" },
    ],
    data: [
      { product_id: 101, name: "Laptop", price: 1200.00, stock: 50 },
      { product_id: 102, name: "Mouse", price: 25.50, stock: 200 },
      { product_id: 103, name: "Keyboard", price: 75.00, stock: 150 },
      { product_id: 104, name: "Monitor", price: 300.00, stock: 80 },
      { product_id: 105, name: "Webcam", price: 50.00, stock: 120 },
    ],
  },
];

export default function SqlPlaygroundPage() {
  const toolSlug = "sql-playground";
  const addToHistory = useToolStore((state) => state.addToHistory);

  const [query, setQuery] = useState<string>(
    "SELECT * FROM users;\n\n-- Try: SELECT * FROM products;"
  );
  const [results, setResults] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleRunQuery = async () => {
    setIsLoading(true);
    setResults(null); // Clear previous results
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay

    const lowerQuery = query.toLowerCase().trim();
    let currentResults: QueryResult = { columns: [], rows: [] };
    let successMessage = "Query executed successfully.";

    try {
      if (lowerQuery.startsWith("select * from users")) {
        const table = sampleDatabase.find((t) => t.name === "users");
        if (table) {
          currentResults.columns = table.columns.map((col) => col.name);
          currentResults.rows = table.data;
        }
      } else if (lowerQuery.startsWith("select * from products")) {
        const table = sampleDatabase.find((t) => t.name === "products");
        if (table) {
          currentResults.columns = table.columns.map((col) => col.name);
          currentResults.rows = table.data;
        }
      } else if (lowerQuery.startsWith("insert into users")) {
        // Simulate an insert
        successMessage = "1 row inserted successfully (simulated).";
        currentResults.message = successMessage;
      } else if (lowerQuery.startsWith("update users")) {
        // Simulate an update
        successMessage = "1 row updated successfully (simulated).";
        currentResults.message = successMessage;
      } else if (lowerQuery.startsWith("delete from users")) {
        // Simulate a delete
        successMessage = "1 row deleted successfully (simulated).";
        currentResults.message = successMessage;
      } else if (lowerQuery.startsWith("create table")) {
        successMessage = "Table created successfully (simulated).";
        currentResults.message = successMessage;
      } else if (lowerQuery.startsWith("drop table")) {
        successMessage = "Table dropped successfully (simulated).";
        currentResults.message = successMessage;
      } else {
        throw new Error("Unsupported query or syntax error (simulated).");
      }

      setResults(currentResults);
      toast.success(successMessage);
    } catch (error: any) {
      setResults({ columns: [], rows: [], message: `Error: ${error.message}` });
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTable = useMemo(() => {
    if (!results || (results.rows.length === 0 && !results.message)) {
      return (
        <div className="text-slate-400 text-sm p-4 bg-slate-800 rounded-lg border border-slate-700">
          No results to display. Run a query to see output.
        </div>
      );
    }

    if (results.message && results.rows.length === 0) {
      return (
        <div className="text-slate-400 text-sm p-4 bg-slate-800 rounded-lg border border-slate-700">
          {results.message}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800">
            <tr>
              {results.columns.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900">
            {results.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                {results.columns.map((col) => (
                  <td
                    key={`${rowIndex}-${col}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-slate-200"
                  >
                    {String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [results]);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Execute and test SQL queries against a simulated database."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left Panel: Schema Browser */}
        <div className="w-full lg:w-1/4 p-4 bg-slate-800 rounded-lg border border-slate-700 shadow-inner flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            Database Schema
          </h3>
          <div className="space-y-4">
            {sampleDatabase.map((table) => (
              <div key={table.name} className="bg-slate-900 p-3 rounded-md border border-slate-700">
                <h4 className="font-medium text-slate-200 mb-2">{table.name}</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  {table.columns.map((col) => (
                    <li key={`${table.name}-${col.name}`} className="flex justify-between">
                      <span>{col.name}</span>
                      <span className="font-mono text-xs text-slate-500">{col.type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Query Editor and Results */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Query Editor */}
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-inner flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">SQL Query</h3>
            <textarea
              className="flex-1 w-full p-3 bg-slate-900 border border-slate-700 rounded-md text-slate-200 font-mono text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              rows={10}
            />
            <button
              onClick={handleRunQuery}
              disabled={isLoading}
              className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Running Query...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Run Query
                </>
              )}
            </button>
          </div>

          {/* Query Results */}
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-inner flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Results</h3>
            {renderTable}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}