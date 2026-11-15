"use client";

import { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Database, Play, Loader2, XCircle, CheckCircle } from 'lucide-react';

interface TableSchema {
  name: string;
  columns: { name: string; type: string }[];
  data: Record<string, any>[];
}

const mockDatabase: Record<string, TableSchema> = {
  users: {
    name: 'users',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'name', type: 'TEXT' },
      { name: 'email', type: 'TEXT' },
      { name: 'created_at', type: 'TEXT' },
    ],
    data: [
      { id: 1, name: 'Alice Smith', email: 'alice@example.com', created_at: '2023-01-15' },
      { id: 2, name: 'Bob Johnson', email: 'bob@example.com', created_at: '2023-02-20' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', created_at: '2023-03-10' },
    ],
  },
  products: {
    name: 'products',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'name', type: 'TEXT' },
      { name: 'price', type: 'REAL' },
      { name: 'stock', type: 'INTEGER' },
    ],
    data: [
      { id: 101, name: 'Laptop', price: 1200.00, stock: 50 },
      { id: 102, name: 'Mouse', price: 25.50, stock: 200 },
      { id: 103, name: 'Keyboard', price: 75.00, stock: 100 },
    ],
  },
};

const SQLPlaygroundPage = () => {
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<Record<string, any>[] | string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addToHistory = useToolStore((state) => state.addToHistory);

  useEffect(() => {
    addToHistory('sql-playground');
  }, [addToHistory]);

  const handleRunQuery = useCallback(() => {
    setError(null);
    setQueryResult(null);
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      try {
        const queryLower = sqlQuery.toLowerCase().trim();

        if (!queryLower) {
          throw new Error('Query cannot be empty.');
        }

        // Simple error simulation
        if (queryLower.includes('error') || queryLower.includes('invalid syntax')) {
          throw new Error('Simulated SQL syntax error or execution failure.');
        }
        if (queryLower.includes('non_existent_table')) {
          throw new Error('Table "non_existent_table" does not exist.');
        }

        // Simulate SELECT queries
        if (queryLower.startsWith('select')) {
          const fromMatch = queryLower.match(/from\s+(\w+)/);
          if (!fromMatch || !fromMatch[1]) {
            throw new Error('Missing FROM clause or table name.');
          }
          const tableName = fromMatch[1];
          const table = mockDatabase[tableName];

          if (!table) {
            throw new Error(`Table "${tableName}" not found.`);
          }

          let results = [...table.data]; // Shallow copy for filtering

          // Basic WHERE clause simulation (only for ID for simplicity)
          const whereMatch = queryLower.match(/where\s+(\w+)\s*=\s*(\d+)/);
          if (whereMatch) {
            const column = whereMatch[1];
            const value = parseInt(whereMatch[2], 10);
            results = results.filter(row => row[column] === value);
          }

          // Basic column selection simulation
          const selectColumnsMatch = queryLower.match(/select\s+(.*?)\s+from/);
          if (selectColumnsMatch && selectColumnsMatch[1] !== '*') {
            const selectedColumns = selectColumnsMatch[1].split(',').map(col => col.trim());
            results = results.map(row => {
              const newRow: Record<string, any> = {};
              selectedColumns.forEach(col => {
                if (row.hasOwnProperty(col)) {
                  newRow[col] = row[col];
                }
              });
              return newRow;
            });
          }

          if (results.length === 0) {
            setQueryResult('No rows found.');
          } else {
            setQueryResult(results);
          }
          toast.success('Query executed successfully!');
        }
        // Simulate DML operations
        else if (queryLower.startsWith('insert') || queryLower.startsWith('update') || queryLower.startsWith('delete')) {
          setQueryResult(`Query executed successfully. Affected rows: ${Math.floor(Math.random() * 5) + 1}. (Simulated)`);
          toast.success('DML operation simulated successfully!');
        }
        // Simulate DDL operations
        else if (queryLower.startsWith('create') || queryLower.startsWith('alter') || queryLower.startsWith('drop')) {
          setQueryResult(`DDL operation executed successfully. (Simulated)`);
          toast.success('DDL operation simulated successfully!');
        }
        else {
          throw new Error('Unsupported query type or invalid SQL statement.');
        }

      } catch (e: any) {
        setError(e.message);
        toast.error(`Error: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    }, 1000); // 1 second delay
  }, [sqlQuery]);

  const handleExampleClick = useCallback((exampleQuery: string) => {
    setSqlQuery(exampleQuery);
    setQueryResult(null);
    setError(null);
  }, []);

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute and test SQL queries against a simulated database environment."
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Query Input and Controls */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="sql-input" className="text-sm font-medium text-slate-300">
              SQL Query
            </label>
            <textarea
              id="sql-input"
              className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y"
              placeholder="Enter your SQL query here, e.g., SELECT * FROM users;"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              spellCheck="false"
            />
          </div>

          <button
            onClick={handleRunQuery}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Running Query...
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Run Query
              </>
            )}
          </button>
        </div>

        {/* Schema and Examples */}
        <div className="w-full lg:w-80 flex flex-col gap-4 p-4 bg-slate-800 border border-slate-700 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-400" />
            Simulated Schema
          </h3>
          <div className="flex flex-col gap-3 text-sm">
            {Object.values(mockDatabase).map((table) => (
              <div key={table.name} className="bg-slate-700 p-3 rounded-md border border-slate-600">
                <h4 className="font-semibold text-slate-100 mb-1">{table.name}</h4>
                <ul className="list-disc list-inside text-slate-300">
                  {table.columns.map((col) => (
                    <li key={`${table.name}-${col.name}`} className="text-xs">
                      <span className="font-mono text-indigo-300">{col.name}</span>{' '}
                      <span className="text-slate-400">({col.type})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-slate-200 mt-4">Example Queries</h3>
          <div className="flex flex-col gap-2 text-sm">
            <button
              onClick={() => handleExampleClick('SELECT * FROM users;')}
              className="text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 font-mono text-xs transition-colors border border-slate-600"
            >
              SELECT * FROM users;
            </button>
            <button
              onClick={() => handleExampleClick('SELECT name, email FROM users WHERE id = 1;')}
              className="text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 font-mono text-xs transition-colors border border-slate-600"
            >
              SELECT name, email FROM users WHERE id = 1;
            </button>
            <button
              onClick={() => handleExampleClick('INSERT INTO products (name, price, stock) VALUES (\'New Item\', 99.99, 10);')}
              className="text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 font-mono text-xs transition-colors border border-slate-600"
            >
              INSERT INTO products (...) VALUES (...);
            </button>
            <button
              onClick={() => handleExampleClick('UPDATE products SET price = 1250.00 WHERE id = 101;')}
              className="text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 font-mono text-xs transition-colors border border-slate-600"
            >
              UPDATE products SET price = ... WHERE id = ...;
            </button>
            <button
              onClick={() => handleExampleClick('DELETE FROM products WHERE id = 103;')}
              className="text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 font-mono text-xs transition-colors border border-slate-600"
            >
              DELETE FROM products WHERE id = ...;
            </button>
            <button
              onClick={() => handleExampleClick('SELECT * FROM non_existent_table;')}
              className="text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 font-mono text-xs transition-colors border border-slate-600"
            >
              SELECT * FROM non_existent_table; (Error)
            </button>
          </div>
        </div>
      </div>

      {/* Query Result Display */}
      <div className="mt-6 p-6 bg-slate-800 border border-slate-700 rounded-lg shadow-lg min-h-[200px] flex flex-col">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Query Result</h3>

        {isLoading && (
          <div className="flex items-center justify-center flex-1 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Executing query...
          </div>
        )}

        {!isLoading && error && (
          <div className="flex items-center justify-center flex-1 text-red-400 bg-red-900/20 p-4 rounded-md border border-red-800">
            <XCircle className="h-6 w-6 mr-2" />
            <span className="font-mono text-sm">{error}</span>
          </div>
        )}

        {!isLoading && queryResult && typeof queryResult === 'string' && !error && (
          <div className="flex items-center justify-center flex-1 text-emerald-400 bg-emerald-900/20 p-4 rounded-md border border-emerald-800">
            <CheckCircle className="h-6 w-6 mr-2" />
            <span className="font-mono text-sm">{queryResult}</span>
          </div>
        )}

        {!isLoading && queryResult && Array.isArray(queryResult) && queryResult.length > 0 && !error && (
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700">
                <tr>
                  {Object.keys(queryResult[0]).map((key) => (
                    <th
                      key={key}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {queryResult.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-700 transition-colors">
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-slate-200 font-mono">
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !queryResult && !error && (
          <div className="flex items-center justify-center flex-1 text-slate-500">
            Your query results will appear here.
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;