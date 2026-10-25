"use client";

import { useState, useEffect } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Terminal } from 'lucide-react'; // Using Terminal icon for SQL

// Mock database for client-side simulation
const mockDatabase = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200 },
    { id: 102, name: 'Mouse', price: 25 },
    { id: 103, name: 'Keyboard', price: 75 },
  ],
};

type MockQueryResult = {
  columns: string[];
  rows: (string | number)[][];
  message?: string;
  error?: string;
};

/**
 * Simulates SQL query execution against a mock in-memory database.
 * This is a simplified client-side simulation and does not parse full SQL.
 */
const simulateSqlQuery = (query: string): Promise<MockQueryResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerQuery = query.toLowerCase().trim();

      if (lowerQuery.startsWith('select')) {
        if (lowerQuery.includes('from users')) {
          const columns = ['id', 'name', 'email', 'age'];
          const rows = mockDatabase.users.map(user => [user.id, user.name, user.email, user.age]);
          resolve({ columns, rows });
        } else if (lowerQuery.includes('from products')) {
          const columns = ['id', 'name', 'price'];
          const rows = mockDatabase.products.map(product => [product.id, product.name, product.price]);
          resolve({ columns, rows });
        } else {
          resolve({ error: 'Unsupported SELECT query or table. Try "SELECT * FROM users;" or "SELECT * FROM products;"', columns: [], rows: [] });
        }
      } else if (lowerQuery.startsWith('insert') || lowerQuery.startsWith('update') || lowerQuery.startsWith('delete')) {
        resolve({ message: `Simulated DML query executed successfully: ${query.substring(0, 50)}${query.length > 50 ? '...' : ''}`, columns: [], rows: [] });
      } else if (lowerQuery.startsWith('create') || lowerQuery.startsWith('drop') || lowerQuery.startsWith('alter')) {
        resolve({ message: `Simulated DDL query executed successfully: ${query.substring(0, 50)}${query.length > 50 ? '...' : ''}`, columns: [], rows: [] });
      } else {
        resolve({ error: 'Unsupported SQL command. Only basic SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER are simulated.', columns: [], rows: [] });
      }
    }, 800); // Simulate network/processing delay
  });
};

export default function SQLPlaygroundPage() {
  const [query, setQuery] = useState<string>('SELECT * FROM users;');
  const [results, setResults] = useState<MockQueryResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { addToHistory } = useToolStore();

  const toolSlug = "sql-playground";

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      toast.error("Please enter an SQL query.");
      return;
    }

    setIsLoading(true);
    setResults(null); // Clear previous results
    try {
      const result = await simulateSqlQuery(query);
      setResults(result);
      if (result.error) {
        toast.error(result.error);
      } else if (result.message) {
        toast.success(result.message);
      } else if (result.rows.length > 0) {
        toast.success("Query executed successfully!");
      } else {
        toast.success("Query executed, no data returned.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setResults({ error: errorMessage, columns: [], rows: [] });
      toast.error(`Error executing query: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Execute and test SQL queries against a mock client-side database."
    >
      <div className="flex flex-col gap-6">
        {/* Query Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="sql-query" className="text-sm font-medium text-slate-300">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="w-full min-h-[150px] bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-50 font-mono text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-y"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            spellCheck="false"
          />
          <button
            onClick={handleExecuteQuery}
            disabled={isLoading}
            className="mt-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Executing...
              </>
            ) : (
              <>
                <Terminal className="w-5 h-5" />
                Execute Query
              </>
            )}
          </button>
        </div>

        {/* Results Display */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-200">Results</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 min-h-[200px] overflow-auto relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/70 backdrop-blur-sm z-10">
                <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            {results ? (
              results.error ? (
                <div className="text-red-400 font-mono text-sm">
                  <p className="font-bold">Error:</p>
                  <pre className="whitespace-pre-wrap">{results.error}</pre>
                </div>
              ) : results.message ? (
                <div className="text-emerald-400 font-mono text-sm">
                  <p className="font-bold">Message:</p>
                  <pre className="whitespace-pre-wrap">{results.message}</pre>
                </div>
              ) : results.rows.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-700">
                      <tr>
                        {results.columns.map((col, index) => (
                          <th key={index} scope="col" className="px-6 py-3">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700 transition-colors">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-6 py-4">
                              {String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">Query executed successfully, but no data was returned.</p>
              )
            ) : (
              <p className="text-slate-400 text-sm">Execute a query to see results here.</p>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}