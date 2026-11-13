"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Order {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  order_date: string;
}

type TableData = User[] | Product[] | Order[];

interface Database {
  users: User[];
  products: Product[];
  orders: Order[];
}

const initialDatabase: Database = {
  users: [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200.00 },
    { id: 102, name: 'Mouse', price: 25.00 },
    { id: 103, name: 'Keyboard', price: 75.00 },
  ],
  orders: [
    { id: 1001, user_id: 1, product_id: 101, quantity: 1, order_date: '2023-01-15' },
    { id: 1002, user_id: 2, product_id: 102, quantity: 2, order_date: '2023-01-16' },
    { id: 1003, user_id: 1, product_id: 103, quantity: 1, order_date: '2023-01-17' },
  ],
};

const schema = {
  users: ['id', 'name', 'email'],
  products: ['id', 'name', 'price'],
  orders: ['id', 'user_id', 'product_id', 'quantity', 'order_date'],
};

const SQLPlaygroundPage = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<string>('Run a query to see results.');
  const [db, setDb] = useState<Database>(initialDatabase);

  const { addToHistory } = useToolStore();
  const toolSlug = "sql-playground";

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const executeSql = useCallback((sql: string): { type: 'success' | 'error', message: string, data?: TableData } => {
    const lowerSql = sql.toLowerCase().trim();

    // SELECT statement
    const selectMatch = lowerSql.match(/^select\s+\*\s+from\s+(\w+)\s*;?$/);
    if (selectMatch) {
      const tableName = selectMatch[1];
      if (db.hasOwnProperty(tableName)) {
        return { type: 'success', message: `Query successful for table '${tableName}'.`, data: db[tableName as keyof Database] };
      }
      return { type: 'error', message: `Error: Table '${tableName}' not found.` };
    }

    // INSERT statement
    const insertMatch = lowerSql.match(/^insert\s+into\s+(\w+)\s+\(([^)]+)\)\s+values\s+\(([^)]+)\)\s*;?$/);
    if (insertMatch) {
      const tableName = insertMatch[1];
      const columns = insertMatch[2].split(',').map(col => col.trim());
      const values = insertMatch[3].split(',').map(val => val.trim().replace(/^'|'$/g, '')); // Remove quotes

      if (!db.hasOwnProperty(tableName)) {
        return { type: 'error', message: `Error: Table '${tableName}' not found.` };
      }
      if (columns.length !== values.length) {
        return { type: 'error', message: 'Error: Column count and value count mismatch.' };
      }

      const newRow: Record<string, any> = {};
      columns.forEach((col, index) => {
        let parsedValue: string | number = values[index];
        // Basic type conversion for numbers
        if (!isNaN(Number(parsedValue)) && col !== 'order_date') {
          parsedValue = Number(parsedValue);
        }
        newRow[col] = parsedValue;
      });

      // Simple auto-increment for 'id' if not provided
      if (!newRow.id && schema[tableName as keyof typeof schema].includes('id')) {
        const currentMaxId = db[tableName as keyof Database].reduce((max, row) => Math.max(max, row.id || 0), 0);
        newRow.id = currentMaxId + 1;
      }

      setDb(prevDb => ({
        ...prevDb,
        [tableName]: [...prevDb[tableName as keyof Database], newRow],
      }));
      return { type: 'success', message: `1 row inserted into '${tableName}'.` };
    }

    // UPDATE statement (simplified: only by ID)
    const updateMatch = lowerSql.match(/^update\s+(\w+)\s+set\s+([\w\s=,']+)\s+where\s+id\s*=\s*(\d+)\s*;?$/);
    if (updateMatch) {
      const tableName = updateMatch[1];
      const setClause = updateMatch[2];
      const idToUpdate = parseInt(updateMatch[3], 10);

      if (!db.hasOwnProperty(tableName)) {
        return { type: 'error', message: `Error: Table '${tableName}' not found.` };
      }

      const updates: Record<string, any> = {};
      setClause.split(',').forEach(part => {
        const [key, val] = part.split('=').map(s => s.trim());
        let parsedValue: string | number = val.replace(/^'|'$/g, '');
        if (!isNaN(Number(parsedValue))) {
          parsedValue = Number(parsedValue);
        }
        updates[key] = parsedValue;
      });

      let updatedCount = 0;
      setDb(prevDb => ({
        ...prevDb,
        [tableName]: prevDb[tableName as keyof Database].map(row => {
          if (row.id === idToUpdate) {
            updatedCount++;
            return { ...row, ...updates };
          }
          return row;
        }),
      }));
      return { type: 'success', message: `${updatedCount} row(s) updated in '${tableName}'.` };
    }

    // DELETE statement (simplified: only by ID)
    const deleteMatch = lowerSql.match(/^delete\s+from\s+(\w+)\s+where\s+id\s*=\s*(\d+)\s*;?$/);
    if (deleteMatch) {
      const tableName = deleteMatch[1];
      const idToDelete = parseInt(deleteMatch[2], 10);

      if (!db.hasOwnProperty(tableName)) {
        return { type: 'error', message: `Error: Table '${tableName}' not found.` };
      }

      let deletedCount = 0;
      setDb(prevDb => {
        const initialLength = prevDb[tableName as keyof Database].length;
        const newTableData = prevDb[tableName as keyof Database].filter(row => row.id !== idToDelete);
        deletedCount = initialLength - newTableData.length;
        return {
          ...prevDb,
          [tableName]: newTableData,
        };
      });
      return { type: 'success', message: `${deletedCount} row(s) deleted from '${tableName}'.` };
    }

    return { type: 'error', message: 'Error: Unsupported or invalid SQL query. Only basic SELECT *, INSERT, UPDATE (by ID), DELETE (by ID) are supported.' };
  }, [db]);

  const handleRunQuery = useCallback(() => {
    if (!query.trim()) {
      setResults('Please enter a SQL query.');
      toast.error('Query cannot be empty.');
      return;
    }

    try {
      const result = executeSql(query);
      if (result.type === 'success') {
        if (result.data) {
          if (result.data.length === 0) {
            setResults('No results found.');
          } else {
            setResults(JSON.stringify(result.data, null, 2));
          }
        } else {
          setResults(result.message);
        }
        toast.success(result.message);
      } else {
        setResults(result.message);
        toast.error(result.message);
      }
    } catch (e: any) {
      setResults(`Error: ${e.message}`);
      toast.error(`Query execution failed: ${e.message}`);
    }
  }, [query, executeSql]);

  const handleResetDatabase = useCallback(() => {
    setDb(initialDatabase);
    setResults('Database reset to initial state.');
    toast.success('Database has been reset.');
  }, []);

  const renderSchema = useMemo(() => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200">Available Tables</h3>
        {Object.entries(schema).map(([tableName, columns]) => (
          <div key={tableName} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h4 className="font-medium text-indigo-400">{tableName}</h4>
            <ul className="list-disc list-inside text-slate-400 text-sm mt-2">
              {columns.map(col => (
                <li key={`${tableName}-${col}`}>{col}</li>
              ))}
            </ul>
          </div>
        ))}
        <h3 className="text-lg font-semibold text-slate-200 mt-6">Example Queries</h3>
        <div className="space-y-2 text-sm text-slate-400">
          <p><code>SELECT * FROM users;</code></p>
          <p><code>INSERT INTO products (name, price) VALUES ('Monitor', 299.99);</code></p>
          <p><code>UPDATE users SET email = 'alice.new@example.com' WHERE id = 1;</code></p>
          <p><code>DELETE FROM orders WHERE id = 1003;</code></p>
        </div>
      </div>
    );
  }, []);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Experiment with SQL queries on a simulated in-memory database."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex-1">
            <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-2">
              SQL Query
            </label>
            <textarea
              id="sql-query"
              className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm resize-y"
              placeholder="Enter your SQL query here (e.g., SELECT * FROM users;)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck="false"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRunQuery}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Run Query
            </button>
            <button
              onClick={handleResetDatabase}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Reset Database
            </button>
          </div>

          <div className="flex-1 mt-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Results
            </label>
            <pre className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg text-emerald-300 overflow-auto font-mono text-sm whitespace-pre-wrap">
              {results}
            </pre>
          </div>
        </div>

        <div className="lg:w-1/3 flex-shrink-0">
          {renderSchema}
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;