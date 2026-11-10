"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const SQLPlaygroundPage: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { addToHistory } = useToolStore();

  const handleRunQuery = useCallback(() => {
    if (!sqlQuery.trim()) {
      toast.error('Please enter an SQL query.');
      return;
    }

    setIsLoading(true);
    setQueryResult('Executing query...');

    // Simulate an asynchronous SQL query execution
    setTimeout(() => {
      let result = '';
      const lowerCaseQuery = sqlQuery.trim().toLowerCase();

      if (lowerCaseQuery.startsWith('select')) {
        // Mock data for SELECT queries
        if (lowerCaseQuery.includes('users')) {
          result = `[
  { "id": 1, "name": "Alice", "email": "alice@example.com" },
  { "id": 2, "name": "Bob", "email": "bob@example.com" },
  { "id": 3, "name": "Charlie", "email": "charlie@example.com" }
]`;
        } else if (lowerCaseQuery.includes('products')) {
          result = `[
  { "id": 101, "name": "Laptop", "price": 1200 },
  { "id": 102, "name": "Mouse", "price": 25 },
  { "id": 103, "name": "Keyboard", "price": 75 }
]`;
        } else {
          result = `[
  { "column1": "value1", "column2": "value2" },
  { "column1": "value3", "column2": "value4" }
]`;
        }
        toast.success('SELECT query executed successfully!');
      } else if (lowerCaseQuery.startsWith('insert') || lowerCaseQuery.startsWith('update') || lowerCaseQuery.startsWith('delete')) {
        // Mock affected rows for DML queries
        const affectedRows = Math.floor(Math.random() * 5) + 1; // 1 to 5 rows affected
        result = `${affectedRows} row(s) affected.`;
        toast.success('DML query executed successfully!');
      } else if (lowerCaseQuery.startsWith('create') || lowerCaseQuery.startsWith('alter') || lowerCaseQuery.startsWith('drop')) {
        // Mock success for DDL queries
        result = 'DDL command executed successfully.';
        toast.success('DDL command executed successfully!');
      } else {
        result = 'Query executed successfully. (No specific output for this type of query)';
        toast.success('Query executed successfully!');
      }

      setQueryResult(result);
      setIsLoading(false);
      addToHistory('sql-playground');
    }, 1000); // Simulate 1 second delay
  }, [sqlQuery, addToHistory]);

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute and test SQL queries in a client-side environment with mock results."
    >
      <div className="flex flex-col gap-6">
        {/* SQL Query Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="sql-input" className="text-sm font-medium text-slate-300">
            SQL Query
          </label>
          <textarea
            id="sql-input"
            className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-sm resize-y placeholder-slate-500"
            placeholder={`-- Example SELECT query\nSELECT id, name, email FROM users WHERE id < 3;\n\n-- Example INSERT query\nINSERT INTO products (name, price) VALUES ('New Item', 99.99);\n\n-- Example DDL query\nCREATE TABLE orders (order_id INT PRIMARY KEY, customer_id INT);`}
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            spellCheck="false"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleRunQuery}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start"
          disabled={isLoading}
        >
          {isLoading ? 'Running Query...' : 'Run Query'}
        </button>

        {/* Query Results Output */}
        <div className="flex flex-col gap-2">
          <label htmlFor="sql-output" className="text-sm font-medium text-slate-300">
            Query Results
          </label>
          <textarea
            id="sql-output"
            className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm resize-y read-only:bg-slate-800 read-only:cursor-default placeholder-slate-500"
            placeholder="Query results will appear here..."
            value={queryResult}
            readOnly
            spellCheck="false"
          />
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;