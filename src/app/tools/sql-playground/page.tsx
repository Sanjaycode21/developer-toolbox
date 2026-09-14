"use client";

import React, { useState, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Database, Play, XCircle } from 'lucide-react';

// Mock Database
const mockDatabase = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
    { id: 4, name: 'Diana', email: 'diana@example.com', age: 28 },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200, category: 'Electronics' },
    { id: 102, name: 'Mouse', price: 25, category: 'Electronics' },
    { id: 103, name: 'Keyboard', price: 75, category: 'Electronics' },
    { id: 104, name: 'Monitor', price: 300, category: 'Electronics' },
    { id: 105, name: 'Desk Chair', price: 150, category: 'Furniture' },
  ],
};

type QueryResult = Record<string, any>[];

export default function SqlPlaygroundPage() {
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM users;');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addToHistory = useToolStore((state) => state.addToHistory);
  const toolSlug = "sql-playground";

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleRunQuery = async () => {
    setIsLoading(true);
    setError(null);
    setQueryResult(null);

    // Simulate API call or complex computation
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const lowerCaseQuery = sqlQuery.trim().toLowerCase();
      let result: QueryResult | null = null;

      if (lowerCaseQuery.startsWith('select * from users')) {
        result = mockDatabase.users;
      } else if (lowerCaseQuery.startsWith('select * from products')) {
        result = mockDatabase.products;
      } else if (lowerCaseQuery.startsWith('select name, email from users')) {
        result = mockDatabase.users.map(({ name, email }) => ({ name, email }));
      } else if (lowerCaseQuery.startsWith('select name, price from products')) {
        result = mockDatabase.products.map(({ name, price }) => ({ name, price }));
      } else {
        setError('Unsupported query. Please refer to the "Mock Database Schema" for supported queries.');
        toast.error('Unsupported query.');
        return;
      }

      setQueryResult(result);
      toast.success('Query executed successfully!');

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      toast.error('Error executing query.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTable = (data: QueryResult) => {
    if (!data || data.length === 0) {
      return <p className="text-slate-400">No results to display.</p>;
    }

    const headers = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800">
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
          <tbody className="divide-y divide-slate-800 bg-slate-900">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                {headers.map((header) => (
                  <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                    {String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Execute and test SQL queries against a mock database."
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Query Input and Controls */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-md">
            <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" /> SQL Query
            </h3>
            <textarea
              className="w-full h-40 p-3 bg-slate-900 border border-slate-700 rounded-md text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              spellCheck="false"
            />
            <button
              onClick={handleRunQuery}
              disabled={isLoading}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running Query...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> Run Query
                </>
              )}
            </button>
          </div>

          {/* Schema Info */}
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-md">
            <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" /> Mock Database Schema
            </h3>
            <div className="text-sm text-slate-300 space-y-2">
              <p className="font-medium text-slate-200">Table: <span className="font-mono text-indigo-300">users</span></p>
              <ul className="list-disc list-inside ml-4 text-slate-400">
                <li><span className="font-mono text-yellow-300">id</span>: INTEGER</li>
                <li><span className="font-mono text-yellow-300">name</span>: TEXT</li>
                <li><span className="font-mono text-yellow-300">email</span>: TEXT</li>
                <li><span className="font-mono text-yellow-300">age</span>: INTEGER</li>
              </ul>
              <p className="font-medium text-slate-200 mt-4">Table: <span className="font-mono text-indigo-300">products</span></p>
              <ul className="list-disc list-inside ml-4 text-slate-400">
                <li><span className="font-mono text-yellow-300">id</span>: INTEGER</li>
                <li><span className="font-mono text-yellow-300">name</span>: TEXT</li>
                <li><span className="font-mono text-yellow-300">price</span>: REAL</li>
                <li><span className="font-mono text-yellow-300">category</span>: TEXT</li>
              </ul>
              <p className="mt-4 text-slate-400">
                <span className="font-semibold text-slate-300">Supported Queries:</span>
                <ul className="list-disc list-inside ml-4 text-slate-400">
                  <li><span className="font-mono text-green-300">SELECT * FROM users;</span></li>
                  <li><span className="font-mono text-green-300">SELECT name, email FROM users;</span></li>
                  <li><span className="font-mono text-green-300">SELECT * FROM products;</span></li>
                  <li><span className="font-mono text-green-300">SELECT name, price FROM products;</span></li>
                </ul>
              </p>
            </div>
          </div>
        </div>

        {/* Query Results */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-md min-h-[300px]">
            <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <Play className="w-5 h-5 text-purple-400" /> Query Results
            </h3>
            {isLoading && (
              <div className="flex items-center justify-center h-full text-slate-400">
                <svg className="animate-spin h-6 w-6 text-indigo-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading results...
              </div>
            )}
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-center gap-3">
                <XCircle className="w-5 h-5" />
                <p className="font-medium">{error}</p>
              </div>
            )}
            {!isLoading && !error && queryResult && (
              renderTable(queryResult)
            )}
            {!isLoading && !error && !queryResult && (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>Run a query to see results here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}