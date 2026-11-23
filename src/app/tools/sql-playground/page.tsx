"use client";

import { useState, useCallback } from "react";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";

const SQLPlaygroundPage = () => {
  const [query, setQuery] = useState<string>("SELECT * FROM users;");
  const [result, setResult] = useState<string>("");
  const addToHistory = useToolStore((state) => state.addToHistory);

  const handleRunQuery = useCallback(() => {
    addToHistory("sql-playground");
    try {
      // Simulate SQL execution
      let outputMessage = "";

      const lowerCaseQuery = query.trim().toLowerCase();

      if (lowerCaseQuery.startsWith("select * from users")) {
        const simulatedResult = [
          { id: 1, name: "Alice", email: "alice@example.com" },
          { id: 2, name: "Bob", email: "bob@example.com" },
          { id: 3, name: "Charlie", email: "charlie@example.com" },
        ];
        outputMessage = JSON.stringify(simulatedResult, null, 2);
        toast.success("Query executed successfully (simulated).");
      } else if (lowerCaseQuery.startsWith("select * from products")) {
        const simulatedResult = [
          { id: 101, name: "Laptop", price: 1200 },
          { id: 102, name: "Mouse", price: 25 },
          { id: 103, name: "Keyboard", price: 75 },
        ];
        outputMessage = JSON.stringify(simulatedResult, null, 2);
        toast.success("Query executed successfully (simulated).");
      } else if (lowerCaseQuery.startsWith("insert") || lowerCaseQuery.startsWith("update") || lowerCaseQuery.startsWith("delete")) {
        outputMessage = "DML statement executed successfully (simulated). Rows affected: 1.";
        toast.success("DML statement executed successfully (simulated).");
      } else if (lowerCaseQuery.startsWith("create") || lowerCaseQuery.startsWith("alter") || lowerCaseQuery.startsWith("drop")) {
        outputMessage = "DDL statement executed successfully (simulated).";
        toast.success("DDL statement executed successfully (simulated).");
      } else {
        outputMessage = `Error: Invalid or unsupported SQL query (simulated). Query: "${query}"`;
        toast.error("Invalid or unsupported SQL query (simulated).");
      }

      setResult(outputMessage);
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
      toast.error(`Error: ${error.message}`);
    }
  }, [query, addToHistory]);

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute and test SQL queries in a simulated environment."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Input Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-2">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 font-mono text-sm text-slate-50 resize-none placeholder-slate-500"
            placeholder="Enter your SQL query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={10}
          />
          <button
            onClick={handleRunQuery}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Run Query
          </button>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="query-result" className="block text-sm font-medium text-slate-300 mb-2">
            Query Result
          </label>
          <textarea
            id="query-result"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none font-mono text-sm text-slate-50 resize-none placeholder-slate-500"
            readOnly
            value={result}
            placeholder="Results will appear here..."
            rows={10}
          />
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;