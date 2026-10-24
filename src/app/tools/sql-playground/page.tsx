"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Code, Table } from 'lucide-react';

interface MockTableData {
  [tableName: string]: Record<string, any>[];
}

interface MockSchema {
  [tableName: string]: string[];
}

const initialMockData: MockTableData = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200, stock: 50 },
    { id: 102, name: 'Mouse', price: 25, stock: 200 },
  ],
};

const initialMockSchema: MockSchema = {
  users: ['id', 'name', 'email', 'age'],
  products: ['id', 'name', 'price', 'stock'],
};

const SQLPlaygroundPage = () => {
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM users;');
  const [queryResult, setQueryResult] = useState<string | Record<string, any>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentMockData, setCurrentMockData] = useState<MockTableData>(initialMockData);

  const { addToHistory } = useToolStore();
  const toolSlug = "sql-playground";

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const executeQuery = useCallback((query: string): { type: string, data?: Record<string, any>[], message?: string, error?: string } => {
    const lowerQuery = query.toLowerCase().trim();

    // SELECT statement
    if (lowerQuery.startsWith('select')) {
      const fromMatch = lowerQuery.match(/from\s+(\w+)/);
      if (!fromMatch) return { type: 'error', error: 'Invalid SELECT query: Missing FROM clause.' };
      const tableName = fromMatch[1];

      if (!currentMockData[tableName]) return { type: 'error', error: `Table '${tableName}' not found.` };

      let data = [...currentMockData[tableName]]; // Work on a copy

      // Basic WHERE clause parsing
      const whereMatch = lowerQuery.match(/where\s+(.+?)(?:\s+order by|\s+limit|$)/);
      if (whereMatch) {
        const whereClause = whereMatch[1];
        try {
          // Very basic WHERE clause evaluation (e.g., "id = 1", "age > 25")
          // This implementation only handles simple "column operator value" conditions.
          // It's not robust for "AND", "OR", string comparisons, etc.
          const parts = whereClause.split(/\s*([=><!]+)\s*/); // Split by operators
          if (parts.length === 3) {
            const [col, op, valStr] = parts;
            const column = col.trim();
            const operator = op.trim();
            let value: any = valStr.trim();

            // Attempt to convert value to number if possible
            if (!isNaN(Number(value))) {
              value = Number(value);
            } else if (value.startsWith("'") && value.endsWith("'")) {
              value = value.slice(1, -1); // Remove quotes for string comparison
            }

            if (!(column in data[0] || initialMockSchema[tableName].includes(column))) {
              throw new Error(`Column '${column}' not found in table '${tableName}'.`);
            }

            data = data.filter(row => {
              switch (operator) {
                case '=': return row[column] === value;
                case '!=':
                case '<>': return row[column] !== value;
                case '>': return row[column] > value;
                case '<': return row[column] < value;
                case '>=': return row[column] >= value;
                case '<=': return row[column] <= value;
                default: throw new Error(`Unsupported operator in WHERE clause: ${operator}`);
              }
            });
          } else {
            throw new Error('Complex WHERE clauses (e.g., with AND/OR) are not supported in this mock engine.');
          }
        } catch (e: any) {
          return { type: 'error', error: `Error in WHERE clause: ${e.message}` };
        }
      }

      // Column selection
      const selectColsMatch = lowerQuery.match(/select\s+(.+?)\s+from/);
      if (selectColsMatch && selectColsMatch[1] !== '*') {
        const selectedColumns = selectColsMatch[1].split(',').map(col => col.trim());
        data = data.map(row => {
          const newRow: Record<string, any> = {};
          for (const col of selectedColumns) {
            if (col in row) {
              newRow[col] = row[col];
            } else {
              return { type: 'error', error: `Column '${col}' not found in table '${tableName}'.` };
            }
          }
          return newRow;
        }).filter(item => item.type !== 'error'); // Filter out error objects if any
        if (data.some(item => item.type === 'error')) {
          return data.find(item => item.type === 'error') as any; // Return the first error
        }
      }

      return { type: 'select', data: data };
    }

    // INSERT statement
    if (lowerQuery.startsWith('insert into')) {
      const insertMatch = lowerQuery.match(/insert into\s+(\w+)\s+\((.+?)\)\s+values\s*\((.+?)\)/);
      if (!insertMatch) return { type: 'error', error: 'Invalid INSERT query syntax.' };

      const [, tableName, colsStr, valuesStr] = insertMatch;
      if (!currentMockData[tableName]) return { type: 'error', error: `Table '${tableName}' not found.` };

      const columns = colsStr.split(',').map(c => c.trim());
      const values = valuesStr.split(',').map(v => {
        const trimmed = v.trim();
        if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
          return trimmed.slice(1, -1); // Remove quotes for strings
        }
        return isNaN(Number(trimmed)) ? trimmed : Number(trimmed); // Convert to number if possible
      });

      if (columns.length !== values.length) return { type: 'error', error: 'Column and value count mismatch.' };

      const newRow: Record<string, any> = {};
      for (let i = 0; i < columns.length; i++) {
        if (!initialMockSchema[tableName].includes(columns[i])) {
          return { type: 'error', error: `Column '${columns[i]}' not defined in table '${tableName}' schema.` };
        }
        newRow[columns[i]] = values[i];
      }

      setCurrentMockData(prevData => ({
        ...prevData,
        [tableName]: [...prevData[tableName], newRow],
      }));
      return { type: 'insert', message: `1 row inserted into '${tableName}'.` };
    }

    // UPDATE statement
    if (lowerQuery.startsWith('update')) {
      const updateMatch = lowerQuery.match(/update\s+(\w+)\s+set\s+(.+?)(?:\s+where\s+(.+?))?$/);
      if (!updateMatch) return { type: 'error', error: 'Invalid UPDATE query syntax.' };

      const [, tableName, setClause, whereClause] = updateMatch;
      if (!currentMockData[tableName]) return { type: 'error', error: `Table '${tableName}' not found.` };

      const setPairs = setClause.split(',').map(pair => pair.trim().split(/\s*=\s*/));
      let rowsAffected = 0;

      const newData = currentMockData[tableName].map(row => {
        let shouldUpdate = true;
        if (whereClause) {
          try {
            // Simplified WHERE clause evaluation, similar to SELECT
            const parts = whereClause.split(/\s*([=><!]+)\s*/);
            if (parts.length === 3) {
              const [col, op, valStr] = parts;
              const column = col.trim();
              const operator = op.trim();
              let value: any = valStr.trim();

              if (!isNaN(Number(value))) {
                value = Number(value);
              } else if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1);
              }

              if (!(column in row)) {
                throw new Error(`Column '${column}' not found in table '${tableName}'.`);
              }

              switch (operator) {
                case '=': shouldUpdate = row[column] === value; break;
                case '!=':
                case '<>': shouldUpdate = row[column] !== value; break;
                case '>': shouldUpdate = row[column] > value; break;
                case '<': shouldUpdate = row[column] < value; break;
                case '>=': shouldUpdate = row[column] >= value; break;
                case '<=': shouldUpdate = row[column] <= value; break;
                default: throw new Error(`Unsupported operator in WHERE clause: ${operator}`);
              }
            } else {
              throw new Error('Complex WHERE clauses (e.g., with AND/OR) are not supported in this mock engine.');
            }
          } catch (e: any) {
            return { type: 'error', error: `Error in WHERE clause: ${e.message}` };
          }
        }

        if (shouldUpdate) {
          rowsAffected++;
          const updatedRow = { ...row };
          for (const [col, valStr] of setPairs) {
            if (!initialMockSchema[tableName].includes(col)) {
              return { type: 'error', error: `Column '${col}' not defined in table '${tableName}' schema.` };
            }
            let value: any = valStr.trim();
            if (!isNaN(Number(value))) {
              value = Number(value);
            } else if (value.startsWith("'") && value.endsWith("'")) {
              value = value.slice(1, -1);
            }
            updatedRow[col] = value;
          }
          return updatedRow;
        }
        return row;
      });

      // Check if any error was returned from map
      if (newData.some(item => item && typeof item === 'object' && 'type' in item && item.type === 'error')) {
        return newData.find(item => item && typeof item === 'object' && 'type' in item && item.type === 'error') as any;
      }

      setCurrentMockData(prevData => ({
        ...prevData,
        [tableName]: newData,
      }));
      return { type: 'update', message: `${rowsAffected} row(s) updated in '${tableName}'.` };
    }

    // DELETE statement
    if (lowerQuery.startsWith('delete from')) {
      const deleteMatch = lowerQuery.match(/delete from\s+(\w+)(?:\s+where\s+(.+?))?$/);
      if (!deleteMatch) return { type: 'error', error: 'Invalid DELETE query syntax.' };

      const [, tableName, whereClause] = deleteMatch;
      if (!currentMockData[tableName]) return { type: 'error', error: `Table '${tableName}' not found.` };

      let rowsAffected = 0;
      const newData = currentMockData[tableName].filter(row => {
        let shouldDelete = true;
        if (whereClause) {
          try {
            // Simplified WHERE clause evaluation, similar to SELECT
            const parts = whereClause.split(/\s*([=><!]+)\s*/);
            if (parts.length === 3) {
              const [col, op, valStr] = parts;
              const column = col.trim();
              const operator = op.trim();
              let value: any = valStr.trim();

              if (!isNaN(Number(value))) {
                value = Number(value);
              } else if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1);
              }

              if (!(column in row)) {
                throw new Error(`Column '${column}' not found in table '${tableName}'.`);
              }

              switch (operator) {
                case '=': shouldDelete = row[column] === value; break;
                case '!=':
                case '<>': shouldDelete = row[column] !== value; break;
                case '>': shouldDelete = row[column] > value; break;
                case '<': shouldDelete = row[column] < value; break;
                case '>=': shouldDelete = row[column] >= value; break;
                case '<=': shouldDelete = row[column] <= value; break;
                default: throw new Error(`Unsupported operator in WHERE clause: ${operator}`);
              }
            } else {
              throw new Error('Complex WHERE clauses (e.g., with AND/OR) are not supported in this mock engine.');
            }
          } catch (e: any) {
            return { type: 'error', error: `Error in WHERE clause: ${e.message}` };
          }
        }

        if (shouldDelete) {
          rowsAffected++;
          return false; // Filter out rows that should be deleted
        }
        return true; // Keep rows that should not be deleted
      });

      setCurrentMockData(prevData => ({
        ...prevData,
        [tableName]: newData,
      }));
      return { type: 'delete', message: `${rowsAffected} row(s) deleted from '${tableName}'.` };
    }

    return { type: 'error', error: 'Unsupported SQL query type or invalid syntax.' };
  }, [currentMockData, initialMockSchema]);

  const handleRunQuery = async () => {
    setIsLoading(true);
    setQueryResult(null); // Clear previous results

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));

    try {
      const result = executeQuery(sqlQuery);

      if (result.error) {
        setQueryResult(result.error);
        toast.error(result.error);
      } else if (result.type === 'select') {
        if (result.data && result.data.length > 0) {
          setQueryResult(result.data);
          toast.success(`Query executed successfully. ${result.data.length} row(s) returned.`);
        } else {
          setQueryResult('No rows returned.');
          toast.success('Query executed successfully. No rows returned.');
        }
      } else if (result.message) {
        setQueryResult(result.message);
        toast.success(result.message);
      } else {
        setQueryResult('Query executed successfully.');
        toast.success('Query executed successfully.');
      }
    } catch (e: any) {
      setQueryResult(`Error: ${e.message}`);
      toast.error(`Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTable = (data: Record<string, any>[]) => {
    if (!data || data.length === 0) {
      return <p className="text-slate-400">No data to display.</p>;
    }

    const columns = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800">
            <tr>
              {columns.map((col) => (
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
          <tbody className="divide-y divide-slate-800">
            {data.map((row, rowIndex) => (
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
  };

  const renderSchema = () => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
        <Table className="w-5 h-5 text-indigo-400" />
        Mock Database Schema
      </h3>
      {Object.keys(initialMockSchema).map(tableName => (
        <div key={tableName} className="mb-2">
          <p className="font-medium text-slate-200">{tableName} <span className="text-slate-400">(</span></p>
          <ul className="ml-4 text-sm text-slate-300">
            {initialMockSchema[tableName].map(col => (
              <li key={`${tableName}-${col}`} className="before:content-['•'] before:mr-2 before:text-indigo-400">
                {col}
              </li>
            ))}
          </ul>
          <p className="font-medium text-slate-200"><span className="text-slate-400">)</span></p>
        </div>
      ))}
      <p className="text-sm text-slate-400 mt-4">
        Current Data State:
        {Object.keys(currentMockData).map(tableName => (
          <span key={`data-count-${tableName}`} className="ml-2">
            {tableName}: {currentMockData[tableName].length} rows
          </span>
        ))}
      </p>
    </div>
  );

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Experiment with SQL queries against a client-side mock database."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* SQL Input */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Code className="w-6 h-6 text-indigo-400" />
              SQL Query
            </h2>
            <textarea
              className="w-full h-48 p-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-y"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              spellCheck="false"
            />
            <button
              onClick={handleRunQuery}
              disabled={isLoading}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Executing...' : 'Run Query'}
            </button>
          </div>

          {/* Query Result */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg flex-1">
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Table className="w-6 h-6 text-indigo-400" />
              Query Result
            </h2>
            {isLoading && (
              <div className="flex items-center justify-center h-32 text-slate-400">
                <svg className="animate-spin h-5 w-5 mr-3 text-indigo-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Executing query...
              </div>
            )}
            {!isLoading && queryResult && (
              typeof queryResult === 'string' ? (
                <p className="text-slate-300 font-mono whitespace-pre-wrap">{queryResult}</p>
              ) : (
                renderTable(queryResult)
              )
            )}
            {!isLoading && !queryResult && (
              <p className="text-slate-400">Run a query to see results here.</p>
            )}
          </div>
        </div>

        {/* Schema and Examples */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {renderSchema()}

          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-400" />
              Example Queries
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setSqlQuery('SELECT * FROM users;')}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors text-left w-full"
                >
                  SELECT * FROM users;
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSqlQuery("SELECT name, email FROM users WHERE age > 25;")}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors text-left w-full"
                >
                  SELECT name, email FROM users WHERE age &gt; 25;
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSqlQuery("INSERT INTO users (id, name, email, age) VALUES (3, 'Charlie', 'charlie@example.com', 28);")}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors text-left w-full"
                >
                  INSERT INTO users (id, name, email, age) VALUES (3, 'Charlie', 'charlie@example.com', 28);
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSqlQuery("UPDATE users SET email = 'alice.smith@example.com' WHERE id = 1;")}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors text-left w-full"
                >
                  UPDATE users SET email = 'alice.smith@example.com' WHERE id = 1;
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSqlQuery("DELETE FROM users WHERE id = 2;")}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors text-left w-full"
                >
                  DELETE FROM users WHERE id = 2;
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSqlQuery("SELECT name, price FROM products WHERE price < 100;")}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors text-left w-full"
                >
                  SELECT name, price FROM products WHERE price &lt; 100;
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;