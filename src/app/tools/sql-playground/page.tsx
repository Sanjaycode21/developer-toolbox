"use client";

import React, { useState, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const toolSlug = "sql-playground";
const toolName = "SQL Playground";
const toolDescription = "Execute and test SQL queries in a simulated environment.";

export default function SqlPlaygroundPage() {
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [queryResults, setQueryResults] = useState<string>('');
  const addToHistory = useToolStore((state) => state.addToHistory);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory]);

  const handleRunQuery = () => {
    if (!sqlQuery.trim()) {
      toast.error("Please enter an SQL query.");
      return;
    }
    // Simulate query execution
    const simulatedResult = `Query executed successfully (simulated).\n\nInput Query:\n${sqlQuery}\n\n--- Simulated Data ---\nID | Name  | Age | City\n---|-------|-----|--------\n1  | Alice | 30  | New York\n2  | Bob   | 24  | London\n3  | Carol | 35  | Paris\n4  | David | 29  | Berlin`;
    setQueryResults(simulatedResult);
    toast.success("Query executed (simulated).");
  };

  const handleClear = () => {
    setSqlQuery('');
    setQueryResults('');
    toast.success("Input and results cleared.");
  };

  const handleFormat = () => {
    if (!sqlQuery.trim()) {
      toast.error("Please enter an SQL query to format.");
      return;
    }
    // Basic simulated SQL formatting
    const formattedSql = sqlQuery
      .replace(/SELECT/gi, '\nSELECT')
      .replace(/FROM/gi, '\nFROM')
      .replace(/WHERE/gi, '\nWHERE')
      .replace(/GROUP BY/gi, '\nGROUP BY')
      .replace(/ORDER BY/gi, '\nORDER BY')
      .replace(/INSERT INTO/gi, '\nINSERT INTO')
      .replace(/VALUES/gi, '\nVALUES')
      .replace(/UPDATE/gi, '\nUPDATE')
      .replace(/SET/gi, '\nSET')
      .replace(/DELETE FROM/gi, '\nDELETE FROM')
      .replace(/AND/gi, '\n  AND')
      .replace(/OR/gi, '\n  OR')
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    setSqlQuery(formattedSql);
    toast.success("SQL formatted (simulated).");
  };

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={toolDescription}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Input and Controls */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1">
            <label htmlFor="sql-input" className="block text-sm font-medium text-slate-300 mb-2">
              SQL Query
            </label>
            <textarea
              id="sql-input"
              className="w-full h-full min-h-[200px] lg:min-h-[unset] p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-y"
              placeholder="Enter your SQL query here, e.g., SELECT * FROM users WHERE age > 25;"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              spellCheck="false"
            />
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            <button
              onClick={handleRunQuery}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-md text-sm"
            >
              Run Query
            </button>
            <button
              onClick={handleFormat}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors shadow-md text-sm"
            >
              Format SQL
            </button>
            <button
              onClick={handleClear}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-md text-sm"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 flex flex-col gap-4">
          <label htmlFor="sql-results" className="block text-sm font-medium text-slate-300 mb-2">
            Results
          </label>
          <div
            id="sql-results"
            className="w-full h-full min-h-[200px] lg:min-h-[unset] p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm overflow-auto whitespace-pre-wrap break-words"
          >
            {queryResults || (
              <span className="text-slate-500">
                Query results will appear here. Click "Run Query" to see a simulated output.
              </span>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}