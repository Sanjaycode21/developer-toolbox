"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Code, Play } from 'lucide-react';

interface Row {
  [key: string]: any;
}

// Simplified in-memory database
const database: { [tableName: string]: Row[] } = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30, city: 'New York' },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24, city: 'Los Angeles' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35, city: 'Chicago' },
    { id: 4, name: 'David', email: 'david@example.com', age: 29, city: 'New York' },
    { id: 5, name: 'Eve', email: 'eve@example.com', age: 42, city: 'Houston' },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200, category: 'Electronics', stock: 50 },
    { id: 102, name: 'Mouse', price: 25, category: 'Electronics', stock: 200 },
    { id: 103, name: 'Keyboard', price: 75, category: 'Electronics', stock: 100 },
    { id: 104, name: 'Monitor', price: 300, category: 'Electronics', stock: 75 },
    { id: 105, name: 'Desk', price: 150, category: 'Furniture', stock: 30 },
    { id: 106, name: 'Chair', price: 80, category: 'Furniture', stock: 60 },
  ],
  orders: [
    { order_id: 1, user_id: 1, product_id: 101, quantity: 1, order_date: '2023-01-15' },
    { order_id: 2, user_id: 2, product_id: 102, quantity: 2, order_date: '2023-01-16' },
    { order_id: 3, user_id: 1, product_id: 103, quantity: 1, order_date: '2023-01-17' },
    { order_id: 4, user_id: 3, product_id: 105, quantity: 1, order_date: '2023-01-18' },
    { order_id: 5, user_id: 4, product_id: 104, quantity: 1, order_date: '2023-01-19' },
  ]
};

const initialQuery = `SELECT id, name, age FROM users WHERE age > 25;`;

const SQLPlaygroundPage = () => {
  const [sqlQuery, setSqlQuery] = useState<string>(initialQuery);
  const [queryResult, setQueryResult] = useState<Row[] | string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { addToHistory } = useToolStore();

  const handleRunQuery = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setQueryResult(null);
    addToHistory('sql-playground');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const result = executeSql(sqlQuery);
      setQueryResult(result);
      toast.success('Query executed successfully!');
    } catch (err: any) {
      setError(err.message);
      toast.error(`Query failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [sqlQuery, addToHistory]);

  const executeSql = (query: string): Row[] | string => {
    query = query.trim();

    // Very basic SELECT statement parsing
    const selectRegex = /SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i;
    const match = query.match(selectRegex);

    if (!match) {
      throw new Error("Unsupported SQL query. Only basic SELECT statements are supported.");
    }

    const [, columnsStr, tableName, whereClause] = match;

    if (!database[tableName.toLowerCase()]) {
      throw new Error(`Table '${tableName}' not found.`);
    }

    let data = [...database[tableName.toLowerCase()]]; // Clone to avoid modifying original data

    // Apply WHERE clause
    if (whereClause) {
      data = data.filter(row => {
        try {
          // Simple WHERE clause parsing: column OPERATOR value
          const whereMatch = whereClause.match(/(\w+)\s*([<>=!]+)\s*(.+)/);
          if (!whereMatch) {
            throw new Error("Invalid WHERE clause format.");
          }
          const [, colName, operator, valueStr] = whereMatch;
          const actualValue = row[colName];
          let expectedValue: any = valueStr.trim();

          // Attempt to parse numbers and booleans
          if (!isNaN(Number(expectedValue)) && !isNaN(parseFloat(expectedValue))) {
            expectedValue = Number(expectedValue);
          } else if (expectedValue.toLowerCase() === 'true') {
            expectedValue = true;
          } else if (expectedValue.toLowerCase() === 'false') {
            expectedValue = false;
          } else if (expectedValue.startsWith("'") && expectedValue.endsWith("'")) {
            expectedValue = expectedValue.slice(1, -1); // Remove quotes for string comparison
          } else if (expectedValue.startsWith('"') && expectedValue.endsWith('"')) {
            expectedValue = expectedValue.slice(1, -1); // Remove quotes for string comparison
          }

          switch (operator) {
            case '=': return actualValue == expectedValue; // Use == for type coercion
            case '!=': return actualValue != expectedValue;
            case '>': return actualValue > expectedValue;
            case '<': return actualValue < expectedValue;
            case '>=': return actualValue >= expectedValue;
            case '<=': return actualValue <= expectedValue;
            default: throw new Error(`Unsupported operator: ${operator}`);
          }
        } catch (e: any) {
          console.error("Error evaluating WHERE clause:", e);
          throw new Error(`Error in WHERE clause: ${e.message}`);
        }
      });
    }

    // Select columns
    let selectedColumns: string[] = [];
    if (columnsStr.trim() === '*') {
      if (data.length > 0) {
        selectedColumns = Object.keys(data[0]);
      }
    } else {
      selectedColumns = columnsStr.split(',').map(col => col.trim());
      // Validate selected columns exist in the table
      if (data.length > 0) {
        const availableColumns = Object.keys(data[0]);
        for (const col of selectedColumns) {
          if (!availableColumns.includes(col)) {
            throw new Error(`Column '${col}' not found in table '${tableName}'.`);
          }
        }
      }
    }

    const finalResult = data.map(row => {
      const newRow: Row = {};
      for (const col of selectedColumns) {
        newRow[col] = row[col];
      }
      return newRow;
    });

    return finalResult;
  };

  const renderTable = useMemo(() => {
    if (!queryResult || typeof queryResult === 'string' || queryResult.length === 0) {
      return null;
    }

    const headers = Object.keys(queryResult[0]);

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
            {queryResult.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                {headers.map((header) => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                    {String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [queryResult]);

  const renderSchemaInfo = useMemo(() => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-sm text-slate-300">
      <h3 className="font-semibold text-base text-slate-100 mb-2 flex items-center gap-2">
        <Code className="w-4 h-4 text-indigo-400" />
        Available Tables & Schema
      </h3>
      {Object.entries(database).map(([tableName, rows]) => (
        <div key={tableName} className="mb-3">
          <p className="font-medium text-indigo-300">{tableName.toUpperCase()}</p>
          {rows.length > 0 && (
            <ul className="list-disc list-inside ml-4 text-slate-400">
              {Object.keys(rows[0]).map(col => (
                <li key={`${tableName}-${col}`}>{col} ({typeof rows[0][col]})</li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <p className="mt-4 text-xs text-slate-500">
        Note: This is a simplified client-side SQL playground. Only basic SELECT queries with WHERE clauses (using =, !=, &lt;, &gt;, &lt;=, &gt;=) are supported.
      </p>
    </div>
  ), []);

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute and test SQL queries against a simulated in-memory database."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="sql-input" className="text-sm font-medium text-slate-300">
              SQL Query
            </label>
            <textarea
              id="sql-input"
              className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm resize-y"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              spellCheck="false"
            />
            <button
              onClick={handleRunQuery}
              className="mt-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running Query...
                </span>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Query
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-slate-100">Query Result</h2>
            <div className="min-h-[200px] bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col">
              {isLoading && (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <svg className="animate-spin h-5 w-5 mr-3 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading results...
                </div>
              )}
              {!isLoading && error && (
                <div className="text-red-400 bg-red-900/20 p-3 rounded-md border border-red-800">
                  <p className="font-medium">Error:</p>
                  <pre className="whitespace-pre-wrap text-sm">{error}</pre>
                </div>
              )}
              {!isLoading && !error && queryResult && typeof queryResult !== 'string' && queryResult.length > 0 && renderTable}
              {!isLoading && !error && queryResult && typeof queryResult !== 'string' && queryResult.length === 0 && (
                <div className="text-slate-400 text-center py-8">No results found.</div>
              )}
              {!isLoading && !error && !queryResult && (
                <div className="text-slate-400 text-center py-8">Run a query to see results here.</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {renderSchemaInfo}
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;