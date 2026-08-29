"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Play, Database, Table, XCircle, Info } from 'lucide-react';

// --- In-memory Database Definition ---
interface Column {
  name: string;
  type: string;
}

interface TableSchema {
  name: string;
  columns: Column[];
  data: Record<string, any>[];
}

// This database object is mutable and will be modified by INSERT/UPDATE/DELETE operations
// within the current session. It resets on page refresh.
const database: Record<string, TableSchema> = {
  users: {
    name: 'users',
    columns: [
      { name: 'id', type: 'number' },
      { name: 'name', type: 'string' },
      { name: 'email', type: 'string' },
      { name: 'age', type: 'number' },
    ],
    data: [
      { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
      { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
      { id: 4, name: 'David', email: 'david@example.com', age: 28 },
    ],
  },
  products: {
    name: 'products',
    columns: [
      { name: 'product_id', type: 'number' },
      { name: 'name', type: 'string' },
      { name: 'price', type: 'number' },
      { name: 'category', type: 'string' },
    ],
    data: [
      { product_id: 101, name: 'Laptop', price: 1200, category: 'Electronics' },
      { product_id: 102, name: 'Mouse', price: 25, category: 'Electronics' },
      { product_id: 103, name: 'Keyboard', price: 75, category: 'Electronics' },
      { product_id: 104, name: 'Monitor', price: 300, category: 'Electronics' },
      { product_id: 105, name: 'Desk Chair', price: 150, category: 'Furniture' },
    ],
  },
};

// --- SQL Executor (Simplified) ---
interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  message?: string;
}

/**
 * A very basic in-memory SQL executor.
 * Supports simple SELECT, INSERT, UPDATE, DELETE statements.
 * Data changes are temporary and reset on page refresh.
 */
function executeSql(query: string): QueryResult {
  const normalizedQuery = query.trim().toLowerCase();

  // SELECT * FROM <table> [WHERE <column> = '<value>']
  const selectMatch = normalizedQuery.match(/^select\s+\*\s+from\s+(\w+)(?:\s+where\s+(\w+)\s*=\s*['"]?([^'"]+)['"]?)?$/);
  if (selectMatch) {
    const tableName = selectMatch[1];
    const whereColumn = selectMatch[2];
    const whereValue = selectMatch[3];

    const table = database[tableName];
    if (!table) {
      throw new Error(`Table '${tableName}' not found.`);
    }

    let filteredData = table.data;

    if (whereColumn && whereValue !== undefined) {
      if (!table.columns.some(col => col.name.toLowerCase() === whereColumn)) {
        throw new Error(`Column '${whereColumn}' not found in table '${tableName}'.`);
      }
      filteredData = table.data.filter(row => String(row[whereColumn]).toLowerCase() === whereValue.toLowerCase());
    }

    const columns = table.columns.map(col => col.name);
    return { columns, rows: filteredData, message: `Query executed successfully. ${filteredData.length} rows returned.` };
  }

  // INSERT INTO <table> (<columns>) VALUES (<values>)
  const insertMatch = normalizedQuery.match(/^insert\s+into\s+(\w+)\s*\(([^)]+)\)\s+values\s*\(([^)]+)\)$/);
  if (insertMatch) {
    const tableName = insertMatch[1];
    const columnNames = insertMatch[2].split(',').map(c => c.trim());
    const values = insertMatch[3].split(',').map(v => v.trim().replace(/^['"]|['"]$/g, '')); // Remove quotes

    const table = database[tableName];
    if (!table) {
      throw new Error(`Table '${tableName}' not found.`);
    }

    if (columnNames.length !== values.length) {
      throw new Error('Column count and value count do not match for INSERT statement.');
    }

    const newRow: Record<string, any> = {};
    for (let i = 0; i < columnNames.length; i++) {
      const colName = columnNames[i];
      const colSchema = table.columns.find(c => c.name.toLowerCase() === colName.toLowerCase());
      if (!colSchema) {
        throw new Error(`Column '${colName}' not found in table '${tableName}'.`);
      }
      let parsedValue: any = values[i];
      if (colSchema.type === 'number') {
        parsedValue = parseFloat(values[i]);
        if (isNaN(parsedValue)) {
          throw new Error(`Invalid number for column '${colName}'.`);
        }
      }
      newRow[colName] = parsedValue;
    }

    // Assign a new ID if 'id' or 'product_id' column exists and is not provided
    if (table.columns.some(c => c.name === 'id') && newRow.id === undefined) {
      const maxId = table.data.reduce((max, row) => Math.max(max, row.id || 0), 0);
      newRow.id = maxId + 1;
    } else if (table.columns.some(c => c.name === 'product_id') && newRow.product_id === undefined) {
      const maxId = table.data.reduce((max, row) => Math.max(max, row.product_id || 0), 0);
      newRow.product_id = maxId + 1;
    }

    table.data.push(newRow);
    return { columns: [], rows: [], message: `1 row inserted into '${tableName}'.` };
  }

  // UPDATE <table> SET <column> = '<value>' WHERE <column> = '<value>'
  const updateMatch = normalizedQuery.match(/^update\s+(\w+)\s+set\s+(\w+)\s*=\s*['"]?([^'"]+)['"]?\s+where\s+(\w+)\s*=\s*['"]?([^'"]+)['"]?$/);
  if (updateMatch) {
    const tableName = updateMatch[1];
    const setColumn = updateMatch[2];
    const setValue = updateMatch[3];
    const whereColumn = updateMatch[4];
    const whereValue = updateMatch[5];

    const table = database[tableName];
    if (!table) {
      throw new Error(`Table '${tableName}' not found.`);
    }

    if (!table.columns.some(col => col.name.toLowerCase() === setColumn)) {
      throw new Error(`Column '${setColumn}' not found in table '${tableName}'.`);
    }
    if (!table.columns.some(col => col.name.toLowerCase() === whereColumn)) {
      throw new Error(`Column '${whereColumn}' not found in table '${tableName}'.`);
    }

    let updatedRowsCount = 0;
    table.data = table.data.map(row => {
      if (String(row[whereColumn]).toLowerCase() === whereValue.toLowerCase()) {
        const colSchema = table.columns.find(c => c.name.toLowerCase() === setColumn);
        let parsedSetValue: any = setValue;
        if (colSchema?.type === 'number') {
          parsedSetValue = parseFloat(setValue);
          if (isNaN(parsedSetValue)) {
            throw new Error(`Invalid number for column '${setColumn}'.`);
          }
        }
        updatedRowsCount++;
        return { ...row, [setColumn]: parsedSetValue };
      }
      return row;
    });
    return { columns: [], rows: [], message: `${updatedRowsCount} rows updated in '${tableName}'.` };
  }

  // DELETE FROM <table> [WHERE <column> = '<value>']
  const deleteMatch = normalizedQuery.match(/^delete\s+from\s+(\w+)(?:\s+where\s+(\w+)\s*=\s*['"]?([^'"]+)['"]?)?$/);
  if (deleteMatch) {
    const tableName = deleteMatch[1];
    const whereColumn = deleteMatch[2];
    const whereValue = deleteMatch[3];

    const table = database[tableName];
    if (!table) {
      throw new Error(`Table '${tableName}' not found.`);
    }

    let deletedRowsCount = 0;
    if (whereColumn && whereValue !== undefined) {
      if (!table.columns.some(col => col.name.toLowerCase() === whereColumn)) {
        throw new Error(`Column '${whereColumn}' not found in table '${tableName}'.`);
      }
      const initialLength = table.data.length;
      table.data = table.data.filter(row => String(row[whereColumn]).toLowerCase() !== whereValue.toLowerCase());
      deletedRowsCount = initialLength - table.data.length;
    } else {
      // If no WHERE clause, delete all rows
      deletedRowsCount = table.data.length;
      table.data = [];
    }
    return { columns: [], rows: [], message: `${deletedRowsCount} rows deleted from '${tableName}'.` };
  }

  throw new Error('Unsupported SQL query. Only basic SELECT, INSERT, UPDATE, DELETE are supported.');
}


const SQLPlaygroundPage: React.FC = () => {
  const [query, setQuery] = useState<string>(`SELECT * FROM users;`);
  const [results, setResults] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'query' | 'schema'>('query');

  const { addToHistory } = useToolStore();
  const toolSlug = "sql-playground";

  const handleExecuteQuery = useCallback(() => {
    setError(null);
    setResults(null);
    addToHistory(toolSlug);

    try {
      const queryResults = executeSql(query);
      setResults(queryResults);
      toast.success(queryResults.message || "Query executed successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    }
  }, [query, addToHistory, toolSlug]);

  // Execute initial query on mount
  useEffect(() => {
    handleExecuteQuery();
  }, [handleExecuteQuery]);

  const renderSchema = () => (
    <div className="space-y-6">
      {Object.values(database).map((table) => (
        <div key={table.name} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-indigo-400 flex items-center gap-2 mb-3">
            <Table className="h-5 w-5" /> {table.name}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Column Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {table.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-200">{col.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-400">{col.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            <span className="font-medium text-slate-300">{table.data.length}</span> rows currently in table.
          </p>
        </div>
      ))}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-sm text-slate-300 flex items-center gap-2">
        <Info className="h-5 w-5 text-indigo-400" />
        <p>
          This is an in-memory database. Data changes are temporary and reset on page refresh.
          Supported queries: <code className="bg-slate-700 px-1 rounded">SELECT * FROM table [WHERE col = 'val']</code>,
          <code className="bg-slate-700 px-1 rounded">INSERT INTO table (cols) VALUES (vals)</code>,
          <code className="bg-slate-700 px-1 rounded">UPDATE table SET col = 'val' WHERE col = 'val'</code>,
          <code className="bg-slate-700 px-1 rounded">DELETE FROM table [WHERE col = 'val']</code>.
        </p>
      </div>
    </div>
  );

  const renderQueryPanel = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 mb-4">
        <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-2">
          SQL Query
        </label>
        <textarea
          id="sql-query"
          className="w-full h-40 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-y"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here..."
          spellCheck="false"
        />
      </div>
      <button
        onClick={handleExecuteQuery}
        className="flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        <Play className="h-5 w-5" /> Execute Query
      </button>

      <div className="mt-6 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Table className="h-5 w-5 text-indigo-400" /> Results
        </h3>
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg flex items-start gap-3">
            <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error executing query:</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}
        {results && results.rows.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-800 flex-1">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700">
                <tr>
                  {results.columns.map((col) => (
                    <th key={col} className="px-4 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {results.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-700/50 transition-colors">
                    {results.columns.map((col) => (
                      <td key={`${rowIndex}-${col}`} className="px-4 py-2 whitespace-nowrap text-sm text-slate-200">
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {results && results.rows.length === 0 && !error && (
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-slate-400 text-sm flex items-center gap-2">
            <Info className="h-5 w-5 text-indigo-400" />
            <p>{results.message || "No results found for the query."}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Execute and test SQL queries against an in-memory database."
    >
      <div className="flex flex-col h-full min-h-[600px]">
        <div className="mb-6 border-b border-slate-800">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('query')}
              className={`
                ${activeTab === 'query'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700'
                }
                whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
              `}
            >
              <Play className="h-4 w-4" /> Query
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`
                ${activeTab === 'schema'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700'
                }
                whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
              `}
            >
              <Database className="h-4 w-4" /> Schema
            </button>
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === 'query' && renderQueryPanel()}
          {activeTab === 'schema' && renderSchema()}
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;