"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Terminal, Database, Table, Play, RotateCcw, Info } from 'lucide-react';

// --- Mock Database Types and Initial Data ---
interface Row {
  [key: string]: any;
}

interface TableSchema {
  columns: string[];
  data: Row[];
  nextId: number;
}

interface DatabaseState {
  [tableName: string]: TableSchema;
}

const getInitialDb = (): DatabaseState => ({
  users: {
    columns: ['id', 'name', 'email', 'age'],
    data: [
      { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
      { id: 2, name: 'Bob', email: 'bob@example.com', age: 24 },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
    ],
    nextId: 4,
  },
  products: {
    columns: ['id', 'name', 'price', 'stock'],
    data: [
      { id: 101, name: 'Laptop', price: 1200, stock: 50 },
      { id: 102, name: 'Mouse', price: 25, stock: 200 },
      { id: 103, name: 'Keyboard', price: 75, stock: 150 },
    ],
    nextId: 104,
  },
});

// --- SQL Execution Logic ---
interface QueryResult {
  type: 'select' | 'mutation' | 'schema_change' | 'error';
  message?: string;
  data?: Row[];
  columns?: string[];
  rowsAffected?: number;
}

const executeSql = (sql: string, currentDb: DatabaseState): [QueryResult, DatabaseState] => {
  const db = JSON.parse(JSON.stringify(currentDb)) as DatabaseState; // Deep copy to avoid direct mutation
  const lowerSql = sql.trim().toLowerCase();
  let result: QueryResult;

  try {
    if (lowerSql.startsWith('select')) {
      const match = lowerSql.match(/select\s+(.*?)\s+from\s+(\w+)(?:\s+where\s+(.*))?/);
      if (!match) throw new Error('Invalid SELECT query syntax.');

      const [, columnsStr, tableName, whereClause] = match;
      const table = db[tableName];
      if (!table) throw new Error(`Table '${tableName}' not found.`);

      let results = table.data;

      if (whereClause) {
        const whereMatch = whereClause.match(/(\w+)\s*([<>=!]+)\s*(.+)/);
        if (!whereMatch) throw new Error('Invalid WHERE clause syntax.');
        const [, colName, operator, valueStr] = whereMatch;

        const targetValue = valueStr.startsWith("'") && valueStr.endsWith("'")
          ? valueStr.slice(1, -1)
          : parseFloat(valueStr);

        results = results.filter(row => {
          const rowValue = row[colName];
          if (rowValue === undefined) return false;

          switch (operator) {
            case '=': return rowValue == targetValue;
            case '!=': return rowValue != targetValue;
            case '>': return rowValue > targetValue;
            case '<': return rowValue < targetValue;
            case '>=': return rowValue >= targetValue;
            case '<=': return rowValue <= targetValue;
            default: return false;
          }
        });
      }

      const selectedColumns = columnsStr === '*' ? table.columns : columnsStr.split(',').map(c => c.trim());
      const finalData = results.map(row => {
        const newRow: Row = {};
        for (const col of selectedColumns) {
          if (table.columns.includes(col)) {
            newRow[col] = row[col];
          } else {
            newRow[col] = null; // Column not found in table schema
          }
        }
        return newRow;
      });

      result = { type: 'select', data: finalData, columns: selectedColumns };
      return [result, currentDb]; // SELECT doesn't change the DB state

    } else if (lowerSql.startsWith('insert into')) {
      const match = lowerSql.match(/insert into\s+(\w+)\s+\((.*?)\)\s+values\s+\((.*?)\)/);
      if (!match) throw new Error('Invalid INSERT query syntax.');

      const [, tableName, columnsStr, valuesStr] = match;
      const table = db[tableName];
      if (!table) throw new Error(`Table '${tableName}' not found.`);

      const columns = columnsStr.split(',').map(c => c.trim());
      const values = valuesStr.split(',').map(v => v.trim().replace(/^'(.*)'$/, '$1'));

      if (columns.length !== values.length) throw new Error('Column and value count mismatch.');

      const newRow: Row = {};
      let hasId = false;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const val = values[i];
        if (col === 'id') hasId = true;
        newRow[col] = isNaN(parseFloat(val)) || val.startsWith("'") ? val : parseFloat(val);
      }

      if (!hasId && table.columns.includes('id')) {
        newRow.id = table.nextId++;
      }

      table.data.push(newRow);
      result = { type: 'mutation', message: `1 row inserted into ${tableName}.`, rowsAffected: 1, data: [newRow] };
      return [result, db];

    } else if (lowerSql.startsWith('update')) {
      const match = lowerSql.match(/update\s+(\w+)\s+set\s+(.*?)(?:\s+where\s+(.*))?/);
      if (!match) throw new Error('Invalid UPDATE query syntax.');

      const [, tableName, setClause, whereClause] = match;
      const table = db[tableName];
      if (!table) throw new Error(`Table '${tableName}' not found.`);

      const updates: Row = {};
      setClause.split(',').forEach(part => {
        const [key, val] = part.split('=').map(s => s.trim());
        updates[key] = val.startsWith("'") && val.endsWith("'")
          ? val.slice(1, -1)
          : parseFloat(val);
      });

      let rowsAffected = 0;
      table.data = table.data.map(row => {
        let shouldUpdate = true;
        if (whereClause) {
          const whereMatch = whereClause.match(/(\w+)\s*([<>=!]+)\s*(.+)/);
          if (!whereMatch) throw new Error('Invalid WHERE clause syntax.');
          const [, colName, operator, valueStr] = whereMatch;

          const targetValue = valueStr.startsWith("'") && valueStr.endsWith("'")
            ? valueStr.slice(1, -1)
            : parseFloat(valueStr);

          const rowValue = row[colName];
          if (rowValue === undefined) shouldUpdate = false;
          else {
            switch (operator) {
              case '=': shouldUpdate = rowValue == targetValue; break;
              case '!=': shouldUpdate = rowValue != targetValue; break;
              case '>': shouldUpdate = rowValue > targetValue; break;
              case '<': shouldUpdate = rowValue < targetValue; break;
              case '>=': shouldUpdate = rowValue >= targetValue; break;
              case '<=': shouldUpdate = rowValue <= targetValue; break;
              default: shouldUpdate = false;
            }
          }
        }

        if (shouldUpdate) {
          rowsAffected++;
          return { ...row, ...updates };
        }
        return row;
      });
      result = { type: 'mutation', message: `${rowsAffected} row(s) updated in ${tableName}.`, rowsAffected, data: table.data };
      return [result, db];

    } else if (lowerSql.startsWith('delete from')) {
      const match = lowerSql.match(/delete from\s+(\w+)(?:\s+where\s+(.*))?/);
      if (!match) throw new Error('Invalid DELETE query syntax.');

      const [, tableName, whereClause] = match;
      const table = db[tableName];
      if (!table) throw new Error(`Table '${tableName}' not found.`);

      let initialCount = table.data.length;
      if (whereClause) {
        const whereMatch = whereClause.match(/(\w+)\s*([<>=!]+)\s*(.+)/);
        if (!whereMatch) throw new Error('Invalid WHERE clause syntax.');
        const [, colName, operator, valueStr] = whereMatch;

        const targetValue = valueStr.startsWith("'") && valueStr.endsWith("'")
          ? valueStr.slice(1, -1)
          : parseFloat(valueStr);

        table.data = table.data.filter(row => {
          const rowValue = row[colName];
          if (rowValue === undefined) return true; // Keep if column not present
          switch (operator) {
            case '=': return rowValue != targetValue;
            case '!=': return rowValue == targetValue;
            case '>': return rowValue <= targetValue;
            case '<': return rowValue >= targetValue;
            case '>=': return rowValue < targetValue;
            case '<=': return rowValue > targetValue;
            default: return true;
          }
        });
      } else {
        table.data = [];
      }
      const rowsAffected = initialCount - table.data.length;
      result = { type: 'mutation', message: `${rowsAffected} row(s) deleted from ${tableName}.`, rowsAffected, data: table.data };
      return [result, db];

    } else if (lowerSql.startsWith('create table')) {
      const match = lowerSql.match(/create table\s+(\w+)\s+\((.*?)\)/);
      if (!match) throw new Error('Invalid CREATE TABLE query syntax.');

      const [, tableName, columnsDefStr] = match;
      if (db[tableName]) throw new Error(`Table '${tableName}' already exists.`);

      const columns = columnsDefStr.split(',').map(colDef => colDef.trim().split(/\s+/)[0]);
      if (!columns.includes('id')) {
        columns.unshift('id');
      }

      db[tableName] = { columns, data: [], nextId: 1 };
      result = { type: 'schema_change', message: `Table '${tableName}' created.`, data: [] };
      return [result, db];

    } else if (lowerSql.startsWith('drop table')) {
      const match = lowerSql.match(/drop table\s+(\w+)/);
      if (!match) throw new Error('Invalid DROP TABLE query syntax.');

      const [, tableName] = match;
      if (!db[tableName]) throw new Error(`Table '${tableName}' not found.`);

      delete db[tableName];
      result = { type: 'schema_change', message: `Table '${tableName}' dropped.`, data: [] };
      return [result, db];

    } else {
      throw new Error('Unsupported SQL command.');
    }
  } catch (error: any) {
    result = { type: 'error', message: error.message };
    return [result, currentDb]; // Error doesn't change the DB state
  }
};

// --- React Component ---
const SQLPlaygroundPage: React.FC = () => {
  const toolSlug = "sql-playground";
  const { addToHistory } = useToolStore();

  const [sqlQuery, setSqlQuery] = useState<string>(`SELECT * FROM users;`);
  const [dbState, setDbState] = useState<DatabaseState>(getInitialDb());
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);

  const handleRunQuery = useCallback(() => {
    addToHistory(toolSlug);
    const [result, newDbState] = executeSql(sqlQuery, dbState);
    setQueryResult(result);
    setDbState(newDbState); // Update DB state if mutation occurred

    if (result.type === 'error') {
      toast.error(result.message || 'An unknown error occurred.');
    } else {
      toast.success(result.message || 'Query executed successfully.');
    }
  }, [sqlQuery, dbState, addToHistory, toolSlug]);

  const handleResetDb = useCallback(() => {
    setDbState(getInitialDb());
    setQueryResult(null);
    setSqlQuery(`SELECT * FROM users;`);
    toast.success('Database reset to initial state.');
  }, []);

  const availableTables = useMemo(() => Object.keys(dbState), [dbState]);

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="SQL Playground"
      description="Execute SQL queries against an in-memory database. Supports basic SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, and DROP TABLE statements."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
        {/* Left Panel: Query Editor */}
        <div className="flex-1 flex flex-col bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" /> SQL Query Editor
          </h2>
          <textarea
            className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-md p-4 text-slate-50 font-mono text-sm resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            rows={10}
          />
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleRunQuery}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors shadow-md"
            >
              <Play className="w-4 h-4" /> Run Query
            </button>
            <button
              onClick={handleResetDb}
              className="flex items-center gap-2 px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-md transition-colors shadow-md"
            >
              <RotateCcw className="w-4 h-4" /> Reset Database
            </button>
          </div>
        </div>

        {/* Right Panel: Results & Schema */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Query Results */}
          <div className="flex-1 bg-slate-800 rounded-lg shadow-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-400" /> Query Results
            </h2>
            {queryResult && queryResult.type === 'error' && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md font-mono text-sm">
                <p className="font-bold mb-2">Error:</p>
                <p>{queryResult.message}</p>
              </div>
            )}
            {queryResult && queryResult.type !== 'error' && (
              <>
                {queryResult.message && (
                  <p className="text-emerald-400 text-sm mb-2">{queryResult.message}</p>
                )}
                {queryResult.data && queryResult.data.length > 0 ? (
                  <div className="overflow-auto max-h-[300px] border border-slate-700 rounded-md">
                    <table className="min-w-full divide-y divide-slate-700">
                      <thead className="bg-slate-700 sticky top-0">
                        <tr>
                          {queryResult.columns?.map((col) => (
                            <th
                              key={col}
                              scope="col"
                              className="px-4 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-slate-800 divide-y divide-slate-700">
                        {queryResult.data.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-slate-700/50 transition-colors">
                            {queryResult.columns?.map((col) => (
                              <td
                                key={`${rowIndex}-${col}`}
                                className="px-4 py-2 whitespace-nowrap text-sm text-slate-300"
                              >
                                {String(row[col])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  queryResult.type === 'select' && <p className="text-slate-400 text-sm">No results found.</p>
                )}
              </>
            )}
            {!queryResult && (
              <p className="text-slate-400 text-sm">Run a query to see results here.</p>
            )}
          </div>

          {/* Database Schema */}
          <div className="bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" /> Database Schema
            </h2>
            {availableTables.length > 0 ? (
              <div className="space-y-4">
                {availableTables.map(tableName => (
                  <div key={tableName} className="bg-slate-900 border border-slate-700 rounded-md p-3">
                    <h3 className="font-medium text-slate-200 flex items-center gap-2 mb-1">
                      <Table className="w-4 h-4 text-purple-300" /> {tableName}
                    </h3>
                    <p className="text-sm text-slate-400">
                      Columns: {dbState[tableName].columns.join(', ')}
                    </p>
                    <p className="text-sm text-slate-400">
                      Rows: {dbState[tableName].data.length}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No tables currently in the database.</p>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default SQLPlaygroundPage;