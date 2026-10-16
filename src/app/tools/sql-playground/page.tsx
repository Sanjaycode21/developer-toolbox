"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Table, Columns, Database, Code, Play } from 'lucide-react';

// --- Dummy Database and Schema ---
// Define interfaces for clarity, though 'any' is used in the generic database object
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

const database: Record<string, any[]> = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
    { id: 4, name: 'David', email: 'david@example.com', age: 28 },
    { id: 5, name: 'Eve', email: 'eve@example.com', age: 29 },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200, category: 'Electronics' },
    { id: 102, name: 'Mouse', price: 25, category: 'Electronics' },
    { id: 103, name: 'Keyboard', price: 75, category: 'Electronics' },
    { id: 104, name: 'Monitor', price: 300, category: 'Electronics' },
    { id: 105, name: 'Desk', price: 400, category: 'Furniture' },
    { id: 106, name: 'Chair', price: 250, category: 'Furniture' },
  ],
};

const schema: Record<string, string[]> = {
  users: ['id', 'name', 'email', 'age'],
  products: ['id', 'name', 'price', 'category'],
};

// --- SQL Executor (Simplified for UI demonstration) ---
interface QueryResult {
  data: Record<string, any>[];
  columns: string[];
  message: string;
}

const executeSql = (query: string): QueryResult => {
  const normalizedQuery = query.trim().toLowerCase();
  let data: Record<string, any>[] = [];
  let columns: string[] = [];
  let message: string = '';

  try {
    // Basic SELECT * FROM table
    const selectAllMatch = normalizedQuery.match(/^select\s+\*\s+from\s+(\w+)\s*;?$/);
    if (selectAllMatch) {
      const tableName = selectAllMatch[1];
      if (database[tableName]) {
        data = database[tableName];
        columns = schema[tableName] || Object.keys(data[0] || {});
        message = `Query successful. ${data.length} rows returned from '${tableName}'.`;
      } else {
        throw new Error(`Table '${tableName}' not found.`);
      }
    }
    // Basic SELECT columns FROM table with optional WHERE
    else if (normalizedQuery.startsWith('select')) {
      const selectMatch = normalizedQuery.match(/^select\s+([\w,\s]+)\s+from\s+(\w+)\s*(?:where\s+(.*))?;?$/);
      if (selectMatch) {
        const selectedColumnsStr = selectMatch[1];
        const tableName = selectMatch[2];
        const whereClauseStr = selectMatch[3];

        if (!database[tableName]) {
          throw new Error(`Table '${tableName}' not found.`);
        }

        let tableData = database[tableName];
        let filteredData = tableData;

        // Basic WHERE clause parsing (very limited: single condition, simple operators)
        if (whereClauseStr) {
          const whereMatch = whereClauseStr.match(/(\w+)\s*([=<>!]+)\s*('?[\w\s.-]+'?)?/);
          if (whereMatch) {
            const col = whereMatch[1];
            const op = whereMatch[2];
            let val: any = whereMatch[3];

            if (val && (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1); // Remove quotes for string comparison
            } else if (!isNaN(Number(val))) {
              val = Number(val); // Convert to number if it looks like one
            }

            filteredData = tableData.filter(row => {
              const rowValue = row[col];
              switch (op) {
                case '=': return rowValue == val;
                case '!=': return rowValue != val;
                case '>': return rowValue > val;
                case '<': return rowValue < val;
                case '>=': return rowValue >= val;
                case '<=': return rowValue <= val;
                default: return false;
              }
            });
          } else {
            throw new Error(`Unsupported WHERE clause: '${whereClauseStr}'`);
          }
        }

        const requestedColumns = selectedColumnsStr.split(',').map(c => c.trim());
        const availableColumns = schema[tableName] || Object.keys(tableData[0] || {});

        const invalidColumns = requestedColumns.filter(col => !availableColumns.includes(col));
        if (invalidColumns.length > 0) {
          throw new Error(`Column(s) not found: ${invalidColumns.join(', ')} in table '${tableName}'.`);
        }

        data = filteredData.map(row => {
          const newRow: Record<string, any> = {};
          requestedColumns.forEach(col => {
            newRow[col] = row[col];
          });
          return newRow;
        });
        columns = requestedColumns;
        message = `Query successful. ${data.length} rows returned from '${tableName}'.`;

      } else {
        throw new Error('Invalid SELECT query syntax.');
      }
    }
    else {
      throw new Error('Unsupported SQL query. Only basic SELECT statements are supported (e.g., SELECT * FROM table; SELECT col1, col2 FROM table WHERE col = "value";).');
    }

  } catch (e: any) {
    return { data: [], columns: [], message: `Error: ${e.message}` };
  }

  return { data, columns, message };
};

const SQLPlaygroundPage: React.FC = () => {
  const [query, setQuery] = useState<string>(`SELECT id, name, age FROM users WHERE age > 25;`);
  const [results, setResults] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { addToHistory } = useToolStore();
  const toolSlug = "sql-playground";

  const handleRunQuery = useCallback(() => {
    setError(null);
    setMessage('');
    setResults([]);
    setColumns([]);

    addToHistory(toolSlug);

    const { data, columns: resColumns, message: resMessage } = executeSql(query);

    if (resMessage.startsWith('Error:')) {
      setError(resMessage.replace('Error: ', ''));
      toast.error(resMessage.replace('Error: ', ''));
    } else {
      setResults(data);
      setColumns(resColumns);
      setMessage(resMessage);
      toast.success('Query executed successfully!');
    }
  }, [query, addToHistory, toolSlug]);

  useEffect(() => {
    handleRunQuery(); // Run initial query on mount
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Experiment with SQL queries against a dummy in-memory database. Supports basic SELECT statements."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Schema Viewer */}
        <div className="w-full lg:w-1/4 p-4 bg-slate-800 border border-slate-700 rounded-lg shadow-inner flex flex-col">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" /> Database Schema
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {Object.entries(schema).map(([tableName, cols]) => (
              <div key={tableName} className="mb-4">
                <h4 className="font-medium text-slate-300 flex items-center gap-1">
                  <Table className="w-4 h-4 text-slate-400" /> {tableName}
                </h4>
                <ul className="ml-6 mt-1 text-sm text-slate-400">
                  {cols.map(col => (
                    <li key={`${tableName}-${col}`} className="flex items-center gap-1">
                      <Columns className="w-3 h-3 text-slate-500" /> {col}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Query Editor and Results */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Query Editor */}
          <div className="flex-1 flex flex-col bg-slate-800 border border-slate-700 rounded-lg shadow-inner p-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-400" /> SQL Query
            </h3>
            <textarea
              className="flex-1 w-full p-3 bg-slate-900 border border-slate-700 rounded-md text-slate-200 font-mono text-sm resize-none focus:outline-none focus:border-indigo-500 custom-scrollbar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              rows={10}
              spellCheck="false"
            />
            <button
              onClick={handleRunQuery}
              className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-2 self-end"
            >
              <Play className="w-5 h-5" /> Run Query
            </button>
          </div>

          {/* Results Display */}
          <div className="flex-1 flex flex-col bg-slate-800 border border-slate-700 rounded-lg shadow-inner p-4 min-h-[200px]">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Table className="w-5 h-5 text-indigo-400" /> Results
            </h3>
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md text-sm mb-4">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
              </div>
            )}
            {message && !error && (
              <div className="bg-emerald-900/30 border border-emerald-700 text-emerald-300 p-3 rounded-md text-sm mb-4">
                <p>{message}</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="flex-1 overflow-auto custom-scrollbar border border-slate-700 rounded-md">
                <table className="w-full text-sm text-left text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-700 sticky top-0">
                    <tr>
                      {columns.map((col) => (
                        <th key={col} scope="col" className="px-4 py-2 font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, rowIndex) => (
                      <tr key={rowIndex} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700 transition-colors">
                        {columns.map((col) => (
                          <td key={`${rowIndex}-${col}`} className="px-4 py-2">
                            {String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {results.length === 0 && !error && !message && (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                No results to display. Run a query!
              </div>
            )}
            {results.length === 0 && !error && message && (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;