"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const toolSlug = "sql-playground";
const toolName = "SQL Playground";
const description = "Execute and test SQL queries against a simulated database environment.";

const mockDatabases = [
  { id: 'sqlite', name: 'SQLite (Browser)' },
  { id: 'postgresql', name: 'PostgreSQL (Mock)' },
  { id: 'mysql', name: 'MySQL (Mock)' },
];

const mockData = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200, stock: 50 },
    { id: 102, name: 'Mouse', price: 25, stock: 200 },
    { id: 103, name: 'Keyboard', price: 75, stock: 150 },
  ],
};

export default function SqlPlaygroundPage() {
  const [sqlQuery, setSqlQuery] = useState<string>(`-- Example: Select all users
SELECT * FROM users;

-- Example: Select products with price > 50
-- SELECT name, price FROM products WHERE price > 50;

-- Example: Insert a new user (mocked)
-- INSERT INTO users (id, name, email, age) VALUES (4, 'David', 'david@example.com', 28);

-- Example: Update a user's age (mocked)
-- UPDATE users SET age = 31 WHERE name = 'Alice';

-- Example: Delete a product (mocked)
-- DELETE FROM products WHERE id = 102;
`);
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<string>(mockDatabases[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { addToHistory } = useToolStore();

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory]);

  const handleExecuteQuery = useCallback(async () => {
    setIsLoading(true);
    setQueryResult(null);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const queryLower = sqlQuery.toLowerCase().trim();

      if (queryLower.startsWith('select')) {
        if (queryLower.includes('from users')) {
          // Simulate SELECT * FROM users;
          const result = mockData.users.map(({ id, name, email, age }) => ({ id, name, email, age }));
          setQueryResult(JSON.stringify(result, null, 2));
          toast.success('Query executed successfully!');
        } else if (queryLower.includes('from products')) {
          // Simulate SELECT * FROM products; or specific columns
          const result = mockData.products.map(({ id, name, price, stock }) => ({ id, name, price, stock }));
          setQueryResult(JSON.stringify(result, null, 2));
          toast.success('Query executed successfully!');
        } else {
          setQueryResult(`Error: Mock database does not support this SELECT query for '${selectedDatabase}'. Try 'SELECT * FROM users;' or 'SELECT * FROM products;'.`);
          toast.error('Query failed: Unsupported SELECT statement.');
        }
      } else if (queryLower.startsWith('insert into')) {
        setQueryResult(`Success: Row inserted into '${selectedDatabase}' (mocked). Affected rows: 1.`);
        toast.success('Insert query mocked successfully!');
      } else if (queryLower.startsWith('update')) {
        setQueryResult(`Success: Row updated in '${selectedDatabase}' (mocked). Affected rows: 1.`);
        toast.success('Update query mocked successfully!');
      } else if (queryLower.startsWith('delete from')) {
        setQueryResult(`Success: Row deleted from '${selectedDatabase}' (mocked). Affected rows: 1.`);
        toast.success('Delete query mocked successfully!');
      } else if (queryLower.startsWith('create table') || queryLower.startsWith('drop table')) {
        setQueryResult(`Success: Table operation executed for '${selectedDatabase}' (mocked).`);
        toast.success('DDL query mocked successfully!');
      } else {
        setQueryResult(`Error: Invalid or unsupported SQL query for '${selectedDatabase}'.`);
        toast.error('Query failed: Invalid or unsupported SQL.');
      }
    } catch (error: any) {
      setQueryResult(`Error: ${error.message || 'An unknown error occurred.'}`);
      toast.error('An error occurred during query execution.');
    } finally {
      setIsLoading(false);
    }
  }, [sqlQuery, selectedDatabase]);

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Query Input Section */}
        <div className="flex-1 flex flex-col bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">SQL Query</h2>
          <div className="flex items-center gap-4 mb-4">
            <label htmlFor="database-select" className="text-slate-400 text-sm">Database:</label>
            <select
              id="database-select"
              className="flex-grow bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-md px-3 py-2 text-sm text-slate-300 transition-colors"
              value={selectedDatabase}
              onChange={(e) => setSelectedDatabase(e.target.value)}
              disabled={isLoading}
            >
              {mockDatabases.map((db) => (
                <option key={db.id} value={db.id}>
                  {db.name}
                </option>
              ))}
            </select>
          </div>
          <textarea
            className="flex-1 w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-md p-4 text-sm font-mono text-slate-300 resize-none transition-colors"
            placeholder="Enter your SQL query here..."
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            rows={10}
            disabled={isLoading}
          />
          <button
            onClick={handleExecuteQuery}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Executing...' : 'Execute Query'}
          </button>
        </div>

        {/* Results Section */}
        <div className="flex-1 flex flex-col bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">Results</h2>
          <div className="flex-1 bg-slate-900 border border-slate-700 rounded-md p-4 overflow-auto text-sm font-mono text-slate-300">
            {queryResult ? (
              <pre className="whitespace-pre-wrap break-words">{queryResult}</pre>
            ) : (
              <p className="text-slate-500">
                {isLoading ? 'Executing query...' : 'Query results will appear here.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}