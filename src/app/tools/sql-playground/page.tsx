"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Code, Table } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

const sampleData: { [key: string]: any[] } = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30, city: 'New York' },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 24, city: 'Los Angeles' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35, city: 'Chicago' },
    { id: 4, name: 'David', email: 'david@example.com', age: 29, city: 'New York' },
    { id: 5, name: 'Eve', email: 'eve@example.com', age: 42, city: 'Houston' },
    { id: 6, name: 'Frank', email: 'frank@example.com', age: 28, city: 'New York' },
    { id: 7, name: 'Grace', email: 'grace@example.com', age: 31, city: 'Los Angeles' },
  ] as User[],
  products: [
    { id: 101, name: 'Laptop', price: 1200, category: 'Electronics', stock: 50 },
    { id: 102, name: 'Mouse', price: 25, category: 'Electronics', stock: 200 },
    { id: 103, name: 'Keyboard', price: 75, category: 'Electronics', stock: 150 },
    { id: 104, name: 'Desk Chair', price: 300, category: 'Furniture', stock: 30 },
    { id: 105, name: 'Monitor', price: 400, category: 'Electronics', stock: 70 },
    { id: 106, name: 'Webcam', price: 60, category: 'Electronics', stock: 100 },
    { id: 107, name: 'Headphones', price: 150, category: 'Electronics', stock: 80 },
  ] as Product[],
};

type ActiveTab = 'query' | 'schema';

const SQLPlaygroundPage = () => {
  const [query, setQuery] = useState<string>(`SELECT * FROM users WHERE age > 30 ORDER BY name ASC LIMIT 3;`);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('query');

  const { addToHistory } = useToolStore();

  useEffect(() => {
    addToHistory('sql-playground');
  }, [addToHistory]);

  const executeSql = useCallback((sql: string): { data: any[] | null; error: string | null } => {
    sql = sql.trim().toLowerCase();

    // 1. Basic SELECT FROM parsing
    const selectFromMatch = sql.match(/select\s+(.+?)\s+from\s+([a-z_]+)/);
    if (!selectFromMatch) {
      return { data: null, error: "Invalid SELECT FROM statement. Expected 'SELECT <columns> FROM <table>'." };
    }

    const selectedColumnsStr = selectFromMatch[1].trim();
    const tableName = selectFromMatch[2].trim();

    if (!sampleData[tableName]) {
      return { data: null, error: `Table '${tableName}' not found. Available tables: ${Object.keys(sampleData).join(', ')}.` };
    }

    let currentData = [...sampleData[tableName]]; // Work on a copy

    // 2. WHERE clause
    const whereRegex = /where\s+(.+?)(?:\s+order by|\s+limit|$)/;
    const whereMatch = sql.match(whereRegex);
    if (whereMatch) {
      const whereClause = whereMatch[1].trim();
      // Very basic WHERE parsing: column operator value (e.g., age > 30, name = 'Alice')
      const conditionMatch = whereClause.match(/([a-z_]+)\s*([<>=!]+)\s*(.+)/);
      if (conditionMatch) {
        const column = conditionMatch[1];
        const operator = conditionMatch[2];
        let value: any = conditionMatch[3].replace(/^'|'$/g, ''); // Remove quotes for strings
        if (!isNaN(Number(value)) && !isNaN(parseFloat(value))) {
          value = Number(value); // Convert to number if it's a number
        }

        currentData = currentData.filter(row => {
          const rowValue = row[column];
          if (rowValue === undefined) return false; // Column not found in row

          switch (operator) {
            case '=': return rowValue == value;
            case '!=': return rowValue != value;
            case '>': return rowValue > value;
            case '<': return rowValue < value;
            case '>=': return rowValue >= value;
            case '<=': return rowValue <= value;
            default: return false; // Unsupported operator
          }
        });
      } else {
        return { data: null, error: "Unsupported WHERE clause format. Try 'column operator value' (e.g., 'age > 30')." };
      }
    }

    // 3. ORDER BY clause
    const orderByMatch = sql.match(/order by\s+([a-z_]+)(?:\s+(asc|desc))?/);
    if (orderByMatch) {
      const orderByColumn = orderByMatch[1];
      const orderDirection = orderByMatch[2] || 'asc'; // Default to ASC

      if (currentData.length > 0 && !currentData[0].hasOwnProperty(orderByColumn)) {
        return { data: null, error: `Column '${orderByColumn}' not found for ORDER BY in table '${tableName}'.` };
      }

      currentData.sort((a, b) => {
        const valA = a[orderByColumn];
        const valB = b[orderByColumn];

        if (valA < valB) return orderDirection === 'asc' ? -1 : 1;
        if (valA > valB) return orderDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // 4. LIMIT clause
    const limitMatch = sql.match(/limit\s+(\d+)/);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1], 10);
      currentData = currentData.slice(0, limit);
    }

    // 5. Column selection
    let finalResults: any[] = [];
    if (selectedColumnsStr === '*') {
      finalResults = currentData;
    } else {
      const selectedColumns = selectedColumnsStr.split(',').map(col => col.trim());
      finalResults = currentData.map(row => {
        const newRow: any = {};
        let foundAnyColumn = false;
        for (const col of selectedColumns) {
          if (row.hasOwnProperty(col)) {
            newRow[col] = row[col];
            foundAnyColumn = true;
          }
        }
        if (!foundAnyColumn && selectedColumns.length > 0) {
          // If no selected column was found in a row, it might indicate an issue
          // For now, we'll just return an empty object for that row or skip it.
          // A more robust parser might throw an error here.
        }
        return newRow;
      });

      // Check if all selected columns were actually missing from the data
      if (selectedColumns.length > 0 && finalResults.every(row => Object.keys(row).length === 0)) {
        return { data: null, error: `One or more selected columns (${selectedColumns.join(', ')}) not found in table '${tableName}'.` };
      }
    }

    return { data: finalResults, error: null };
  }, []);

  const handleExecute = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const { data, error: execError } = executeSql(query);
      if (execError) {
        setError(execError);
        toast.error(execError);
      } else {
        setResults(data);
        toast.success('Query executed successfully!');
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred during query execution.');
      toast.error(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [query, executeSql]);

  const getColumnType = (value: any): string => {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'boolean') return 'boolean';
    if (value === null) return 'null';
    return 'any';
  };

  const renderSchema = () => (
    <div className="space-y-6">
      {Object.entries(sampleData).map(([tableName, rows]) => (
        <div key={tableName} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-indigo-400 mb-3 flex items-center gap-2">
            <Table className="w-5 h-5" /> Table: <span className="text-slate-100">{tableName}</span>
          </h3>
          {rows.length > 0 ? (
            <ul className="space-y-1 text-sm text-slate-300">
              {Object.keys(rows[0]).map(columnName => (
                <li key={`${tableName}-${columnName}`} className="flex items-center gap-2">
                  <span className="font-mono text-slate-400">{columnName}</span>
                  <span className="text-slate-500">-</span>
                  <span className="text-emerald-400">{getColumnType(rows[0][columnName])}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-sm">No data available for this table to infer schema.</p>
          )}
        </div>
      ))}
    </div>
  );

  const renderResults = () => {
    if (isLoading) {
      return <div className="text-slate-400 text-center py-8">Executing query...</div>;
    }
    if (error) {
      return (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg font-mono text-sm">
          <p className="font-semibold mb-2">Error:</p>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      );
    }
    if (!results || results.length === 0) {
      return <div className="text-slate-400 text-center py-8">No results to display.</div>;
    }

    const columns = Object.keys(results[0]);

    return (
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700 bg-slate-900">
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
            {results.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                {columns.map((col, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-slate-400"
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
  };

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute and test SQL queries against a sample in-memory database. Supports basic SELECT, WHERE, ORDER BY, and LIMIT clauses."
    >
      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Query Input & Schema */}
        <div className="flex-1 flex flex-col space-y-6">
          <div className="flex border-b border-slate-700">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'query'
                  ? 'text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
              onClick={() => setActiveTab('query')}
            >
              <Code className="inline-block w-4 h-4 mr-2" /> Query
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'schema'
                  ? 'text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
              onClick={() => setActiveTab('schema')}
            >
              <Table className="inline-block w-4 h-4 mr-2" /> Schema
            </button>
          </div>

          {activeTab === 'query' && (
            <div className="flex-1 flex flex-col space-y-4">
              <textarea
                className="w-full flex-1 min-h-[200px] lg:min-h-[300px] bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-200 font-mono text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-y"
                placeholder="Enter your SQL query here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                spellCheck="false"
              />
              <button
                onClick={handleExecute}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Executing...' : 'Execute Query'}
              </button>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {renderSchema()}
            </div>
          )}
        </div>

        {/* Results Display */}
        <div className="flex-1 flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">Results</h2>
          <div className="flex-1 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
            {renderResults()}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;