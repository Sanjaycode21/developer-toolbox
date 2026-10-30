"use client";

import React, { useState, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

interface TableData {
  headers: string[];
  rows: string[][];
}

const sampleUsersData: TableData = {
  headers: ['id', 'name', 'email', 'created_at'],
  rows: [
    ['1', 'Alice Smith', 'alice@example.com', '2023-01-15'],
    ['2', 'Bob Johnson', 'bob@example.com', '2023-02-20'],
    ['3', 'Charlie Brown', 'charlie@example.com', '2023-03-10'],
  ],
};

const sampleProductsData: TableData = {
  headers: ['product_id', 'name', 'price', 'stock'],
  rows: [
    ['101', 'Laptop', '1200.00', '50'],
    ['102', 'Mouse', '25.00', '200'],
    ['103', 'Keyboard', '75.00', '150'],
  ],
};

const sampleSchema = `
-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    created_at DATE
);

-- Products Table
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    stock INT
);
`;

export default function SqlPlaygroundPage() {
  const [sqlInput, setSqlInput] = useState<string>('');
  const [queryResult, setQueryResult] = useState<TableData | string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addToHistory = useToolStore((state) => state.addToHistory);
  const toolSlug = "sql-playground";

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleRunQuery = () => {
    setError(null);
    setQueryResult(null);

    const lowerCaseInput = sqlInput.toLowerCase().trim();

    if (lowerCaseInput.includes('select * from users')) {
      setQueryResult(sampleUsersData);
      toast.success('Query executed successfully against users table!');
    } else if (lowerCaseInput.includes('select * from products')) {
      setQueryResult(sampleProductsData);
      toast.success('Query executed successfully against products table!');
    } else if (lowerCaseInput.startsWith('select')) {
      setQueryResult("Query executed. No matching sample data found for this SELECT statement. Try 'SELECT * FROM users;' or 'SELECT * FROM products;'.");
      toast.success('Query executed, but no specific sample data matched.');
    } else if (lowerCaseInput.startsWith('insert') || lowerCaseInput.startsWith('update') || lowerCaseInput.startsWith('delete')) {
      setQueryResult("Operation simulated. Data modification queries are not supported in this playground.");
      toast.success('Operation simulated.');
    } else if (lowerCaseInput.startsWith('create table')) {
      setQueryResult("Table creation simulated. Schema changes are not persisted in this playground.");
      toast.success('Table creation simulated.');
    }
    else if (lowerCaseInput === '') {
      setError('Please enter a SQL query.');
      toast.error('Please enter a SQL query.');
    }
    else {
      setError('Unsupported query or syntax. This playground supports basic SELECT * FROM users/products.');
      toast.error('Unsupported query or syntax.');
    }
  };

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Experiment with SQL queries against a sample in-memory database."
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Input and Controls */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="sql-input" className="text-sm font-medium text-slate-300">
              SQL Query
            </label>
            <textarea
              id="sql-input"
              className="w-full h-48 bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-50 placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 resize-y font-mono"
              placeholder="e.g., SELECT * FROM users;"
              value={sqlInput}
              onChange={(e) => setSqlInput(e.target.value)}
              spellCheck="false"
            ></textarea>
          </div>

          <button
            onClick={handleRunQuery}
            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Run Query
          </button>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Output and Schema */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Schema Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-slate-300">Sample Schema</h3>
            <pre className="w-full h-48 bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 overflow-auto font-mono">
              {sampleSchema.trim()}
            </pre>
          </div>

          {/* Query Results */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-slate-300">Query Results</h3>
            <div className="w-full min-h-[12rem] bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-50 overflow-auto">
              {queryResult === null && (
                <p className="text-slate-400">Run a query to see results here.</p>
              )}
              {typeof queryResult === 'string' && (
                <p className="text-slate-300 whitespace-pre-wrap">{queryResult}</p>
              )}
              {typeof queryResult === 'object' && queryResult !== null && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-auto">
                    <thead>
                      <tr className="bg-slate-700">
                        {queryResult.headers.map((header, index) => (
                          <th key={index} className="px-4 py-2 font-semibold text-slate-200 border-b border-slate-600">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-700/50 transition-colors duration-150">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-2 text-slate-300 border-b border-slate-700">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}