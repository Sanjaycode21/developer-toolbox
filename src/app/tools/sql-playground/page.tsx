"use client";

import React, { useState, useEffect } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";
import { Database, Table } from "lucide-react"; // Using Database icon

interface SampleUser {
  id: number;
  name: string;
  email: string;
  age: number;
}

interface SampleProduct {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface SampleData {
  users: SampleUser[];
  products: SampleProduct[];
}

const sampleData: SampleData = {
  users: [
    { id: 1, name: "Alice", email: "alice@example.com", age: 30 },
    { id: 2, name: "Bob", email: "bob@example.com", age: 24 },
    { id: 3, name: "Charlie", email: "charlie@example.com", age: 35 },
    { id: 4, name: "Diana", email: "diana@example.com", age: 28 },
  ],
  products: [
    { id: 101, name: "Laptop", price: 1200, category: "Electronics" },
    { id: 102, name: "Mouse", price: 25, category: "Electronics" },
    { id: 103, name: "Keyboard", price: 75, category: "Electronics" },
    { id: 104, name: "Monitor", price: 300, category: "Electronics" },
    { id: 105, name: "Desk Chair", price: 150, category: "Furniture" },
  ],
};

const toolSlug = "sql-playground";
const toolName = "SQL Playground";
const description = "Simulate SQL queries against sample data.";

export default function SqlPlaygroundPage() {
  const [sqlQuery, setSqlQuery] = useState<string>(
    "SELECT * FROM users;\n-- Try 'SELECT * FROM products;'\n-- Or 'INSERT INTO users (id, name) VALUES (5, \"Eve\");'"
  );
  const [results, setResults] = useState<any[] | string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"query" | "schema">("query");

  const { addToHistory } = useToolStore();

  const handleExecuteQuery = () => {
    const query = sqlQuery.trim();
    if (!query) {
      setError("Please enter an SQL query.");
      setResults(null);
      toast.error("Query cannot be empty.");
      return;
    }

    addToHistory(toolSlug); // Add to history on execution attempt

    const lowerQuery = query.toLowerCase();
    setError(null); // Clear previous errors

    try {
      if (lowerQuery.startsWith("select * from")) {
        const match = lowerQuery.match(/select \* from (\w+)/);
        if (match && match[1]) {
          const tableName = match[1];
          if (sampleData[tableName as keyof SampleData]) {
            setResults(sampleData[tableName as keyof SampleData]);
            toast.success(`Selected from table '${tableName}'.`);
          } else {
            setError(`Table '${tableName}' not found in sample data.`);
            setResults(null);
            toast.error(`Table '${tableName}' not found.`);
          }
        } else {
          setError('Invalid SELECT statement format. Try "SELECT * FROM <table_name>".');
          setResults(null);
          toast.error("Invalid SELECT statement.");
        }
      } else if (
        lowerQuery.startsWith("insert into") ||
        lowerQuery.startsWith("update") ||
        lowerQuery.startsWith("delete from") ||
        lowerQuery.startsWith("create table") ||
        lowerQuery.startsWith("drop table")
      ) {
        setResults("Query executed successfully. (Simulated)");
        toast.success("DML/DDL query simulated successfully.");
      } else {
        setError("Unsupported SQL query. Only basic SELECT * FROM and DML/DDL statements are simulated.");
        setResults(null);
        toast.error("Unsupported SQL query.");
      }
    } catch (e: any) {
      setError(`An unexpected error occurred: ${e.message}`);
      setResults(null);
      toast.error("An unexpected error occurred.");
    }
  };

  const renderResults = () => {
    if (error) {
      return (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg font-mono text-sm">
          Error: {error}
        </div>
      );
    }

    if (results === null) {
      return (
        <div className="text-slate-500 text-center py-8">
          Execute a query to see results.
        </div>
      );
    }

    if (typeof results === "string") {
      return (
        <div className="bg-emerald-900/30 border border-emerald-700 text-emerald-300 p-4 rounded-lg font-mono text-sm">
          {results}
        </div>
      );
    }

    if (Array.isArray(results) && results.length > 0) {
      const headers = Object.keys(results[0]);
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
              {results.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-800 transition-colors">
                  {headers.map((header) => (
                    <td
                      key={`${rowIndex}-${header}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-slate-400"
                    >
                      {String(row[header])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="text-slate-500 text-center py-8">
        No results found.
      </div>
    );
  };

  const renderSchema = () => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 overflow-auto max-h-[calc(100vh-250px)]">
      <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
        <Table className="w-5 h-5 text-indigo-400" />
        Sample Database Schema
      </h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-slate-300 mb-2">users Table</h4>
          <pre className="bg-slate-900 p-3 rounded-md text-sm text-slate-400 font-mono overflow-x-auto">
            {JSON.stringify(
              {
                id: "INTEGER PRIMARY KEY",
                name: "TEXT",
                email: "TEXT UNIQUE",
                age: "INTEGER",
              },
              null,
              2
            )}
          </pre>
          <p className="text-xs text-slate-500 mt-1">
            Example data: {JSON.stringify(sampleData.users[0], null, 2).split('\n')[0] + '...'}
          </p>
        </div>
        <div>
          <h4 className="text-md font-medium text-slate-300 mb-2">products Table</h4>
          <pre className="bg-slate-900 p-3 rounded-md text-sm text-slate-400 font-mono overflow-x-auto">
            {JSON.stringify(
              {
                id: "INTEGER PRIMARY KEY",
                name: "TEXT",
                price: "REAL",
                category: "TEXT",
              },
              null,
              2
            )}
          </pre>
          <p className="text-xs text-slate-500 mt-1">
            Example data: {JSON.stringify(sampleData.products[0], null, 2).split('\n')[0] + '...'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left Panel: Query Editor / Schema */}
        <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-[calc(100vh-180px)]">
          <div className="flex border-b border-slate-700 mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "query"
                  ? "border-b-2 border-indigo-500 text-indigo-400"
                  : "text-slate-400 hover:text-slate-300"
              } transition-colors`}
              onClick={() => setActiveTab("query")}
            >
              Query Editor
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "schema"
                  ? "border-b-2 border-indigo-500 text-indigo-400"
                  : "text-slate-400 hover:text-slate-300"
              } transition-colors`}
              onClick={() => setActiveTab("schema")}
            >
              Schema
            </button>
          </div>

          {activeTab === "query" ? (
            <div className="flex flex-col flex-1">
              <textarea
                className="flex-1 w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-500"
                placeholder="Enter your SQL query here..."
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={10}
              />
              <button
                onClick={handleExecuteQuery}
                className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Database className="w-5 h-5" />
                Execute Query
              </button>
            </div>
          ) : (
            renderSchema()
          )}
        </div>

        {/* Right Panel: Results */}
        <div className="flex-1 flex flex-col min-h-[300px] lg:min-h-[calc(100vh-180px)]">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Table className="w-6 h-6 text-indigo-400" />
            Results
          </h2>
          <div className="flex-1 bg-slate-900 p-4 rounded-lg border border-slate-800 overflow-auto">
            {renderResults()}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}