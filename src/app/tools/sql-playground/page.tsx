"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Terminal, Table } from 'lucide-react';

interface MockUser {
  id: number;
  name: string;
  email: string;
  age: number;
}

interface MockProduct {
  id: number;
  name: string;
  price: number;
  category: string;
}

type MockRow = MockUser | MockProduct | Record<string, any>;

const mockDatabase = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
    { id: 4, name: 'Diana', email: 'diana@example.com', age: 29 },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200, category: 'Electronics' },
    { id: 102, name: 'Mouse', price: 25, category: 'Electronics' },
    { id: 103, name: 'Keyboard', price: 75, category: 'Electronics' },
    { id: 104, name: 'Monitor', price: 300, category: 'Electronics' },
    { id: 105, name: 'Desk Chair', price: 150, category: 'Furniture' },
    { id: 106, name: 'Webcam', price: 60, category: 'Electronics' },
  ],
};

const SQLPlaygroundPage: React.FC = () => {
  const [query, setQuery] = useState<string>('SELECT * FROM users;');
  const [results, setResults] = useState<MockRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const { addToHistory } = useToolStore();

  const parseAndExecuteQuery = useCallback((sqlQuery: string) => {
    const startTime = performance.now();
    setError(null);
    setResults(null);
    setExecutionTime(null);

    const trimmedQuery = sqlQuery.trim().toLowerCase();

    try {
      if (trimmedQuery.startsWith('select * from users')) {
        setResults(mockDatabase.users);
      } else if (trimmedQuery.startsWith('select * from products')) {
        setResults(mockDatabase.products);
      } else if (trimmedQuery.startsWith('select')) {
        // A very basic attempt to handle specific column selection for users
        const match = trimmedQuery.match(/select\s+(.+?)\s+from\s+(users|products)/);
        if (match) {
          const columnsStr = match[1];
          const tableName = match[2];
          const columns = columnsStr.split(',').map(col => col.trim());

          const sourceData = tableName === 'users' ? mockDatabase.users : mockDatabase.products;
          const selectedResults = sourceData.map(row => {
            const newRow: Record<string, any> = {};
            columns.forEach(col => {
              if (row.hasOwnProperty(col)) {
                newRow[col] = row[col as keyof typeof row];
              }
            });
            return newRow;
          });
          setResults(selectedResults);
        } else {
          setError('Unsupported SELECT query format or table. Try "SELECT * FROM users;" or "SELECT name, email FROM users;"');
        }
      } else if (trimmedQuery.startsWith('insert') || trimmedQuery.startsWith('update') || trimmedQuery.startsWith('delete')) {
        setError('DML statements (INSERT, UPDATE, DELETE) are not supported in this mock playground.');
      } else if (trimmedQuery.startsWith('create') || trimmedQuery.startsWith('drop') || trimmedQuery.startsWith('alter')) {
        setError('DDL statements (CREATE, DROP, ALTER) are not supported in this mock playground.');
      } else {
        setError('Unsupported SQL query. Only basic SELECT statements are simulated.');
      }
    } catch (e: any) {
      setError(`Query execution failed: ${e.message}`);
    } finally {
      const endTime = performance.now();
      setExecutionTime(parseFloat((endTime - startTime).toFixed(3)));
    }
  }, []);

  useEffect(() => {
    // Run initial query on mount
    parseAndExecuteQuery(query);
  }, [parseAndExecuteQuery, query]);

  const handleRunQuery = () => {
    addToHistory('sql-playground');
    parseAndExecuteQuery(query);
    toast.success('Query executed!');
  };

  const getTableHeaders = (data: MockRow[]) => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const headers = results ? getTableHeaders(results) : [];

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute and test SQL queries against a mock in-memory database."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Query Input Section */}
        <div className="flex-1 flex flex-col bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            SQL Query
          </h2>
          <textarea
            className="flex-1 w-full p-4 bg-slate-900 border border-slate-700 rounded-md text-slate-200 font-mono text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            rows={10}
          />
          <button
            onClick={handleRunQuery}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            Run Query
          </button>
          <div className="mt-4 text-xs text-slate-400">
            <p>
              <span className="font-semibold">Supported Queries:</span>
            </p>
            <ul className="list-disc list-inside ml-2">
              <li><code className="bg-slate-700 px-1 rounded">SELECT * FROM users;</code></li>
              <li><code className="bg-slate-700 px-1 rounded">SELECT * FROM products;</code></li>
              <li><code className="bg-slate-700 px-1 rounded">SELECT name, email FROM users;</code></li>
              <li><code className="bg-slate-700 px-1 rounded">SELECT name, price FROM products;</code></li>
            </ul>
            <p className="mt-2 text-yellow-400">
              <span className="font-semibold">Note:</span> This is a client-side mock playground. No actual database operations are performed.
            </p>
          </div>
        </div>

        {/* Results Output Section */}
        <div className="flex-1 flex flex-col bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-400" />
            Query Results
          </h2>

          {executionTime !== null && (
            <p className="text-sm text-slate-400 mb-3">
              Execution Time: <span className="font-mono text-emerald-400">{executionTime} ms</span>
            </p>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md font-mono text-sm overflow-auto">
              <p className="font-semibold">Error:</p>
              <pre className="whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          {results && results.length > 0 && !error && (
            <div className="flex-1 overflow-auto rounded-md border border-slate-700">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700 sticky top-0">
                  <tr>
                    {headers.map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                  {results.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-slate-700 transition-colors">
                      {headers.map((header) => (
                        <td
                          key={`${rowIndex}-${header}`}
                          className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono"
                        >
                          {String(row[header as keyof typeof row])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {results && results.length === 0 && !error && (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-lg">
              No results found.
            </div>
          )}

          {!results && !error && (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-lg">
              Run a query to see results.
            </div>
          )}
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;