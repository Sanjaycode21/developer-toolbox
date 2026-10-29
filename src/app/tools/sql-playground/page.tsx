'use client';

import { useState, useCallback, useEffect } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const toolSlug = "sql-playground";
const toolName = "SQL Playground";
const description = "Execute and test SQL queries against a simulated database environment.";

// Mock data for simulation
const mockUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com', created_at: '2023-01-01' },
  { id: 2, name: 'Bob', email: 'bob@example.com', created_at: '2023-02-15' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', created_at: '2023-03-20' },
];

const mockProducts = [
  { id: 101, name: 'Laptop', price: 1200.00, stock: 50 },
  { id: 102, name: 'Mouse', price: 25.50, stock: 200 },
  { id: 103, name: 'Keyboard', price: 75.99, stock: 100 },
];

// Simulated schema for display
const mockSchema = `
-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at DATE
);

-- Products Table
CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2),
    stock INT
);

-- Example Data
INSERT INTO users (id, name, email, created_at) VALUES (1, 'Alice', 'alice@example.com', '2023-01-01');
INSERT INTO users (id, name, email, created_at) VALUES (2, 'Bob', 'bob@example.com', '2023-02-15');
INSERT INTO users (id, name, email, created_at) VALUES (3, 'Charlie', 'charlie@example.com', '2023-03-20');

INSERT INTO products (id, name, price, stock) VALUES (101, 'Laptop', 1200.00, 50);
INSERT INTO products (id, name, price, stock) VALUES (102, 'Mouse', 25.50, 200);
INSERT INTO products (id, name, price, stock) VALUES (103, 'Keyboard', 75.99, 100);
`;

export default function SqlPlaygroundPage() {
  const [query, setQuery] = useState<string>('SELECT * FROM users;');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { addToHistory } = useToolStore();

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory]);

  const executeQuery = useCallback(async () => {
    setIsLoading(true);
    setOutput('Executing query...');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerCaseQuery = query.toLowerCase().trim();
    let result: any;
    let success = true;

    try {
      if (lowerCaseQuery.includes('select * from users')) {
        result = mockUsers;
      } else if (lowerCaseQuery.includes('select * from products')) {
        result = mockProducts;
      } else if (lowerCaseQuery.startsWith('insert into users') || lowerCaseQuery.startsWith('insert into products')) {
        result = { message: 'Row inserted successfully.', affectedRows: 1 };
      } else if (lowerCaseQuery.startsWith('update users') || lowerCaseQuery.startsWith('update products')) {
        result = { message: 'Row updated successfully.', affectedRows: 1 };
      } else if (lowerCaseQuery.startsWith('delete from users') || lowerCaseQuery.startsWith('delete from products')) {
        result = { message: 'Row deleted successfully.', affectedRows: 1 };
      } else if (lowerCaseQuery.startsWith('create table') || lowerCaseQuery.startsWith('drop table')) {
        result = { message: 'Schema operation simulated successfully.', affectedRows: 0 };
      } else {
        success = false;
        result = { error: 'Unsupported or invalid SQL query for this playground.' };
      }

      setOutput(JSON.stringify(result, null, 2));
      if (success) {
        toast.success('Query executed successfully!');
      } else {
        toast.error('Error executing query.');
      }
    } catch (e: any) {
      success = false;
      setOutput(JSON.stringify({ error: e.message || 'An unknown error occurred.' }, null, 2));
      toast.error('Error executing query.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleExampleQuery = useCallback((example: string) => {
    setQuery(example);
    setOutput(''); // Clear previous output
  }, []);

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Query Input and Controls */}
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200">SQL Query</h2>
            <button
              onClick={executeQuery}
              disabled={isLoading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Executing...' : 'Run Query'}
            </button>
          </div>
          <textarea
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-none"
            rows={10}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            spellCheck="false"
          />

          {/* Example Queries */}
          <div className="mt-4">
            <h3 className="text-md font-semibold text-slate-300 mb-2">Example Queries</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleExampleQuery('SELECT * FROM users;')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-md transition-colors"
              >
                SELECT * FROM users
              </button>
              <button
                onClick={() => handleExampleQuery('SELECT * FROM products;')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-md transition-colors"
              >
                SELECT * FROM products
              </button>
              <button
                onClick={() => handleExampleQuery('INSERT INTO users (id, name, email, created_at) VALUES (4, \'David\', \'david@example.com\', \'2023-04-01\');')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-md transition-colors"
              >
                INSERT User
              </button>
              <button
                onClick={() => handleExampleQuery('UPDATE products SET price = 1250.00 WHERE id = 101;')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-md transition-colors"
              >
                UPDATE Product
              </button>
              <button
                onClick={() => handleExampleQuery('DELETE FROM users WHERE id = 3;')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-md transition-colors"
              >
                DELETE User
              </button>
              <button
                onClick={() => handleExampleQuery('CREATE TABLE orders (order_id INT PRIMARY KEY, user_id INT);')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-md transition-colors"
              >
                CREATE Table
              </button>
            </div>
          </div>
        </div>

        {/* Output and Schema */}
        <div className="flex-1 flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-200 mb-2">Query Output</h2>
            <textarea
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-none"
              rows={10}
              value={output}
              readOnly
              placeholder="Query results will appear here..."
              spellCheck="false"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-200 mb-2">Simulated Schema</h2>
            <pre className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 font-mono text-xs overflow-auto max-h-64">
              <code>{mockSchema.trim()}</code>
            </pre>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}