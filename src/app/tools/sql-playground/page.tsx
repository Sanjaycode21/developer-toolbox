"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Loader2, Play, RotateCcw, Database } from 'lucide-react';

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
  stock: number;
}

// Initial mock data for demonstration
let mockUsers: User[] = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', age: 30 },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', age: 24 },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 35 },
];

let mockProducts: Product[] = [
  { id: 101, name: 'Laptop', price: 1200, stock: 10 },
  { id: 102, name: 'Mouse', price: 25, stock: 50 },
  { id: 103, name: 'Keyboard', price: 75, stock: 30 },
];

// Helper to deep clone data to avoid direct mutation issues
const cloneData = () => ({
  users: JSON.parse(JSON.stringify(mockUsers)),
  products: JSON.parse(JSON.stringify(mockProducts)),
});

// Simple in-memory SQL executor for demonstration
const executeSql = (query: string, currentData: { users: User[], products: Product[] }) => {
  const lowerQuery = query.toLowerCase().trim();
  let { users, products } = currentData;

  // SELECT statements
  if (lowerQuery.startsWith('select')) {
    if (lowerQuery.includes('from users')) {
      if (lowerQuery.includes('where')) {
        const match = /where\s+(.+)/.exec(lowerQuery);
        if (match) {
          const condition = match[1].trim();
          // Very basic condition parsing for 'age > X'
          const ageMatch = /age\s*>\s*(\d+)/.exec(condition);
          if (ageMatch) {
            const ageThreshold = parseInt(ageMatch[1]);
            users = users.filter(u => u.age > ageThreshold);
          }
        }
      }
      if (lowerQuery.includes('*')) {
        return { columns: Object.keys(users[0] || {}), rows: users };
      } else {
        const columnsMatch = /select\s+([a-z0-9_,\s]+)\s+from/.exec(lowerQuery);
        if (columnsMatch) {
          const selectedCols = columnsMatch[1].split(',').map(c => c.trim());
          const rows = users.map(user => {
            const newRow: Record<string, any> = {};
            selectedCols.forEach(col => {
              if (Object.prototype.hasOwnProperty.call(user, col)) {
                newRow[col] = (user as any)[col];
              }
            });
            return newRow;
          });
          return { columns: selectedCols, rows };
        }
      }
      return { columns: Object.keys(users[0] || {}), rows: users };
    } else if (lowerQuery.includes('from products')) {
      if (lowerQuery.includes('*')) {
        return { columns: Object.keys(products[0] || {}), rows: products };
      }
      // Add more complex SELECT logic for products if needed
      return { columns: Object.keys(products[0] || {}), rows: products };
    }
    return { columns: [], rows: [] };
  }

  // INSERT statements
  if (lowerQuery.startsWith('insert into users')) {
    const valuesMatch = /values\s*\((.+?)\)/.exec(lowerQuery);
    const columnsMatch = /\((.+?)\)\s*values/.exec(lowerQuery);
    if (valuesMatch && columnsMatch) {
      const cols = columnsMatch[1].split(',').map(c => c.trim());
      const vals = valuesMatch[1].split(',').map(v => v.trim().replace(/^'|'$/g, '')); // Remove quotes
      const newUser: Partial<User> = { id: Math.max(...users.map(u => u.id), 0) + 1 };
      cols.forEach((col, index) => {
        if (col === 'age' || col === 'id') {
          (newUser as any)[col] = parseInt(vals[index]);
        } else {
          (newUser as any)[col] = vals[index];
        }
      });
      users.push(newUser as User);
      mockUsers = users; // Update global mock data
      return { message: `1 row inserted. New ID: ${newUser.id}`, rowsAffected: 1 };
    }
  }

  // UPDATE statements
  if (lowerQuery.startsWith('update users')) {
    const setMatch = /set\s+(.+?)\s+where/.exec(lowerQuery);
    const whereMatch = /where\s+(.+)/.exec(lowerQuery);
    if (setMatch && whereMatch) {
      const setClause = setMatch[1].trim();
      const whereClause = whereMatch[1].trim();

      // Very basic parsing for SET and WHERE
      const setParts = setClause.split('=').map(p => p.trim());
      const updateCol = setParts[0];
      let updateVal: string | number = setParts[1].replace(/^'|'$/g, '');
      if (updateCol === 'age' || updateCol === 'id') updateVal = parseInt(updateVal as string);

      const whereParts = whereClause.split('=').map(p => p.trim());
      const filterCol = whereParts[0];
      let filterVal: string | number = whereParts[1].replace(/^'|'$/g, '');
      if (filterCol === 'age' || filterCol === 'id') filterVal = parseInt(filterVal as string);

      let rowsAffected = 0;
      users = users.map(user => {
        if ((user as any)[filterCol] === filterVal) {
          (user as any)[updateCol] = updateVal;
          rowsAffected++;
        }
        return user;
      });
      mockUsers = users; // Update global mock data
      return { message: `${rowsAffected} row(s) updated.`, rowsAffected };
    }
  }

  // DELETE statements
  if (lowerQuery.startsWith('delete from users')) {
    const whereMatch = /where\s+(.+)/.exec(lowerQuery);
    if (whereMatch) {
      const whereClause = whereMatch[1].trim();
      const whereParts = whereClause.split('=').map(p => p.trim());
      const filterCol = whereParts[0];
      let filterVal: string | number = whereParts[1].replace(/^'|'$/g, '');
      if (filterCol === 'age' || filterCol === 'id') filterVal = parseInt(filterVal as string);

      const initialLength = users.length;
      users = users.filter(user => (user as any)[filterCol] !== filterVal);
      const rowsAffected = initialLength - users.length;
      mockUsers = users; // Update global mock data
      return { message: `${rowsAffected} row(s) deleted.`, rowsAffected };
    } else {
      // DELETE ALL
      const rowsAffected = users.length;
      users = [];
      mockUsers = users; // Update global mock data
      return { message: `${rowsAffected} row(s) deleted.`, rowsAffected };
    }
  }

  return { error: 'Unsupported query or syntax error. Try SELECT, INSERT, UPDATE, DELETE on users/products.' };
};


const SQLPlaygroundPage = () => {
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<{ columns: string[], rows: any[] } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const addToHistory = useToolStore((state) => state.addToHistory);

  // Use a ref or state to manage the current "database" state
  // For simplicity, we'll re-initialize mock data on page load and use global mutable vars for this demo.
  // In a real app, you'd manage this state more robustly.
  const [currentDbState, setCurrentDbState] = useState(cloneData());

  useEffect(() => {
    // Re-initialize mock data when component mounts or resets
    mockUsers = [
      { id: 1, name: 'Alice Smith', email: 'alice@example.com', age: 30 },
      { id: 2, name: 'Bob Johnson', email: 'bob@example.com', age: 24 },
      { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 35 },
    ];
    mockProducts = [
      { id: 101, name: 'Laptop', price: 1200, stock: 10 },
      { id: 102, name: 'Mouse', price: 25, stock: 50 },
      { id: 103, name: 'Keyboard', price: 75, stock: 30 },
    ];
    setCurrentDbState(cloneData());
  }, []); // Empty dependency array means this runs once on mount

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) {
      setError('Please enter an SQL query.');
      setQueryResult(null);
      setMessage(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setQueryResult(null);
    setMessage(null);
    addToHistory('sql-playground');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const result = executeSql(sqlQuery, currentDbState); // Pass current state
      if (result.error) {
        setError(result.error);
        toast.error('Query failed!');
      } else if (result.rows) {
        setQueryResult(result as { columns: string[], rows: any[] });
        setMessage(`Query executed successfully. ${result.rows.length} row(s) returned.`);
        toast.success('Query executed!');
      } else if (result.message) {
        setMessage(result.message);
        toast.success('Query executed!');
      } else {
        setMessage('Query executed successfully.');
        toast.success('Query executed!');
      }
      // Update the currentDbState if DML operations occurred
      setCurrentDbState(cloneData());
    } catch (e: any) {
      setError(`An unexpected error occurred: ${e.message}`);
      toast.error('An unexpected error occurred!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSqlQuery('');
    setQueryResult(null);
    setError(null);
    setMessage(null);
    setIsLoading(false);
    // Reset mock data to initial state
    mockUsers = [
      { id: 1, name: 'Alice Smith', email: 'alice@example.com', age: 30 },
      { id: 2, name: 'Bob Johnson', email: 'bob@example.com', age: 24 },
      { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 35 },
    ];
    mockProducts = [
      { id: 101, name: 'Laptop', price: 1200, stock: 10 },
      { id: 102, name: 'Mouse', price: 25, stock: 50 },
      { id: 103, name: 'Keyboard', price: 75, stock: 30 },
    ];
    setCurrentDbState(cloneData());
    toast.success('Playground reset!');
  };

  const handleLoadSampleData = (type: 'select' | 'insert' | 'update' | 'delete') => {
    let sampleQuery = '';
    switch (type) {
      case 'select':
        sampleQuery = 'SELECT id, name, email FROM users WHERE age > 25;';
        break;
      case 'insert':
        sampleQuery = "INSERT INTO users (name, email, age) VALUES ('Eve Adams', 'eve@example.com', 28);";
        break;
      case 'update':
        sampleQuery = "UPDATE users SET age = 31 WHERE id = 1;";
        break;
      case 'delete':
        sampleQuery = "DELETE FROM users WHERE id = 3;";
        break;
    }
    setSqlQuery(sampleQuery);
    toast.success('Sample query loaded!');
  };

  const renderTable = useMemo(() => {
    if (!queryResult || queryResult.rows.length === 0) {
      return null;
    }

    return (
      <div className="overflow-x-auto rounded-lg border border-slate-700 shadow-lg">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800">
            <tr>
              {queryResult.columns.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900">
            {queryResult.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                {queryResult.columns.map((col, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-slate-200"
                  >
                    {String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [queryResult]);

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute SQL queries against an in-memory database for testing and learning."
    >
      <div className="flex flex-col gap-6">
        {/* Schema Info */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-sm text-slate-300">
          <h3 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" /> Available Tables & Schema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-slate-200 mb-1">users:</p>
              <ul className="list-disc list-inside ml-2 text-slate-400">
                <li>id (INTEGER, PRIMARY KEY)</li>
                <li>name (TEXT)</li>
                <li>email (TEXT)</li>
                <li>age (INTEGER)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-slate-200 mb-1">products:</p>
              <ul className="list-disc list-inside ml-2 text-slate-400">
                <li>id (INTEGER, PRIMARY KEY)</li>
                <li>name (TEXT)</li>
                <li>price (REAL)</li>
                <li>stock (INTEGER)</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-slate-400">
            <span className="font-semibold text-slate-300">Note:</span> This is a simplified in-memory database. Only basic SELECT, INSERT, UPDATE, DELETE operations are supported.
          </p>
        </div>

        {/* Query Input */}
        <div className="flex flex-col gap-4">
          <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300">
            SQL Query:
          </label>
          <textarea
            id="sql-query"
            rows={10}
            className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-colors font-mono resize-y"
            placeholder="e.g., SELECT * FROM users;"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            spellCheck="false"
          />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRunQuery}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Run Query
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-5 py-2 border border-slate-700 text-sm font-medium rounded-md shadow-sm text-slate-300 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </button>
            <div className="flex-grow" /> {/* Spacer */}
            <button
              onClick={() => handleLoadSampleData('select')}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-4 py-2 border border-slate-700 text-xs font-medium rounded-md shadow-sm text-slate-300 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load SELECT Sample
            </button>
            <button
              onClick={() => handleLoadSampleData('insert')}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-4 py-2 border border-slate-700 text-xs font-medium rounded-md shadow-sm text-slate-300 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load INSERT Sample
            </button>
            <button
              onClick={() => handleLoadSampleData('update')}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-4 py-2 border border-slate-700 text-xs font-medium rounded-md shadow-sm text-slate-300 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load UPDATE Sample
            </button>
            <button
              onClick={() => handleLoadSampleData('delete')}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-4 py-2 border border-slate-700 text-xs font-medium rounded-md shadow-sm text-slate-300 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load DELETE Sample
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-100">Query Result:</h2>
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm font-mono">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          {message && !error && (
            <div className="bg-emerald-900/30 border border-emerald-700 text-emerald-300 px-4 py-3 rounded-lg text-sm font-mono">
              <p>{message}</p>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center p-8 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin mr-3" />
              Executing query...
            </div>
          )}
          {!isLoading && !error && renderTable}
          {!isLoading && !error && !queryResult && !message && (
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 text-slate-400 text-center">
              No results to display. Run a query to see output.
            </div>
          )}
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;