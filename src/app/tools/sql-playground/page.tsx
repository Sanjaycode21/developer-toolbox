'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Loader2, Play, RotateCcw } from 'lucide-react';

// Define a simple in-memory database structure for demonstration
interface Row {
  [key: string]: any;
}

interface Table {
  columns: string[];
  data: Row[];
}

interface Database {
  [tableName: string]: Table;
}

const initialDatabase: Database = {
  users: {
    columns: ['id', 'name', 'email'],
    data: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' },
    ],
  },
  products: {
    columns: ['product_id', 'product_name', 'price'],
    data: [
      { product_id: 101, product_name: 'Laptop', price: 1200 },
      { product_id: 102, product_name: 'Mouse', price: 25 },
      { product_id: 103, product_name: 'Keyboard', price: 75 },
    ],
  },
};

export default function SqlPlaygroundPage() {
  const toolSlug = "sql-playground";
  const { addToHistory } = useToolStore();

  const [sqlQuery, setSqlQuery] = useState<string>(`SELECT * FROM users;`);
  const [queryResult, setQueryResult] = useState<Table | string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [database, setDatabase] = useState<Database>(initialDatabase); // Use state for database to allow modifications

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleRunQuery = useCallback(async () => {
    setIsLoading(true);
    setQueryResult(null); // Clear previous results

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const normalizedQuery = sqlQuery.trim().toLowerCase();

    try {
      if (normalizedQuery.startsWith('select')) {
        const match = normalizedQuery.match(/from\s+(\w+)/);
        if (match && match[1]) {
          const tableName = match[1];
          if (database[tableName]) {
            setQueryResult(database[tableName]);
            toast.success(`Query executed successfully on table '${tableName}'.`);
          } else {
            setQueryResult(`Error: Table '${tableName}' not found.`);
            toast.error(`Error: Table '${tableName}' not found.`);
          }
        } else {
          setQueryResult("Error: Invalid SELECT query format. Try 'SELECT * FROM <tableName>'.");
          toast.error("Error: Invalid SELECT query format.");
        }
      } else if (normalizedQuery.startsWith('insert into')) {
        const match = normalizedQuery.match(/insert into\s+(\w+)\s+values\s*\((.*)\)/);
        if (match && match[1] && match[2]) {
          const tableName = match[1];
          const valuesString = match[2];
          if (database[tableName]) {
            // Very basic parsing of values - assumes simple comma-separated values
            const values = valuesString.split(',').map(v => {
              const trimmed = v.trim();
              if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
                return trimmed.slice(1, -1); // Remove quotes for strings
              }
              return isNaN(Number(trimmed)) ? trimmed : Number(trimmed); // Convert numbers
            });

            // Check if number of values matches number of columns
            if (values.length !== database[tableName].columns.length) {
              throw new Error(`Column count mismatch. Expected ${database[tableName].columns.length} values, got ${values.length}.`);
            }

            // Create a new row object based on table columns
            const newRow: Row = {};
            database[tableName].columns.forEach((col, index) => {
              newRow[col] = values[index];
            });

            // Update the database state
            setDatabase(prevDb => ({
              ...prevDb,
              [tableName]: {
                ...prevDb[tableName],
                data: [...prevDb[tableName].data, newRow],
              },
            }));
            setQueryResult(`Successfully inserted 1 row into '${tableName}'.`);
            toast.success(`Successfully inserted 1 row into '${tableName}'.`);
          } else {
            setQueryResult(`Error: Table '${tableName}' not found for INSERT.`);
            toast.error(`Error: Table '${tableName}' not found.`);
          }
        } else {
          setQueryResult("Error: Invalid INSERT query format. Try 'INSERT INTO <tableName> VALUES (value1, value2, ...)'");
          toast.error("Error: Invalid INSERT query format.");
        }
      } else if (normalizedQuery.startsWith('update')) {
        setQueryResult("Update query simulated: 1 row affected.");
        toast.success("Update query simulated: 1 row affected.");
      } else if (normalizedQuery.startsWith('delete')) {
        setQueryResult("Delete query simulated: 1 row affected.");
        toast.success("Delete query simulated: 1 row affected.");
      } else if (normalizedQuery.startsWith('create table')) {
        setQueryResult("CREATE TABLE query simulated: Table created.");
        toast.success("CREATE TABLE query simulated: Table created.");
      } else if (normalizedQuery.startsWith('drop table')) {
        setQueryResult("DROP TABLE query simulated: Table dropped.");
        toast.success("DROP TABLE query simulated: Table dropped.");
      }
      else {
        setQueryResult("Error: Unsupported SQL command or invalid syntax for this playground.");
        toast.error("Error: Unsupported SQL command or invalid syntax.");
      }
    } catch (error: any) {
      setQueryResult(`Execution Error: ${error.message}`);
      toast.error(`Execution Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [sqlQuery, database]);

  const renderResult = useCallback(() => {
    if (!queryResult) return null;

    if (typeof queryResult === 'string') {
      return (
        <div className="bg-slate-800 p-4 rounded-lg text-red-400 font-mono text-sm whitespace-pre-wrap">
          {queryResult}
        </div>
      );
    }

    // Assume it's a Table object
    const { columns, data } = queryResult;

    if (data.length === 0) {
      return (
        <div className="bg-slate-800 p-4 rounded-lg text-slate-400 text-sm">
          No results found.
        </div>
      );
    }

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
          <tbody className="divide-y divide-slate-800 bg-slate-900">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                {columns.map((col) => (
                  <td key={`${rowIndex}-${col}`} className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
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

  const handleClear = useCallback(() => {
    setSqlQuery('');
    setQueryResult(null);
    toast.success('Editor cleared.');
  }, []);

  const handleResetDatabase = useCallback(() => {
    setDatabase(initialDatabase);
    setQueryResult(null);
    setSqlQuery(`SELECT * FROM users;`);
    toast.success('Database reset to initial state.');
  }, []);

  const handleExampleQuery = useCallback((query: string) => {
    setSqlQuery(query);
    setQueryResult(null);
    toast.success('Example query loaded.');
  }, []);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Experiment with SQL queries in an in-memory database environment. Note: This is a simplified simulation, not a full SQL engine."
    >
      <div className="flex flex-col space-y-6">
        {/* SQL Input Area */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="sql-input" className="text-sm font-medium text-slate-300">
            Enter SQL Query:
          </label>
          <textarea
            id="sql-input"
            className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-y"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="e.g., SELECT * FROM users;"
            spellCheck="false"
          />
          <div className="flex flex-wrap gap-3 mt-2">
            <button
              onClick={handleRunQuery}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !sqlQuery.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run Query
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors"
            >
              Clear Editor
            </button>
            <button
              onClick={handleResetDatabase}
              className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Database
            </button>
          </div>
        </div>

        {/* Example Queries */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-sm font-medium text-slate-300">Example Queries:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleExampleQuery('SELECT * FROM users;')}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors font-mono"
            >
              SELECT * FROM users;
            </button>
            <button
              onClick={() => handleExampleQuery('SELECT * FROM products;')}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors font-mono"
            >
              SELECT * FROM products;
            </button>
            <button
              onClick={() => handleExampleQuery(`INSERT INTO users VALUES (4, 'David', 'david@example.com');`)}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors font-mono"
            >
              INSERT INTO users...
            </button>
            <button
              onClick={() => handleExampleQuery(`UPDATE users SET email = 'alice.smith@example.com' WHERE id = 1;`)}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors font-mono"
            >
              UPDATE users...
            </button>
            <button
              onClick={() => handleExampleQuery(`DELETE FROM products WHERE product_id = 101;`)}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors font-mono"
            >
              DELETE FROM products...
            </button>
            <button
              onClick={() => handleExampleQuery(`CREATE TABLE orders (order_id INT, customer_id INT, order_date DATE);`)}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors font-mono"
            >
              CREATE TABLE orders...
            </button>
          </div>
        </div>

        {/* Query Result Area */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-slate-200">Result:</h2>
          <div className="min-h-[150px] bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Executing query...</p>
              </div>
            ) : queryResult ? (
              renderResult()
            ) : (
              <p className="text-slate-500">Run a query to see results here.</p>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}