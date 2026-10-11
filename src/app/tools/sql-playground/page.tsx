'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Play, Database, Table } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

// Mock database table
let mockUsers: User[] = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
];

const SQLPlaygroundPage: React.FC = () => {
  const toolSlug = "sql-playground";
  const { addToHistory } = useToolStore();

  const [query, setQuery] = useState<string>(`SELECT * FROM users;`);
  const [results, setResults] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const runQuery = useCallback(() => {
    setIsLoading(true);
    setResults(''); // Clear previous results
    toast.dismiss(); // Dismiss any existing toasts

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setResults('Please enter an SQL query.');
      toast.error('Query cannot be empty.');
      setIsLoading(false);
      return;
    }

    // Simulate network delay
    setTimeout(() => {
      let output: any = null;
      let success = true;

      try {
        const upperQuery = trimmedQuery.toUpperCase();

        if (upperQuery.startsWith('SELECT')) {
          if (upperQuery.includes('FROM USERS')) {
            let filteredUsers = [...mockUsers];
            let columnsToSelect: string[] = [];

            const selectMatch = upperQuery.match(/SELECT\s+(.*?)\s+FROM/);
            if (selectMatch && selectMatch[1] && selectMatch[1] !== '*') {
              columnsToSelect = selectMatch[1].split(',').map(col => col.trim());
            }

            const whereMatch = upperQuery.match(/WHERE\s+(.*?)(;|$)/);
            if (whereMatch && whereMatch[1]) {
              const condition = whereMatch[1].trim();
              const idMatch = condition.match(/ID\s*=\s*(\d+)/);
              if (idMatch && idMatch[1]) {
                const id = parseInt(idMatch[1], 10);
                filteredUsers = filteredUsers.filter(user => user.id === id);
              } else {
                // Basic name search
                const nameMatch = condition.match(/NAME\s*=\s*'([^']+)'/);
                if (nameMatch && nameMatch[1]) {
                  const name = nameMatch[1];
                  filteredUsers = filteredUsers.filter(user => user.name.toUpperCase() === name.toUpperCase());
                }
              }
            }

            if (columnsToSelect.length > 0) {
              output = filteredUsers.map(user => {
                const newObj: any = {};
                columnsToSelect.forEach(col => {
                  if (col === 'ID' && 'id' in user) newObj.id = user.id;
                  if (col === 'NAME' && 'name' in user) newObj.name = user.name;
                  if (col === 'EMAIL' && 'email' in user) newObj.email = user.email;
                });
                return newObj;
              });
            } else {
              output = filteredUsers;
            }

            if (output.length === 0) {
              output = 'No results found.';
            }

          } else {
            output = 'SELECT queries only supported for the "users" table.';
            success = false;
          }
        } else if (upperQuery.startsWith('INSERT INTO USERS')) {
          const valuesMatch = trimmedQuery.match(/\(([^)]+)\)\s+VALUES\s+\(([^)]+)\)/i);
          if (valuesMatch && valuesMatch[1] && valuesMatch[2]) {
            const columns = valuesMatch[1].split(',').map(c => c.trim().toLowerCase());
            const values = valuesMatch[2].split(',').map(v => v.trim().replace(/^'|'$/g, '')); // Remove quotes

            const newUser: Partial<User> = {};
            columns.forEach((col, index) => {
              if (col === 'name') newUser.name = values[index];
              if (col === 'email') newUser.email = values[index];
            });

            if (newUser.name && newUser.email) {
              const newId = Math.max(...mockUsers.map(u => u.id)) + 1;
              const completeUser: User = { id: newId, name: newUser.name, email: newUser.email };
              mockUsers.push(completeUser);
              output = `1 row inserted. New user ID: ${newId}`;
              toast.success('User inserted successfully!');
            } else {
              output = 'Invalid INSERT statement. Please provide name and email.';
              success = false;
            }
          } else {
            output = 'Invalid INSERT statement syntax.';
            success = false;
          }
        } else if (upperQuery.startsWith('UPDATE') || upperQuery.startsWith('DELETE')) {
          output = 'UPDATE and DELETE operations are not supported in this playground.';
          success = false;
        } else if (upperQuery.startsWith('CREATE TABLE') || upperQuery.startsWith('DROP TABLE')) {
          output = 'DDL operations (CREATE/DROP TABLE) are not supported in this playground.';
          success = false;
        } else {
          output = 'Unsupported SQL query type or syntax error.';
          success = false;
        }
      } catch (e: any) {
        output = `Error executing query: ${e.message}`;
        success = false;
      } finally {
        setResults(JSON.stringify(output, null, 2));
        if (success) {
          toast.success('Query executed successfully!');
        } else {
          toast.error('Query execution failed or partially successful.');
        }
        setIsLoading(false);
      }
    }, 500); // Simulate a small delay
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      runQuery();
    }
  }, [runQuery]);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Experiment with SQL queries against a mock database."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query Input */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your SQL query here..."
            spellCheck="false"
          />
          <button
            onClick={runQuery}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Play className="h-5 w-5 mr-2" />
            )}
            Run Query (Cmd/Ctrl + Enter)
          </button>
        </div>

        {/* Results Output & Schema Info */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          {/* Results */}
          <div className="flex flex-col space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Results
            </label>
            <div className="relative">
              <pre className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm overflow-auto whitespace-pre-wrap break-all">
                {results || 'Run a query to see results.'}
              </pre>
            </div>
          </div>

          {/* Schema Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="flex items-center text-sm font-medium text-slate-300">
              <Database className="h-4 w-4 mr-2 text-indigo-400" />
              Mock Database Schema
            </h3>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-300">
              <p className="font-semibold text-slate-200 mb-2 flex items-center">
                <Table className="h-4 w-4 mr-1 text-slate-400" />
                users
              </p>
              <ul className="list-disc list-inside ml-2 text-slate-400">
                <li><span className="font-mono text-indigo-300">id</span>: INTEGER (Primary Key)</li>
                <li><span className="font-mono text-indigo-300">name</span>: TEXT</li>
                <li><span className="font-mono text-indigo-300">email</span>: TEXT</li>
              </ul>
              <p className="mt-4 text-slate-400">
                Supported operations: <span className="font-mono text-indigo-300">SELECT</span>, <span className="font-mono text-indigo-300">INSERT</span> (basic).
              </p>
              <p className="mt-2 text-slate-400">
                Try: <span className="font-mono text-indigo-300">SELECT * FROM users;</span>
              </p>
              <p className="mt-1 text-slate-400">
                Try: <span className="font-mono text-indigo-300">SELECT name, email FROM users WHERE id = 1;</span>
              </p>
              <p className="mt-1 text-slate-400">
                Try: <span className="font-mono text-indigo-300">INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;