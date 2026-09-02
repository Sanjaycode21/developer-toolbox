'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Play, Table, XCircle, Loader2, Info } from 'lucide-react';

// Mock Database Data
const mockDb = {
  users: [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', created_at: '2023-01-15' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', created_at: '2023-02-20' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', created_at: '2023-03-10' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', created_at: '2023-04-01' },
  ],
  products: [
    { id: 101, name: 'Laptop Pro', price: 1200.00, stock: 50 },
    { id: 102, name: 'Mechanical Keyboard', price: 150.00, stock: 200 },
    { id: 103, name: 'Wireless Mouse', price: 45.00, stock: 300 },
    { id: 104, name: 'USB-C Hub', price: 75.00, stock: 120 },
  ],
  orders: [
    { id: 1001, user_id: 1, product_id: 101, quantity: 1, order_date: '2023-04-01' },
    { id: 1002, user_id: 2, product_id: 102, quantity: 2, order_date: '2023-04-05' },
    { id: 1003, user_id: 1, product_id: 103, quantity: 1, order_date: '2023-04-10' },
    { id: 1004, user_id: 3, product_id: 101, quantity: 1, order_date: '2023-04-12' },
    { id: 1005, user_id: 4, product_id: 104, quantity: 1, order_date: '2023-04-15' },
    { id: 1006, user_id: 2, product_id: 103, quantity: 3, order_date: '2023-04-18' },
  ],
};

type TableRow = Record<string, any>;

const SqlPlaygroundPage: React.FC = () => {
  const toolSlug = "sql-playground";
  const toolName = "SQL Playground";
  const description = "Execute and test SQL queries against a mock database.";

  const { addToHistory } = useToolStore();

  const [query, setQuery] = useState<string>('SELECT * FROM users;');
  const [results, setResults] = useState<TableRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const executeQuery = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));

    try {
      const lowerCaseQuery = query.toLowerCase().trim();

      if (lowerCaseQuery.startsWith('select * from')) {
        const match = lowerCaseQuery.match(/select \* from\s+(\w+);?/);
        if (match && match[1]) {
          const tableName = match[1];
          if (mockDb.hasOwnProperty(tableName)) {
            setResults(mockDb[tableName as keyof typeof mockDb]);
            toast.success(`Query executed successfully on table '${tableName}'.`);
          } else {
            setError(`Error: Table '${tableName}' not found in mock database.`);
            toast.error(`Table '${tableName}' not found.`);
          }
        } else {
          setError('Error: Invalid SELECT * FROM query format. Expected "SELECT * FROM <table>;".');
          toast.error('Invalid query format.');
        }
      } else if (lowerCaseQuery.startsWith('insert') || lowerCaseQuery.startsWith('update') || lowerCaseQuery.startsWith('delete')) {
        setError('Error: DML statements (INSERT, UPDATE, DELETE) are not supported in this mock playground.');
        toast.error('DML statements not supported.');
      } else if (lowerCaseQuery.startsWith('create') || lowerCaseQuery.startsWith('alter') || lowerCaseQuery.startsWith('drop')) {
        setError('Error: DDL statements (CREATE, ALTER, DROP) are not supported in this mock playground.');
        toast.error('DDL statements not supported.');
      } else if (lowerCaseQuery === '') {
        setError('Error: Query cannot be empty.');
        toast.error('Query cannot be empty.');
      }
      else {
        setError('Error: Only basic "SELECT * FROM <table>" queries are supported.');
        toast.error('Unsupported query type.');
      }
    } catch (e: any) {
      setError(`An unexpected error occurred: ${e.message}`);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const tableHeaders = useMemo(() => {
    if (!results || results.length === 0) return [];
    return Object.keys(results[0]);
  }, [results]);

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Query Input Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 relative">
            <textarea
              className="w-full h-full min-h-[150px] lg:min-h-[300px] p-4 pr-28 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-y lg:resize-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              spellCheck="false"
            />
            <button
              onClick={executeQuery}
              disabled={isLoading}
              className="absolute bottom-4 right-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run Query
            </button>
          </div>

          {/* Info about supported queries */}
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg text-sm text-slate-400 flex items-start gap-3">
            <Info className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-300 mb-1">Supported Queries:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Only basic <code className="bg-slate-700 px-1 py-0.5 rounded text-indigo-300">SELECT * FROM &lt;table_name&gt;</code> statements are supported.</li>
                <li>Available tables: <code className="bg-slate-700 px-1 py-0.5 rounded text-indigo-300">users</code>, <code className="bg-slate-700 px-1 py-0.5 rounded text-indigo-300">products</code>, <code className="bg-slate-700 px-1 py-0.5 rounded text-indigo-300">orders</code>.</li>
                <li>DML (INSERT, UPDATE, DELETE) and DDL (CREATE, ALTER, DROP) statements are not supported.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Table className="h-5 w-5 text-indigo-400" /> Query Results
          </h3>

          <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-auto relative min-h-[200px]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/70 backdrop-blur-sm z-10">
                <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                <span className="sr-only">Loading...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 text-red-400 bg-red-900/30 border border-red-800 p-3 rounded-md">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {results && results.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-700">
                    <tr>
                      {tableHeaders.map((header) => (
                        <th key={header} scope="col" className="px-4 py-2 whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, rowIndex) => (
                      <tr key={rowIndex} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700 transition-colors">
                        {tableHeaders.map((header) => (
                          <td key={`${rowIndex}-${header}`} className="px-4 py-2 whitespace-nowrap">
                            {String(row[header])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {results && results.length === 0 && !error && !isLoading && (
              <div className="text-slate-400 text-center py-8">
                <p>No results found for your query.</p>
              </div>
            )}

            {!results && !error && !isLoading && (
              <div className="text-slate-400 text-center py-8">
                <p>Run a query to see results here.</p>
                <p className="text-xs mt-2">Try: <code className="bg-slate-700 px-1 py-0.5 rounded text-indigo-300">SELECT * FROM users;</code></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SqlPlaygroundPage;