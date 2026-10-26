"use client";

import React, { useState, useEffect } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

// --- Simulated Database Types ---
interface Row {
  [key: string]: any;
}

interface Table {
  columns: string[];
  data: Row[];
  primaryKey?: string;
}

interface Database {
  [tableName: string]: Table;
}

// --- Initial Simulated Database Data ---
const initialDb: Database = {
  users: {
    columns: ['id', 'name', 'email', 'age'],
    data: [
      { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
      { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
    ],
    primaryKey: 'id',
  },
  products: {
    columns: ['product_id', 'name', 'price', 'stock'],
    data: [
      { product_id: 101, name: 'Laptop', price: 1200, stock: 50 },
      { product_id: 102, name: 'Mouse', price: 25, stock: 200 },
      { product_id: 103, name: 'Keyboard', price: 75, stock: 150 },
    ],
    primaryKey: 'product_id',
  },
};

// --- Helper Functions for SQL Parsing ---

// Parses a WHERE clause (very basic: "column = value")
const parseWhereClause = (whereClause: string): ((row: Row) => boolean) => {
  if (!whereClause) return () => true; // No WHERE clause means all rows

  const match = whereClause.trim().match(/^(\w+)\s*=\s*(.+)$/);
  if (!match) {
    throw new Error(`Invalid WHERE clause format: ${whereClause}. Expected 'column = value'.`);
  }
  const [, column, valueStr] = match;
  const value = valueStr.startsWith("'") && valueStr.endsWith("'")
    ? valueStr.slice(1, -1) // String literal
    : parseFloat(valueStr); // Number literal

  return (row: Row) => row[column] === value;
};

// Parses a SET clause (very basic: "column1 = value1, column2 = value2")
const parseSetClause = (setClause: string): Row => {
  const updates: Row = {};
  setClause.split(',').forEach(part => {
    const match = part.trim().match(/^(\w+)\s*=\s*(.+)$/);
    if (match) {
      const [, column, valueStr] = match;
      const value = valueStr.startsWith("'") && valueStr.endsWith("'")
        ? valueStr.slice(1, -1)
        : parseFloat(valueStr);
      updates[column] = value;
    } else {
      throw new Error(`Invalid SET clause part: ${part}. Expected 'column = value'.`);
    }
  });
  return updates;
};

const SqlPlaygroundPage = () => {
  const [sqlInput, setSqlInput] = useState<string>('');
  const [results, setResults] = useState<any[] | string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const { addToHistory } = useToolStore();

  // Use useState to manage the database state, allowing modifications
  const [db, setDb] = useState<Database>(initialDb);

  useEffect(() => {
    addToHistory('sql-playground');
  }, [addToHistory]);

  const executeSql = () => {
    setResults(null);
    setMessage('');
    setIsError(false);

    const trimmedSql = sqlInput.trim();
    if (!trimmedSql) {
      setMessage('Please enter an SQL query.');
      setIsError(true);
      toast.error('Please enter an SQL query.');
      return;
    }

    try {
      // Convert SQL to uppercase for keyword matching, but preserve case for column/table names if needed
      const upperSql = trimmedSql.toUpperCase();

      // SELECT statement
      const selectMatch = trimmedSql.match(/^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER BY\s+(.+?))?$/i);
      if (selectMatch) {
        const [, columnsStr, tableName, whereClause, orderByClause] = selectMatch;
        const lowerTableName = tableName.toLowerCase();
        const table = db[lowerTableName];
        if (!table) {
          throw new Error(`Table '${tableName}' not found.`);
        }

        let filteredData = table.data;
        if (whereClause) {
          const filterFn = parseWhereClause(whereClause);
          filteredData = table.data.filter(filterFn);
        }

        if (orderByClause) {
          const orderColumns = orderByClause.split(',').map(col => col.trim());
          filteredData.sort((a, b) => {
            for (const col of orderColumns) {
              if (a[col] === undefined || b[col] === undefined) continue; // Skip if column doesn't exist in row
              if (typeof a[col] === 'string' && typeof b[col] === 'string') {
                const comparison = a[col].localeCompare(b[col]);
                if (comparison !== 0) return comparison;
              } else {
                const comparison = (a[col] || 0) - (b[col] || 0);
                if (comparison !== 0) return comparison;
              }
            }
            return 0;
          });
        }

        const selectedColumns = columnsStr.trim() === '*'
          ? table.columns
          : columnsStr.split(',').map(col => col.trim());

        const resultRows = filteredData.map(row => {
          const newRow: Row = {};
          selectedColumns.forEach(col => {
            if (row.hasOwnProperty(col)) {
              newRow[col] = row[col];
            } else {
              // Optionally, throw error for non-existent column or set to null/undefined
              // For now, just skip
            }
          });
          return newRow;
        });

        setResults(resultRows);
        setMessage(`${resultRows.length} rows selected.`);
        return;
      }

      // INSERT statement
      const insertMatch = trimmedSql.match(/^INSERT INTO\s+(\w+)\s+\((.+?)\)\s+VALUES\s+\((.+?)\)$/i);
      if (insertMatch) {
        const [, tableName, columnsStr, valuesStr] = insertMatch;
        const lowerTableName = tableName.toLowerCase();
        const table = db[lowerTableName];
        if (!table) {
          throw new Error(`Table '${tableName}' not found.`);
        }

        const columns = columnsStr.split(',').map(col => col.trim());
        const values = valuesStr.split(',').map(val => {
          const trimmedVal = val.trim();
          if (trimmedVal.startsWith("'") && trimmedVal.endsWith("'")) {
            return trimmedVal.slice(1, -1);
          }
          const numVal = parseFloat(trimmedVal);
          return isNaN(numVal) ? trimmedVal : numVal;
        });

        if (columns.length !== values.length) {
          throw new Error('Column count and value count mismatch in INSERT statement.');
        }

        const newRow: Row = {};
        columns.forEach((col, index) => {
          newRow[col] = values[index];
        });

        // Simple auto-increment for primary key if it's defined and not provided
        if (table.primaryKey && !newRow[table.primaryKey]) {
          const maxId = table.data.reduce((max, row) => Math.max(max, row[table.primaryKey!] || 0), 0);
          newRow[table.primaryKey] = maxId + 1;
        }

        setDb(prevDb => ({
          ...prevDb,
          [lowerTableName]: {
            ...prevDb[lowerTableName],
            data: [...prevDb[lowerTableName].data, newRow],
          },
        }));
        setMessage('1 row inserted.');
        toast.success('1 row inserted.');
        return;
      }

      // UPDATE statement
      const updateMatch = trimmedSql.match(/^UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+?))?$/i);
      if (updateMatch) {
        const [, tableName, setClause, whereClause] = updateMatch;
        const lowerTableName = tableName.toLowerCase();
        const table = db[lowerTableName];
        if (!table) {
          throw new Error(`Table '${tableName}' not found.`);
        }

        const updates = parseSetClause(setClause);
        const filterFn = whereClause ? parseWhereClause(whereClause) : () => true; // Apply to all if no WHERE
        let rowsAffected = 0;

        const updatedData = table.data.map(row => {
          if (filterFn(row)) {
            rowsAffected++;
            return { ...row, ...updates };
          }
          return row;
        });

        setDb(prevDb => ({
          ...prevDb,
          [lowerTableName]: {
            ...prevDb[lowerTableName],
            data: updatedData,
          },
        }));
        setMessage(`${rowsAffected} rows updated.`);
        toast.success(`${rowsAffected} rows updated.`);
        return;
      }

      // DELETE statement
      const deleteMatch = trimmedSql.match(/^DELETE FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?$/i);
      if (deleteMatch) {
        const [, tableName, whereClause] = deleteMatch;
        const lowerTableName = tableName.toLowerCase();
        const table = db[lowerTableName];
        if (!table) {
          throw new Error(`Table '${tableName}' not found.`);
        }

        const filterFn = whereClause ? parseWhereClause(whereClause) : () => true; // Apply to all if no WHERE
        let rowsAffected = 0;

        const newData = table.data.filter(row => {
          if (filterFn(row)) {
            rowsAffected++;
            return false; // Exclude this row
          }
          return true; // Keep this row
        });

        setDb(prevDb => ({
          ...prevDb,
          [lowerTableName]: {
            ...prevDb[lowerTableName],
            data: newData,
          },
        }));
        setMessage(`${rowsAffected} rows deleted.`);
        toast.success(`${rowsAffected} rows deleted.`);
        return;
      }

      throw new Error('Unsupported or invalid SQL query. Only SELECT, INSERT, UPDATE, DELETE are supported with basic syntax.');

    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
      setIsError(true);
      toast.error(`Error: ${err.message}`);
    }
  };

  const handlePredefinedQuery = (query: string) => {
    setSqlInput(query);
  };

  const renderResults = () => {
    if (results === null) {
      return null;
    }

    if (typeof results === 'string') {
      return <p className="text-slate-300">{results}</p>;
    }

    if (Array.isArray(results) && results.length > 0) {
      const columns = Object.keys(results[0]);
      return (
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {results.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                  {columns.map((col) => (
                    <td key={`${rowIndex}-${col}`} className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                      {String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (Array.isArray(results) && results.length === 0) {
      return <p className="text-slate-400">No results found.</p>;
    }

    return null;
  };

  const predefinedQueries = [
    { name: 'Select all users', query: 'SELECT * FROM users;' },
    { name: 'Select users over 25', query: 'SELECT name, email FROM users WHERE age = 30;' },
    { name: 'Select products with stock > 100', query: 'SELECT name, stock FROM products WHERE stock = 150;' },
    { name: 'Insert new user', query: "INSERT INTO users (name, email, age) VALUES ('David', 'david@example.com', 28);" },
    { name: 'Update user email', query: "UPDATE users SET email = 'alice.smith@example.com' WHERE id = 1;" },
    { name: 'Delete user by ID', query: "DELETE FROM users WHERE id = 2;" },
  ];

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute and test SQL queries against a simulated in-memory database."
    >
      <div className="space-y-6">
        {/* Predefined Queries */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200 mb-3">Predefined Queries</h3>
          <div className="flex flex-wrap gap-2">
            {predefinedQueries.map((item, index) => (
              <button
                key={index}
                onClick={() => handlePredefinedQuery(item.query)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-md transition-colors border border-slate-600"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* SQL Input */}
        <div>
          <label htmlFor="sql-input" className="block text-sm font-medium text-slate-300 mb-2">
            Enter SQL Query
          </label>
          <textarea
            id="sql-input"
            rows={8}
            className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:ring-indigo-500 focus:border-indigo-500 resize-y font-mono text-sm"
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            placeholder={`Example:
SELECT * FROM users;
INSERT INTO products (name, price, stock) VALUES ('Monitor', 300, 100);
UPDATE users SET age = 31 WHERE id = 1;
DELETE FROM products WHERE product_id = 102;`}
          />
        </div>

        {/* Action Button */}
        <button
          onClick={executeSql}
          className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Execute SQL
        </button>

        {/* Messages */}
        {message && (
          <div
            className={`p-4 rounded-lg text-sm ${
              isError
                ? 'bg-red-900/30 border border-red-700 text-red-300'
                : 'bg-emerald-900/30 border border-emerald-700 text-emerald-300'
            }`}
          >
            {message}
          </div>
        )}

        {/* Results Display */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-3">Results</h3>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 min-h-[150px] flex items-center justify-center">
            {renderResults()}
          </div>
        </div>

        {/* Schema Information */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200 mb-3">Simulated Database Schema</h3>
          <div className="space-y-4">
            {Object.entries(db).map(([tableName, table]) => (
              <div key={tableName} className="bg-slate-700 p-3 rounded-md">
                <h4 className="font-medium text-slate-100 capitalize mb-1">{tableName}</h4>
                <p className="text-sm text-slate-300">
                  Columns: <span className="font-mono">{table.columns.join(', ')}</span>
                </p>
                <p className="text-sm text-slate-300">
                  Rows: <span className="font-mono">{table.data.length}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SqlPlaygroundPage;