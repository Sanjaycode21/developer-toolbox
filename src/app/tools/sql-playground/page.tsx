"use client";

import { useState, useCallback, useMemo } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Terminal } from 'lucide-react';

const TOOL_SLUG = "sql-playground";
const TOOL_NAME = "SQL Playground";
const TOOL_DESCRIPTION = "Execute and test SQL queries against a mock database.";

// Mock Database
const mockDatabase = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200, category: 'Electronics' },
    { id: 102, name: 'Mouse', price: 25, category: 'Electronics' },
    { id: 103, name: 'Keyboard', price: 75, category: 'Electronics' },
    { id: 104, name: 'Monitor', price: 300, category: 'Electronics' },
  ],
};

// Helper to format JSON output nicely
const formatJson = (data: any) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (e) {
    return String(data);
  }
};

export default function SqlPlaygroundPage() {
  const [query, setQuery] = useState<string>('SELECT * FROM users;');
  const [results, setResults] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'results' | 'schema'>('results');

  const addToHistory = useToolStore((state) => state.addToHistory);

  const handleRunQuery = useCallback(() => {
    addToHistory(TOOL_SLUG);
    setError(null);
    setResults('');

    const trimmedQuery = query.trim().toLowerCase();

    try {
      if (trimmedQuery.startsWith('select * from users')) {
        setResults(formatJson(mockDatabase.users));
        toast.success('Query executed successfully!');
      } else if (trimmedQuery.startsWith('select * from products')) {
        setResults(formatJson(mockDatabase.products));
        toast.success('Query executed successfully!');
      } else if (trimmedQuery.startsWith('select')) {
        // Generic select for other tables or complex selects not explicitly mocked
        setResults(formatJson({ message: 'Generic SELECT query executed. Only `users` and `products` tables are fully mocked for SELECT *.' }));
        toast.success('Query executed successfully!');
      } else if (trimmedQuery.startsWith('insert') || trimmedQuery.startsWith('update') || trimmedQuery.startsWith('delete') || trimmedQuery.startsWith('create') || trimmedQuery.startsWith('drop')) {
        setResults(formatJson({ message: `Operation "${trimmedQuery.split(' ')[0].toUpperCase()}" executed successfully (mock). No actual database changes.` }));
        toast.success('Query executed successfully (mock)!');
      } else if (!trimmedQuery) {
        setError('Query cannot be empty.');
        toast.error('Query cannot be empty.');
      } else {
        setError('Unsupported query or syntax error. Try "SELECT * FROM users;" or "SELECT * FROM products;".');
        toast.error('Unsupported query or syntax error.');
      }
    } catch (e: any) {
      setError(`Execution error: ${e.message}`);
      toast.error(`Execution error: ${e.message}`);
    }
  }, [query, addToHistory]);

  const schemaInfo = useMemo(() => {
    const usersSchema = Object.keys(mockDatabase.users[0] || {}).map(key => ({
      column: key,
      type: typeof (mockDatabase.users[0] as any)[key],
    }));
    const productsSchema = Object.keys(mockDatabase.products[0] || {}).map(key => ({
      column: key,
      type: typeof (mockDatabase.products[0] as any)[key],
    }));

    return {
      users: usersSchema,
      products: productsSchema,
    };
  }, []);

  return (
    <ToolPageWrapper
      toolSlug={TOOL_SLUG}
      toolName={TOOL_NAME}
      description={TOOL_DESCRIPTION}
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Query Input Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-2">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            rows={10}
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 resize-y font-mono text-sm transition-colors placeholder-slate-500"
            spellCheck="false"
          />
          <button
            onClick={handleRunQuery}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Terminal size={18} />
            Run Query
          </button>
        </div>

        {/* Results and Schema Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex border-b border-slate-700 mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'results'
                  ? 'text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-300'
              } transition-colors`}
              onClick={() => setActiveTab('results')}
            >
              Results
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'schema'
                  ? 'text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-300'
              } transition-colors`}
              onClick={() => setActiveTab('schema')}
            >
              Schema
            </button>
          </div>

          {activeTab === 'results' && (
            <div className="flex-1 flex flex-col">
              <label htmlFor="sql-results" className="block text-sm font-medium text-slate-300 mb-2">
                Output
              </label>
              <textarea
                id="sql-results"
                value={error || results}
                readOnly
                rows={10}
                className={`w-full flex-1 p-4 bg-slate-800 border ${
                  error ? 'border-red-600 text-red-400' : 'border-slate-700 text-slate-50'
                } rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-y font-mono text-sm transition-colors`}
                spellCheck="false"
              />
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Mock Database Schema</h3>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-50 overflow-auto flex-1">
                <h4 className="font-medium text-indigo-400 mb-2">Table: users</h4>
                <ul className="list-disc list-inside mb-4 pl-2">
                  {schemaInfo.users.map((col, index) => (
                    <li key={index} className="text-slate-300">
                      <span className="font-mono text-slate-100">{col.column}</span>: <span className="text-slate-400">{col.type}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="font-medium text-indigo-400 mb-2">Table: products</h4>
                <ul className="list-disc list-inside pl-2">
                  {schemaInfo.products.map((col, index) => (
                    <li key={index} className="text-slate-300">
                      <span className="font-mono text-slate-100">{col.column}</span>: <span className="text-slate-400">{col.type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolPageWrapper>
  );
}