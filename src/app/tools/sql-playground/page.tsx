"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Terminal } from 'lucide-react';

interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  message?: string;
  error?: string;
}

const SQLPlaygroundPage: React.FC = () => {
  const toolSlug = "sql-playground";
  const { addToHistory } = useToolStore();

  const [sqlQuery, setSqlQuery] = useState<string>(`SELECT id, name, email FROM users WHERE id < 3;`);
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dummyData = useMemo(() => ({
    users: [
      { id: 1, name: 'Alice Smith', email: 'alice@example.com', age: 30, city: 'New York' },
      { id: 2, name: 'Bob Johnson', email: 'bob@example.com', age: 24, city: 'Los Angeles' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 35, city: 'Chicago' },
      { id: 4, name: 'Diana Prince', email: 'diana@example.com', age: 28, city: 'Miami' },
    ],
    products: [
      { product_id: 101, name: 'Laptop', price: 1200, category: 'Electronics' },
      { product_id: 102, name: 'Mouse', price: 25, category: 'Electronics' },
      { product_id: 103, name: 'Keyboard', price: 75, category: 'Electronics' },
    ],
  }), []);

  const simulateQueryExecution = useCallback((query: string): QueryResult => {
    const lowerQuery = query.toLowerCase().trim();

    if (lowerQuery.startsWith('select')) {
      // Simple SELECT simulation
      if (lowerQuery.includes('from users')) {
        let filteredUsers = [...dummyData.users];
        let selectedColumns: string[] = [];

        // Extract columns
        const selectMatch = lowerQuery.match(/select\s+(.*?)\s+from/);
        if (selectMatch && selectMatch[1]) {
          selectedColumns = selectMatch[1].split(',').map(col => col.trim()).filter(Boolean);
          if (selectedColumns.includes('*')) {
            selectedColumns = Object.keys(dummyData.users[0]);
          }
        } else {
          selectedColumns = Object.keys(dummyData.users[0]); // Default to all columns
        }

        // Extract WHERE clause
        const whereMatch = lowerQuery.match(/where\s+(.*)/);
        if (whereMatch && whereMatch[1]) {
          const condition = whereMatch[1];
          // Very basic condition parsing (e.g., id < 3, age > 25)
          try {
            if (condition.includes('id <')) {
              const val = parseInt(condition.split('<')[1].trim());
              filteredUsers = filteredUsers.filter(u => u.id < val);
            } else if (condition.includes('id >')) {
              const val = parseInt(condition.split('>')[1].trim());
              filteredUsers = filteredUsers.filter(u => u.id > val);
            } else if (condition.includes('age <')) {
              const val = parseInt(condition.split('<')[1].trim());
              filteredUsers = filteredUsers.filter(u => u.age < val);
            } else if (condition.includes('age >')) {
              const val = parseInt(condition.split('>')[1].trim());
              filteredUsers = filteredUsers.filter(u => u.age > val);
            } else if (condition.includes('name =')) {
              const val = condition.split('=')[1].trim().replace(/['"]/g, '');
              filteredUsers = filteredUsers.filter(u => u.name.toLowerCase() === val.toLowerCase());
            }
            // Add more conditions as needed for a more robust simulation
          } catch (e) {
            return { columns: [], rows: [], error: `Error parsing WHERE clause: ${e}` };
          }
        }

        const rows = filteredUsers.map(user => {
          const row: Record<string, any> = {};
          selectedColumns.forEach(col => {
            if (user.hasOwnProperty(col)) {
              row[col] = user[col as keyof typeof user];
            }
          });
          return row;
        });

        return {
          columns: selectedColumns,
          rows: rows,
          message: `Query executed successfully. ${rows.length} row(s) returned.`,
        };
      } else if (lowerQuery.includes('from products')) {
        // Similar logic for products table
        let filteredProducts = [...dummyData.products];
        let selectedColumns: string[] = [];

        const selectMatch = lowerQuery.match(/select\s+(.*?)\s+from/);
        if (selectMatch && selectMatch[1]) {
          selectedColumns = selectMatch[1].split(',').map(col => col.trim()).filter(Boolean);
          if (selectedColumns.includes('*')) {
            selectedColumns = Object.keys(dummyData.products[0]);
          }
        } else {
          selectedColumns = Object.keys(dummyData.products[0]);
        }

        const rows = filteredProducts.map(product => {
          const row: Record<string, any> = {};
          selectedColumns.forEach(col => {
            if (product.hasOwnProperty(col)) {
              row[col] = product[col as keyof typeof product];
            }
          });
          return row;
        });

        return {
          columns: selectedColumns,
          rows: rows,
          message: `Query executed successfully. ${rows.length} row(s) returned.`,
        };
      }
    } else if (lowerQuery.startsWith('insert') || lowerQuery.startsWith('update') || lowerQuery.startsWith('delete')) {
      return {
        columns: [],
        rows: [],
        message: `Simulated DML statement: "${query}". No actual changes made.`,
      };
    } else if (lowerQuery.startsWith('create') || lowerQuery.startsWith('alter') || lowerQuery.startsWith('drop')) {
      return {
        columns: [],
        rows: [],
        message: `Simulated DDL statement: "${query}". No actual changes made.`,
      };
    }

    return {
      columns: [],
      rows: [],
      error: `Unsupported query type or table. Try SELECT from 'users' or 'products'.`,
    };
  }, [dummyData]);

  const handleRunQuery = useCallback(() => {
    addToHistory(toolSlug);
    setIsLoading(true);
    setQueryResults(null); // Clear previous results

    // Simulate network delay
    setTimeout(() => {
      const result = simulateQueryExecution(sqlQuery);
      setQueryResults(result);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "Query executed successfully.");
      }
      setIsLoading(false);
    }, 700);
  }, [sqlQuery, simulateQueryExecution, addToHistory, toolSlug]);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Execute and test SQL queries against a simulated database. (UI-only, no actual database connection)"
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* SQL Input Panel */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-2">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="flex-1 w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-md p-3 text-slate-200 placeholder-slate-400 focus:outline-none transition-colors font-mono text-sm resize-y min-h-[150px] lg:min-h-[250px]"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            rows={10}
          />
          <button
            onClick={handleRunQuery}
            disabled={isLoading}
            className="mt-4 w-full lg:w-auto self-end bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Executing...
              </>
            ) : (
              <>
                <Terminal size={18} /> Run Query
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="flex-1 flex flex-col">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Results
          </label>
          <div className="flex-1 bg-slate-800 border border-slate-700 rounded-md p-4 text-slate-200 font-mono text-sm overflow-auto min-h-[200px] lg:min-h-[300px]">
            {queryResults ? (
              queryResults.error ? (
                <div className="text-red-400">
                  <p className="font-bold">Error:</p>
                  <pre className="whitespace-pre-wrap">{queryResults.error}</pre>
                </div>
              ) : (
                <>
                  {queryResults.message && <p className="text-emerald-400 mb-2">{queryResults.message}</p>}
                  {queryResults.rows.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr>
                            {queryResults.columns.map((col, index) => (
                              <th key={index} className="pb-2 pr-4 border-b border-slate-600 text-slate-300 font-semibold">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResults.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-slate-700/50 transition-colors">
                              {queryResults.columns.map((col, colIndex) => (
                                <td key={colIndex} className="py-2 pr-4 border-b border-slate-700">
                                  {String(row[col] ?? 'NULL')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-slate-400">No rows returned.</p>
                  )}
                </>
              )
            ) : (
              <p className="text-slate-400">Run a query to see results here.</p>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;