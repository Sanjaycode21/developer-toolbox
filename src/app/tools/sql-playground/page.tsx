"use client";

import React, { useState, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

// Mock database data
const mockData = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
    { id: 4, name: 'David', email: 'david@example.com', age: 29 },
    { id: 5, name: 'Eve', email: 'eve@example.com', age: 42 },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200.00, category: 'Electronics' },
    { id: 102, name: 'Mouse', price: 25.50, category: 'Electronics' },
    { id: 103, name: 'Keyboard', price: 75.00, category: 'Electronics' },
    { id: 104, name: 'Monitor', price: 300.00, category: 'Electronics' },
    { id: 105, name: 'Desk Chair', price: 150.00, category: 'Furniture' },
  ],
  orders: [
    { order_id: 1, user_id: 1, product_id: 101, quantity: 1, order_date: '2023-01-15' },
    { order_id: 2, user_id: 2, product_id: 103, quantity: 2, order_date: '2023-01-16' },
    { order_id: 3, user_id: 1, product_id: 102, quantity: 1, order_date: '2023-01-17' },
    { order_id: 4, user_id: 3, product_id: 105, quantity: 1, order_date: '2023-01-18' },
  ],
};

const SQLPlaygroundPage = () => {
  const toolSlug = "sql-playground";
  const { addToHistory } = useToolStore();

  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const handleExecute = useCallback(() => {
    addToHistory(toolSlug);
    const lowerCaseQuery = query.toLowerCase().trim();
    let newResults: any = null;

    if (lowerCaseQuery.startsWith('select * from')) {
      const parts = lowerCaseQuery.split(' ');
      const fromIndex = parts.indexOf('from');
      if (fromIndex !== -1 && fromIndex + 1 < parts.length) {
        let tableName = parts[fromIndex + 1];
        // Remove semicolon if present
        if (tableName.endsWith(';')) {
          tableName = tableName.slice(0, -1);
        }

        if (mockData.hasOwnProperty(tableName)) {
          newResults = mockData[tableName as keyof typeof mockData];
          toast.success(`Query executed successfully on table '${tableName}'.`);
        } else {
          newResults = { error: `Table '${tableName}' not found in mock database.` };
          toast.error(`Error: Table '${tableName}' not found.`);
        }
      } else {
        newResults = { error: 'Invalid SELECT * FROM query format.' };
        toast.error('Error: Invalid SELECT * FROM query format.');
      }
    } else if (lowerCaseQuery === '') {
      newResults = { message: 'Please enter a query.' };
      toast('Please enter a query.', { icon: 'ℹ️' });
    } else {
      newResults = { message: 'Only simple "SELECT * FROM <table>" queries are supported for now.' };
      toast.error('Unsupported query type.');
    }

    setResults(newResults);
  }, [query, addToHistory, toolSlug]);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults(null);
    toast('Editor cleared.', { icon: '🧹' });
  }, []);

  const handleLoadSample = useCallback(() => {
    setQuery('SELECT * FROM users;');
    setResults(null);
    toast('Sample query loaded.', { icon: '📝' });
  }, []);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Execute and test SQL queries against a mock in-memory database."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left Panel: Editor */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Query Editor */}
          <div className="bg-slate-800 p-4 rounded-lg shadow-md flex-1 flex flex-col">
            <label htmlFor="sql-editor" className="block text-sm font-medium text-slate-300 mb-2">SQL Query Editor</label>
            <textarea
              id="sql-editor"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={10}
              placeholder="Enter your SQL query here, e.g., SELECT * FROM users;"
              className="w-full flex-1 bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
              spellCheck="false"
            ></textarea>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleExecute}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors text-sm font-medium"
              >
                Execute Query
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors text-sm font-medium"
              >
                Clear Editor
              </button>
              <button
                onClick={handleLoadSample}
                className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors text-sm font-medium"
              >
                Load Sample Query
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Results & Schema */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Results */}
          <div className="bg-slate-800 p-4 rounded-lg shadow-md flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Query Results</h3>
            <div className="bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-100 overflow-auto flex-1 font-mono text-sm">
              {results ? (
                <pre className="whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
              ) : (
                <p className="text-slate-500">No results yet. Execute a query to see output.</p>
              )}
            </div>
          </div>

          {/* Schema Info */}
          <div className="bg-slate-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Mock Database Schema</h3>
            <div className="bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-100 font-mono text-sm">
              <p className="text-slate-300 mb-2">Available Tables:</p>
              <ul className="list-disc list-inside ml-2 text-slate-400">
                <li>
                  <span className="font-semibold text-slate-200">users</span>: (id INT, name TEXT, email TEXT, age INT)
                </li>
                <li>
                  <span className="font-semibold text-slate-200">products</span>: (id INT, name TEXT, price REAL, category TEXT)
                </li>
                <li>
                  <span className="font-semibold text-slate-200">orders</span>: (order_id INT, user_id INT, product_id INT, quantity INT, order_date TEXT)
                </li>
              </ul>
              <p className="mt-3 text-slate-500 text-xs">
                Only simple <code className="bg-slate-700 px-1 py-0.5 rounded">SELECT * FROM &lt;table&gt;</code> queries are supported.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;