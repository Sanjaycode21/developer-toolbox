'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

// Mock Database Structure
interface TableRow {
  [key: string]: string | number | boolean | null;
}

interface Table {
  columns: string[];
  rows: TableRow[];
}

interface Database {
  [tableName: string]: Table;
}

const mockDatabase: Database = {
  users: {
    columns: ['id', 'name', 'email', 'age'],
    rows: [
      { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
      { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
      { id: 4, name: 'David', email: 'david@example.com', age: 28 },
    ],
  },
  products: {
    columns: ['product_id', 'name', 'price', 'stock'],
    rows: [
      { product_id: 101, name: 'Laptop', price: 1200, stock: 50 },
      { product_id: 102, name: 'Mouse', price: 25, stock: 200 },
      { product_id: 103, name: 'Keyboard', price: 75, stock: 150 },
      { product_id: 104, name: 'Monitor', price: 300, stock: 75 },
    ],
  },
};

// Basic SQL Parser/Executor
interface QueryResult {
  columns: string[];
  rows: TableRow[];
  message?: string;
}

const executeQuery = (query: string): QueryResult => {
  const trimmedQuery = query.trim().toUpperCase();

  // Handle SELECT * FROM <table>
  const selectAllMatch = trimmedQuery.match(/^SELECT\s+\*\s+FROM\s+(\w+)\s*;?$/);
  if (selectAllMatch) {
    const tableName = selectAllMatch[1].toLowerCase();
    const table = mockDatabase[tableName];
    if (table) {
      return { columns: table.columns, rows: table.rows };
    } else {
      throw new Error(`Table '${tableName}' not found.`);
    }
  }

  // Handle SELECT col1, col2 FROM <table>
  const selectColumnsMatch = trimmedQuery.match(/^SELECT\s+([\w,\s]+)\s+FROM\s+(\w+)\s*;?$/);
  if (selectColumnsMatch) {
    const columnsToSelect = selectColumnsMatch[1].split(',').map(col => col.trim().toLowerCase());
    const tableName = selectColumnsMatch[2].toLowerCase();
    const table = mockDatabase[tableName];

    if (table) {
      const invalidColumns = columnsToSelect.filter(col => !table.columns.includes(col));
      if (invalidColumns.length > 0) {
        throw new Error(`Column(s) '${invalidColumns.join(', ')}' not found in table '${tableName}'.`);
      }

      const selectedRows = table.rows.map(row => {
        const newRow: TableRow = {};
        columnsToSelect.forEach(col => {
          newRow[col] = row[col];
        });
        return newRow;
      });
      return { columns: columnsToSelect, rows: selectedRows };
    } else {
      throw new Error(`Table '${tableName}' not found.`);
    }
  }

  // Handle INSERT (mock success)
  const insertMatch = trimmedQuery.match(/^INSERT\s+INTO\s+(\w+)\s+\(.+\)\s+VALUES\s+\(.+\)\s*;?$/);
  if (insertMatch) {
    const tableName = insertMatch[1].toLowerCase();
    if (mockDatabase[tableName]) {
      return { columns: [], rows: [], message: `1 row inserted into '${tableName}'. (Mock operation)` };
    } else {
      throw new Error(`Table '${tableName}' not found for INSERT.`);
    }
  }

  // Handle UPDATE (mock success)
  const updateMatch = trimmedQuery.match(/^UPDATE\s+(\w+)\s+SET\s+.+\s+WHERE\s+.+\s*;?$/);
  if (updateMatch) {
    const tableName = updateMatch[1].toLowerCase();
    if (mockDatabase[tableName]) {
      return { columns: [], rows: [], message: `1 row updated in '${tableName}'. (Mock operation)` };
    } else {
      throw new Error(`Table '${tableName}' not found for UPDATE.`);
    }
  }

  // Handle DELETE (mock success)
  const deleteMatch = trimmedQuery.match(/^DELETE\s+FROM\s+(\w+)\s+WHERE\s+.+\s*;?$/);
  if (deleteMatch) {
    const tableName = deleteMatch[1].toLowerCase();
    if (mockDatabase[tableName]) {
      return { columns: [], rows: [], message: `1 row deleted from '${tableName}'. (Mock operation)` };
    } else {
      throw new Error(`Table '${tableName}' not found for DELETE.`);
    }
  }

  throw new Error('Unsupported or invalid SQL query. Try "SELECT * FROM users;" or "SELECT name, email FROM users;"');
};

const SQLPlaygroundPage: React.FC = () => {
  const [query, setQuery] = useState<string>('SELECT * FROM users;');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addToHistory = useToolStore((state) => state.addToHistory);
  const toolSlug = "sql-playground";

  const handleExecute = useCallback(() => {
    setError(null);
    setResult(null);
    addToHistory(toolSlug);

    try {
      const queryResult = executeQuery(query);
      setResult(queryResult);
      toast.success(queryResult.message || 'Query executed successfully!');
    } catch (err: any) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    }
  }, [query, addToHistory, toolSlug]);

  const schemaDisplay = useMemo(() => {
    return Object.entries(mockDatabase).map(([tableName, table]) => (
      <div key={tableName} className="mb-4">
        <h3 className="text-sm font-semibold text-indigo-400 mb-1">{tableName}</h3>
        <ul className="list-disc list-inside text-xs text-slate-400 ml-2">
          {table.columns.map(col => (
            <li key={`${tableName}-${col}`}>{col}</li>
          ))}
        </ul>
      </div>
    ));
  }, []);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Experiment with SQL queries against a mock in-memory database."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
        {/* Schema Sidebar */}
        <div className="w-full lg:w-1/4 p-4 bg-slate-800 rounded-lg shadow-inner border border-slate-700 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-200 mb-4">Schema</h2>
          {schemaDisplay}
        </div>

        {/* Query Editor & Results */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Query Editor */}
          <div className="flex-1 flex flex-col">
            <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-2">
              SQL Query
            </label>
            <textarea
              id="sql-query"
              className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm resize-y min-h-[150px]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              spellCheck="false"
            />
            <button
              onClick={handleExecute}
              className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Execute Query
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-lg font-bold text-slate-200 mb-2">Results</h2>
            <div className="flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg overflow-auto font-mono text-sm min-h-[200px]">
              {error && (
                <pre className="text-red-400 whitespace-pre-wrap">Error: {error}</pre>
              )}
              {result && result.message && !result.rows.length && (
                <p className="text-emerald-400">{result.message}</p>
              )}
              {result && result.rows.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-auto border-collapse">
                    <thead>
                      <tr>
                        {result.columns.map((col) => (
                          <th key={col} className="px-4 py-2 border-b border-slate-600 text-slate-300 font-semibold text-xs uppercase tracking-wider">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-700 transition-colors duration-150">
                          {result.columns.map((col) => (
                            <td key={`${rowIndex}-${col}`} className="px-4 py-2 border-b border-slate-700 text-slate-200">
                              {String(row[col] ?? 'NULL')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!error && !result && (
                <p className="text-slate-400">Execute a query to see results.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;