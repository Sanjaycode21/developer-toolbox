"use client";

import React, { useState, useEffect, useCallback } from "react";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";

interface QueryResult {
  type: "success" | "error" | "data";
  message?: string;
  data?: Record<string, any>[];
  columns?: string[];
  rowsAffected?: number;
}

const SQLPlaygroundPage: React.FC = () => {
  const [query, setQuery] = useState<string>(`-- Sample SQL Queries:
-- SELECT * FROM users;
-- INSERT INTO products (name, price) VALUES ('New Item', 29.99);
-- UPDATE orders SET status = 'shipped' WHERE id = 1;
-- DELETE FROM users WHERE id = 5;
-- CREATE TABLE employees (id INT, name TEXT);

SELECT id, name, email FROM users WHERE id < 3;`);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addToHistory = useToolStore((state) => state.addToHistory);

  useEffect(() => {
    addToHistory("sql-playground");
  }, [addToHistory]);

  const mockDatabase: Record<string, Record<string, any>[]> = {
    users: [
      { id: 1, name: "Alice", email: "alice@example.com", age: 30 },
      { id: 2, name: "Bob", email: "bob@example.com", age: 24 },
      { id: 3, name: "Charlie", email: "charlie@example.com", age: 35 },
      { id: 4, name: "David", email: "david@example.com", age: 29 },
    ],
    products: [
      { id: 101, name: "Laptop", price: 1200.00, stock: 50 },
      { id: 102, name: "Mouse", price: 25.00, stock: 200 },
      { id: 103, name: "Keyboard", price: 75.00, stock: 150 },
    ],
    orders: [
      { id: 1, userId: 1, productId: 101, quantity: 1, status: "pending" },
      { id: 2, userId: 2, productId: 102, quantity: 2, status: "completed" },
    ],
  };

  const executeMockQuery = useCallback((sql: string): QueryResult => {
    const trimmedSql = sql.trim().toUpperCase();

    if (trimmedSql.startsWith("SELECT")) {
      const match = trimmedSql.match(/FROM\s+(\w+)/);
      if (!match || !match[1]) {
        return { type: "error", message: "Invalid SELECT query: missing FROM clause." };
      }
      const tableName = match[1].toLowerCase();
      const table = mockDatabase[tableName];

      if (!table) {
        return { type: "error", message: `Table '${tableName}' not found.` };
      }

      // Simple WHERE clause parsing (e.g., WHERE id < 3)
      const whereMatch = trimmedSql.match(/WHERE\s+(.+)/);
      let filteredData = table;
      if (whereMatch && whereMatch[1]) {
        try {
          const condition = whereMatch[1];
          // Very basic condition parsing for numeric comparisons
          const conditionParts = condition.split(/\s*(<|>|=|<=|>=|!=)\s*/);
          if (conditionParts.length === 3) {
            const [col, op, valStr] = conditionParts;
            const value = parseFloat(valStr);
            if (!isNaN(value)) {
              filteredData = table.filter(row => {
                const rowValue = row[col.toLowerCase()];
                if (typeof rowValue === 'number') {
                  switch (op) {
                    case '<': return rowValue < value;
                    case '>': return rowValue > value;
                    case '=': return rowValue === value;
                    case '<=': return rowValue <= value;
                    case '>=': return rowValue >= value;
                    case '!=': return rowValue !== value;
                    default: return true;
                  }
                }
                return true;
              });
            }
          }
        } catch (e) {
          console.warn("Could not parse WHERE clause:", e);
          // Fallback to no filtering if parsing fails
        }
      }

      // Simple column selection parsing (e.g., SELECT id, name)
      const selectColsMatch = trimmedSql.match(/SELECT\s+(.+?)\s+FROM/);
      let selectedColumns: string[] = [];
      if (selectColsMatch && selectColsMatch[1] && selectColsMatch[1] !== '*') {
        selectedColumns = selectColsMatch[1].split(',').map(c => c.trim().toLowerCase());
      } else {
        selectedColumns = Object.keys(table[0] || {});
      }

      const resultData = filteredData.map(row => {
        const newRow: Record<string, any> = {};
        selectedColumns.forEach(col => {
          if (row.hasOwnProperty(col)) {
            newRow[col] = row[col];
          }
        });
        return newRow;
      });

      return {
        type: "data",
        data: resultData,
        columns: selectedColumns,
        message: `Query executed successfully. ${resultData.length} rows returned.`,
      };
    } else if (trimmedSql.startsWith("INSERT") || trimmedSql.startsWith("UPDATE") || trimmedSql.startsWith("DELETE")) {
      // Simulate DML operations
      const rowsAffected = Math.floor(Math.random() * 5) + 1; // Randomly affect 1-5 rows
      return {
        type: "success",
        message: `Query executed successfully. ${rowsAffected} rows affected.`,
        rowsAffected,
      };
    } else if (trimmedSql.startsWith("CREATE TABLE") || trimmedSql.startsWith("DROP TABLE") || trimmedSql.startsWith("ALTER TABLE")) {
      // Simulate DDL operations
      return { type: "success", message: "DDL command executed successfully." };
    } else {
      return { type: "error", message: "Unsupported SQL command or syntax error." };
    }
  }, []);

  const handleRunQuery = useCallback(async () => {
    setIsLoading(true);
    setResult(null); // Clear previous results

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const queryResult = executeMockQuery(query);
    setResult(queryResult);

    if (queryResult.type === "error") {
      toast.error(queryResult.message || "An error occurred during query execution.");
    } else {
      toast.success(queryResult.message || "Query executed successfully.");
    }

    setIsLoading(false);
  }, [query, executeMockQuery]);

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute and test SQL queries in a browser-based environment."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Query Input and Controls */}
        <div className="flex-1 flex flex-col gap-4">
          <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="w-full flex-1 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-lg p-4 text-sm font-mono text-slate-200 placeholder-slate-500 transition-colors resize-y min-h-[200px] lg:min-h-[unset]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            rows={10}
          />
          <button
            onClick={handleRunQuery}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Executing..." : "Run Query"}
          </button>
        </div>

        {/* Results Output */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-200">Results</h2>
          <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-auto text-sm font-mono text-slate-200 min-h-[200px] lg:min-h-[unset]">
            {result === null && (
              <p className="text-slate-500">Run a query to see results here.</p>
            )}

            {result && result.type === "error" && (
              <div className="text-red-400">
                <p className="font-bold">Error:</p>
                <pre className="whitespace-pre-wrap">{result.message}</pre>
              </div>
            )}

            {result && result.type === "success" && (
              <div className="text-emerald-400">
                <p className="font-bold">Success:</p>
                <pre className="whitespace-pre-wrap">{result.message}</pre>
              </div>
            )}

            {result && result.type === "data" && result.data && result.data.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left table-auto border-collapse">
                  <thead>
                    <tr className="bg-slate-700">
                      {result.columns?.map((col) => (
                        <th key={col} className="p-2 border border-slate-600 font-semibold text-slate-100">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.data.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-slate-800" : "bg-slate-700"}>
                        {result.columns?.map((col) => (
                          <td key={col} className="p-2 border border-slate-600 text-slate-300">
                            {String(row[col] ?? "NULL")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {result && result.type === "data" && result.data && result.data.length === 0 && (
              <p className="text-slate-500">Query executed successfully. No rows returned.</p>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;