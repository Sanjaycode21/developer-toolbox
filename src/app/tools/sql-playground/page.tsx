'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

// Define types for our in-memory database
interface Row {
  [key: string]: any;
}

interface TableSchema {
  name: string;
  columns: string[];
  data: Row[];
}

interface Database {
  [tableName: string]: TableSchema;
}

// Initial database state
const initialDbState: Database = {
  users: {
    name: 'users',
    columns: ['id', 'name', 'email', 'age'],
    data: [
      { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
      { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
      { id: 4, name: 'David', email: 'david@example.com', age: 28 },
      { id: 5, name: 'Eve', email: 'eve@example.com', age: 42 },
    ],
  },
  products: {
    name: 'products',
    columns: ['id', 'name', 'price', 'stock'],
    data: [
      { id: 101, name: 'Laptop', price: 1200, stock: 50 },
      { id: 102, name: 'Mouse', price: 25, stock: 200 },
      { id: 103, name: 'Keyboard', price: 75, stock: 150 },
      { id: 104, name: 'Monitor', price: 300, stock: 80 },
      { id: 105, name: 'Webcam', price: 50, stock: 120 },
    ],
  },
};

// Helper function to deep clone the database state
const deepCloneDb = (db: Database): Database => {
  const clonedDb: Database = {};
  for (const tableName in db) {
    if (Object.prototype.hasOwnProperty.call(db, tableName)) {
      const table = db[tableName];
      clonedDb[tableName] = {
        ...table,
        data: table.data.map(row => ({ ...row })), // Deep clone rows
      };
    }
  }
  return clonedDb;
};

// Very basic SQL parser and executor for an in-memory database
// Currently supports:
// - SELECT * FROM table_name;
// - INSERT INTO table_name (col1, col2, ...) VALUES (val1, val2, ...);
// - UPDATE table_name SET column = value WHERE column = value; (simple equality)
// - DELETE FROM table_name WHERE column = value; (simple equality)
function executeQuery(query: string, db: Database): { columns: string[], rows: any[][] } | string {
  query = query.trim();

  // SELECT statement
  const selectAllRegex = /SELECT\s+\*\s+FROM\s+(\w+)\s*;/i;
  let match = query.match(selectAllRegex);
  if (match && match[1]) {
    const tableName = match[1].toLowerCase();
    const table = db[tableName];
    if (table) {
      return {
        columns: table.columns,
        rows: table.data.map(row => table.columns.map(col => row[col]))
      };
    } else {
      throw new Error(`Table '${tableName}' not found.`);
    }
  }

  // INSERT statement
  const insertRegex = /INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)\s*;/i;
  match = query.match(insertRegex);
  if (match && match[1] && match[2] && match[3]) {
    const tableName = match[1].toLowerCase();
    const columns = match[2].split(',').map(c => c.trim().toLowerCase());
    const values = match[3].split(',').map(v => {
      v = v.trim();
      if (v.startsWith("'") && v.endsWith("'")) {
        return v.substring(1, v.length - 1); // Remove quotes for strings
      }
      return isNaN(Number(v)) ? v : Number(v); // Convert to number if possible
    });

    const table = db[tableName];
    if (!table) {
      throw new Error(`Table '${tableName}' not found.`);
    }

    if (columns.length !== values.length) {
      throw new Error('Column count and value count mismatch.');
    }

    const newRow: Row = {};
    for (let i = 0; i < columns.length; i++) {
      if (!table.columns.includes(columns[i])) {
        throw new Error(`Column '${columns[i]}' does not exist in table '${tableName}'.`);
      }
      newRow[columns[i]] = values[i];
    }

    // Assign a new ID if 'id' column exists and is not provided
    if (table.columns.includes('id') && newRow.id === undefined) {
      const maxId = table.data.reduce((max, row) => Math.max(max, row.id || 0), 0);
      newRow.id = maxId + 1;
    }

    table.data.push(newRow);
    return `1 row inserted into '${tableName}'.`;
  }

  // UPDATE statement
  const updateRegex = /UPDATE\s+(\w+)\s+SET\s+([^=]+)\s*=\s*([^,]+)\s+WHERE\s+([^=]+)\s*=\s*(.+)\s*;/i;
  match = query.match(updateRegex);
  if (match && match[1] && match[2] && match[3] && match[4] && match[5]) {
    const tableName = match[1].toLowerCase();
    const setColumn = match[2].trim().toLowerCase();
    let setValue: any = match[3].trim();
    const whereColumn = match[4].trim().toLowerCase();
    let whereValue: any = match[5].trim();

    // Handle string values (remove quotes)
    if (setValue.startsWith("'") && setValue.endsWith("'")) setValue = setValue.slice(1, -1);
    else setValue = isNaN(Number(setValue)) ? setValue : Number(setValue);

    if (whereValue.startsWith("'") && whereValue.endsWith("'")) whereValue = whereValue.slice(1, -1);
    else whereValue = isNaN(Number(whereValue)) ? whereValue : Number(whereValue);

    const table = db[tableName];
    if (!table) {
      throw new Error(`Table '${tableName}' not found.`);
    }
    if (!table.columns.includes(setColumn)) {
      throw new Error(`Column '${setColumn}' does not exist in table '${tableName}'.`);
    }
    if (!table.columns.includes(whereColumn)) {
      throw new Error(`Column '${whereColumn}' does not exist in table '${tableName}'.`);
    }

    let updatedRows = 0;
    table.data = table.data.map(row => {
      if (row[whereColumn] == whereValue) { // Use == for loose comparison (e.g., string '1' == number 1)
        row[setColumn] = setValue;
        updatedRows++;
      }
      return row;
    });
    return `${updatedRows} row(s) updated in '${tableName}'.`;
  }

  // DELETE statement
  const deleteRegex = /DELETE\s+FROM\s+(\w+)\s+WHERE\s+([^=]+)\s*=\s*(.+)\s*;/i;
  match = query.match(deleteRegex);
  if (match && match[1] && match[2] && match[3]) {
    const tableName = match[1].toLowerCase();
    const whereColumn = match[2].trim().toLowerCase();
    let whereValue: any = match[3].trim();

    // Handle string values (remove quotes)
    if (whereValue.startsWith("'") && whereValue.endsWith("'")) whereValue = whereValue.slice(1, -1);
    else whereValue = isNaN(Number(whereValue)) ? whereValue : Number(whereValue);

    const table = db[tableName];
    if (!table) {
      throw new Error(`Table '${tableName}' not found.`);
    }
    if (!table.columns.includes(whereColumn)) {
      throw new Error(`Column '${whereColumn}' does not exist in table '${tableName}'.`);
    }

    const initialRowCount = table.data.length;
    table.data = table.data.filter(row => row[whereColumn] != whereValue); // Use != for loose comparison
    const deletedRows = initialRowCount - table.data.length;
    return `${deletedRows} row(s) deleted from '${tableName}'.`;
  }

  throw new Error("Unsupported query. Supported: SELECT * FROM table_name; INSERT INTO table_name (...) VALUES (...); UPDATE table_name SET col = val WHERE col = val; DELETE FROM table_name WHERE col = val;");
}


export default function SqlPlaygroundPage() {
  const [query, setQuery] = useState<string>(`SELECT * FROM users;`);
  const [db, setDb] = useState<Database>(deepCloneDb(initialDbState));
  const [results, setResults] = useState<{ columns: string[], rows: any[][] } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { addToHistory } = useToolStore();

  const toolSlug = "sql-playground";
  const toolName = "SQL Playground";
  const description = "Execute and test SQL queries in an in-browser environment.";

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleRunQuery = useCallback(() => {
    setError(null);
    setMessage(null);
    setResults(null);

    try {
      const clonedDb = deepCloneDb(db); // Operate on a clone for non-SELECT queries
      const result = executeQuery(query, clonedDb);

      if (typeof result === 'string') {
        setMessage(result);
        setDb(clonedDb); // Update the actual DB state if DML was successful
        toast.success(result);
      } else {
        setResults(result);
        toast.success('Query executed successfully!');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  }, [query, db]);

  const handleResetDatabase = useCallback(() => {
    setDb(deepCloneDb(initialDbState));
    setQuery(`SELECT * FROM users;`);
    setResults(null);
    setMessage(null);
    setError(null);
    toast.success('Database reset to initial state.');
  }, []);

  const handleExampleQuery = useCallback((example: string) => {
    setQuery(example);
    setError(null);
    setMessage(null);
    setResults(null);
  }, []);

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col space-y-6">
        {/* Query Input */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="sql-query" className="text-sm font-medium text-slate-300">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="w-full h-40 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            spellCheck="false"
          />
          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="font-semibold">Examples:</span>
            <button
              onClick={() => handleExampleQuery(`SELECT * FROM users;`)}
              className="px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              SELECT * FROM users;
            </button>
            <button
              onClick={() => handleExampleQuery(`SELECT * FROM products;`)}
              className="px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              SELECT * FROM products;
            </button>
            <button
              onClick={() => handleExampleQuery(`INSERT INTO users (name, email, age) VALUES ('Frank', 'frank@example.com', 29);`)}
              className="px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              INSERT user
            </button>
            <button
              onClick={() => handleExampleQuery(`UPDATE users SET age = 31 WHERE name = 'Alice';`)}
              className="px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              UPDATE Alice's age
            </button>
            <button
              onClick={() => handleExampleQuery(`DELETE FROM products WHERE id = 105;`)}
              className="px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              DELETE product 105
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleRunQuery}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Run Query
          </button>
          <button
            onClick={handleResetDatabase}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Reset Database
          </button>
        </div>

        {/* Messages and Errors */}
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-sm font-mono">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}
        {message && (
          <div className="p-4 bg-emerald-900/30 border border-emerald-700 text-emerald-300 rounded-lg text-sm font-mono">
            <span className="font-bold">Message:</span> {message}
          </div>
        )}

        {/* Results Display */}
        {results && results.columns.length > 0 && (
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold text-slate-200">Query Results</h3>
            <div className="overflow-x-auto rounded-lg border border-slate-700">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                  <tr>
                    {results.columns.map((col, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-slate-900 divide-y divide-slate-800">
                  {results.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono"
                        >
                          {String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Database Schema Display */}
        <div className="flex flex-col space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-lg font-semibold text-slate-200">Current Database Schema</h3>
          {Object.values(db).map((table) => (
            <div key={table.name} className="flex flex-col space-y-2">
              <h4 className="text-md font-medium text-slate-300 capitalize">{table.name} Table ({table.data.length} rows)</h4>
              <div className="overflow-x-auto rounded-lg border border-slate-700">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead className="bg-slate-800">
                    <tr>
                      {table.columns.map((col, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-slate-900 divide-y divide-slate-800">
                    {table.data.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                        {table.columns.map((col, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono"
                          >
                            {String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolPageWrapper>
  );
}