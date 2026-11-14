'use client';

import { useState, useCallback } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

// Mock database schema and data for demonstration
const mockSchema = {
  users: [
    { name: 'id', type: 'INTEGER', primaryKey: true },
    { name: 'name', type: 'TEXT' },
    { name: 'email', type: 'TEXT' },
  ],
  products: [
    { name: 'id', type: 'INTEGER', primaryKey: true },
    { name: 'name', type: 'TEXT' },
    { name: 'price', type: 'REAL' },
  ],
};

const mockData = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200.00 },
    { id: 102, name: 'Mouse', price: 25.50 },
    { id: 103, name: 'Keyboard', price: 75.00 },
  ],
};

export default function SqlPlaygroundPage() {
  const toolSlug = "sql-playground";
  const toolName = "SQL Playground";
  const description = "Execute SQL queries against an in-memory database and view results.";

  const { addToHistory } = useToolStore();

  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'results' | 'schema'>('results');

  const handleRunQuery = useCallback(() => {
    addToHistory(toolSlug);
    setError(null);
    setResults(null);

    if (!query.trim()) {
      setError("Please enter an SQL query.");
      toast.error("Please enter an SQL query.");
      return;
    }

    // --- Mock SQL Execution Logic ---
    // In a real scenario, you'd use a library like sql.js-wasm here.
    // For this implementation, we'll simulate some common queries.

    const lowerCaseQuery = query.trim().toLowerCase();

    if (lowerCaseQuery.startsWith('select * from users')) {
      setResults(mockData.users);
      toast.success("Query executed successfully!");
    } else if (lowerCaseQuery.startsWith('select * from products')) {
      setResults(mockData.products);
      toast.success("Query executed successfully!");
    } else if (lowerCaseQuery.startsWith('select name, email from users')) {
      setResults(mockData.users.map(({ name, email }) => ({ name, email })));
      toast.success("Query executed successfully!");
    } else if (lowerCaseQuery.startsWith('select name, price from products where price > 100')) {
      setResults(mockData.products.filter(p => p.price > 100).map(({ name, price }) => ({ name, price })));
      toast.success("Query executed successfully!");
    } else if (lowerCaseQuery.startsWith('insert') || lowerCaseQuery.startsWith('update') || lowerCaseQuery.startsWith('delete')) {
      setResults([{ message: "DML operations are simulated. No actual data changes in mock DB." }]);
      toast.success("DML operation simulated.");
    } else if (lowerCaseQuery.startsWith('create table') || lowerCaseQuery.startsWith('drop table')) {
      setResults([{ message: "DDL operations are simulated. No actual schema changes in mock DB." }]);
      toast.success("DDL operation simulated.");
    } else {
      setError("Unsupported or invalid mock query. Try 'SELECT * FROM users' or 'SELECT * FROM products'.");
      toast.error("Query failed: Unsupported or invalid query.");
    }
    setActiveTab('results');
  }, [query, addToHistory, toolSlug]);

  const renderTable = (data: any[]) => {
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

  const renderSchema = () => {
    return (
      <div className="space-y-6">
        {Object.entries(mockSchema).map(([tableName, columns]) => (
          <div key={tableName} className="border border-slate-700 rounded-lg p-4 bg-slate-800">
            <h3 className="text-lg font-semibold text-indigo-400 mb-3">{tableName}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-300 uppercase">Column</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-300 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-300 uppercase">PK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-800">
                  {columns.map((col, index) => (
                    <tr key={index} className="hover:bg-slate-700 transition-colors">
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-200">{col.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-300">{col.type}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-300">{col.primaryKey ? '✅' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };


  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Query Input and Controls */}
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex-1">
            <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-2">
              SQL Query
            </label>
            <textarea
              id="sql-query"
              className="w-full h-full min-h-[150px] p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 resize-y font-mono text-sm"
              placeholder="Enter your SQL query here, e.g., SELECT * FROM users;"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck="false"
            ></textarea>
          </div>
          <button
            onClick={handleRunQuery}
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Run Query
          </button>
        </div>

        {/* Results and Schema Display */}
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex border-b border-slate-700">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'results'
                  ? 'border-b-2 border-indigo-500 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-300'
              } transition-colors`}
              onClick={() => setActiveTab('results')}
            >
              Results
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'schema'
                  ? 'border-b-2 border-indigo-500 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-300'
              } transition-colors`}
              onClick={() => setActiveTab('schema')}
            >
              Schema
            </button>
          </div>

          <div className="flex-1 bg-slate-900 p-4 rounded-lg border border-slate-800 overflow-auto">
            {activeTab === 'results' && (
              <>
                {error && (
                  <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg text-sm mb-4">
                    <p className="font-semibold">Error:</p>
                    <pre className="whitespace-pre-wrap font-mono">{error}</pre>
                  </div>
                )}
                {results && results.length > 0 && renderTable(results)}
                {results && results.length === 0 && !error && (
                  <p className="text-slate-400">Query executed, but returned no results.</p>
                )}
                {!results && !error && (
                  <p className="text-slate-400">Run a query to see results here.</p>
                )}
              </>
            )}
            {activeTab === 'schema' && renderSchema()}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}