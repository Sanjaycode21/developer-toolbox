"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

interface TableData {
  columns: string[];
  rows: string[][];
}

// Mock database for client-side simulation
const mockDatabase: Record<string, TableData> = {
  users: {
    columns: ['id', 'name', 'email', 'age'],
    rows: [
      ['1', 'Alice', 'alice@example.com', '30'],
      ['2', 'Bob', 'bob@example.com', '24'],
      ['3', 'Charlie', 'charlie@example.com', '35'],
      ['4', 'Diana', 'diana@example.com', '28'],
    ],
  },
  products: {
    columns: ['product_id', 'product_name', 'price', 'stock'],
    rows: [
      ['101', 'Laptop', '1200.00', '50'],
      ['102', 'Mouse', '25.00', '200'],
      ['103', 'Keyboard', '75.00', '150'],
      ['104', 'Monitor', '300.00', '80'],
    ],
  },
  orders: {
    columns: ['order_id', 'user_id', 'product_id', 'quantity', 'order_date'],
    rows: [
      ['1001', '1', '101', '1', '2023-01-15'],
      ['1002', '2', '102', '2', '2023-01-16'],
      ['1003', '1', '103', '1', '2023-01-17'],
      ['1004', '3', '101', '1', '2023-01-18'],
    ],
  },
};

const initialQuery = `SELECT * FROM users;`;

export default function SqlPlaygroundPage() {
  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<TableData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { addToHistory } = useToolStore();

  useEffect(() => {
    addToHistory('sql-playground');
  }, [addToHistory]);

  const executeSql = useCallback(async () => {
    setIsLoading(true);
    setResults(null);
    setError(null);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));

    try {
      const trimmedQuery = query.trim().toLowerCase();

      // Basic parsing for SELECT * FROM <table>;
      const selectAllRegex = /^select\s+\*\s+from\s+(\w+)\s*;?$/;
      const match = trimmedQuery.match(selectAllRegex);

      if (match && match[1]) {
        const tableName = match[1];
        if (mockDatabase[tableName]) {
          setResults(mockDatabase[tableName]);
          toast.success(`Query executed successfully on table '${tableName}'.`);
        } else {
          setError(`Error: Table '${tableName}' not found in mock database.`);
          toast.error(`Table '${tableName}' not found.`);
        }
      } else if (trimmedQuery.startsWith('show tables')) {
        setResults({
          columns: ['Table Name'],
          rows: Object.keys(mockDatabase).map(name => [name]),
        });
        toast.success('Tables listed successfully.');
      }
      else {
        setError('Error: Only "SELECT * FROM <table>;" or "SHOW TABLES;" queries are supported in this playground.');
        toast.error('Unsupported query type.');
      }
    } catch (e: any) {
      setError(`An unexpected error occurred: ${e.message}`);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleSampleQuery = useCallback((sample: string) => {
    setQuery(sample);
    setResults(null);
    setError(null);
  }, []);

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute and test SQL queries against a mock in-memory database."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Query Input and Controls */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1">
            <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-2">
              SQL Query
            </label>
            <textarea
              id="sql-query"
              className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-y"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              spellCheck="false"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={executeSql}
              disabled={isLoading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Executing...' : 'Execute Query'}
            </button>
            <button
              onClick={() => handleSampleQuery('SHOW TABLES;')}
              disabled={isLoading}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Show Tables
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Sample Queries</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSampleQuery('SELECT * FROM users;')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-md transition-colors"
              >
                SELECT * FROM users;
              </button>
              <button
                onClick={() => handleSampleQuery('SELECT * FROM products;')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-md transition-colors"
              >
                SELECT * FROM products;
              </button>
              <button
                onClick={() => handleSampleQuery('SELECT * FROM orders;')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-md transition-colors"
              >
                SELECT * FROM orders;
              </button>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-slate-200">Results</h2>
          <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-auto min-h-[200px] lg:min-h-[400px]">
            {isLoading && (
              <div className="flex items-center justify-center h-full text-slate-400">
                <svg className="animate-spin h-5 w-5 mr-3 text-indigo-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading results...
              </div>
            )}

            {!isLoading && error && (
              <div className="text-red-400 bg-red-900/20 p-4 rounded-md border border-red-800">
                <p className="font-mono text-sm">{error}</p>
              </div>
            )}

            {!isLoading && results && (
              <div className="overflow-x-auto">
                <table className="w-full text-left table-auto border-collapse">
                  <thead>
                    <tr className="bg-slate-700">
                      {results.columns.map((col, index) => (
                        <th key={index} className="px-4 py-2 text-slate-200 font-semibold text-sm border-b border-slate-600">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 text-slate-300 text-sm">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && !error && !results && (
              <div className="flex items-center justify-center h-full text-slate-500">
                <p>Execute a query to see results here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}