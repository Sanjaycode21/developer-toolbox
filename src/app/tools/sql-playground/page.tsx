"use client";

import { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

// A very basic mock SQL engine for frontend simulation
// This function simulates SQL query execution and returns mock results.
// It does not actually parse or execute SQL against a real database.
const mockSQLEngine = (query: string, schema: string) => {
  const lowerQuery = query.toLowerCase().trim();
  const lowerSchema = schema.toLowerCase();

  if (lowerQuery === '') {
    return {
      columns: ['Error'],
      rows: [['Please enter a SQL query.']],
      message: 'No query provided.',
      error: true,
    };
  }

  // Simulate SELECT queries
  if (lowerQuery.startsWith('select')) {
    if (lowerQuery.includes('from users') && lowerSchema.includes('create table users')) {
      return {
        columns: ['id', 'name', 'email'],
        rows: [
          [1, 'Alice', 'alice@example.com'],
          [2, 'Bob', 'bob@example.com'],
          [3, 'Charlie', 'charlie@example.com'],
        ],
        message: 'SELECT query on users executed successfully.',
      };
    } else if (lowerQuery.includes('from products') && lowerSchema.includes('create table products')) {
      return {
        columns: ['product_id', 'product_name', 'price'],
        rows: [
          [101, 'Laptop', '1200.00'],
          [102, 'Mouse', '25.00'],
          [103, 'Keyboard', '75.00'],
        ],
        message: 'SELECT query on products executed successfully.',
      };
    } else {
      return {
        columns: ['Result'],
        rows: [['No matching data found for your SELECT query based on the defined schema.']],
        message: 'SELECT query executed, but no data found.',
      };
    }
  }
  // Simulate DDL (CREATE TABLE)
  else if (lowerQuery.startsWith('create table')) {
    const tableNameMatch = /create table (\w+)/.exec(lowerQuery);
    const tableName = tableNameMatch ? tableNameMatch[1] : 'unknown_table';
    return {
      columns: ['Status'],
      rows: [[`Table '${tableName}' created (simulated).`]],
      message: `CREATE TABLE statement for '${tableName}' processed.`,
    };
  }
  // Simulate DML (INSERT, UPDATE, DELETE)
  else if (lowerQuery.startsWith('insert into')) {
    const tableNameMatch = /insert into (\w+)/.exec(lowerQuery);
    const tableName = tableNameMatch ? tableNameMatch[1] : 'unknown_table';
    return {
      columns: ['Status'],
      rows: [[`Row inserted into '${tableName}' (simulated).`]],
      message: `INSERT INTO statement for '${tableName}' processed.`,
    };
  } else if (lowerQuery.startsWith('update')) {
    const tableNameMatch = /update (\w+)/.exec(lowerQuery);
    const tableName = tableNameMatch ? tableNameMatch[1] : 'unknown_table';
    return {
      columns: ['Status'],
      rows: [[`Rows updated in '${tableName}' (simulated).`]],
      message: `UPDATE statement for '${tableName}' processed.`,
    };
  } else if (lowerQuery.startsWith('delete from')) {
    const tableNameMatch = /delete from (\w+)/.exec(lowerQuery);
    const tableName = tableNameMatch ? tableNameMatch[1] : 'unknown_table';
    return {
      columns: ['Status'],
      rows: [[`Rows deleted from '${tableName}' (simulated).`]],
      message: `DELETE statement for '${tableName}' processed.`,
    };
  }
  // Generic statement
  else {
    return {
      columns: ['Status'],
      rows: [['Generic SQL statement processed (simulated).']],
      message: 'Query executed successfully.',
    };
  }
};

export default function SqlPlaygroundPage() {
  const toolSlug = "sql-playground";
  const toolName = "SQL Playground";
  const description = "Write, test, and visualize SQL queries with a mock database engine.";

  const addToHistory = useToolStore((state) => state.addToHistory);

  const [sqlQuery, setSqlQuery] = useState(`SELECT * FROM users;`);
  const [schemaDefinition, setSchemaDefinition] = useState(`CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE
);

INSERT INTO users (id, name, email) VALUES
(1, 'Alice', 'alice@example.com'),
(2, 'Bob', 'bob@example.com'),
(3, 'Charlie', 'charlie@example.com');

CREATE TABLE products (
  product_id INT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2)
);

INSERT INTO products (product_id, product_name, price) VALUES
(101, 'Laptop', 1200.00),
(102, 'Mouse', 25.00),
(103, 'Keyboard', 75.00);`);
  const [queryResults, setQueryResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'query' | 'schema' | 'results'>('query');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleRunQuery = useCallback(() => {
    setIsLoading(true);
    setQueryResults(null); // Clear previous results
    setTimeout(() => { // Simulate network delay
      const results = mockSQLEngine(sqlQuery, schemaDefinition);
      setQueryResults(results);
      setIsLoading(false);
      if (results.error) {
        toast.error(results.message || 'An error occurred during query execution.');
      } else {
        toast.success(results.message || 'Query executed successfully.');
      }
      setActiveTab('results'); // Switch to results tab automatically
    }, 800);
  }, [sqlQuery, schemaDefinition]);

  const renderResultsTable = () => {
    if (!queryResults) {
      return <p className="text-slate-400">Run a query to see results.</p>;
    }
    if (queryResults.error) {
      return <p className="text-red-400 font-mono text-sm p-2 bg-red-900/20 rounded-md border border-red-700">{queryResults.rows[0][0]}</p>;
    }
    if (!queryResults.columns || queryResults.columns.length === 0) {
      return <p className="text-slate-400">No columns found in results.</p>;
    }
    if (!queryResults.rows || queryResults.rows.length === 0) {
      return <p className="text-slate-400">No rows found in results.</p>;
    }

    return (
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800">
            <tr>
              {queryResults.columns.map((col: string, index: number) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900">
            {queryResults.rows.map((row: any[], rowIndex: number) => (
              <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                {row.map((cell: any, cellIndex: number) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-slate-200 font-mono">
                    {String(cell)}
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
      toolName={toolName}
      description={description}
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left Panel: Query Editor / Schema */}
        <div className="flex-1 flex flex-col bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
          <div className="flex border-b border-slate-700">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'query'
                  ? 'bg-slate-700 text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:bg-slate-700'
              } transition-colors`}
              onClick={() => setActiveTab('query')}
            >
              Query Editor
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'schema'
                  ? 'bg-slate-700 text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:bg-slate-700'
              } transition-colors`}
              onClick={() => setActiveTab('schema')}
            >
              Schema Definition
            </button>
          </div>
          <div className="flex-1 p-4 relative">
            {activeTab === 'query' && (
              <textarea
                className="w-full h-full bg-slate-900 border border-slate-700 rounded-md p-3 text-sm font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Enter your SQL query here..."
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                spellCheck="false"
              />
            )}
            {activeTab === 'schema' && (
              <textarea
                className="w-full h-full bg-slate-900 border border-slate-700 rounded-md p-3 text-sm font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Define your mock database schema (e.g., CREATE TABLE, INSERT INTO statements)..."
                value={schemaDefinition}
                onChange={(e) => setSchemaDefinition(e.target.value)}
                spellCheck="false"
              />
            )}
          </div>
          <div className="p-4 border-t border-slate-700 bg-slate-800 flex justify-end">
            <button
              onClick={handleRunQuery}
              disabled={isLoading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running...
                </span>
              ) : (
                'Run Query'
              )}
            </button>
          </div>
        </div>

        {/* Right Panel: Results */}
        <div className="flex-1 flex flex-col bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
          <div className="flex border-b border-slate-700">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'results'
                  ? 'bg-slate-700 text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:bg-slate-700'
              } transition-colors`}
              onClick={() => setActiveTab('results')}
            >
              Query Results
            </button>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-slate-400">
                <svg className="animate-spin h-5 w-5 mr-3 text-indigo-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Executing query...
              </div>
            ) : (
              renderResultsTable()
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}