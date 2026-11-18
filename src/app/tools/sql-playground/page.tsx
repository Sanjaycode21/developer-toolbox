"use client";

import React, { useState, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

interface TableRow {
  [key: string]: any;
}

interface TableResult {
  columns: string[];
  rows: TableRow[];
}

const sampleData: { [key: string]: TableRow[] } = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30, city: 'New York' },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24, city: 'Los Angeles' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35, city: 'Chicago' },
    { id: 4, name: 'Diana', email: 'diana@example.com', age: 28, city: 'Houston' },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200, category: 'Electronics', stock: 50 },
    { id: 102, name: 'Mouse', price: 25, category: 'Electronics', stock: 200 },
    { id: 103, name: 'Keyboard', price: 75, category: 'Electronics', stock: 150 },
    { id: 104, name: 'Monitor', price: 300, category: 'Electronics', stock: 75 },
    { id: 105, name: 'Desk Chair', price: 150, category: 'Furniture', stock: 100 },
  ],
};

const SQLPlaygroundPage: React.FC = () => {
  const toolSlug = "sql-playground";
  const addToHistory = useToolStore((state) => state.addToHistory);

  const [query, setQuery] = useState<string>('SELECT * FROM users;');
  const [results, setResults] = useState<TableResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const executeQuery = () => {
    setLoading(true);
    setResults(null);
    setError(null);

    const lowerCaseQuery = query.toLowerCase().trim();

    // Simulate a delay for query execution
    setTimeout(() => {
      try {
        let data: TableRow[] = [];
        let columns: string[] = [];

        if (lowerCaseQuery.startsWith('select * from users')) {
          data = sampleData.users;
        } else if (lowerCaseQuery.startsWith('select * from products')) {
          data = sampleData.products;
        } else if (lowerCaseQuery.startsWith('select name, email from users')) {
          data = sampleData.users.map(({ name, email }) => ({ name, email }));
        } else if (lowerCaseQuery.startsWith('select name, price from products')) {
          data = sampleData.products.map(({ name, price }) => ({ name, price }));
        } else if (lowerCaseQuery.startsWith('select * from users where age > 30')) {
          data = sampleData.users.filter(user => user.age > 30);
        } else if (lowerCaseQuery.startsWith('select * from products where price < 100')) {
          data = sampleData.products.filter(product => product.price < 100);
        }
        else if (lowerCaseQuery.startsWith('insert') || lowerCaseQuery.startsWith('update') || lowerCaseQuery.startsWith('delete')) {
          setError('DML operations are not supported in this playground.');
          toast.error('DML operations not supported.');
          setLoading(false);
          return;
        } else if (lowerCaseQuery.startsWith('create') || lowerCaseQuery.startsWith('alter') || lowerCaseQuery.startsWith('drop')) {
          setError('DDL operations are not supported in this playground.');
          toast.error('DDL operations not supported.');
          setLoading(false);
          return;
        }
        else {
          setError('Unsupported query or table. Try "SELECT * FROM users;", "SELECT name, email FROM users;", "SELECT * FROM users WHERE age > 30;" or similar simple SELECT statements.');
          toast.error('Unsupported query.');
          setLoading(false);
          return;
        }

        if (data.length > 0) {
          columns = Object.keys(data[0]);
          setResults({ columns, rows: data });
        } else {
          setResults({ columns: [], rows: [] });
        }
        toast.success('Query executed successfully!');

      } catch (e: any) {
        setError(e.message || 'An unknown error occurred during query execution.');
        toast.error('Error executing query.');
      } finally {
        setLoading(false);
      }
    }, 500); // Simulate network/processing delay
  };

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Experiment with SQL queries against a sample in-memory database."
    >
      <div className="flex flex-col space-y-6">
        {/* Query Input */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="sql-query" className="text-sm font-medium text-slate-300">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="w-full min-h-[150px] bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-50 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-y"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here, e.g., SELECT * FROM users;"
            spellCheck="false"
          />
          <button
            onClick={executeQuery}
            disabled={loading}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start"
          >
            {loading ? 'Executing...' : 'Run Query'}
          </button>
        </div>

        {/* Results Display */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold text-slate-200">Results</h3>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 min-h-[200px] overflow-auto">
            {loading && (
              <div className="flex items-center justify-center h-full text-slate-400">
                <svg className="animate-spin h-5 w-5 mr-3 text-indigo-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Executing query...
              </div>
            )}

            {!loading && error && (
              <div className="text-red-400 font-mono text-sm">
                <pre className="whitespace-pre-wrap">{error}</pre>
              </div>
            )}

            {!loading && results && results.rows.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-700">
                    <tr>
                      {results.columns.map((col) => (
                        <th key={col} scope="col" className="px-6 py-3">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700 transition-colors">
                        {results.columns.map((col) => (
                          <td key={col} className="px-6 py-4">
                            {String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && results && results.rows.length === 0 && !error && (
              <div className="text-slate-400 text-sm">No results found.</div>
            )}

            {!loading && !results && !error && (
              <div className="text-slate-400 text-sm">
                Enter a SQL query and click "Run Query" to see results.
                <p className="mt-2">
                  Try: <code className="bg-slate-700 px-1 py-0.5 rounded">SELECT * FROM users;</code>,{' '}
                  <code className="bg-slate-700 px-1 py-0.5 rounded">SELECT name, email FROM users;</code>,{' '}
                  <code className="bg-slate-700 px-1 py-0.5 rounded">SELECT * FROM users WHERE age &gt; 30;</code>, or{' '}
                  <code className="bg-slate-700 px-1 py-0.5 rounded">SELECT * FROM products;</code>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;