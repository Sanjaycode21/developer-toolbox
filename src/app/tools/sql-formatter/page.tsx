"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';

const toolSlug = "sql-formatter";
const toolName = "SQL Formatter";
const toolDescription = "Format and beautify your SQL queries for better readability and consistency.";

// --- SQL Formatting Logic (Simplified) ---
// IMPORTANT: This is a basic, heuristic SQL formatter.
// A robust, production-grade SQL formatter would typically use a dedicated parsing library
// (e.g., sql-formatter-plus, prettier with a SQL plugin, or a custom parser).
// This implementation aims to provide reasonable formatting for common SQL queries
// by applying rules for capitalization, newlines, and basic indentation.
// It may not handle all complex SQL constructs perfectly and might produce
// sub-optimal results for very complex or malformed SQL.
function formatSql(sql: string): string {
  if (!sql.trim()) return '';

  // Normalize whitespace and remove leading/trailing spaces
  let formattedSql = sql.replace(/\s+/g, ' ').trim();

  // Define keywords that should start on a new line and potentially indent
  const blockKeywords = [
    'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
    'UNION', 'INTERSECT', 'EXCEPT',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'CREATE INDEX', 'DROP INDEX',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'JOIN', 'ON',
    'AND', 'OR'
  ];

  // Capitalize all keywords (including those not in blockKeywords for consistency)
  const allKeywords = [
    ...blockKeywords,
    'AS', 'DISTINCT', 'NULL', 'NOT NULL', 'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES',
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'IN', 'LIKE', 'BETWEEN', 'IS', 'EXISTS',
    'VARCHAR', 'INT', 'BIGINT', 'TEXT', 'DATE', 'DATETIME', 'TIMESTAMP', 'BOOLEAN', 'DECIMAL', 'NUMERIC'
  ];
  allKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword.replace(/\s/g, '\\s+')})\\b`, 'gi');
    formattedSql = formattedSql.replace(regex, (match) => match.toUpperCase());
  });

  // Add newlines before block keywords
  blockKeywords.forEach(keyword => {
    const regex = new RegExp(`\\s+\\b(${keyword.replace(/\s/g, '\\s+')})\\b`, 'g');
    formattedSql = formattedSql.replace(regex, (match) => `\n${match.trim()}`);
  });

  // Handle commas: put each item on a new line
  formattedSql = formattedSql.replace(/,\s*/g, ',\n');

  // Handle parentheses: newlines after opening, before closing
  formattedSql = formattedSql.replace(/\(\s*/g, '(\n');
  formattedSql = formattedSql.replace(/\s*\)/g, '\n)');

  // Split into lines and apply indentation
  const lines = formattedSql.split('\n').filter(line => line.trim() !== '');
  let currentIndent = 0;
  const indentStep = '  '; // 2 spaces
  const resultLines: string[] = [];

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Decrease indent for closing parentheses or 'END' / 'ELSE'
    if (trimmedLine.startsWith(')') || trimmedLine.toUpperCase().startsWith('END') || trimmedLine.toUpperCase().startsWith('ELSE')) {
      currentIndent = Math.max(0, currentIndent - 1);
    }

    resultLines.push(indentStep.repeat(currentIndent) + trimmedLine);

    // Increase indent for opening parentheses or block-starting keywords
    if (trimmedLine.startsWith('(') ||
        trimmedLine.toUpperCase().startsWith('SELECT') ||
        trimmedLine.toUpperCase().startsWith('FROM') ||
        trimmedLine.toUpperCase().startsWith('WHERE') ||
        trimmedLine.toUpperCase().includes('JOIN') ||
        trimmedLine.toUpperCase().startsWith('ON') ||
        trimmedLine.toUpperCase().startsWith('GROUP BY') ||
        trimmedLine.toUpperCase().startsWith('ORDER BY') ||
        trimmedLine.toUpperCase().startsWith('HAVING') ||
        trimmedLine.toUpperCase().startsWith('SET') ||
        trimmedLine.toUpperCase().startsWith('VALUES') ||
        trimmedLine.toUpperCase().startsWith('CASE') ||
        trimmedLine.toUpperCase().startsWith('THEN')) {
      currentIndent++;
    }
  });

  return resultLines.join('\n').trim();
}
// --- End SQL Formatting Logic ---

export default function SqlFormatterPage() {
  const [inputSql, setInputSql] = useState<string>('');
  const [outputSql, setOutputSql] = useState<string>('');
  const addToHistory = useToolStore((state) => state.addToHistory);

  const handleFormat = useCallback(() => {
    if (!inputSql.trim()) {
      setOutputSql('');
      toast.error('Please enter SQL to format.');
      return;
    }
    try {
      const formatted = formatSql(inputSql);
      setOutputSql(formatted);
      addToHistory(toolSlug);
      toast.success('SQL formatted successfully!');
    } catch (error) {
      console.error("SQL formatting error:", error);
      toast.error('Failed to format SQL. Please check your input.');
      setOutputSql('Error: Could not format SQL. Please check your input.');
    }
  }, [inputSql, addToHistory]);

  const handleClear = useCallback(() => {
    setInputSql('');
    setOutputSql('');
    toast.success('Cleared SQL inputs.');
  }, []);

  const handleCopyOutput = useCallback(async () => {
    if (outputSql) {
      try {
        await navigator.clipboard.writeText(outputSql);
        toast.success('Formatted SQL copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
        toast.error('Failed to copy SQL.');
      }
    } else {
      toast.error('No formatted SQL to copy.');
    }
  }, [outputSql]);

  // Example usage for initial load
  useEffect(() => {
    setInputSql(`SELECT id, name, email FROM users WHERE age > 25 AND city = 'New York' ORDER BY name ASC;`);
  }, []);

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={toolDescription}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Input Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="input-sql" className="block text-sm font-medium text-slate-300 mb-2">
            Input SQL
          </label>
          <textarea
            id="input-sql"
            className="flex-1 w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:border-indigo-500 font-mono text-sm resize-none"
            placeholder="Enter your SQL query here..."
            value={inputSql}
            onChange={(e) => setInputSql(e.target.value)}
            rows={15}
          ></textarea>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 lg:w-48">
          <button
            onClick={handleFormat}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Format SQL
          </button>
          <button
            onClick={handleCopyOutput}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Copy Output
          </button>
          <button
            onClick={handleClear}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Clear
          </button>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="output-sql" className="block text-sm font-medium text-slate-300 mb-2">
            Formatted SQL
          </label>
          <textarea
            id="output-sql"
            className="flex-1 w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:border-indigo-500 font-mono text-sm resize-none"
            placeholder="Formatted SQL will appear here..."
            value={outputSql}
            readOnly
            rows={15}
          ></textarea>
        </div>
      </div>
    </ToolPageWrapper>
  );
}