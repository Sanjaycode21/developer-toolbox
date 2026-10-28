"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";

interface Row {
  [key: string]: string | number | boolean | null;
}

interface Table {
  [tableName: string]: Row[];
}

const initialDatabase: Table = {
  users: [
    { id: 1, name: "Alice", email: "alice@example.com", age: 30, city: "New York" },
    { id: 2, name: "Bob", email: "bob@example.com", age: 24, city: "Los Angeles" },
    { id: 3, name: "Charlie", email: "charlie@example.com", age: 35, city: "Chicago" },
    { id: 4, name: "David", email: "david@example.com", age: 28, city: "New York" },
    { id: 5, name: "Eve", email: "eve@example.com", age: 42, city: "Houston" },
  ],
  products: [
    { id: 101, name: "Laptop", price: 1200, category: "Electronics", stock: 50 },
    { id: 102, name: "Mouse", price: 25, category: "Electronics", stock: 200 },
    { id: 103, name: "Keyboard", price: 75, category: "Electronics", stock: 150 },
    { id: 104, name: "Monitor", price: 300, category: "Electronics", stock: 80 },
    { id: 105, name: "Desk Chair", price: 150, category: "Furniture", stock: 100 },
    { id: 106, name: "Webcam", price: 50, category: "Electronics", stock: 120 },
  ],
};

const sampleQueries = [
  "SELECT * FROM users;",
  "SELECT name, email FROM users WHERE age > 25 ORDER BY name;",
  "SELECT * FROM products WHERE category = 'Electronics' ORDER BY price DESC;",
  "SELECT name, price FROM products WHERE stock < 100;",
  "SELECT id, name, age, city FROM users WHERE city = 'New York';",
];

export default function SqlPlaygroundPage() {
  const [database, setDatabase] = useState<Table>(initialDatabase);
  const [sqlQuery, setSqlQuery] = useState<string>(sampleQueries[0]);
  const [queryResult, setQueryResult] = useState<Row[] | null>(null);
  const [queryColumns, setQueryColumns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { addToHistory } = useToolStore();

  useEffect(() => {
    addToHistory("sql-playground");
  }, [addToHistory]);

  const executeSql = useCallback(() => {
    setError(null);
    setQueryResult(null);
    setQueryColumns([]);

    const query = sqlQuery.trim();
    if (!query) {
      setError("Please enter an SQL query.");
      toast.error("Please enter an SQL query.");
      return;
    }

    // Very basic SELECT statement parsing
    const selectMatch = query.match(
      /SELECT\s+(.*?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.*?))?(?:\s+ORDER BY\s+(.*?))?(?:\s+LIMIT\s+(\d+))?/i
    );

    if (!selectMatch) {
      setError("Invalid SELECT query format. Only basic SELECT, FROM, WHERE, ORDER BY, LIMIT are supported.");
      toast.error("Invalid SELECT query format.");
      return;
    }

    const [, columnsStr, tableName, whereClause, orderByClause, limitStr] = selectMatch;

    if (!database[tableName.toLowerCase()]) {
      setError(`Table '${tableName}' not found.`);
      toast.error(`Table '${tableName}' not found.`);
      return;
    }

    let rows = [...database[tableName.toLowerCase()]];

    // Apply WHERE clause
    if (whereClause) {
      try {
        // Supports single condition: column = 'value' or column = number
        const conditionMatch = whereClause.match(/(\w+)\s*([<>=!]+)\s*(?:'([^']*)'|(\d+))/i);
        if (conditionMatch) {
          const [, colName, operator, stringValue, numValue] = conditionMatch;
          const value: string | number = stringValue !== undefined ? stringValue : parseFloat(numValue);

          rows = rows.filter((row) => {
            const rowValue = row[colName];
            if (rowValue === undefined) return false; // Column not found in row

            switch (operator) {
              case "=":
                return rowValue == value;
              case "!=":
                return rowValue != value;
              case ">":
                return typeof rowValue === 'number' && typeof value === 'number' && rowValue > value;
              case "<":
                return typeof rowValue === 'number' && typeof value === 'number' && rowValue < value;
              case ">=":
                return typeof rowValue === 'number' && typeof value === 'number' && rowValue >= value;
              case "<=":
                return typeof rowValue === 'number' && typeof value === 'number' && rowValue <= value;
              default:
                return false;
            }
          });
        } else {
          setError("Unsupported WHERE clause format. Only 'column = value' or 'column > value' etc. is supported.");
          toast.error("Unsupported WHERE clause format.");
          return;
        }
      } catch (e: any) {
        setError(`Error in WHERE clause: ${e.message}`);
        toast.error(`Error in WHERE clause: ${e.message}`);
        return;
      }
    }

    // Apply ORDER BY clause
    if (orderByClause) {
      try {
        const orderByParts = orderByClause.trim().split(/\s+/);
        const colName = orderByParts[0];
        const direction = orderByParts[1]?.toUpperCase() || "ASC"; // Default to ASC

        rows.sort((a, b) => {
          const valA = a[colName];
          const valB = b[colName];

          if (valA === undefined || valB === undefined) {
            // Handle cases where column might not exist in all rows
            return 0;
          }

          if (typeof valA === "string" && typeof valB === "string") {
            return direction === "DESC" ? valB.localeCompare(valA) : valA.localeCompare(valB);
          }
          if (typeof valA === "number" && typeof valB === "number") {
            return direction === "DESC" ? valB - valA : valA - valB;
          }
          return 0; // Cannot compare other types
        });
      } catch (e: any) {
        setError(`Error in ORDER BY clause: ${e.message}`);
        toast.error(`Error in ORDER BY clause: ${e.message}`);
        return;
      }
    }

    // Apply LIMIT clause
    if (limitStr) {
      const limit = parseInt(limitStr, 10);
      if (!isNaN(limit) && limit >= 0) {
        rows = rows.slice(0, limit);
      }
    }

    // Select specific columns
    let finalColumns: string[] = [];
    let finalResult: Row[] = [];

    if (columnsStr.trim() === "*") {
      // Get all unique keys from the filtered rows to determine columns
      const allKeys = new Set<string>();
      rows.forEach((row) => Object.keys(row).forEach((key) => allKeys.add(key)));
      finalColumns = Array.from(allKeys);
      finalResult = rows;
    } else {
      finalColumns = columnsStr.split(",").map((col) => col.trim());
      finalResult = rows.map((row) => {
        const newRow: Row = {};
        finalColumns.forEach((col) => {
          newRow[col] = row[col] !== undefined ? row[col] : null; // Show null for missing columns
        });
        return newRow;
      });
    }

    setQueryResult(finalResult);
    setQueryColumns(finalColumns);
    toast.success("Query executed successfully!");
  }, [sqlQuery, database]);

  const resetDatabase = useCallback(() => {
    setDatabase(initialDatabase);
    setSqlQuery(sampleQueries[0]);
    setQueryResult(null);
    setQueryColumns([]);
    setError(null);
    toast.success("Database reset to initial state.");
  }, []);

  const handleSampleQueryClick = (query: string) => {
    setSqlQuery(query);
    setError(null);
    setQueryResult(null);
    setQueryColumns([]);
  };

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Experiment with SQL queries on a simple in-memory database. Supports basic SELECT, FROM, WHERE, ORDER BY, and LIMIT clauses."
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Query Input and Controls */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="sql-query" className="text-sm font-medium text-slate-300">
              SQL Query
            </label>
            <textarea
              id="sql-query"
              className="w-full h-48 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-50 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              spellCheck="false"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={executeSql}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Run Query
            </button>
            <button
              onClick={resetDatabase}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Reset Database
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Sample Queries</h3>
            <div className="flex flex-col gap-2">
              {sampleQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleQueryClick(query)}
                  className="text-left p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 font-mono text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Query Results */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-200">Query Results</h2>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg text-sm font-mono">
              <p className="font-bold mb-1">Error:</p>
              <pre className="whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          {queryResult && queryResult.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-slate-700">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                  <tr>
                    {queryColumns.map((col) => (
                      <th
                        key={col}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-slate-900 divide-y divide-slate-800">
                  {queryResult.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-slate-800 transition-colors duration-150">
                      {queryColumns.map((col) => (
                        <td key={`${rowIndex}-${col}`} className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span className="text-slate-500 italic">NULL</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {queryResult && queryResult.length === 0 && !error && (
            <div className="bg-slate-800 border border-slate-700 text-slate-400 p-4 rounded-lg text-sm font-mono">
              No results found for your query.
            </div>
          )}

          {!queryResult && !error && (
            <div className="bg-slate-800 border border-slate-700 text-slate-400 p-4 rounded-lg text-sm font-mono">
              Run a query to see results here.
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Current Database Tables</h3>
            <div className="flex flex-col gap-4">
              {Object.entries(database).map(([tableName, tableData]) => (
                <div key={tableName} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <h4 className="text-md font-medium text-slate-200 mb-2 capitalize">{tableName} ({tableData.length} rows)</h4>
                  {tableData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-700">
                        <thead className="bg-slate-700">
                          <tr>
                            {Object.keys(tableData[0]).map((col) => (
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
                        <tbody className="bg-slate-800 divide-y divide-slate-800">
                          {tableData.slice(0, 3).map((row, rowIndex) => ( // Show first 3 rows as preview
                            <tr key={rowIndex}>
                              {Object.keys(tableData[0]).map((col) => (
                                <td key={`${rowIndex}-${col}`} className="px-4 py-2 whitespace-nowrap text-xs text-slate-400">
                                  {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span className="text-slate-600 italic">NULL</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                          {tableData.length > 3 && (
                            <tr>
                              <td colSpan={Object.keys(tableData[0]).length} className="px-4 py-2 text-xs text-slate-500 italic text-center">
                                ... {tableData.length - 3} more rows
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No data in this table.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}