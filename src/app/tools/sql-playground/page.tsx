'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

// Mock database
interface User {
  id: number;
  name: string;
  email: string;
}

// Initialize with some mock data
let mockUsers: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
];

let nextUserId = 4; // For new inserts

interface QueryResult {
  type: 'success' | 'error';
  message: string;
  data?: any[] | object;
}

/**
 * Simulates SQL query execution against an in-memory mock database.
 * This function is for demonstration purposes only and does not parse full SQL syntax.
 */
const executeMockQuery = (query: string): QueryResult => {
  const lowerQuery = query.toLowerCase().trim();

  if (lowerQuery.startsWith('select * from users')) {
    return { type: 'success', message: 'Query executed successfully.', data: [...mockUsers] };
  } else if (lowerQuery.startsWith('select name, email from users')) {
    const selectedUsers = mockUsers.map(({ name, email }) => ({ name, email }));
    return { type: 'success', message: 'Query executed successfully.', data: selectedUsers };
  } else if (lowerQuery.startsWith('insert into users')) {
    const match = query.match(/\(([^)]+)\)\s*values\s*\(([^)]+)\)/i);
    if (match) {
      const columns = match[1].split(',').map(c => c.trim().toLowerCase());
      const values = match[2].split(',').map(v => v.trim().replace(/^'|'$/g, ''));

      const newUser: Partial<User> = { id: nextUserId++ };
      columns.forEach((col, index) => {
        if (col === 'name') newUser.name = values[index];
        if (col === 'email') newUser.email = values[index];
      });

      if (newUser.name && newUser.email) {
        mockUsers.push(newUser as User);
        return { type: 'success', message: `User '${newUser.name}' inserted successfully.`, data: newUser };
      }
    }
    return { type: 'error', message: 'Failed to parse INSERT statement or missing data.' };
  } else if (lowerQuery.startsWith('update users')) {
    const setMatch = query.match(/set\s+([^where]+)/i);
    const whereMatch = query.match(/where\s+(.+)/i);

    if (setMatch && whereMatch) {
      const setClause = setMatch[1].trim();
      const whereClause = whereMatch[1].trim();

      const [setCol, setValue] = setClause.split('=').map(s => s.trim().replace(/^'|'$/g, ''));
      const [whereCol, whereValue] = whereClause.split('=').map(s => s.trim().replace(/^'|'$/g, ''));

      let updatedCount = 0;
      mockUsers = mockUsers.map(user => {
        const userValue = (user as any)[whereCol.toLowerCase()];
        const targetValue = whereCol.toLowerCase() === 'id' ? parseInt(whereValue) : whereValue;

        if (userValue == targetValue) { // Use == for loose comparison (string '1' vs number 1)
          (user as any)[setCol.toLowerCase()] = setCol.toLowerCase() === 'id' ? parseInt(setValue) : setValue;
          updatedCount++;
        }
        return user;
      });
      return { type: 'success', message: `${updatedCount} user(s) updated successfully.` };
    }
    return { type: 'error', message: 'Failed to parse UPDATE statement.' };
  } else if (lowerQuery.startsWith('delete from users')) {
    const whereMatch = query.match(/where\s+(.+)/i);
    if (whereMatch) {
      const whereClause = whereMatch[1].trim();
      const [whereCol, whereValue] = whereClause.split('=').map(s => s.trim().replace(/^'|'$/g, ''));

      const initialLength = mockUsers.length;
      mockUsers = mockUsers.filter(user => {
        const userValue = (user as any)[whereCol.toLowerCase()];
        const targetValue = whereCol.toLowerCase() === 'id' ? parseInt(whereValue) : whereValue;
        return userValue != targetValue; // Keep if not matching
      });
      const deletedCount = initialLength - mockUsers.length;
      return { type: 'success', message: `${deletedCount} user(s) deleted successfully.` };
    }
    return { type: 'error', message: 'Failed to parse DELETE statement.' };
  }

  return { type: 'error', message: 'Unsupported or invalid SQL query (mock engine).' };
};

const exampleQueries = [
  {
    name: 'Select All Users',
    query: 'SELECT * FROM users;',
  },
  {
    name: 'Insert New User',
    query: "INSERT INTO users (name, email) VALUES ('David', 'david@example.com');",
  },
  {
    name: 'Update User Email',
    query: "UPDATE users SET email = 'alice.smith@example.com' WHERE id = 1;",
  },
  {
    name: 'Delete User by ID',
    query: "DELETE FROM users WHERE id = 3;",
  },
  {
    name: 'Select Specific Columns',
    query: 'SELECT name, email FROM users WHERE id = 2;',
  },
];

export default function SqlPlaygroundPage() {
  const [sqlQuery, setSqlQuery] = useState(exampleQueries[0].query);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const addToHistory = useToolStore((state) => state.addToHistory);

  useEffect(() => {
    addToHistory('sql-playground');
  }, [addToHistory]);

  const handleRunQuery = useCallback(() => {
    if (!sqlQuery.trim()) {
      setQueryResult({ type: 'error', message: 'Please enter a SQL query.' });
      toast.error('Please enter a SQL query.');
      return;
    }
    try {
      const result = executeMockQuery(sqlQuery);
      setQueryResult(result);
      if (result.type === 'success') {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (e: any) {
      setQueryResult({ type: 'error', message: `Error: ${e.message}` });
      toast.error(`Error: ${e.message}`);
    }
  }, [sqlQuery]);

  const handleClearQuery = useCallback(() => {
    setSqlQuery('');
    setQueryResult(null);
    toast('Query cleared.', { icon: '🧹' });
  }, []);

  const handleLoadExample = useCallback((query: string) => {
    setSqlQuery(query);
    setQueryResult(null);
    toast.success('Example query loaded.');
  }, []);

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Experiment with SQL queries against a mock in-memory database."
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Query Input Section */}
        <div className="flex-1 flex flex-col gap-4">
          <label htmlFor="sql-input" className="block text-sm font-medium text-slate-300">
            SQL Query
          </label>
          <textarea
            id="sql-input"
            className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-y"
            placeholder="Enter your SQL query here..."
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            spellCheck="false"
          />
          <div className="flex gap-3">
            <button
              onClick={handleRunQuery}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Run Query
            </button>
            <button
              onClick={handleClearQuery}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Clear Query
            </button>
          </div>

          {/* Example Queries */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Example Queries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleLoadExample(example.query)}
                  className="flex flex-col items-start p-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <span className="text-sm font-medium text-slate-200">{example.name}</span>
                  <code className="text-xs text-slate-400 mt-1 truncate w-full">{example.query}</code>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Query Result Section */}
        <div className="flex-1 flex flex-col gap-4">
          <label className="block text-sm font-medium text-slate-300">
            Query Result
          </label>
          <div
            className={`w-full h-full min-h-[256px] p-4 bg-slate-800 border rounded-lg text-sm font-mono overflow-auto ${
              queryResult?.type === 'error' ? 'border-red-600 text-red-400' : 'border-slate-700 text-slate-50'
            }`}
          >
            {queryResult ? (
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(queryResult.data || queryResult.message, null, 2)}
              </pre>
            ) : (
              <p className="text-slate-500">Run a query to see results here...</p>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}