'use client';

import React, { useState, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Code, Play, Database } from 'lucide-react';

interface MockTable {
  [key: string]: any[];
}

// A simple in-memory mock database for demonstration purposes
const mockDatabase: MockTable = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
    { id: 4, name: 'David', email: 'david@example.com', age: 40 },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200, category: 'Electronics' },
    { id: 102, name: 'Mouse', price: 25, category: 'Electronics' },
    { id: 103, name: 'Keyboard', price: 75, category: 'Electronics' },
    { id: 104, name: 'Desk Chair', price: 300, category: 'Furniture' },
    { id: 105, name: 'Monitor', price: 400, category: 'Electronics' },
  ],
  orders: [
    { order_id: 1001, user_id: 1, product_id: 101, quantity: 1, order_date: '2023-01-15' },
    { order_id: 1002, user_id: 2, product_id: 102, quantity: 2, order_date: '2023-01-16' },
    { order_id: 1003, user_id: 1, product_id: 103, quantity: 1, order_date: '2023-01-17' },
    { order_id: 1004, user_id: 3, product_id: 104, quantity: 1, order_date: '2023-01-18' },
    { order_id: 1005, user_id: 4, product_id: 105, quantity: 1, order_date: '2023-01-19' },
  ],
};

// Helper to get schema (column names) for a given table
const getTableSchema = (tableName: string) => {
  const table = mockDatabase[tableName];
  if (!table || table.length === 0) return [];
  return Object.keys(table[0]);
};

const SqlPlaygroundPage = () => {
  const [query, setQuery] = useState<string>('SELECT * FROM users;');
  const [results, setResults] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { addToHistory } = useToolStore();

  useEffect(() => {
    addToHistory('sql-playground');
  }, [addToHistory]);

  const handleExecuteQuery = () => {
    setError('');
    setResults('');

    const lowerQuery = query.toLowerCase().trim();

    if (lowerQuery.startsWith('select')) {
      const fromMatch = lowerQuery.match(/from\s+(\w+)/);
      if (fromMatch && fromMatch[1]) {
        const tableName = fromMatch[1];
        const tableData = mockDatabase[tableName];

        if (tableData) {
          // Basic SELECT * implementation
          if (lowerQuery.includes('select *')) {
            setResults(JSON.stringify(tableData, null, 2));
            toast.success(`Query executed on table '${tableName}'.`);
          } else {
            // More complex SELECT (e.g., specific columns) - simplified for now
            const selectMatch = lowerQuery.match(/select\s+([\w,\s]+)\s+from/);
            if (selectMatch && selectMatch[1]) {
              const columns = selectMatch[1].split(',').map(col => col.trim());
              const projectedData = tableData.map(row => {
                const newRow: { [key: string]: any } = {};
                columns.forEach(col => {
                  if (row.hasOwnProperty(col)) {
                    newRow[col] = row[col];
                  }
                });
                return newRow;
              });
              setResults(JSON.stringify(projectedData, null, 2));
              toast.success(`Query executed on table '${tableName}' with selected columns.`);
            } else {
              setError('Unsupported SELECT query format. Try "SELECT * FROM <table_name>;" or "SELECT col1, col2 FROM <table_name>;".');
              toast.error('Unsupported query format.');
            }
          }
        } else {
          setError(`Table '${tableName}' not found in mock database.`);
          toast.error(`Table '${tableName}' not found.`);
        }
      } else {
        setError('Invalid SELECT query. Please specify a table using "FROM".');
        toast.error('Invalid SELECT query.');
      }
    } else if (lowerQuery.startsWith('insert')) {
      setError('INSERT statements are not supported in this mock playground.');
      toast.error('INSERT not supported.');
    } else if (lowerQuery.startsWith('update')) {
      setError('UPDATE statements are not supported in this mock playground.');
      toast.error('UPDATE not supported.');
    } else if (lowerQuery.startsWith('delete')) {
      setError('DELETE statements are not supported in this mock playground.');
      toast.error('DELETE not supported.');
    } else if (lowerQuery.startsWith('create')) {
      setError('CREATE statements are not supported in this mock playground.');
      toast.error('CREATE not supported.');
    }
    else {
      setError('Unsupported SQL query type. Only basic SELECT queries are partially supported.');
      toast.error('Unsupported query type.');
    }
  };

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute and test SQL queries against a mock in-memory database."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query Input */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-400" /> SQL Query
            </h2>
            <button
              onClick={handleExecuteQuery}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <Play className="w-4 h-4 mr-2" /> Execute Query
            </button>
          </div>
          <textarea
            className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            spellCheck="false"
          />
        </div>

        {/* Schema Info */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" /> Mock Schema
          </h2>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 h-64 overflow-auto">
            <p className="text-sm text-slate-400 mb-2">Available Tables:</p>
            <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
              {Object.keys(mockDatabase).map((tableName) => (
                <li key={tableName}>
                  <span className="font-medium text-indigo-300">{tableName}</span> (
                  {getTableSchema(tableName).map((col, idx) => (
                    <span key={col} className="text-slate-400">
                      {col}
                      {idx < getTableSchema(tableName).length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  )
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 mt-4">
              Note: This is a client-side mock database. Only basic SELECT queries are partially supported.
            </p>
          </div>
        </div>
      </div>

      {/* Results Output */}
      <div className="mt-6 flex flex-col space-y-4">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <Code className="w-5 h-5 text-purple-400" /> Results
        </h2>
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg text-sm font-mono">
            Error: {error}
          </div>
        )}
        <textarea
          className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
          value={results}
          readOnly
          placeholder="Query results will appear here..."
          spellCheck="false"
        />
      </div>
    </ToolPageWrapper>
  );
};

export default SqlPlaygroundPage;