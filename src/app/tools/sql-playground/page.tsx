"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const initialDatabase: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
];
const initialNextId = 4;

// Helper function to parse WHERE clauses for the mock database
const parseWhereClause = (whereClause: string | undefined, item: User): boolean => {
  if (!whereClause) return true;

  // Very basic parsing: assumes conditions are joined by 'AND'
  // Does not support 'OR' or parentheses for simplicity.
  const andConditions = whereClause.split(/\s+AND\s+/i);

  return andConditions.every(conditionPart => {
    const match = conditionPart.match(/(\w+)\s*([<>=!]+)\s*(.+)/);
    if (!match) {
      console.warn(`Could not parse condition part: ${conditionPart}`);
      return false; // Malformed condition
    }

    const [, key, op, valueStr] = match;
    const prop = key.toLowerCase() as keyof User;
    const itemValue = item[prop];
    let compareValue: any = valueStr.trim();

    // Attempt to convert valueStr to appropriate type
    if (!isNaN(Number(compareValue))) {
      compareValue = Number(compareValue);
    } else if (compareValue.startsWith("'") && compareValue.endsWith("'")) {
      compareValue = compareValue.slice(1, -1);
    } else if (compareValue.startsWith('"') && compareValue.endsWith('"')) {
      compareValue = compareValue.slice(1, -1);
    }

    // Perform comparison
    switch (op) {
      case '=': return itemValue == compareValue;
      case '!=':
      case '<>': return itemValue != compareValue;
      case '>': return (itemValue as any) > compareValue;
      case '<': return (itemValue as any) < compareValue;
      case '>=': return (itemValue as any) >= compareValue;
      case '<=': return (itemValue as any) <= compareValue;
      default: return false;
    }
  });
};

const SQLPlaygroundPage: React.FC = () => {
  const toolSlug = "sql-playground";
  const toolName = "SQL Playground";
  const description = "Execute and test SQL queries against a mock in-memory database.";

  const { addToHistory } = useToolStore();

  const [query, setQuery] = useState<string>('');
  const [database, setDatabase] = useState<User[]>(initialDatabase);
  const [nextId, setNextId] = useState<number>(initialNextId);
  const [results, setResults] = useState<string>('');

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  const runQuery = useCallback(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      toast.error("Query cannot be empty.");
      return;
    }

    try {
      let currentDatabase = [...database];
      let output: string[] = [];
      let affectedRows = 0;

      // SELECT statement
      const selectMatch = trimmedQuery.match(/^SELECT\s+(.+?)\s+FROM\s+users(?:\s+WHERE\s+(.+))?;/i);
      if (selectMatch) {
        const columnsStr = selectMatch[1].trim();
        const whereClause = selectMatch[2]?.trim();

        let filteredData = currentDatabase;
        if (whereClause) {
          filteredData = currentDatabase.filter(item => parseWhereClause(whereClause, item));
        }

        if (filteredData.length === 0) {
          output.push("No rows found.");
        } else {
          const allColumns = Object.keys(filteredData[0] || {});
          const selectedColumns = columnsStr === '*' ? allColumns : columnsStr.split(',').map(col => col.trim());

          // Header
          output.push(selectedColumns.map(col => col.padEnd(15)).join(' | '));
          output.push(selectedColumns.map(() => '-'.repeat(15)).join('-|-'));

          // Data rows
          filteredData.forEach(row => {
            output.push(selectedColumns.map(col => {
              const value = (row as any)[col]?.toString() || 'NULL';
              return value.padEnd(15);
            }).join(' | '));
          });
        }
        setResults(output.join('\n'));
        toast.success(`Query executed. ${filteredData.length} rows selected.`);
        return;
      }

      // INSERT statement
      const insertMatch = trimmedQuery.match(/^INSERT INTO users\s*\((.+?)\)\s*VALUES\s*\((.+?)\);/i);
      if (insertMatch) {
        const columns = insertMatch[1].split(',').map(c => c.trim().toLowerCase());
        const values = insertMatch[2].split(',').map(v => {
          const trimmed = v.trim();
          if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
          if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1);
          if (!isNaN(Number(trimmed))) return Number(trimmed);
          return trimmed;
        });

        if (columns.length !== values.length) {
          throw new Error("Column count and value count mismatch.");
        }

        const newRow: Partial<User> = { id: nextId };
        columns.forEach((col, index) => {
          (newRow as any)[col] = values[index];
        });

        currentDatabase.push(newRow as User);
        setNextId(prev => prev + 1);
        affectedRows = 1;
        setDatabase(currentDatabase);
        setResults(`1 row inserted. New ID: ${nextId}`);
        toast.success(`Query executed. ${affectedRows} row inserted.`);
        return;
      }

      // UPDATE statement
      const updateMatch = trimmedQuery.match(/^UPDATE users\s+SET\s+(.+?)(?:\s+WHERE\s+(.+))?;/i);
      if (updateMatch) {
        const setClause = updateMatch[1];
        const whereClause = updateMatch[2];

        const updates: { [key: string]: any } = {};
        setClause.split(',').forEach(part => {
          const [key, valueStr] = part.split('=').map(s => s.trim());
          let value: any = valueStr;
          if (valueStr.startsWith("'") && valueStr.endsWith("'")) value = valueStr.slice(1, -1);
          else if (valueStr.startsWith('"') && valueStr.endsWith('"')) value = valueStr.slice(1, -1);
          else if (!isNaN(Number(valueStr))) value = Number(valueStr);
          updates[key.toLowerCase()] = value;
        });

        affectedRows = 0;
        currentDatabase = currentDatabase.map(row => {
          if (parseWhereClause(whereClause, row)) {
            affectedRows++;
            return { ...row, ...updates };
          }
          return row;
        });
        setDatabase(currentDatabase);
        setResults(`${affectedRows} rows updated.`);
        toast.success(`Query executed. ${affectedRows} rows updated.`);
        return;
      }

      // DELETE statement
      const deleteMatch = trimmedQuery.match(/^DELETE FROM users(?:\s+WHERE\s+(.+))?;/i);
      if (deleteMatch) {
        const whereClause = deleteMatch[1];
        const initialCount = currentDatabase.length;
        currentDatabase = currentDatabase.filter(item => !parseWhereClause(whereClause, item));
        affectedRows = initialCount - currentDatabase.length;
        setDatabase(currentDatabase);
        setResults(`${affectedRows} rows deleted.`);
        toast.success(`Query executed. ${affectedRows} rows deleted.`);
        return;
      }

      throw new Error("Unsupported SQL query or syntax error.");

    } catch (error: any) {
      setResults(`Error: ${error.message}`);
      toast.error(`Query failed: ${error.message}`);
    }
  }, [query, database, nextId]);

  const resetPlayground = useCallback(() => {
    setQuery('');
    setDatabase(initialDatabase);
    setNextId(initialNextId);
    setResults('');
    toast.success("SQL Playground reset to initial state.");
  }, []);

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Query Input */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-2">
            SQL Query
          </label>
          <textarea
            id="sql-query"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:border-indigo-500 focus:ring-indigo-500 resize-y min-h-[150px] lg:min-h-[300px]"
            placeholder={`Example queries:\nSELECT * FROM users;\nSELECT name, age FROM users WHERE age > 25;\nINSERT INTO users (name, email, age) VALUES ('David', 'david@example.com', 28);\nUPDATE users SET age = 31 WHERE name = 'Alice';\nDELETE FROM users WHERE id = 2;`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck="false"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={runQuery}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Run Query
            </button>
            <button
              onClick={resetPlayground}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results Output */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-results" className="block text-sm font-medium text-slate-300 mb-2">
            Results
          </label>
          <pre
            id="sql-results"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm whitespace-pre-wrap break-all overflow-auto min-h-[150px] lg:min-h-[300px]"
          >
            {results || "Query results will appear here."}
          </pre>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;