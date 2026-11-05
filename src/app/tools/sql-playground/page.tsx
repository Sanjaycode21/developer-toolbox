"use client";

import React, { useState, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const SQLPlaygroundPage: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState<string>(`SELECT * FROM users WHERE id = 1;

-- Example Schema:
--
-- CREATE TABLE users (
--   id INT PRIMARY KEY,
--   name VARCHAR(255),
--   email VARCHAR(255) UNIQUE
-- );
--
-- CREATE TABLE products (
--   product_id INT PRIMARY KEY,
--   product_name VARCHAR(255),
--   price DECIMAL(10, 2)
-- );
--
-- INSERT INTO users (id, name, email) VALUES
-- (1, 'Alice', 'alice@example.com'),
-- (2, 'Bob', 'bob@example.com');
--
-- INSERT INTO products (product_id, product_name, price) VALUES
-- (101, 'Laptop', 1200.00),
-- (102, 'Mouse', 25.00);
`);
  const [queryResult, setQueryResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const addToHistory = useToolStore((state) => state.addToHistory);

  const handleRunQuery = useCallback(() => {
    if (!sqlQuery.trim()) {
      toast.error('Please enter an SQL query.');
      return;
    }

    setIsLoading(true);
    setQueryResult(''); // Clear previous results

    // Simulate API call or processing delay
    setTimeout(() => {
      let result = '';
      const lowerCaseQuery = sqlQuery.toLowerCase();

      if (lowerCaseQuery.includes('drop table') || (lowerCaseQuery.includes('delete from') && !lowerCaseQuery.includes('where'))) {
        result = `ERROR: Dangerous query detected. Operation aborted.
Query:
${sqlQuery}`;
        toast.error('Dangerous query detected!');
      } else if (lowerCaseQuery.includes('select')) {
        result = `Query executed successfully.
Simulated Result:
+----+-------+-------------------+
| id | name  | email             |
+----+-------+-------------------+
| 1  | Alice | alice@example.com |
| 2  | Bob   | bob@example.com   |
+----+-------+-------------------+
(2 rows affected)

Query:
${sqlQuery}`;
        toast.success('Query executed successfully!');
      } else if (lowerCaseQuery.includes('insert into') || lowerCaseQuery.includes('update') || lowerCaseQuery.includes('create table')) {
        result = `Query executed successfully.
(1 row affected)

Query:
${sqlQuery}`;
        toast.success('Query executed successfully!');
      } else {
        result = `Query executed successfully.
No specific result to display for this type of query.

Query:
${sqlQuery}`;
        toast.success('Query executed successfully!');
      }

      setQueryResult(result);
      setIsLoading(false);
      addToHistory('sql-playground');
    }, 1000); // Simulate 1 second delay
  }, [sqlQuery, addToHistory]);

  const handleClear = useCallback(() => {
    setSqlQuery('');
    setQueryResult('');
    toast.success('Input and output cleared!');
  }, []);

  return (
    <ToolPageWrapper
      toolSlug="sql-playground"
      toolName="SQL Playground"
      description="Test and format SQL queries in a simulated environment."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Input Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-input" className="block text-sm font-medium text-slate-300 mb-2">
            SQL Query
          </label>
          <textarea
            id="sql-input"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:border-indigo-500 font-mono text-sm resize-y min-h-[200px] lg:min-h-[unset]"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            spellCheck="false"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleRunQuery}
              disabled={isLoading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? 'Running...' : 'Run Query'}
            </button>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="sql-output" className="block text-sm font-medium text-slate-300 mb-2">
            Query Result
          </label>
          <textarea
            id="sql-output"
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:border-indigo-500 font-mono text-sm resize-y min-h-[200px] lg:min-h-[unset]"
            value={queryResult}
            readOnly
            placeholder="Results will appear here after running a query..."
            spellCheck="false"
          />
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;