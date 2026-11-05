"use client";

import React, { useState, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const toolSlug = "sql-playground";
const toolName = "SQL Playground";
const description = "Execute and test SQL queries in a simulated environment.";

// Simple in-memory database for demonstration purposes
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Initialize with some sample data
let database: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", age: 30 },
  { id: 2, name: "Bob", email: "bob@example.com", age: 24 },
  { id: 3, name: "Charlie", email: "charlie@example.com", age: 35 },
];

// Keep track of the next available ID
let nextId = database.length > 0 ? Math.max(...database.map(u => u.id)) + 1 : 1;

const SQLPlaygroundPage = () => {
  const [sqlQuery, setSqlQuery] = useState<string>("");
  const [queryResult, setQueryResult] = useState<string | User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addToHistory = useToolStore((state) => state.addToHistory);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory]);

  const handleRunQuery = () => {
    setError(null);
    setQueryResult(null);
    const query = sqlQuery.trim();

    if (!query) {
      setError("Please enter an SQL query.");
      toast.error("Please enter an SQL query.");
      return;
    }

    try {
      const upperCaseQuery = query.toUpperCase();

      if (upperCaseQuery.startsWith("SELECT")) {
        if (upperCaseQuery.includes("FROM USERS")) {
          const whereMatch = upperCaseQuery.match(/WHERE\s+(.+)/);
          let results = [...database]; // Work on a copy

          if (whereMatch) {
            const condition = whereMatch[1].trim();
            // Basic WHERE clause parsing
            if (condition.includes("ID = ")) {
              const id = parseInt(condition.split("ID = ")[1].trim());
              results = results.filter(user => user.id === id);
            } else if (condition.includes("AGE > ")) {
              const age = parseInt(condition.split("AGE > ")[1].trim());
              results = results.filter(user => user.age > age);
            } else if (condition.includes("NAME = '")) {
              const name = condition.split("NAME = '")[1].split("'")[0];
              results = results.filter(user => user.name.toUpperCase() === name.toUpperCase());
            } else {
              throw new Error("Unsupported WHERE clause for SELECT.");
            }
          }
          setQueryResult(results.length > 0 ? results : "No results found.");
          toast.success("Query executed successfully!");
        } else {
          throw new Error("Unsupported SELECT query. Try 'SELECT * FROM USERS;'.");
        }
      } else if (upperCaseQuery.startsWith("INSERT INTO USERS")) {
        const valuesMatch = query.match(/VALUES\s*\((.+)\)/i);
        if (valuesMatch) {
          const valuesStr = valuesMatch[1];
          const parts = valuesStr.split(',').map(p => p.trim());
          if (parts.length === 4) {
            // Assuming format: (ID, 'NAME', 'EMAIL', AGE)
            // We ignore the provided ID and use our auto-increment
            const name = parts[1].replace(/^'|'$/g, '');
            const email = parts[2].replace(/^'|'$/g, '');
            const age = parseInt(parts[3]);

            if (isNaN(age)) {
              throw new Error("Invalid age value. Age must be a number.");
            }

            const newUser: User = { id: nextId++, name, email, age };
            database.push(newUser);
            setQueryResult(`1 row inserted. New ID: ${newUser.id}`);
            toast.success("Row inserted successfully!");
          } else {
            throw new Error("Invalid INSERT syntax. Expected 4 values (ID, NAME, EMAIL, AGE).");
          }
        } else {
          throw new Error("Invalid INSERT syntax. Missing VALUES clause.");
        }
      } else if (upperCaseQuery.startsWith("UPDATE USERS")) {
        const setMatch = query.match(/SET\s+(.+?)(?:\s+WHERE\s+(.+))?$/i);
        if (setMatch) {
          const setClause = setMatch[1];
          const whereClause = setMatch[2];
          let updatedRows = 0;

          const updates: { [key: string]: any } = {};
          setClause.split(',').forEach(part => {
            const [key, value] = part.split('=').map(s => s.trim());
            updates[key.toUpperCase()] = value.replace(/^'|'$/g, '');
          });

          if (!whereClause) {
            throw new Error("UPDATE without WHERE clause is not supported in this demo to prevent accidental mass updates.");
          }

          const targetUsers = database.filter(user => {
            if (whereClause.includes("ID = ")) {
              const id = parseInt(whereClause.split("ID = ")[1].trim());
              return user.id === id;
            }
            return false; // Only ID-based WHERE is supported for UPDATE
          });

          targetUsers.forEach(user => {
            if (updates.NAME !== undefined) user.name = updates.NAME;
            if (updates.EMAIL !== undefined) user.email = updates.EMAIL;
            if (updates.AGE !== undefined) {
              const newAge = parseInt(updates.AGE);
              if (isNaN(newAge)) throw new Error("Invalid age value for UPDATE.");
              user.age = newAge;
            }
            updatedRows++;
          });
          setQueryResult(`${updatedRows} row(s) updated.`);
          toast.success(`${updatedRows} row(s) updated successfully!`);
        } else {
          throw new Error("Invalid UPDATE syntax.");
        }
      } else if (upperCaseQuery.startsWith("DELETE FROM USERS")) {
        const whereMatch = upperCaseQuery.match(/WHERE\s+(.+)/);
        if (whereMatch) {
          const condition = whereMatch[1].trim();
          let deletedRows = 0;
          if (condition.includes("ID = ")) {
            const idToDelete = parseInt(condition.split("ID = ")[1].trim());
            const initialLength = database.length;
            database = database.filter(user => user.id !== idToDelete);
            deletedRows = initialLength - database.length;
            setQueryResult(`${deletedRows} row(s) deleted.`);
            toast.success(`${deletedRows} row(s) deleted successfully!`);
          } else {
            throw new Error("Unsupported DELETE WHERE clause. Try 'DELETE FROM USERS WHERE ID = [id];'.");
          }
        } else {
          throw new Error("DELETE without WHERE clause is not supported in this demo to prevent accidental mass deletions.");
        }
      } else {
        throw new Error("Unsupported SQL query type. Try SELECT, INSERT, UPDATE, or DELETE on the 'USERS' table.");
      }
    } catch (e: any) {
      setError(`Error: ${e.message}`);
      toast.error(`Error: ${e.message}`);
    }
  };

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col space-y-6">
        {/* SQL Query Input */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="sql-query" className="text-sm font-medium text-slate-300">
            Enter SQL Query:
          </label>
          <textarea
            id="sql-query"
            className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
            placeholder={`Example queries:\nSELECT * FROM USERS;\nSELECT * FROM USERS WHERE AGE > 25;\nINSERT INTO USERS (ID, NAME, EMAIL, AGE) VALUES (NULL, 'David', 'david@example.com', 28);\nUPDATE USERS SET AGE = 31, EMAIL = 'alice.smith@example.com' WHERE ID = 1;\nDELETE FROM USERS WHERE ID = 2;`}
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            spellCheck="false"
          />
          <button
            onClick={handleRunQuery}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors self-start"
          >
            Run Query
          </button>
        </div>

        {/* Query Result */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold text-slate-200">Result:</h3>
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 font-mono text-sm">
              {error}
            </div>
          )}
          {queryResult && !error && (
            <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg overflow-auto max-h-96">
              {Array.isArray(queryResult) ? (
                queryResult.length > 0 ? (
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-700">
                      <tr>
                        {Object.keys(queryResult[0]).map((key) => (
                          <th
                            key={key}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {queryResult.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-700/50 transition-colors">
                          {Object.values(row).map((value, colIndex) => (
                            <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-slate-400 text-sm">No results found.</p>
                )
              ) : (
                <pre className="text-slate-200 font-mono text-sm whitespace-pre-wrap">
                  {String(queryResult)}
                </pre>
              )}
            </div>
          )}
          {!queryResult && !error && (
            <p className="text-slate-400 text-sm">Run a query to see results here.</p>
          )}
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;