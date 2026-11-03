"use client";

import { useState, useEffect, useCallback } from "react";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";

const mockUsers = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", age: 30 },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", age: 24 },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", age: 35 },
];

const mockProducts = [
  { id: 101, name: "Laptop", price: 1200, category: "Electronics" },
  { id: 102, name: "Mouse", price: 25, category: "Electronics" },
  { id: 103, name: "Keyboard", price: 75, category: "Electronics" },
  { id: 104, name: "Monitor", price: 300, category: "Electronics" },
];

export default function SQLPlaygroundPage() {
  const [sqlQuery, setSqlQuery] = useState<string>(
    "SELECT * FROM users;\n\n-- Try:\n-- SELECT * FROM products;\n-- CREATE TABLE orders (id INT, product_id INT);\n-- INSERT INTO users (name, email) VALUES ('David', 'david@example.com');\n-- UPDATE users SET age = 31 WHERE id = 1;\n-- DELETE FROM users WHERE id = 3;"
  );
  const [queryResult, setQueryResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addToHistory = useToolStore((state) => state.addToHistory);
  const toolSlug = "sql-playground";

  const handleExecuteQuery = useCallback(async () => {
    setError(null);
    setQueryResult("");
    setIsLoading(true);
    addToHistory(toolSlug);

    if (!sqlQuery.trim()) {
      setError("Please enter an SQL query.");
      setIsLoading(false);
      return;
    }

    // Simulate API call or client-side SQL execution
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay

    const lowerCaseQuery = sqlQuery.trim().toLowerCase();

    try {
      if (lowerCaseQuery.includes("select * from users")) {
        setQueryResult(JSON.stringify(mockUsers, null, 2));
        toast.success("Query executed successfully!");
      } else if (lowerCaseQuery.includes("select * from products")) {
        setQueryResult(JSON.stringify(mockProducts, null, 2));
        toast.success("Query executed successfully!");
      } else if (lowerCaseQuery.startsWith("create table")) {
        setQueryResult("Table created successfully.");
        toast.success("Query executed successfully!");
      } else if (lowerCaseQuery.startsWith("insert into")) {
        setQueryResult("Row inserted successfully.");
        toast.success("Query executed successfully!");
      } else if (lowerCaseQuery.startsWith("update")) {
        setQueryResult("Rows updated successfully.");
        toast.success("Query executed successfully!");
      } else if (lowerCaseQuery.startsWith("delete from")) {
        setQueryResult("Rows deleted successfully.");
        toast.success("Query executed successfully!");
      } else if (lowerCaseQuery.startsWith("select")) {
        setQueryResult("Query executed successfully. (Mock data for SELECT statements)");
        toast.success("Query executed successfully!");
      } else {
        setQueryResult("Query executed successfully.");
        toast.success("Query executed successfully!");
      }
    } catch (e: any) {
      setError(`Error: ${e.message || "An unknown error occurred."}`);
      toast.error("Query execution failed.");
    } finally {
      setIsLoading(false);
    }
  }, [sqlQuery, addToHistory, toolSlug]);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Execute and test SQL queries against a mock database environment."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Query Input Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-2">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y min-h-[200px] lg:min-h-[unset]"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            rows={10}
          ></textarea>
          <button
            onClick={handleExecuteQuery}
            className="mt-4 w-full lg:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Executing..." : "Execute Query"}
          </button>
        </div>

        {/* Results Output Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="query-result" className="block text-sm font-medium text-slate-300 mb-2">
            Result
          </label>
          <textarea
            id="query-result"
            className={`w-full flex-1 p-4 bg-slate-800 border rounded-lg text-slate-50 font-mono text-sm resize-y min-h-[200px] lg:min-h-[unset] ${
              error ? "border-red-500" : "border-slate-700"
            }`}
            value={error || queryResult}
            readOnly
            placeholder="Query results will appear here..."
            rows={10}
          ></textarea>
          {error && (
            <p className="mt-2 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
    </ToolPageWrapper>
  );
}