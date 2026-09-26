'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Terminal, Database, Table } from 'lucide-react';

// --- Mock Database Setup ---
interface ColumnSchema {
  name: string;
  type: string;
}

interface TableData {
  [key: string]: any;
}

interface MockTable {
  schema: ColumnSchema[];
  data: TableData[];
}

interface MockDatabase {
  [tableName: string]: MockTable;
}

const mockDatabase: MockDatabase = {
  users: {
    schema: [
      { name: 'id', type: 'INTEGER' },
      { name: 'name', type: 'TEXT' },
      { name: 'email', type: 'TEXT' },
      { name: 'age', type: 'INTEGER' },
    ],
    data: [
      { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
      { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
      { id: 4, name: 'David', email: 'david@example.com', age: 29 },
    ],
  },
  products: {
    schema: [
      { name: 'id', type: 'INTEGER' },
      { name: 'name', type: 'TEXT' },
      { name: 'price', type: 'REAL' },
      { name: 'category', type: 'TEXT' },
    ],
    data: [
      { id: 101, name: 'Laptop', price: 1200, category: 'Electronics' },
      { id: 102, name: 'Mouse', price: 25, category: 'Electronics' },
      { id: 103, name: 'Keyboard', price: 75, category: 'Electronics' },
      { id: 104, name: 'Monitor', price: 300, category: 'Electronics' },
      { id: 105, name: 'Desk Chair', price: 150, category: 'Furniture' },
    ],
  },
};

// --- Component Implementation ---
const SQLPlaygroundPage: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM users;');
  const [queryResult, setQueryResult] = useState<TableData[] | string | null>(null);
  const [resultHeaders, setResultHeaders] = useState<string[]>([]);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const { addToHistory } = useToolStore();

  useEffect(() => {
    addToHistory('sql-playground');
  }, [addToHistory]);

  const executeQuery = useCallback(() => {
    setQueryResult(null);
    setResultHeaders([]);
    setExecutionTime(null);

    const startTime = performance.now();
    const query = sqlQuery.trim().toLowerCase();

    if (!query) {
      setQueryResult('Please enter a SQL query.');
      toast.error('Query cannot be empty.');
      return;
    }

    try {
      // Very basic SQL parsing for SELECT statements
      const selectMatch = query.match(/^select\s+(.+?)\s+from\s+([a-z_]+)\s*;?$/);

      if (selectMatch) {
        const columnsStr = selectMatch[1].trim();
        const tableName = selectMatch[2].trim();

        const table = mockDatabase[tableName];
        if (!table) {
          setQueryResult(`Error: Table '${tableName}' not found.`);
          toast.error(`Table '${tableName}' not found.`);
          return;
        }

        let selectedColumns: string[] = [];
        if (columnsStr === '*') {
          selectedColumns = table.schema.map(col => col.name);
        } else {
          selectedColumns = columnsStr.split(',').map(col => col.trim());
          // Validate selected columns
          const invalidColumns = selectedColumns.filter(col => !table.schema.some(sCol => sCol.name === col));
          if (invalidColumns.length > 0) {
            setQueryResult(`Error: Column(s) '${invalidColumns.join(', ')}' not found in table '${tableName}'.`);
            toast.error(`Column(s) '${invalidColumns.join(', ')}' not found.`);
            return;
          }
        }

        const results = table.data.map(row => {
          const newRow: TableData = {};
          selectedColumns.forEach(col => {
            newRow[col] = row[col];
          });
          return newRow;
        });

        setResultHeaders(selectedColumns);
        setQueryResult(results);
        toast.success('Query executed successfully!');
      } else {
        setQueryResult('Error: Only basic SELECT * FROM <table> or SELECT col1, col2 FROM <table> queries are supported.');
        toast.error('Unsupported query type.');
      }
    } catch (error: any) {
      setQueryResult(`Error: ${error.message || 'An unknown error occurred.'}`);
      toast.error('An error occurred during query execution.');
    } finally {
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
    }
  }, [sqlQuery]);

  const clearQuery = useCallback(() => {
    setSqlQuery('');
    setQueryResult(null);
    setResultHeaders([]);
    setExecutionTime(null);
    toast('Query cleared.', { icon: '🧹' });
  }, []);

  const handleExampleQuery = useCallback((query: string) => {
    setSqlQuery(query);
    toast('Example query loaded.', { icon: '💡' });
  }, []);

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute and test SQL queries against a mock in-memory database."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left Panel: Schema & Query Editor */}
        <div className="flex flex-col w-full lg:w-2/3 gap-6">
          {/* Schema Viewer */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex-none">
            <h2 className="text-xl font-semibold mb-4 text-slate-200 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" /> Database Schema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(mockDatabase).map(([tableName, table]) => (
                <div key={tableName} className="bg-slate-700 p-4 rounded-md border border-slate-600">
                  <h3 className="font-medium text-lg text-slate-100 mb-2 flex items-center gap-2">
                    <Table className="w-4 h-4 text-emerald-400" /> {tableName}
                  </h3>
                  <ul className="text-sm text-slate-300 space-y-1">
                    {table.schema.map((col, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span className="font-mono text-slate-400">{col.name}</span>
                        <span className="text-slate-500">{col.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => handleExampleQuery('SELECT * FROM users;')}
                className="px-3 py-1 text-xs rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors border border-slate-600"
              >
                Example: SELECT * FROM users
              </button>
              <button
                onClick={() => handleExampleQuery('SELECT name, email FROM users;')}
                className="px-3 py-1 text-xs rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors border border-slate-600"
              >
                Example: SELECT name, email FROM users
              </button>
              <button
                onClick={() => handleExampleQuery('SELECT name, price FROM products;')}
                className="px-3 py-1 text-xs rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors border border-slate-600"
              >
                Example: SELECT name, price FROM products
              </button>
            </div>
          </div>

          {/* Query Editor */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex-1 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-slate-200 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" /> SQL Query Editor
            </h2>
            <textarea
              className="w-full flex-1 bg-slate-900 border border-slate-700 rounded-md p-4 text-slate-200 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-y min-h-[150px]"
              placeholder="Enter your SQL query here..."
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              spellCheck="false"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={executeQuery}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors shadow-md"
              >
                Execute Query
              </button>
              <button
                onClick={clearQuery}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md font-medium transition-colors shadow-md"
              >
                Clear Query
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Results */}
        <div className="flex flex-col w-full lg:w-1/3 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex-1 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-slate-200 flex items-center gap-2">
              <Table className="w-5 h-5 text-indigo-400" /> Query Results
            </h2>
            {executionTime !== null && (
              <p className="text-sm text-slate-400 mb-3">
                Executed in {executionTime.toFixed(2)} ms
              </p>
            )}
            <div className="flex-1 overflow-auto border border-slate-700 rounded-md bg-slate-900">
              {queryResult === null ? (
                <div className="p-4 text-slate-400 text-sm">
                  No results yet. Execute a query to see results.
                </div>
              ) : typeof queryResult === 'string' ? (
                <pre className="p-4 text-red-400 text-sm whitespace-pre-wrap font-mono">
                  {queryResult}
                </pre>
              ) : (
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-700 sticky top-0">
                    <tr>
                      {resultHeaders.map((header, index) => (
                        <th key={index} className="px-4 py-2 font-medium text-slate-100 border-b border-slate-600">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.length === 0 ? (
                      <tr>
                        <td colSpan={resultHeaders.length} className="px-4 py-3 text-slate-400 text-center">
                          No rows returned.
                        </td>
                      </tr>
                    ) : (
                      queryResult.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-slate-800 hover:bg-slate-800 transition-colors">
                          {resultHeaders.map((header, colIndex) => (
                            <td key={colIndex} className="px-4 py-2">
                              {String(row[header])}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;