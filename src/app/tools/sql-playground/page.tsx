"use client";

import React, { useState, useEffect } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { useToolStore } from "@/store/useToolStore";
import toast from "react-hot-toast";
import { Terminal, Play } from "lucide-react";

const SQLPlaygroundPage: React.FC = () => {
  const toolSlug = "sql-playground";
  const toolName = "SQL Playground";
  const description = "Execute and test SQL queries in a simulated environment.";

  const { addToHistory } = useToolStore();

  const [query, setQuery] = useState<string>(`-- Example: SELECT id, name FROM users;
-- Example: INSERT INTO products (name, price) VALUES ('New Product', 99.99);
-- Example: UPDATE orders SET status = 'shipped' WHERE id = 1;
-- Example: DELETE FROM items WHERE quantity = 0;

SELECT id, name, email FROM users WHERE id < 5;`);
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleRunQuery = async () => {
    setIsLoading(true);
    setOutput(""); // Clear previous output
    toast.dismiss(); // Dismiss any existing toasts

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // Simple mock logic for demonstration
      const lowerCaseQuery = query.toLowerCase();

      if (lowerCaseQuery.includes("select * from users")) {
        setOutput(
          `id | name    | email
---|---------|--------------------
1  | Alice   | alice@example.com
2  | Bob     | bob@example.com
3  | Charlie | charlie@example.com
4  | David   | david@example.com
5  | Eve     | eve@example.com`
        );
        toast.success("Query executed successfully!");
      } else if (lowerCaseQuery.includes("select")) {
        // More generic select
        setOutput(
          `id | name
---|---------
1  | Item A
2  | Item B
3  | Item C`
        );
        toast.success("Query executed successfully!");
      } else if (lowerCaseQuery.includes("insert")) {
        setOutput("Query OK, 1 row affected (0.02 sec)");
        toast.success("Insert query executed successfully!");
      } else if (lowerCaseQuery.includes("update")) {
        setOutput("Query OK, 3 rows affected (0.03 sec)");
        toast.success("Update query executed successfully!");
      } else if (lowerCaseQuery.includes("delete")) {
        setOutput("Query OK, 2 rows affected (0.01 sec)");
        toast.success("Delete query executed successfully!");
      } else if (lowerCaseQuery.includes("drop table")) {
        setOutput("ERROR 1008 (HY000): Can't drop database 'test_db'; database doesn't exist");
        toast.error("Error: Cannot drop table in this simulated environment.");
      } else {
        setOutput(`Query:
${query}

-- No specific mock result for this query.
-- This is a simulated environment.
`);
        toast("Query processed (simulated).", { icon: "ℹ️" });
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message || "An unknown error occurred."}`);
      toast.error("An error occurred during query execution.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName={toolName}
      description={description}
    >
      <div className="flex flex-col space-y-6">
        {/* SQL Query Input */}
        <div className="flex flex-col">
          <label htmlFor="sql-query" className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 outline-none resize-y transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            spellCheck="false"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleRunQuery}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-indigo-600"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running Query...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run Query
              </>
            )}
          </button>
        </div>

        {/* Output Area */}
        <div className="flex flex-col">
          <label htmlFor="sql-output" className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Output
          </label>
          <pre
            id="sql-output"
            className="w-full min-h-[150px] max-h-[400px] overflow-auto p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm whitespace-pre-wrap break-all focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 outline-none transition-colors"
          >
            {output || "Query results will appear here."}
          </pre>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;