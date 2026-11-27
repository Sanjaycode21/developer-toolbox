"use client";

import React, { useState, useEffect } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const SQLPlaygroundPage: React.FC = () => {
  const toolSlug = "sql-playground";
  const toolName = "SQL Playground";
  const description = "Execute and test SQL queries in a simulated environment.";

  const [sqlQuery, setSqlQuery] = useState<string>(`SELECT id, name, email FROM users WHERE status = 'active';`);
  const [queryResult, setQueryResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addToHistory = useToolStore((state) => state.addToHistory);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const handleRunQuery = () => {
    setIsLoading(true);
    setQueryResult(''); // Clear previous results

    const trimmedQuery = sqlQuery.trim();

    if (!trimmedQuery) {
      toast.error("Please enter an SQL query.");
      setIsLoading(false);
      return;
    }

    // Simulate network delay
    setTimeout(() => {
      let simulatedResult: any;
      const lowerCaseQuery = trimmedQuery.toLowerCase();

      if (lowerCaseQuery.startsWith("select")) {
        simulatedResult = [
          { id: 1, name: "Alice", age: 30, city: "New York", email: "alice@example.com" },
          { id: 2, name: "Bob", age: 24, city: "London", email: "bob@example.com" },
          { id: 3, name: "Charlie", age: 35, city: "Paris", email: "charlie@example.com" },
          { id: 4, name: "Diana", age: 28, city: "Berlin", email: "diana@example.com" },
        ];
        toast.success("SELECT query simulated successfully.");
      } else if (lowerCaseQuery.startsWith("insert")) {
        simulatedResult = { message: "1 row inserted successfully.", affectedRows: 1, query: trimmedQuery };
        toast.success("INSERT query simulated successfully.");
      } else if (lowerCaseQuery.startsWith("update")) {
        simulatedResult = { message: "Rows updated successfully.", affectedRows: Math.floor(Math.random() * 3) + 1, query: trimmedQuery };
        toast.success("UPDATE query simulated successfully.");
      } else if (lowerCaseQuery.startsWith("delete")) {
        simulatedResult = { message: "Rows deleted successfully.", affectedRows: Math.floor(Math.random() * 2) + 1, query: trimmedQuery };
        toast.success("DELETE query simulated successfully.");
      } else if (lowerCaseQuery.startsWith("create table")) {
        simulatedResult = { message: "Table created successfully.", query: trimmedQuery };
        toast.success("CREATE TABLE query simulated successfully.");
      } else if (lowerCaseQuery.startsWith("drop table")) {
        simulatedResult = { message: "Table dropped successfully.", query: trimmedQuery };
        toast.success("DROP TABLE query simulated successfully.");
      }
      else {
        simulatedResult = { error: "Unsupported SQL command for simulation.", query: trimmedQuery };
        toast.error("Unsupported SQL command for simulation.");
      }

      setQueryResult(JSON.stringify(simulatedResult, null, 2));
      setIsLoading(false);
    }, 1000); // Simulate 1 second delay
  };

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Input Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-input" className="block text-sm font-medium text-slate-300 mb-2">
            SQL Query
          </label>
          <textarea
            id="sql-input"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:ring-indigo-500 focus:border-indigo-500 resize-y font-mono text-sm min-h-[150px] lg:min-h-0"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            rows={10}
          />
          <button
            onClick={handleRunQuery}
            disabled={isLoading}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Running Query...' : 'Run Query'}
          </button>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-output" className="block text-sm font-medium text-slate-300 mb-2">
            Query Result (Simulated)
          </label>
          <div
            id="sql-output"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm overflow-auto min-h-[150px] lg:min-h-0"
          >
            {queryResult ? (
              <pre className="whitespace-pre-wrap break-words">{queryResult}</pre>
            ) : (
              <p className="text-slate-400">Results will appear here after running a query.</p>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;