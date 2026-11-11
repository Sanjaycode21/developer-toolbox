"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Terminal, Copy, X } from 'lucide-react';

// --- Sample Database ---
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

interface Order {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  order_date: string;
}

interface TableData {
  users: User[];
  products: Product[];
  orders: Order[];
}

const database: TableData = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
    { id: 4, name: 'David', email: 'david@example.com', age: 29 },
    { id: 5, name: 'Eve', email: 'eve@example.com', age: 22 },
  ],
  products: [
    { id: 101, name: 'Laptop', price: 1200, stock: 50 },
    { id: 102, name: 'Mouse', price: 25, stock: 200 },
    { id: 103, name: 'Keyboard', price: 75, stock: 150 },
    { id: 104, name: 'Monitor', price: 300, stock: 75 },
    { id: 105, name: 'Webcam', price: 50, stock: 120 },
  ],
  orders: [
    { id: 1001, user_id: 1, product_id: 101, quantity: 1, order_date: '2023-01-15' },
    { id: 1002, user_id: 2, product_id: 102, quantity: 2, order_date: '2023-01-16' },
    { id: 1003, user_id: 1, product_id: 103, quantity: 1, order_date: '2023-01-17' },
    { id: 1004, user_id: 3, product_id: 104, quantity: 1, order_date: '2023-01-18' },
    { id: 1005, user_id: 2, product_id: 101, quantity: 1, order_date: '2023-01-19' },
    { id: 1006, user_id: 4, product_id: 105, quantity: 3, order_date: '2023-01-20' },
    { id: 1007, user_id: 5, product_id: 102, quantity: 1, order_date: '2023-01-21' },
  ],
};

// --- SQL Parser & Executor (Simplified) ---
interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  message?: string;
}

/**
 * Very basic WHERE clause evaluator.
 * Supports: column = value, column > value, column < value, column LIKE '%value%'
 * Supports AND/OR (simple, left-to-right evaluation without operator precedence).
 */
function evaluateWhereClause(row: Record<string, any>, whereClause: string): boolean {
  const parts = whereClause.split(/\s+(and|or)\s+/i);
  let currentResult: boolean | null = null;
  let logicalOperator: 'and' | 'or' = 'and';

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();

    if (part.toLowerCase() === 'and') {
      logicalOperator = 'and';
      continue;
    }
    if (part.toLowerCase() === 'or') {
      logicalOperator = 'or';
      continue;
    }

    const match = part.match(/([a-z_]+)\s*([<>=]|like)\s*(.+)/i);
    if (!match) {
      throw new Error(`Invalid WHERE condition syntax: '${part}'`);
    }

    const [, column, op, valueStr] = match;
    const rowValue = row[column];
    let parsedValue: any = valueStr.trim();

    // Attempt to parse value (number, string)
    if (parsedValue.startsWith("'") && parsedValue.endsWith("'")) {
      parsedValue = parsedValue.slice(1, -1); // Remove quotes for string
    } else if (!isNaN(Number(parsedValue))) {
      parsedValue = Number(parsedValue); // Convert to number if possible
    }

    let conditionResult: boolean;
    switch (op.toLowerCase()) {
      case '=':
        conditionResult = rowValue == parsedValue; // Use == for type coercion
        break;
      case '>':
        conditionResult = rowValue > parsedValue;
        break;
      case '<':
        conditionResult = rowValue < parsedValue;
        break;
      case 'like':
        if (typeof rowValue !== 'string' || typeof parsedValue !== 'string') {
          throw new Error(`LIKE operator only works with strings. Column: ${column}`);
        }
        const pattern = parsedValue.replace(/%/g, '.*'); // Convert % to regex .*
        conditionResult = new RegExp(`^${pattern}$`, 'i').test(rowValue);
        break;
      default:
        throw new Error(`Unsupported operator: ${op}`);
    }

    if (currentResult === null) {
      currentResult = conditionResult;
    } else {
      if (logicalOperator === 'and') {
        currentResult = currentResult && conditionResult;
      } else { // 'or'
        currentResult = currentResult || conditionResult;
      }
    }
  }
  return currentResult ?? false;
}

function parseAndExecuteSql(sql: string, db: TableData): QueryResult | { error: string } {
  const startTime = performance.now();
  const lowerSql = sql.toLowerCase().trim();

  if (!lowerSql.startsWith('select')) {
    return { error: 'Only SELECT statements are supported.' };
  }

  // Regex to extract clauses: SELECT ... FROM ... [WHERE ...] [ORDER BY ...] [LIMIT ...]
  const selectMatch = lowerSql.match(/select\s+(.*?)\s+from\s+([a-z_]+)(?:\s+where\s+(.*?))?(?:\s+order by\s+(.*?))?(?:\s+limit\s+(\d+))?$/);

  if (!selectMatch) {
    return { error: 'Invalid SELECT statement syntax. Expected: SELECT columns FROM table [WHERE condition] [ORDER BY column [ASC|DESC]] [LIMIT N]' };
  }

  const [, columnsStr, tableName, whereClause, orderByClause, limitStr] = selectMatch;

  if (!(tableName in db)) {
    return { error: `Table '${tableName}' not found.` };
  }

  let data: Record<string, any>[] = [...db[tableName as keyof TableData]]; // Make a copy to avoid modifying original data

  // 1. Apply WHERE clause
  if (whereClause) {
    try {
      data = data.filter(row => evaluateWhereClause(row, whereClause));
    } catch (e: any) {
      return { error: `Error in WHERE clause: ${e.message}` };
    }
  }

  // 2. Apply ORDER BY clause
  if (orderByClause) {
    const [column, direction = 'asc'] = orderByClause.split(/\s+/);
    if (!data.length) {
      // If no data, sorting is irrelevant, but we still check column existence if data was present in original table
      const tableSchema = db[tableName as keyof TableData];
      if (tableSchema.length > 0 && !(column in tableSchema[0])) {
        return { error: `Column '${column}' not found for ORDER BY.` };
      }
    } else if (!(column in data[0])) {
      return { error: `Column '${column}' not found for ORDER BY.` };
    }

    data.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return direction === 'asc' ? (valA - valB) : (valB - valA);
    });
  }

  // 3. Apply LIMIT clause
  if (limitStr) {
    const limit = parseInt(limitStr, 10);
    if (!isNaN(limit) && limit >= 0) {
      data = data.slice(0, limit);
    }
  }

  // 4. Select columns
  const selectedColumns = columnsStr.split(',').map(c => c.trim());
  let finalRows: Record<string, any>[] = [];
  let finalColumns: string[] = [];

  if (selectedColumns.includes('*')) {
    if (data.length > 0) {
      finalColumns = Object.keys(data[0]);
      finalRows = data;
    } else {
      // If no data, but '*' was selected, infer columns from the table schema
      const tableSchema = db[tableName as keyof TableData];
      if (tableSchema && tableSchema.length > 0) {
        finalColumns = Object.keys(tableSchema[0]);
      } else {
        finalColumns = []; // No data, no schema to infer from
      }
      finalRows = [];
    }
  } else {
    finalColumns = selectedColumns;
    finalRows = data.map(row => {
      const newRow: Record<string, any> = {};
      selectedColumns.forEach(col => {
        if (!(col in row)) {
          throw new Error(`Column '${col}' not found in table '${tableName}'.`);
        }
        newRow[col] = row[col];
      });
      return newRow;
    });
  }

  const endTime = performance.now();
  const executionTime = (endTime - startTime).toFixed(2);

  return {
    columns: finalColumns,
    rows: finalRows,
    message: `Query executed in ${executionTime} ms. ${finalRows.length} rows returned.`,
  };
}


const SQLPlaygroundPage: React.FC = () => {
  const [sqlInput, setSqlInput] = useState<string>(`SELECT id, name, age FROM users WHERE age > 25 ORDER BY name ASC LIMIT 3;`);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const addToHistory = useToolStore((state) => state.addToHistory);

  const handleExecute = useCallback(() => {
    setQueryResult(null);
    setQueryError(null);
    addToHistory('sql-playground');

    try {
      const result = parseAndExecuteSql(sqlInput, database);
      if ('error' in result) {
        setQueryError(result.error);
        toast.error(result.error);
      } else {
        setQueryResult(result);
        toast.success(result.message || 'Query executed successfully!');
      }
    } catch (e: any) {
      setQueryError(e.message);
      toast.error(e.message);
    }
  }, [sqlInput, addToHistory]);

  const handleClear = useCallback(() => {
    setSqlInput('');
    setQueryResult(null);
    setQueryError(null);
  }, []);

  const handleCopyResults = useCallback(() => {
    if (queryResult && queryResult.rows.length > 0) {
      const header = queryResult.columns.join('\t');
      const rows = queryResult.rows.map(row =>
        queryResult.columns.map(col => row[col]).join('\t')
      ).join('\n');
      const fullResult = `${header}\n${rows}`;
      navigator.clipboard.writeText(fullResult)
        .then(() => toast.success('Results copied to clipboard!'))
        .catch(() => toast.error('Failed to copy results.'));
    } else {
      toast.error('No results to copy.');
    }
  }, [queryResult]);

  const tableSchemas = useMemo(() => {
    return Object.entries(database).map(([tableName, data]) => {
      if (data.length > 0) {
        return {
          name: tableName,
          columns: Object.keys(data[0]),
        };
      }
      // If table is empty, try to infer columns from type definitions if possible,
      // but for this simple setup, we'll just show empty.
      // For a real app, you'd have a separate schema definition.
      return { name: tableName, columns: [] };
    });
  }, []);

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute SQL queries against a sample in-memory database."
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Input and Controls */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="sql-input" className="text-sm font-medium text-slate-300">
              SQL Query
            </label>
            <textarea
              id="sql-input"
              className="w-full h-48 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 resize-y font-mono text-sm"
              value={sqlInput}
              onChange={(e) => setSqlInput(e.target.value)}
              placeholder="Enter your SQL query here (e.g., SELECT * FROM users;)"
              spellCheck="false"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExecute}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <Terminal size={18} />
              Execute Query
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <X size={18} />
              Clear
            </button>
          </div>

          {/* Schema Information */}
          <div className="mt-4 p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Available Tables & Schema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tableSchemas.map((table) => (
                <div key={table.name} className="bg-slate-900 p-3 rounded-md border border-slate-700">
                  <p className="font-mono text-indigo-400 text-sm mb-1">{table.name}</p>
                  <ul className="text-slate-400 text-xs list-disc list-inside">
                    {table.columns.length > 0 ? (
                      table.columns.map((col) => <li key={`${table.name}-${col}`}>{col}</li>)
                    ) : (
                      <li>No columns (table empty or schema not inferred)</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-200">Results</h2>

          {queryError && (
            <div className="p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg font-mono text-sm">
              <p className="font-bold mb-2">Error:</p>
              <pre className="whitespace-pre-wrap">{queryError}</pre>
            </div>
          )}

          {queryResult && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-400">{queryResult.message}</p>
                <button
                  onClick={handleCopyResults}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  <Copy size={16} />
                  Copy Results
                </button>
              </div>

              {queryResult.rows.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-800">
                      <tr>
                        {queryResult.columns.map((col) => (
                          <th
                            key={col}
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-slate-900 divide-y divide-slate-800">
                      {queryResult.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-800 transition-colors duration-150">
                          {queryResult.columns.map((col) => (
                            <td
                              key={`${rowIndex}-${col}`}
                              className="px-4 py-2 whitespace-nowrap text-sm text-slate-200 font-mono"
                            >
                              {String(row[col])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg text-sm">
                  No rows returned.
                </div>
              )}
            </div>
          )}

          {!queryResult && !queryError && (
            <div className="p-4 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg text-sm">
              Execute a query to see results here.
            </div>
          )}
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;