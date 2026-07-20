"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, Table, FileText, ChevronDown, ChevronUp } from 'lucide-react';

// --- CSV Parsing Logic ---
interface ParsedCSV {
    headers: string[];
    data: string[][];
}

/**
 * Parses a CSV string into headers and data rows.
 * Handles quoted fields, escaped quotes (""), and common delimiters.
 * Assumes newlines are row delimiters and not part of quoted fields.
 */
function parseCSV(csvString: string, delimiter: string = ',', hasHeader: boolean = true): ParsedCSV {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let inQuote = false;

    for (let i = 0; i < csvString.length; i++) {
        const char = csvString[i];
        const nextChar = csvString[i + 1];

        if (char === '"') {
            if (inQuote && nextChar === '"') { // Escaped quote: ""
                currentField += '"';
                i++; // Skip the next quote
            } else {
                inQuote = !inQuote;
            }
        } else if (char === delimiter && !inQuote) {
            currentRow.push(currentField);
            currentField = '';
        } else if ((char === '\n' || char === '\r') && !inQuote) {
            if (char === '\r' && nextChar === '\n') {
                i++; // Consume CRLF
            }
            currentRow.push(currentField);
            rows.push(currentRow);
            currentRow = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }
    // Add the last field and row if any content exists
    currentRow.push(currentField);
    if (currentRow.some(field => field.length > 0) || rows.length === 0) {
        rows.push(currentRow);
    }

    // Filter out empty rows that might result from trailing newlines or initial empty input
    const nonEmptyRows = rows.filter(row => row.some(field => field.trim().length > 0));

    if (nonEmptyRows.length === 0) {
        return { headers: [], data: [] };
    }

    let headers: string[] = [];
    let data: string[][] = [];

    if (hasHeader) {
        headers = nonEmptyRows[0].map(h => h.trim());
        data = nonEmptyRows.slice(1);
    } else {
        // Generate generic headers if no header row
        headers = Array.from({ length: nonEmptyRows[0].length }, (_, i) => `Column ${i + 1}`);
        data = nonEmptyRows;
    }

    // Trim data fields and ensure consistent column count
    data = data.map(row => row.map(field => field.trim()));
    // Filter out rows that don't match the header count, or pad them if needed (for now, filter)
    data = data.filter(row => row.length === headers.length);

    return { headers, data };
}

/**
 * Converts parsed CSV data into a JSON array of objects.
 */
function csvToJson(parsedCSV: ParsedCSV): string {
    const { headers, data } = parsedCSV;

    if (headers.length === 0 || data.length === 0) {
        return "[]";
    }

    const jsonArray = data.map(row => {
        const obj: { [key: string]: string } = {};
        headers.forEach((header, index) => {
            obj[header] = row[index];
        });
        return obj;
    });

    return JSON.stringify(jsonArray, null, 2);
}

// --- Component ---
const CSVViewerConverter: React.FC = () => {
    const [csvInput, setCsvInput] = useState<string>('');
    const [delimiter, setDelimiter] = useState<string>(',');
    const [hasHeader, setHasHeader] = useState<boolean>(true);
    const [outputFormat, setOutputFormat] = useState<'table' | 'json'>('table');
    const [showInputOptions, setShowInputOptions] = useState<boolean>(true);

    const { addToHistory } = useToolStore();

    useEffect(() => {
        addToHistory('csv-viewer-converter');
    }, [addToHistory]);

    const parsedCSV = useMemo(() => {
        if (!csvInput.trim()) {
            return { headers: [], data: [] };
        }
        try {
            return parseCSV(csvInput, delimiter, hasHeader);
        } catch (error) {
            console.error("Error parsing CSV:", error);
            toast.error("Failed to parse CSV. Check input and options.");
            return { headers: [], data: [] };
        }
    }, [csvInput, delimiter, hasHeader]);

    const jsonOutput = useMemo(() => {
        if (!csvInput.trim()) {
            return "[]";
        }
        try {
            return csvToJson(parsedCSV);
        } catch (error) {
            console.error("Error converting to JSON:", error);
            toast.error("Failed to convert to JSON.");
            return "[]";
        }
    }, [csvInput, parsedCSV]);

    const handleCopy = useCallback((text: string, type: string) => {
        navigator.clipboard.writeText(text)
            .then(() => toast.success(`${type} copied to clipboard!`))
            .catch(() => toast.error(`Failed to copy ${type}.`));
    }, []);

    const handleClear = useCallback(() => {
        setCsvInput('');
        toast.success('Input cleared!');
    }, []);

    const handlePaste = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText();
            setCsvInput(text);
            toast.success('Pasted from clipboard!');
        } catch (error) {
            toast.error('Failed to paste from clipboard.');
        }
    }, []);

    return (
        <ToolPageWrapper
            toolSlug="csv-viewer-converter"
            toolName="CSV Viewer & Converter"
            description="View, parse, and convert CSV data to a table or JSON format."
        >
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Input Section */}
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-semibold text-slate-200">CSV Input</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePaste}
                                className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-md transition-colors text-slate-200"
                            >
                                Paste
                            </button>
                            <button
                                onClick={handleClear}
                                className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-md transition-colors text-slate-200"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                    <textarea
                        className="w-full h-64 p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-50 font-mono text-sm resize-y"
                        placeholder="Paste your CSV data here..."
                        value={csvInput}
                        onChange={(e) => setCsvInput(e.target.value)}
                    />

                    {/* Input Options */}
                    <div className="mt-4 bg-slate-800 border border-slate-700 rounded-lg p-4">
                        <button
                            className="flex items-center justify-between w-full text-slate-200 font-medium mb-3"
                            onClick={() => setShowInputOptions(!showInputOptions)}
                        >
                            Input Options
                            {showInputOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {showInputOptions && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="delimiter" className="block text-sm font-medium text-slate-400 mb-1">
                                        Delimiter
                                    </label>
                                    <select
                                        id="delimiter"
                                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-md text-slate-50 text-sm focus:outline-none focus:border-indigo-500"
                                        value={delimiter}
                                        onChange={(e) => setDelimiter(e.target.value)}
                                    >
                                        <option value=",">Comma (,)</option>
                                        <option value=";">Semicolon (;)</option>
                                        <option value="\t">Tab</option>
                                        <option value="|">Pipe (|)</option>
                                    </select>
                                </div>
                                <div className="flex items-center mt-6 md:mt-0">
                                    <input
                                        type="checkbox"
                                        id="hasHeader"
                                        className="h-4 w-4 text-indigo-600 bg-slate-900 border-slate-700 rounded focus:ring-indigo-500"
                                        checked={hasHeader}
                                        onChange={(e) => setHasHeader(e.target.checked)}
                                    />
                                    <label htmlFor="hasHeader" className="ml-2 block text-sm text-slate-400">
                                        First row is header
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Output Section */}
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-semibold text-slate-200">Output</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setOutputFormat('table')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${outputFormat === 'table' ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}
                            >
                                <Table className="inline-block mr-1" size={16} /> Table
                            </button>
                            <button
                                onClick={() => setOutputFormat('json')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${outputFormat === 'json' ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}
                            >
                                <FileText className="inline-block mr-1" size={16} /> JSON
                            </button>
                            {outputFormat === 'json' && (
                                <button
                                    onClick={() => handleCopy(jsonOutput, 'JSON')}
                                    className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-md transition-colors text-slate-200"
                                >
                                    <Copy className="inline-block mr-1" size={16} /> Copy
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-auto">
                        {csvInput.trim() === '' ? (
                            <div className="text-slate-500 text-center py-10">
                                Enter CSV data to see the output.
                            </div>
                        ) : (
                            outputFormat === 'table' ? (
                                <div className="overflow-x-auto max-h-[500px]">
                                    {parsedCSV.headers.length > 0 && parsedCSV.data.length > 0 ? (
                                        <table className="min-w-full divide-y divide-slate-700 text-sm">
                                            <thead className="bg-slate-700 sticky top-0">
                                                <tr>
                                                    {parsedCSV.headers.map((header, index) => (
                                                        <th
                                                            key={index}
                                                            scope="col"
                                                            className="px-4 py-2 text-left font-medium text-slate-200 whitespace-nowrap"
                                                        >
                                                            {header}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800">
                                                {parsedCSV.data.map((row, rowIndex) => (
                                                    <tr key={rowIndex} className="hover:bg-slate-700/50 transition-colors">
                                                        {row.map((cell, cellIndex) => (
                                                            <td
                                                                key={cellIndex}
                                                                className="px-4 py-2 whitespace-nowrap text-slate-300"
                                                            >
                                                                {cell}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="text-slate-500 text-center py-10">
                                            No valid CSV data to display as table.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <pre className="text-slate-50 font-mono text-sm whitespace-pre-wrap break-all max-h-[500px] overflow-auto">
                                    <code>{jsonOutput}</code>
                                </pre>
                            )
                        )}
                    </div>
                </div>
            </div>
        </ToolPageWrapper>
    );
};

export default CSVViewerConverter;