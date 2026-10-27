'use client';

import { useState, useCallback, useMemo } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

// Define a simple in-memory database for simulation
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Order {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  orderDate: string;
}

const database: {
  users: User[];
  products: Product[];
  orders: Order[];
} = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
    { id: 4, name: 'David', email: 'david@example.com', age: 29 },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200, category: 'Electronics' },
    { id: 102, name: 'Mouse', price: 25, category: 'Electronics' },
    { id: 103, name: 'Keyboard', price: 75, category: 'Electronics' },
    { id: 104, name: 'Monitor', price: 300, category: 'Electronics' },
    { id: 105, name: 'Desk Chair', price: 150, category: 'Furniture' },
  ],
  orders: [
    { id: 1001, userId: 1, productId: 101, quantity: 1, orderDate: '2023-01-15' },
    { id: 1002, userId: 2, productId: 102, quantity: 2, orderDate: '2023-01-16' },
    { id: 1003, userId: 1, productId: 103, quantity: 1, orderDate: '2023-01-17' },
    { id: 1004, userId: 3, productId: 105, quantity: 1, orderDate: '2023-01-18' },
    { id: 1005, userId: 4, productId: 104, quantity: 1, orderDate: '2023-01-19' },
  ],
};

// Simple SQL executor (client-side simulation)
function executeSql(query: string): { data?: Record<string, any>[]; error?: string } {
  const lowerQuery = query.toLowerCase().trim();

  // Basic SELECT * FROM <table>
  const selectAllRegex = /^select\s+\*\s+from\s+(\w+)\s*;?$/;
  const match = lowerQuery.match(selectAllRegex);

  if (match) {
    const tableName = match[1];
    const tableData = database[tableName as keyof typeof database];

    if (tableData) {
      return { data: tableData };
    } else {
      return { error: `Error: Table '${tableName}' not found.` };
    }
  }

  // For now, only SELECT * FROM is supported.
  return { error: 'Error: Only "SELECT * FROM <table>" queries are supported for now.' };
}

const SQLPlaygroundPage = () => {
  const [query, setQuery] = useState('SELECT * FROM users;');
  const [results, setResults] = useState<Record<string, any>[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { addToHistory } = useToolStore();
  const toolSlug = "sql-playground";

  const handleRunQuery = useCallback(async () => {
    setError(null);
    setResults(null);
    setIsLoading(true);
    addToHistory(toolSlug);

    try {
      // Simulate network delay for a more realistic feel
      await new Promise(resolve => setTimeout(resolve, 500));

      const { data, error: execError } = executeSql(query);

      if (execError) {
        setError(execError);
        toast.error(execError);
      } else if (data) {
        setResults(data);
        toast.success('Query executed successfully!');
      } else {
        setError('An unexpected error occurred.');
        toast.error('An unexpected error occurred.');
      }
    } catch (e: any) {
      setError(`Execution failed: ${e.message}`);
      toast.error(`Execution failed: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [query, addToHistory, toolSlug]);

  const resultKeys = useMemo(() => {
    if (results && results.length > 0) {
      return Object.keys(results[0]);
    }
    return [];
  }, [results]);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Execute and test SQL queries against a simulated in-memory database."
    >
      <div className="flex flex-col gap-6">
        {/* Query Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="sql-query" className="text-sm font-medium text-slate-300">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="w-full min-h-[150px] bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-50 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-y"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            spellCheck="false"
          />
          <button
            onClick={handleRunQuery}
            disabled={isLoading}
            className="mt-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start"
          >
            {isLoading ? 'Running...' : 'Run Query'}
          </button>
        </div>

        {/* Results Display */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-200">Results</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 min-h-[200px] overflow-auto">
            {isLoading && (
              <div className="flex items-center justify-center h-full text-slate-400">
                <svg className="animate-spin h-5 w-5 mr-3 text-indigo-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Executing query...
              </div>
            )}

            {!isLoading && error && (
              <div className="text-red-400 font-mono text-sm">
                <pre className="whitespace-pre-wrap">{error}</pre>
              </div>
            )}

            {!isLoading && results && results.length === 0 && !error && (
              <div className="text-slate-400 text-sm">No results found.</div>
            )}

            {!isLoading && results && results.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left table-auto border-collapse">
                  <thead>
                    <tr className="bg-slate-700">
                      {resultKeys.map((key) => (
                        <th key={key} className="px-4 py-2 border border-slate-600 text-slate-200 text-sm font-semibold">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, rowIndex) => (
                      <tr key={rowIndex} className="even:bg-slate-800 odd:bg-slate-850 hover:bg-slate-700 transition-colors">
                        {resultKeys.map((key) => (
                          <td key={`${rowIndex}-${key}`} className="px-4 py-2 border border-slate-700 text-slate-300 text-sm">
                            {String(row[key])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && !results && !error && (
              <div className="text-slate-400 text-sm">Enter a query and click "Run Query" to see results.</div>
            )}
          </div>
        </div>

        {/* Available Tables Info */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-200">Available Tables</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-300 text-sm font-mono">
            <p><strong>users</strong> (id, name, email, age)</p>
            <p><strong>products</strong> (id, name, price, category)</p>
            <p><strong>orders</strong> (id, userId, productId, quantity, orderDate)</p>
            <p className="mt-4 text-slate-400">
              <em>Note: This is a client-side simulation. Only "SELECT * FROM &lt;table_name&gt;" queries are supported for now.</em>
            </p>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;