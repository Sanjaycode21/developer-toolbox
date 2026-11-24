"use client";

import React, { useState, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Terminal, Play } from 'lucide-react';

// Mock data for demonstration
const mockUsers = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', created_at: '2023-01-01' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', created_at: '2023-01-05' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', created_at: '2023-01-10' },
];

const mockProducts = [
  { id: 101, name: 'Laptop', price: 1200.00, stock: 50 },
  { id: 102, name: 'Mouse', price: 25.00, stock: 200 },
  { id: 103, name: 'Keyboard', price: 75.00, stock: 100 },
];

const mockSchema = {
  users: [
    { name: 'id', type: 'INT', primaryKey: true },
    { name: 'name', type: 'VARCHAR(255)' },
    { name: 'email', type: 'VARCHAR(255)' },
    { name: 'created_at', type: 'DATE' },
  ],
  products: [
    { name: 'id', type: 'INT', primaryKey: true },
    { name: 'name', type: 'VARCHAR(255)' },
    { name: 'price', type: 'DECIMAL(10,2)' },
    { name: 'stock', type: 'INT' },
  ],
};

export default function SQLPlaygroundPage() {
  const [sqlInput, setSqlInput] = useState('SELECT * FROM users;');
  const [queryResult, setQueryResult] = useState<any[] | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToHistory = useToolStore((state) => state.addToHistory);

  useEffect(() => {
    addToHistory('sql-playground');
  }, [addToHistory]);

  const handleRunQuery = () => {
    setError(null);
    setIsLoading(true);
    setQueryResult(null); // Clear previous results

    const trimmedInput = sqlInput.trim().toLowerCase();

    setTimeout(() => {
      try {
        if (trimmedInput.startsWith('select * from users')) {
          setQueryResult(mockUsers);
          toast.success('Query executed successfully!');
        } else if (trimmedInput.startsWith('select * from products')) {
          setQueryResult(mockProducts);
          toast.success('Query executed successfully!');
        } else if (trimmedInput.startsWith('insert') || trimmedInput.startsWith('update') || trimmedInput.startsWith('delete')) {
          setQueryResult('Query executed successfully. Affected rows: 1');
          toast.success('Query executed successfully!');
        } else if (trimmedInput.startsWith('create') || trimmedInput.startsWith('drop') || trimmedInput.startsWith('alter')) {
          throw new Error('Schema modification queries are not supported in this playground.');
        } else {
          throw new Error('Unsupported query or syntax error. Try "SELECT * FROM users;" or "SELECT * FROM products;".');
        }
      } catch (e: any) {
        setError(e.message || 'An unknown error occurred.');
        setQueryResult(null);
        toast.error(e.message || 'Failed to execute query.');
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Simulate network delay
  };

  const renderResultTable = (data: any[]) => {
    if (!data || data.length === 0) {
      return <p className="text-slate-400">No results found.</p>;
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
          <tbody className="divide-y divide-slate-800">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                {headers.map((header) => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
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
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Write and test SQL queries against a mock database."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left Panel: SQL Editor */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 flex flex-col">
            <label htmlFor="sql-editor" className="block text-sm font-medium text-slate-300 mb-2">
              SQL Query
            </label>
            <textarea
              id="sql-editor"
              className="flex-1 w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-y min-h-[150px] lg:min-h-[300px]"
              value={sqlInput}
              onChange={(e) => setSqlInput(e.target.value)}
              placeholder="Enter your SQL query here..."
              rows={10}
            />
          </div>
          <button
            onClick={handleRunQuery}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running...
              </>
            ) : (
              <>
                <Play size={18} /> Run Query
              </>
            )}
          </button>
        </div>

        {/* Right Panel: Results & Schema */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Query Results */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Query Results</h3>
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-4 overflow-auto min-h-[150px] lg:min-h-[300px]">
              {isLoading && (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <svg className="animate-spin h-5 w-5 mr-3 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Executing query...
                </div>
              )}
              {!isLoading && error && (
                <div className="text-red-400 font-mono text-sm">
                  <p className="font-bold">Error:</p>
                  <pre className="whitespace-pre-wrap">{error}</pre>
                </div>
              )}
              {!isLoading && queryResult && typeof queryResult === 'string' && (
                <p className="text-slate-200 font-mono text-sm">{queryResult}</p>
              )}
              {!isLoading && queryResult && Array.isArray(queryResult) && renderResultTable(queryResult)}
              {!isLoading && !queryResult && !error && (
                <p className="text-slate-400">Run a query to see results here.</p>
              )}
            </div>
          </div>

          {/* Mock Schema */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">
              <Terminal size={20} className="inline-block mr-2 text-indigo-400" />
              Mock Schema
            </h3>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-sm text-slate-300 font-mono">
              {Object.entries(mockSchema).map(([tableName, columns]) => (
                <div key={tableName} className="mb-4 last:mb-0">
                  <p className="font-bold text-indigo-400 mb-1">{tableName}</p>
                  <ul className="list-disc list-inside ml-4 text-slate-400">
                    {columns.map((col) => (
                      <li key={col.name}>
                        {col.name} <span className="text-slate-500">({col.type}{col.primaryKey ? ', PK' : ''})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}