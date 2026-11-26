"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const initialUsers: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
];

const SQLPlaygroundPage: React.FC = () => {
  const toolSlug = "sql-playground";
  const { addToHistory } = useToolStore();

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[] | string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUsers, setCurrentUsers] = useState<User[]>(initialUsers);
  const [nextId, setNextId] = useState<number>(initialUsers.length + 1);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const resetDatabase = useCallback(() => {
    setCurrentUsers([...initialUsers]);
    setNextId(initialUsers.length + 1);
    setResults(null);
    setError(null);
    toast.success("Database reset to initial state.");
  }, []);

  const handleRunQuery = useCallback(() => {
    setError(null);
    setResults(null);
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("Please enter a SQL query.");
      return;
    }

    const lowerQuery = trimmedQuery.toLowerCase();

    try {
      if (lowerQuery.startsWith('select')) {
        const match = lowerQuery.match(/select\s+(.*?)\s+from\s+users(?:\s+where\s+(.*))?/);
        if (!match) {
          throw new Error("Invalid SELECT query syntax.");
        }
        const fieldsStr = match[1];
        const whereClause = match[2];

        let filteredUsers = [...currentUsers];

        if (whereClause) {
          const whereMatch = whereClause.match(/(\w+)\s*=\s*['"]?(\w+)['"]?/);
          if (whereMatch) {
            const field = whereMatch[1];
            const value = whereMatch[2];
            filteredUsers = filteredUsers.filter(user => {
              if (field === 'id') return user.id === parseInt(value);
              if (field === 'name') return user.name.toLowerCase() === value.toLowerCase();
              if (field === 'email') return user.email.toLowerCase() === value.toLowerCase();
              if (field === 'age') return user.age === parseInt(value);
              return false;
            });
          } else {
            throw new Error("Unsupported WHERE clause. Only 'field = value' is supported.");
          }
        }

        if (fieldsStr === '*') {
          setResults(filteredUsers);
        } else {
          const fields = fieldsStr.split(',').map(f => f.trim());
          const projectedUsers = filteredUsers.map(user => {
            const newUser: { [key: string]: any } = {};
            fields.forEach(field => {
              if (Object.prototype.hasOwnProperty.call(user, field)) {
                newUser[field] = (user as any)[field];
              }
            });
            return newUser;
          });
          setResults(projectedUsers);
        }
        toast.success("Query executed successfully!");

      } else if (lowerQuery.startsWith('insert into users')) {
        const match = lowerQuery.match(/insert into users\s*\((.*?)\)\s*values\s*\((.*?)\)/);
        if (!match) {
          throw new Error("Invalid INSERT query syntax.");
        }
        const fields = match[1].split(',').map(f => f.trim());
        const values = match[2].split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''));

        if (fields.length !== values.length) {
          throw new Error("Number of fields and values do not match.");
        }

        const newUser: Partial<User> = { id: nextId };
        fields.forEach((field, index) => {
          if (field === 'age' || field === 'id') {
            (newUser as any)[field] = parseInt(values[index]);
          } else {
            (newUser as any)[field] = values[index];
          }
        });

        if (!newUser.name || !newUser.email || !newUser.age) {
          throw new Error("Missing required fields for INSERT: name, email, age.");
        }

        setCurrentUsers(prev => [...prev, newUser as User]);
        setNextId(prev => prev + 1);
        setResults(`1 row inserted. New ID: ${nextId}`);
        toast.success("Query executed successfully!");

      } else if (lowerQuery.startsWith('update users')) {
        const match = lowerQuery.match(/update users\s+set\s+(.*?)(?:\s+where\s+(.*))?/);
        if (!match) {
          throw new Error("Invalid UPDATE query syntax.");
        }
        const setClause = match[1];
        const whereClause = match[2];

        const setPairs = setClause.split(',').map(pair => {
          const [key, value] = pair.split('=').map(s => s.trim());
          return { key, value: value.replace(/^['"]|['"]$/g, '') };
        });

        let updatedCount = 0;
        setCurrentUsers(prev => prev.map(user => {
          let shouldUpdate = true;
          if (whereClause) {
            const whereMatch = whereClause.match(/(\w+)\s*=\s*['"]?(\w+)['"]?/);
            if (whereMatch) {
              const field = whereMatch[1];
              const value = whereMatch[2];
              if (field === 'id') shouldUpdate = user.id === parseInt(value);
              else if (field === 'name') shouldUpdate = user.name.toLowerCase() === value.toLowerCase();
              else if (field === 'email') shouldUpdate = user.email.toLowerCase() === value.toLowerCase();
              else if (field === 'age') shouldUpdate = user.age === parseInt(value);
              else shouldUpdate = false;
            } else {
              throw new Error("Unsupported WHERE clause. Only 'field = value' is supported.");
            }
          }

          if (shouldUpdate) {
            updatedCount++;
            const updatedUser = { ...user };
            setPairs.forEach(({ key, value }) => {
              if (key === 'age' || key === 'id') {
                (updatedUser as any)[key] = parseInt(value);
              } else {
                (updatedUser as any)[key] = value;
              }
            });
            return updatedUser;
          }
          return user;
        }));
        setResults(`${updatedCount} row(s) updated.`);
        toast.success("Query executed successfully!");

      } else if (lowerQuery.startsWith('delete from users')) {
        const match = lowerQuery.match(/delete from users(?:\s+where\s+(.*))?/);
        if (!match) {
          throw new Error("Invalid DELETE query syntax.");
        }
        const whereClause = match[1];

        let deletedCount = 0;
        setCurrentUsers(prev => {
          if (!whereClause) {
            deletedCount = prev.length;
            return []; // Delete all
          }

          const whereMatch = whereClause.match(/(\w+)\s*=\s*['"]?(\w+)['"]?/);
          if (whereMatch) {
            const field = whereMatch[1];
            const value = whereMatch[2];
            const filtered = prev.filter(user => {
              let shouldDelete = false;
              if (field === 'id') shouldDelete = user.id === parseInt(value);
              else if (field === 'name') shouldDelete = user.name.toLowerCase() === value.toLowerCase();
              else if (field === 'email') shouldDelete = user.email.toLowerCase() === value.toLowerCase();
              else if (field === 'age') shouldDelete = user.age === parseInt(value);
              return !shouldDelete; // Keep if not deleted
            });
            deletedCount = prev.length - filtered.length;
            return filtered;
          } else {
            throw new Error("Unsupported WHERE clause. Only 'field = value' is supported.");
          }
        });
        setResults(`${deletedCount} row(s) deleted.`);
        toast.success("Query executed successfully!");

      } else {
        throw new Error("Unsupported SQL command. Only SELECT, INSERT, UPDATE, DELETE on 'users' table are supported.");
      }
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
    }
  }, [query, currentUsers, nextId]);

  const renderTable = (data: any[]) => {
    if (!data || data.length === 0) {
      return <p className="text-slate-400">No results found.</p>;
    }

    const headers = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                {headers.map((header, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                    {String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Experiment with basic SQL queries on an in-memory database. (Limited functionality)"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
          {/* Query Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="sql-query" className="text-sm font-medium text-slate-300">
              SQL Query
            </label>
            <textarea
              id="sql-query"
              className="w-full h-40 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-50 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors resize-y"
              placeholder={`-- Example Queries:\nSELECT * FROM users;\nINSERT INTO users (name, email, age) VALUES ('David', 'david@example.com', 28);\nUPDATE users SET age = 31 WHERE id = 1;\nDELETE FROM users WHERE id = 2;`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck="false"
            />
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleRunQuery}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Run Query
              </button>
              <button
                onClick={resetDatabase}
                className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Reset Database
              </button>
            </div>
          </div>

          {/* Current Database State */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-slate-200">Current 'users' Table State</h3>
            <p className="text-sm text-slate-400 mb-2">This is the current in-memory state of the database.</p>
            {renderTable(currentUsers)}
          </div>
        </div>

        {/* Results Display */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-slate-200">Query Results</h3>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 min-h-[150px] flex flex-col justify-center items-center">
              {error && (
                <div className="text-red-400 text-sm font-mono whitespace-pre-wrap">
                  <span className="font-bold">Error:</span> {error}
                </div>
              )}
              {!error && results === null && (
                <p className="text-slate-400 text-sm">Run a query to see results here.</p>
              )}
              {!error && typeof results === 'string' && (
                <p className="text-emerald-400 text-sm font-mono">{results}</p>
              )}
              {!error && Array.isArray(results) && results.length > 0 && renderTable(results)}
              {!error && Array.isArray(results) && results.length === 0 && (
                <p className="text-slate-400 text-sm">Query returned no rows.</p>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-400">
            <p className="font-semibold text-slate-300 mb-2">Important Note:</p>
            <p>
              This SQL Playground is a simplified, client-side simulation. It operates on an in-memory JavaScript array and supports only basic `SELECT`, `INSERT`, `UPDATE`, and `DELETE` operations on a single `users` table. It does not support complex SQL features like `JOIN`s, aggregate functions, transactions, or schema modifications.
            </p>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;