"use client";

import React, { useState, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Database, Play, RotateCcw, Code } from 'lucide-react';

// Sample Data for the simulated database
const sampleData = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
    { id: 4, name: 'Diana', email: 'diana@example.com', age: 28 },
    { id: 5, name: 'Eve', email: 'eve@example.com', age: 29 },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200, category: 'Electronics' },
    { id: 102, name: 'Mouse', price: 25, category: 'Electronics' },
    { id: 103, name: 'Keyboard', price: 75, category: 'Electronics' },
    { id: 104, name: 'Monitor', price: 300, category: 'Electronics' },
    { id: 105, name: 'Desk Chair', price: 150, category: 'Furniture' },
    { id: 106, name: 'Webcam', price: 50, category: 'Electronics' },
  ],
  orders: [
    { order_id: 1, user_id: 1, product_id: 101, quantity: 1, order_date: '2023-01-15' },
    { order_id: 2, user_id: 2, product_id: 103, quantity: 2, order_date: '2023-01-16' },
    { order_id: 3, user_id: 1, product_id: 105, quantity: 1, order_date: '2023-01-17' },
    { order_id: 4, user_id: 3, product_id: 102, quantity: 1, order_date: '2023-01-18' },
    { order_id: 5, user_id: 4, product_id: 104, quantity: 1, order_date: '2023-01-19' },
  ]
};

// Helper function to simulate SQL execution
const simulateSQLExecution = (query: string): { data?: any[]; error?: string; columns?: string[] } => {
  const lowerQuery = query.toLowerCase().trim();

  // Basic SELECT * FROM table_name;
  const selectAllMatch = lowerQuery.match(/^select\s+\*\s+from\s+([a-z_]+)\s*;?$/);
  if (selectAllMatch) {
    const tableName = selectAllMatch[1];
    const tableData = sampleData[tableName as keyof typeof sampleData];
    if (tableData) {
      if (tableData.length > 0) {
        const columns = Object.keys(tableData[0]);
        return { data: tableData, columns };
      }
      return { data: [], columns: [] }; // Empty table
    }
    return { error: `Table '${tableName}' not found.` };
  }

  // Basic INSERT INTO table_name (col1, col2) VALUES (val1, val2);
  const insertMatch = lowerQuery.match(/^insert\s+into\s+([a-z_]+)\s*\(([^)]+)\)\s*values\s*\(([^)]+)\)\s*;?$/);
  if (insertMatch) {
    const tableName = insertMatch[1];
    const columns = insertMatch[2].split(',').map(c => c.trim());
    const values = insertMatch[3].split(',').map(v => v.trim().replace(/^'|'$/g, '')); // Remove quotes for string values

    const tableData = sampleData[tableName as keyof typeof sampleData];
    if (tableData) {
      // Simulate adding to the table (in-memory only)
      // For this playground, we'll just acknowledge the insert.
      // We won't actually modify `sampleData` to keep it consistent for subsequent queries.
      return { data: [{ message: `Simulated INSERT into ${tableName} successful. (Data not actually modified)` }], columns: ['message'] };
    }
    return { error: `Table '${tableName}' not found for INSERT.` };
  }

  // Basic UPDATE table_name SET col1 = val1 WHERE condition;
  const updateMatch = lowerQuery.match(/^update\s+([a-z_]+)\s+set\s+([^;]+)(?:\s+where\s+([^;]+))?\s*;?$/);
  if (updateMatch) {
    const tableName = updateMatch[1];
    const setClause = updateMatch[2]; // Not actually used for logic, just for parsing
    const whereClause = updateMatch[3]; // Not actually used for logic

    const tableData = sampleData[tableName as keyof typeof sampleData];
    if (tableData) {
      // Simulate update
      return { data: [{ message: `Simulated UPDATE on ${tableName} successful. (Data not actually modified)` }], columns: ['message'] };
    }
    return { error: `Table '${tableName}' not found for UPDATE.` };
  }

  // Basic DELETE FROM table_name WHERE condition;
  const deleteMatch = lowerQuery.match(/^delete\s+from\s+([a-z_]+)(?:\s+where\s+([^;]+))?\s*;?$/);
  if (deleteMatch) {
    const tableName = deleteMatch[1];
    const whereClause = deleteMatch[2]; // Not actually used for logic

    const tableData = sampleData[tableName as keyof typeof sampleData];
    if (tableData) {
      // Simulate delete
      return { data: [{ message: `Simulated DELETE from ${tableName} successful. (Data not actually removed)` }], columns: ['message'] };
    }
    return { error: `Table '${tableName}' not found for DELETE.` };
  }

  return { error: "Unsupported SQL query. Only basic SELECT * FROM, INSERT INTO, UPDATE, and DELETE statements are simulated." };
};

interface QueryResult {
  data: any[];
  columns: string[];
  error?: string;
}

const SQLPlaygroundPage: React.FC = () => {
  const toolSlug = "sql-playground";
  const addToHistory = useToolStore((state) => state.addToHistory);

  const [query, setQuery] = useState<string>(`SELECT * FROM users;`);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleExecute = () => {
    setLoading(true);
    setResult(null);
    try {
      const simulatedResult = simulateSQLExecution(query);
      setResult({
        data: simulatedResult.data || [],
        columns: simulatedResult.columns || [],
        error: simulatedResult.error,
      });
      if (simulatedResult.error) {
        toast.error(simulatedResult.error);
      } else {
        toast.success("Query executed successfully!");
      }
    } catch (e: any) {
      setResult({ data: [], columns: [], error: e.message });
      toast.error(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery(`SELECT * FROM users;`);
    setResult(null);
    toast.success("Query editor reset.");
  };

  const renderTable = (data: any[], columns: string[]) => {
    if (data.length === 0) {
      return <p className="text-slate-400">No results found.</p>;
    }

    return (
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                {columns.map((col) => (
                  <td key={`${rowIndex}-${col}`} className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                    {String(row[col])}
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
      description="Execute and test SQL queries against a simulated database environment."
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Query Input and Controls */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" /> SQL Query Editor
            </h3>
            <textarea
              className="w-full h-48 p-3 bg-slate-900 border border-slate-700 rounded-md text-slate-200 font-mono text-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none resize-y"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              spellCheck="false"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Reset
              </button>
              <button
                onClick={handleExecute}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Executing...
                  </span>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" /> Execute
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Schema Information */}
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" /> Available Tables
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(sampleData).map(([tableName, data]) => (
                <div key={tableName} className="bg-slate-900 p-3 rounded-md border border-slate-700">
                  <p className="font-mono text-sm text-indigo-300 mb-1">{tableName}</p>
                  {data.length > 0 ? (
                    <ul className="list-disc list-inside text-slate-400 text-xs">
                      {Object.keys(data[0]).map((col) => (
                        <li key={`${tableName}-${col}`}>{col}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 text-xs">No columns defined (empty table).</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-400" /> Query Results
            </h3>
            {result ? (
              result.error ? (
                <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md font-mono text-sm">
                  <p className="font-bold mb-2">Error:</p>
                  <pre className="whitespace-pre-wrap">{result.error}</pre>
                </div>
              ) : (
                renderTable(result.data, result.columns)
              )
            ) : (
              <p className="text-slate-400">Execute a query to see results here.</p>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;