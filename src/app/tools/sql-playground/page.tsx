"use client";

import React, { useState, useCallback } from "react";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";

const toolSlug = "sql-playground";
const toolName = "SQL Playground";
const toolDescription = "Experiment with SQL queries in an interactive environment. (UI-only)";

const SQLPlaygroundPage: React.FC = () => {
  const [sqlInput, setSqlInput] = useState<string>(
    `-- Example SQL Query\nSELECT * FROM users WHERE age > 30;`
  );
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { addToHistory } = useToolStore();

  const handleRunQuery = useCallback(() => {
    addToHistory(toolSlug);
    setError("");
    setOutput("");

    // In a real application, this would send the SQL to a backend for execution.
    // For this UI-only playground, we'll simulate a response.
    try {
      if (sqlInput.trim().toLowerCase().startsWith("select")) {
        setOutput(
          `Query executed successfully!\n\n` +
          `-- Simulated Results --\n` +
          `id | name    | age\n` +
          `---|---------|----\n` +
          `1  | Alice   | 35\n` +
          `2  | Bob     | 42\n` +
          `3  | Charlie | 31`
        );
        toast.success("Query simulated successfully!");
      } else if (sqlInput.trim().toLowerCase().startsWith("insert")) {
        setOutput("Query executed successfully!\n\n-- Simulated: 1 row inserted.");
        toast.success("Query simulated successfully!");
      } else if (sqlInput.trim().toLowerCase().startsWith("update")) {
        setOutput("Query executed successfully!\n\n-- Simulated: 2 rows updated.");
        toast.success("Query simulated successfully!");
      } else if (sqlInput.trim().toLowerCase().startsWith("delete")) {
        setOutput("Query executed successfully!\n\n-- Simulated: 0 rows deleted.");
        toast.success("Query simulated successfully!");
      }
      else if (sqlInput.trim() === "") {
        setError("Please enter an SQL query.");
        toast.error("Please enter an SQL query.");
      }
      else {
        setError("Simulated Error: Only SELECT, INSERT, UPDATE, DELETE statements are partially supported in this UI-only playground.");
        toast.error("Simulated Error: Invalid query type.");
      }
    } catch (e: any) {
      setError(`Simulated Error: ${e.message || "An unknown error occurred."}`);
      toast.error("An error occurred during simulation.");
    }
  }, [sqlInput, addToHistory]);

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={toolDescription}>
      <div className="flex flex-col space-y-6">
        {/* SQL Input Area */}
        <div className="flex flex-col">
          <label htmlFor="sql-input" className="text-sm font-medium text-slate-300 mb-2">
            SQL Query
          </label>
          <textarea
            id="sql-input"
            className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
            placeholder="Enter your SQL query here..."
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            spellCheck="false"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleRunQuery}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Run Query
          </button>
        </div>

        {/* Output Area */}
        <div className="flex flex-col">
          <label htmlFor="sql-output" className="text-sm font-medium text-slate-300 mb-2">
            Output
          </label>
          <textarea
            id="sql-output"
            className={`w-full h-48 p-4 bg-slate-800 border rounded-lg text-slate-50 font-mono text-sm resize-y ${
              error ? "border-red-500" : "border-slate-700"
            }`}
            readOnly
            value={error || output || "Results will appear here after running a query."}
            placeholder="Results will appear here after running a query."
            style={{ whiteSpace: "pre-wrap" }}
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;