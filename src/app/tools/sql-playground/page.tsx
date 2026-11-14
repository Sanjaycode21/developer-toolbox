"use client";

import React, { useState, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Database, Play, Loader2, ClipboardCopy } from 'lucide-react';

const SQL_PLAYGROUND_SLUG = "sql-playground";

const exampleSchema = `CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE
);

CREATE TABLE products (
  product_id INT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2)
);

INSERT INTO users (id, name, email) VALUES
(1, 'Alice Smith', 'alice@example.com'),
(2, 'Bob Johnson', 'bob@example.com'),
(3, 'Charlie Brown', 'charlie@example.com');

INSERT INTO products (product_id, product_name, price) VALUES
(101, 'Laptop', 1200.00),
(102, 'Mouse', 25.50),
(103, 'Keyboard', 75.00);
`;

const exampleQuery = `SELECT id, name, email FROM users WHERE id = 1;`;
const exampleSelectAll = `SELECT * FROM users;`;

export default function SqlPlaygroundPage() {
  const [sqlQuery, setSqlQuery] = useState<string>(exampleSelectAll);
  const [queryResult, setQueryResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { addToHistory } = useToolStore();

  useEffect(() => {
    addToHistory(SQL_PLAYGROUND_SLUG);
  }, [addToHistory]);

  // Mock SQL execution function
  const mockExecuteSql = async (query: string): Promise<string> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network/processing delay

    const lowerCaseQuery = query.toLowerCase().trim();
    let result: string;

    try {
      if (lowerCaseQuery.startsWith("select")) {
        if (lowerCaseQuery.includes("from users")) {
          const data = [
            { id: 1, name: "Alice Smith", email: "alice@example.com" },
            { id: 2, name: "Bob Johnson", email: "bob@example.com" },
            { id: 3, name: "Charlie Brown", email: "charlie@example.com" },
          ];
          result = JSON.stringify(data, null, 2);
        } else if (lowerCaseQuery.includes("from products")) {
          const data = [
            { product_id: 101, product_name: "Laptop", price: 1200.00 },
            { product_id: 102, product_name: "Mouse", price: 25.50 },
            { product_id: 103, product_name: "Keyboard", price: 75.00 },
          ];
          result = JSON.stringify(data, null, 2);
        } else {
          result = "Mock Result: SELECT query executed. No specific data found for this table.";
        }
      } else if (lowerCaseQuery.startsWith("create table")) {
        result = "Mock Result: Table created successfully.";
      } else if (lowerCaseQuery.startsWith("insert into")) {
        result = "Mock Result: Data inserted successfully.";
      } else if (lowerCaseQuery.startsWith("update")) {
        result = "Mock Result: Data updated successfully.";
      } else if (lowerCaseQuery.startsWith("delete")) {
        result = "Mock Result: Data deleted successfully.";
      } else if (lowerCaseQuery.startsWith("drop table")) {
        result = "Mock Result: Table dropped successfully.";
      } else {
        throw new Error("Unsupported or invalid SQL query for this playground.");
      }
      toast.success("Query executed successfully!");
    } catch (error: any) {
      result = `Mock Error: ${error.message || "An unknown error occurred."}`;
      toast.error("Query execution failed.");
    } finally {
      setIsLoading(false);
    }
    return result;
  };

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) {
      setQueryResult("Please enter an SQL query to execute.");
      toast.error("Query cannot be empty.");
      return;
    }
    const result = await mockExecuteSql(sqlQuery);
    setQueryResult(result);
  };

  const handleCopyResult = () => {
    if (queryResult) {
      navigator.clipboard.writeText(queryResult);
      toast.success("Result copied to clipboard!");
    } else {
      toast.error("No result to copy.");
    }
  };

  return (
    <ToolPageWrapper
      toolSlug={SQL_PLAYGROUND_SLUG}
      toolName="SQL Playground"
      description="Execute and test SQL queries directly in your browser with a mock database."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Query Input Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-200">SQL Query</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSqlQuery(exampleSchema)}
                className="px-3 py-1.5 text-sm font-medium rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors border border-slate-600"
              >
                Load Schema
              </button>
              <button
                onClick={() => setSqlQuery(exampleQuery)}
                className="px-3 py-1.5 text-sm font-medium rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors border border-slate-600"
              >
                Load Example Query
              </button>
            </div>
          </div>
          <textarea
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            rows={10}
          />
          <button
            onClick={handleRunQuery}
            disabled={isLoading}
            className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-2.5 text-lg font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Executing...
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Run Query
              </>
            )}
          </button>
        </div>

        {/* Results Output Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-200">Results</h2>
            <button
              onClick={handleCopyResult}
              disabled={!queryResult}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ClipboardCopy className="h-4 w-4" /> Copy
            </button>
          </div>
          <div className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm overflow-auto relative">
            {queryResult ? (
              <pre className="whitespace-pre-wrap break-words">{queryResult}</pre>
            ) : (
              <div className="text-slate-500 flex items-center justify-center h-full">
                <Database className="h-8 w-8 mr-2" />
                <p>Results will appear here after execution.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}