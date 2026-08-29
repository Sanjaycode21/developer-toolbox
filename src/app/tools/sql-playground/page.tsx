'use client';

import { useState, useCallback, useMemo } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Terminal } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

// Initial mock database state
let mockDb: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
];
let nextId = 4;

const resetMockDb = () => {
  mockDb = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  ];
  nextId = 4;
};

// Mock SQL execution function
const executeSql = (query: string): Promise<{ data?: any[]; message?: string; error?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => { // Simulate async operation
      const lowerQuery = query.trim().toLowerCase();

      if (query.trim() === '') {
        resolve({ error: 'Query cannot be empty.' });
        return;
      }

      if (lowerQuery.startsWith('select')) {
        if (lowerQuery.includes('from users')) {
          resolve({ data: mockDb });
        } else {
          resolve({ error: 'Unsupported SELECT query or table. Try "SELECT * FROM users;"' });
        }
      } else if (lowerQuery.startsWith('insert into users')) {
        const match = query.match(/values\s*\(([^)]+)\)/i);
        if (match && match[1]) {
          const values = match[1].split(',').map(s => s.trim().replace(/^'|'$/g, ''));
          if (values.length === 2) { // Assuming name, email
            const newUser: User = { id: nextId++, name: values[0], email: values[1] };
            mockDb.push(newUser);
            resolve({ message: `Inserted 1 row. New ID: ${newUser.id}` });
          } else {
            resolve({ error: 'Invalid INSERT syntax. Expected (name, email).' });
          }
        } else {
          resolve({ error: 'Invalid INSERT syntax.' });
        }
      } else if (lowerQuery.startsWith('update users')) {
        const setMatch = query.match(/set\s+([^where]+)/i);
        const whereMatch = query.match(/where\s+(.+)/i);

        if (setMatch && whereMatch) {
          const setClause = setMatch[1].trim();
          const whereClause = whereMatch[1].trim();

          // Very basic parsing for SET and WHERE
          const setParts = setClause.split('=').map(s => s.trim().replace(/^'|'$/g, ''));
          const whereParts = whereClause.split('=').map(s => s.trim().replace(/^'|'$/g, ''));

          if (setParts.length === 2 && whereParts.length === 2) {
            const [setKey, setValue] = setParts;
            const [whereKey, whereValue] = whereParts;

            let updatedCount = 0;
            mockDb = mockDb.map(user => {
              if (user[whereKey as keyof User]?.toString() === whereValue) {
                updatedCount++;
                return { ...user, [setKey]: setValue };
              }
              return user;
            });
            resolve({ message: `Updated ${updatedCount} row(s).` });
          } else {
            resolve({ error: 'Invalid UPDATE syntax. Expected SET key=value WHERE key=value.' });
          }
        } else {
          resolve({ error: 'Invalid UPDATE syntax.' });
        }
      } else if (lowerQuery.startsWith('delete from users')) {
        const whereMatch = query.match(/where\s+(.+)/i);
        if (whereMatch) {
          const whereClause = whereMatch[1].trim();
          const whereParts = whereClause.split('=').map(s => s.trim().replace(/^'|'$/g, ''));

          if (whereParts.length === 2) {
            const [whereKey, whereValue] = whereParts;
            const initialLength = mockDb.length;
            mockDb = mockDb.filter(user => user[whereKey as keyof User]?.toString() !== whereValue);
            const deletedCount = initialLength - mockDb.length;
            resolve({ message: `Deleted ${deletedCount} row(s).` });
          } else {
            resolve({ error: 'Invalid DELETE syntax. Expected WHERE key=value.' });
          }
        } else {
          resolve({ error: 'Invalid DELETE syntax. WHERE clause is required.' });
        }
      } else if (lowerQuery.startsWith('create table')) {
        resolve({ message: 'CREATE TABLE statements are acknowledged but do not modify the mock database schema.' });
      } else {
        resolve({ error: 'Unsupported SQL command or syntax.' });
      }
    }, 500);
  });
};


const SQLPlaygroundPage = () => {
  const toolSlug = "sql-playground";
  const { addToHistory } = useToolStore();

  const [sqlInput, setSqlInput] = useState<string>(`-- Welcome to the SQL Playground!
-- This is a mock database with a 'users' table.
-- Try these queries:

-- SELECT * FROM users;
-- INSERT INTO users VALUES ('David', 'david@example.com');
-- UPDATE users SET name='Alice Smith' WHERE id=1;
-- DELETE FROM users WHERE id=3;

SELECT * FROM users;`);
  const [queryResult, setQueryResult] = useState<any[] | string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleExecute = useCallback(async () => {
    setError(null);
    setQueryResult(null);
    setIsLoading(true);
    addToHistory(toolSlug);

    try {
      const result = await executeSql(sqlInput);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else if (result.data) {
        setQueryResult(result.data);
        toast.success('Query executed successfully!');
      } else if (result.message) {
        setQueryResult(result.message);
        toast.success(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      toast.error(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [sqlInput, addToHistory, toolSlug]);

  const handleClearEditor = useCallback(() => {
    setSqlInput('');
    setQueryResult(null);
    setError(null);
    toast('Editor cleared.', { icon: '📝' });
  }, []);

  const handleResetDatabase = useCallback(() => {
    resetMockDb();
    setQueryResult(null);
    setError(null);
    setSqlInput(`-- Welcome to the SQL Playground!
-- This is a mock database with a 'users' table.
-- Try these queries:

-- SELECT * FROM users;
-- INSERT INTO users VALUES ('David', 'david@example.com');
-- UPDATE users SET name='Alice Smith' WHERE id=1;
-- DELETE FROM users WHERE id=3;

SELECT * FROM users;`);
    toast.success('Mock database reset to initial state.');
  }, []);

  const renderResult = useMemo(() => {
    if (isLoading) {
      return <div className="text-slate-400">Executing query...</div>;
    }
    if (error) {
      return <pre className="bg-red-950/30 text-red-300 p-4 rounded-lg font-mono whitespace-pre-wrap">{error}</pre>;
    }
    if (queryResult === null) {
      return <div className="text-slate-500">Results will appear here.</div>;
    }
    if (typeof queryResult === 'string') {
      return <pre className="bg-slate-800/50 text-slate-200 p-4 rounded-lg font-mono whitespace-pre-wrap">{queryResult}</pre>;
    }
    if (Array.isArray(queryResult) && queryResult.length > 0) {
      const headers = Object.keys(queryResult[0]);
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800">
                {headers.map((header) => (
                  <th key={header} className="p-3 border-b border-slate-700 text-slate-300 font-medium text-sm">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryResult.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-800/50 transition-colors">
                  {headers.map((header) => (
                    <td key={`${rowIndex}-${header}`} className="p-3 border-b border-slate-800 text-slate-200 text-sm">
                      {row[header]?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (Array.isArray(queryResult) && queryResult.length === 0) {
      return <div className="text-slate-500">Query executed successfully, but returned no rows.</div>;
    }
    return null;
  }, [isLoading, error, queryResult]);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Write and execute SQL queries against an in-browser mock database."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* SQL Input Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-input" className="block text-sm font-medium text-slate-300 mb-2">
            SQL Query
          </label>
          <textarea
            id="sql-input"
            className="w-full flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg p-4 text-sm text-slate-300 font-mono resize-y min-h-[200px] lg:min-h-[unset]"
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            placeholder="Enter your SQL query here..."
            spellCheck="false"
          />
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={handleExecute}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <Terminal size={18} />
              {isLoading ? 'Executing...' : 'Execute Query'}
            </button>
            <button
              onClick={handleClearEditor}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Clear Editor
            </button>
            <button
              onClick={handleResetDatabase}
              className="px-5 py-2 bg-red-700 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Reset Database
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 flex flex-col">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Results
          </label>
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-4 text-sm overflow-auto min-h-[200px] lg:min-h-[unset]">
            {renderResult}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;