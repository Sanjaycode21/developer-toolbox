"use client";

import React, { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";

const SQLPlaygroundPage: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState<string>(
    "SELECT id, name, email FROM users WHERE status = 'active';"
  );
  const [queryResult, setQueryResult] = useState<string>(
    "// Query results will appear here.\n// This is a simulated environment. No actual database connection is made."
  );
  const addToHistory = useToolStore((state) => state.addToHistory);

  const handleRunQuery = useCallback(() => {
    addToHistory("sql-playground");
    // Simulate query execution
    if (sqlQuery.trim() === "") {
      setQueryResult("// Error: Query cannot be empty.");
      toast.error("Query cannot be empty.");
      return;
    }

    // A very basic simulation: just echo the query and a success message
    const simulatedResult = `// Query executed successfully (simulated)!\n\n// Your Query:\n${sqlQuery}\n\n// Simulated Data (example):\n[{"id": 1, "name": "Alice", "email": "alice@example.com"}, {"id": 2, "name": "Bob", "email": "bob@example.com"}]`;
    setQueryResult(simulatedResult);
    toast.success("SQL query executed (simulated).");
  }, [sqlQuery, addToHistory]);

  const handleClear = useCallback(() => {
    setSqlQuery("");
    setQueryResult(
      "// Query results will appear here.\n// This is a simulated environment. No actual database connection is made."
    );
    toast("Input and output cleared.", { icon: "🧹" });
  }, []);

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Execute and test SQL queries in a simulated environment."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Input Section */}
        <div className="flex-1 flex flex-col space-y-4">
          <label htmlFor="sql-input" className="text-sm font-medium text-slate-300">
            SQL Query
          </label>
          <textarea
            id="sql-input"
            className="flex-1 w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-y min-h-[200px] lg:min-h-[unset]"
            placeholder="Enter your SQL query here..."
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            rows={10}
          />
          <div className="flex gap-3">
            <button
              onClick={handleRunQuery}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Run Query
            </button>
            <button
              onClick={handleClear}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col space-y-4">
          <label htmlFor="sql-output" className="text-sm font-medium text-slate-300">
            Query Result
          </label>
          <textarea
            id="sql-output"
            className="flex-1 w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-y min-h-[200px] lg:min-h-[unset]"
            readOnly
            value={queryResult}
            rows={10}
          />
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;