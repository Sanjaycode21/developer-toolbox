"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Layers, Table, Hash, Terminal } from 'lucide-react'; // Import Lucide icons

interface TableRow {
  [key: string]: any;
}

interface TableData {
  columns: string[];
  data: TableRow[];
}

// Initial in-memory database structure
const initialDatabase: { [tableName: string]: TableData } = {
  users: {
    columns: ['id', 'name', 'email'],
    data: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' },
    ],
  },
  products: {
    columns: ['id', 'name', 'price'],
    data: [
      { id: 1, name: 'Laptop', price: 1200 },
      { id: 2, name: 'Mouse', price: 25 },
      { id: 3, name: 'Keyboard', price: 75 },
    ],
  },
};

export default function SqlPlaygroundPage() {
  const toolSlug = "sql-playground";
  const { addToHistory } = useToolStore();

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  // Use a deep copy of initialDatabase to allow modifications without affecting the original
  const [currentDb, setCurrentDb] = useState<{ [tableName: string]: TableData }>(
    JSON.parse(JSON.stringify(initialDatabase))
  );

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const formatResults = (data: TableRow[] | string, type: 'data' | 'message'): string => {
    if (type === 'message') {
      return String(data);
    }
    if (!Array.isArray(data) || data.length === 0) {
      return "No results found.";
    }
    return JSON.stringify(data, null, 2); // Pretty print JSON
  };

  const executeQuery = useCallback(() => {
    setError(null);
    setResults("");

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("Query cannot be empty.");
      toast.error("Query cannot be empty.");
      return;
    }

    try {
      // SELECT statement
      const selectMatch = trimmedQuery.match(/^SELECT\s+(.+?)\s+FROM\s+([a-zA-Z_]+)\s*;?$/i);
      if (selectMatch) {
        const columnsPart = selectMatch[1].trim();
        const tableName = selectMatch[2].trim().toLowerCase(); // Ensure table name is lowercased for lookup

        if (!currentDb[tableName]) {
          throw new Error(`Table '${tableName}' does not exist.`);
        }

        let selectedData = currentDb[tableName].data;

        if (columnsPart !== '*') {
          const requestedColumns = columnsPart.split(',').map(col => col.trim());
          const invalidColumns = requestedColumns.filter(col => !currentDb[tableName].columns.includes(col));
          if (invalidColumns.length > 0) {
            throw new Error(`Invalid column(s) in '${tableName}': ${invalidColumns.join(', ')}`);
          }
          selectedData = selectedData.map(row => {
            const newRow: TableRow = {};
            requestedColumns.forEach(col => {
              newRow[col] = row[col];
            });
            return newRow;
          });
        }

        setResults(formatResults(selectedData, 'data'));
        toast.success(`Query executed successfully. ${selectedData.length} row(s) returned.`);
        return;
      }

      // INSERT statement
      const insertMatch = trimmedQuery.match(/^INSERT\s+INTO\s+([a-zA-Z_]+)\s+VALUES\s+\((.+?)\)\s*;?$/i);
      if (insertMatch) {
        const tableName = insertMatch[1].trim().toLowerCase(); // Ensure table name is lowercased for lookup
        const valuesPart = insertMatch[2].trim();

        if (!currentDb[tableName]) {
          throw new Error(`Table '${tableName}' does not exist.`);
        }

        const table = currentDb[tableName];
        // Regex to split values, handling quoted strings
        const rawValues = valuesPart.match(/(?:'[^']*'|[^,])+/g)?.map(v => v.trim()) || [];

        const parsedValues = rawValues.map(v => {
          if (v.startsWith("'") && v.endsWith("'")) {
            return v.substring(1, v.length - 1); // Remove quotes for strings
          }
          if (!isNaN(Number(v)) && v !== '') {
            return Number(v); // Convert to number if possible
          }
          if (v.toLowerCase() === 'true') return true;
          if (v.toLowerCase() === 'false') return false;
          if (v.toLowerCase() === 'null') return null;
          return v; // Keep as is
        });

        if (parsedValues.length !== table.columns.length) {
          throw new Error(`Number of values (${parsedValues.length}) does not match number of columns (${table.columns.length}) for table '${tableName}'.`);
        }

        const newRow: TableRow = {};
        table.columns.forEach((col, index) => {
          newRow[col] = parsedValues[index];
        });

        // Basic ID uniqueness check if 'id' is the first column and it's a number
        if (table.columns[0] === 'id' && typeof newRow.id === 'number') {
          if (table.data.some(row => row.id === newRow.id)) {
            throw new Error(`Duplicate ID '${newRow.id}' for table '${tableName}'.`);
          }
        }

        const updatedData = [...table.data, newRow];
        setCurrentDb(prevDb => ({
          ...prevDb,
          [tableName]: {
            ...prevDb[tableName],
            data: updatedData,
          },
        }));
        setResults(formatResults(`1 row inserted into '${tableName}'.`, 'message'));
        toast.success(`1 row inserted into '${tableName}'.`);
        return;
      }

      // If no known command matches
      throw new Error("Unsupported SQL query. Only SELECT and INSERT are supported.");

    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
    }
  }, [query, currentDb]);

  const handleResetDb = useCallback(() => {
    setCurrentDb(JSON.parse(JSON.stringify(initialDatabase))); // Reset to a fresh deep copy
    setQuery("");
    setResults("");
    setError(null);
    toast.success("Database reset to initial state.");
  }, []);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Execute and test SQL queries against an in-memory database. Supports basic SELECT and INSERT statements."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Schema Explorer */}
        <div className="w-full lg:w-1/4 p-4 bg-slate-800 border border-slate-700 rounded-lg shadow-inner flex flex-col">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Schema Explorer
          </h3>
          <div className="flex-1 overflow-y-auto">
            {Object.entries(currentDb).map(([tableName, table]) => (
              <div key={tableName} className="mb-4 p-3 bg-slate-700/50 rounded-md border border-slate-600">
                <h4 className="font-medium text-indigo-400 text-sm mb-2 flex items-center gap-1">
                  <Table className="w-4 h-4 text-slate-400" />
                  {tableName}
                </h4>
                <ul className="text-xs text-slate-300 space-y-1">
                  {table.columns.map(col => (
                    <li key={`${tableName}-${col}`} className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-slate-500" />
                      {col}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button
            onClick={handleResetDb}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            Reset Database
          </button>
        </div>

        {/* Query and Results */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Query Input */}
          <div className="flex-1 flex flex-col">
            <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-2">
              SQL Query
            </label>
            <textarea
              id="sql-query"
              className="w-full flex-1 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-lg p-4 text-sm text-slate-200 placeholder-slate-500 resize-none font-mono overflow-auto"
              rows={10}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Example queries:\nSELECT * FROM users;\nINSERT INTO products VALUES (4, 'Monitor', 300);`}
              spellCheck="false"
            ></textarea>
            <button
              onClick={executeQuery}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
              Execute Query
            </button>
          </div>

          {/* Results Output */}
          <div className="flex-1 flex flex-col">
            <label htmlFor="sql-results" className="block text-sm font-medium text-slate-300 mb-2">
              Results
            </label>
            <pre
              id="sql-results"
              className={`w-full flex-1 bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-lg p-4 text-sm ${error ? 'text-red-400' : 'text-emerald-400'} overflow-auto font-mono`}
            >
              {error ? `Error: ${error}` : results || "Execute a query to see results."}
            </pre>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}