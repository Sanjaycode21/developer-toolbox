"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react'; // Using Loader2 for spinner

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
  category: string;
}

interface Order {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  orderDate: string;
}

const users: User[] = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', age: 30 },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', age: 24 },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 35 },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', age: 28 },
  { id: 5, name: 'Eve Adams', email: 'eve@example.com', age: 42 },
];

const products: Product[] = [
  { id: 101, name: 'Laptop', price: 1200, category: 'Electronics' },
  { id: 102, name: 'Mouse', price: 25, category: 'Electronics' },
  { id: 103, name: 'Keyboard', price: 75, category: 'Electronics' },
  { id: 104, name: 'Monitor', price: 300, category: 'Electronics' },
  { id: 105, name: 'Desk Chair', price: 150, category: 'Furniture' },
  { id: 106, name: 'Coffee Mug', price: 10, category: 'Kitchen' },
];

const orders: Order[] = [
  { id: 1001, userId: 1, productId: 101, quantity: 1, orderDate: '2023-01-15' },
  { id: 1002, userId: 2, productId: 102, quantity: 2, orderDate: '2023-01-16' },
  { id: 1003, userId: 1, productId: 103, quantity: 1, orderDate: '2023-01-17' },
  { id: 1004, userId: 3, productId: 104, quantity: 1, orderDate: '2023-01-18' },
  { id: 1005, userId: 2, productId: 105, quantity: 1, orderDate: '2023-01-19' },
  { id: 1006, userId: 4, productId: 106, quantity: 3, orderDate: '2023-01-20' },
  { id: 1007, userId: 5, productId: 101, quantity: 1, orderDate: '2023-01-21' },
];

const database: Record<string, any[]> = {
  users,
  products,
  orders,
};

const schema: Record<string, Record<string, string>> = {
  users: { id: 'number', name: 'string', email: 'string', age: 'number' },
  products: { id: 'number', name: 'string', price: 'number', category: 'string' },
  orders: { id: 'number', userId: 'number', productId: 'number', quantity: 'number', orderDate: 'string' },
};

const SQLPlayground: React.FC = () => {
  const toolSlug = "sql-playground";
  const addToHistory = useToolStore((state) => state.addToHistory);

  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM users;');
  const [queryResult, setQueryResult] = useState<any[] | string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'query' | 'schema'>('query');

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const parseAndExecuteQuery = useCallback((query: string): any[] | string => {
    const normalizedQuery = query.trim();
    const selectMatch = normalizedQuery.match(/^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?$/i);

    if (!selectMatch) {
      return "Error: Only basic SELECT statements are supported. Format: SELECT <columns> FROM <table> [WHERE <condition>].";
    }

    const columnsStr = selectMatch[1].trim();
    const tableName = selectMatch[2].toLowerCase();
    const whereClause = selectMatch[3]?.trim() || '';

    if (!database[tableName]) {
      return `Error: Table '${tableName}' not found. Available tables: ${Object.keys(database).join(', ')}.`;
    }

    let data = [...database[tableName]]; // Create a shallow copy to filter

    // Handle WHERE clause
    if (whereClause) {
      try {
        data = data.filter(row => {
          // Simple WHERE clause parsing for single conditions
          const conditionMatch = whereClause.match(/(\w+)\s*([<>=!~]+)\s*(.+)/i);
          if (!conditionMatch) {
            throw new Error("Invalid WHERE clause format.");
          }

          const column = conditionMatch[1];
          const operator = conditionMatch[2];
          let value = conditionMatch[3].replace(/^['"]|['"]$/g, ''); // Remove quotes

          if (!(column in row)) {
            throw new Error(`Column '${column}' not found in table '${tableName}'.`);
          }

          const rowValue = row[column];
          let parsedValue: any = value;

          // Attempt to parse value to number if rowValue is a number
          if (typeof rowValue === 'number' && !isNaN(parseFloat(value))) {
            parsedValue = parseFloat(value);
          }

          switch (operator) {
            case '=': return rowValue == parsedValue;
            case '!=': return rowValue != parsedValue;
            case '>': return rowValue > parsedValue;
            case '<': return rowValue < parsedValue;
            case '>=': return rowValue >= parsedValue;
            case '<=': return rowValue <= parsedValue;
            case '~': // Simple LIKE operator
            case 'LIKE': return String(rowValue).toLowerCase().includes(String(parsedValue).toLowerCase());
            default: throw new Error(`Unsupported operator: ${operator}`);
          }
        });
      } catch (e: any) {
        return `Error in WHERE clause: ${e.message}`;
      }
    }

    // Handle column selection
    if (columnsStr === '*') {
      return data;
    } else {
      const selectedColumns = columnsStr.split(',').map(col => col.trim());
      const result = data.map(row => {
        const newRow: Record<string, any> = {};
        for (const col of selectedColumns) {
          if (col in row) {
            newRow[col] = row[col];
          } else {
            throw new Error(`Column '${col}' not found in table '${tableName}'.`);
          }
        }
        return newRow;
      });
      return result;
    }
  }, []);

  const handleExecuteQuery = useCallback(async () => {
    setIsLoading(true);
    setQueryResult(null); // Clear previous results
    setActiveTab('query');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const result = parseAndExecuteQuery(sqlQuery);
      if (typeof result === 'string') {
        setQueryResult(result);
        toast.error(result);
      } else {
        setQueryResult(result);
        toast.success(`Query executed successfully. ${result.length} row(s) returned.`);
      }
    } catch (error: any) {
      setQueryResult(`Execution Error: ${error.message}`);
      toast.error(`Execution Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [sqlQuery, parseAndExecuteQuery]);

  const renderTable = (data: any[]) => {
    if (data.length === 0) {
      return <p className="text-slate-400 text-sm">No results found.</p>;
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
                  className="px-4 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                {headers.map((header) => (
                  <td key={`${rowIndex}-${header}`} className="px-4 py-2 whitespace-nowrap text-sm text-slate-200">
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

  const renderSchema = () => (
    <div className="space-y-6">
      {Object.entries(schema).map(([tableName, tableSchema]) => (
        <div key={tableName} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">{tableName}</h3>
          <ul className="space-y-1">
            {Object.entries(tableSchema).map(([columnName, columnType]) => (
              <li key={`${tableName}-${columnName}`} className="text-sm text-slate-300">
                <span className="font-mono text-slate-200">{columnName}</span>: <span className="text-slate-400">{columnType}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Execute SQL queries against an in-memory database with sample data."
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Query Input and Controls */}
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex-1">
            <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-2">
              SQL Query
            </label>
            <textarea
              id="sql-query"
              className="w-full h-40 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-y"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              spellCheck="false"
            />
          </div>
          <button
            onClick={handleExecuteQuery}
            disabled={isLoading}
            className="w-full lg:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Execute Query
          </button>

          {/* Tabs for Results and Schema */}
          <div className="mt-6">
            <div className="flex border-b border-slate-700">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'query'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-slate-300'
                } transition-colors`}
                onClick={() => setActiveTab('query')}
              >
                Query Result
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'schema'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-slate-300'
                } transition-colors`}
                onClick={() => setActiveTab('schema')}
              >
                Database Schema
              </button>
            </div>

            <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-lg min-h-[200px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Executing query...
                </div>
              ) : activeTab === 'query' ? (
                queryResult === null ? (
                  <p className="text-slate-400 text-sm">Execute a query to see results here.</p>
                ) : typeof queryResult === 'string' ? (
                  <pre className="text-red-400 text-sm whitespace-pre-wrap font-mono">{queryResult}</pre>
                ) : (
                  renderTable(queryResult)
                )
              ) : (
                renderSchema()
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlayground;