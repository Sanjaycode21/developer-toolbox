"use client";

import React, { useState, useCallback, useEffect } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';
import { Clock, Copy } from 'lucide-react';

const UnixTimestampEpochConverterPage: React.FC = () => {
  const [timestampInput, setTimestampInput] = useState<string>('');
  const [timestampUnit, setTimestampUnit] = useState<'seconds' | 'milliseconds'>('seconds');
  const [convertedDate, setConvertedDate] = useState<string>('');

  const [dateInput, setDateInput] = useState<string>('');
  const [convertedTimestampSeconds, setConvertedTimestampSeconds] = useState<string>('');
  const [convertedTimestampMilliseconds, setConvertedTimestampMilliseconds] = useState<string>('');

  // Function to convert timestamp to date
  const convertTimestampToDate = useCallback(() => {
    if (!timestampInput) {
      setConvertedDate('');
      return;
    }

    const numTimestamp = parseFloat(timestampInput);
    if (isNaN(numTimestamp)) {
      setConvertedDate('Invalid timestamp');
      toast.error('Please enter a valid number for the timestamp.');
      return;
    }

    const ms = timestampUnit === 'seconds' ? numTimestamp * 1000 : numTimestamp;
    const date = new Date(ms);

    if (isNaN(date.getTime())) {
      setConvertedDate('Invalid date');
      toast.error('Could not convert timestamp to a valid date.');
      return;
    }

    setConvertedDate(date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
      hour12: false, // Use 24-hour format
    }));
  }, [timestampInput, timestampUnit]);

  // Function to convert date to timestamp
  const convertDateToTimestamp = useCallback(() => {
    if (!dateInput) {
      setConvertedTimestampSeconds('');
      setConvertedTimestampMilliseconds('');
      return;
    }

    const date = new Date(dateInput);

    if (isNaN(date.getTime())) {
      setConvertedTimestampSeconds('Invalid date');
      setConvertedTimestampMilliseconds('Invalid date');
      toast.error('Please enter a valid date string (e.g., "2023-10-27 10:30:00 GMT").');
      return;
    }

    const ms = date.getTime();
    const seconds = Math.floor(ms / 1000);

    setConvertedTimestampMilliseconds(ms.toString());
    setConvertedTimestampSeconds(seconds.toString());
  }, [dateInput]);

  // Function to get current timestamp
  const getCurrentTimestamp = useCallback(() => {
    const now = Date.now(); // milliseconds
    setTimestampInput(now.toString());
    setTimestampUnit('milliseconds');
    toast.success('Current timestamp loaded.');
  }, []);

  // Effect to re-convert when inputs change
  useEffect(() => {
    convertTimestampToDate();
  }, [timestampInput, timestampUnit, convertTimestampToDate]);

  useEffect(() => {
    convertDateToTimestamp();
  }, [dateInput, convertDateToTimestamp]);

  const copyToClipboard = useCallback((text: string, label: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } else {
      toast.error(`Nothing to copy for ${label}.`);
    }
  }, []);

  return (
    <ToolPageWrapper
      toolSlug="unix-timestamp-epoch-converter"
      toolName="Unix Timestamp & Epoch Converter"
      description="Convert Unix timestamps to human-readable dates and vice-versa."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timestamp to Date Converter */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Timestamp to Date
          </h2>
          <div className="mb-4">
            <label htmlFor="timestampInput" className="block text-sm font-medium text-slate-300 mb-2">
              Unix Timestamp
            </label>
            <div className="flex gap-2">
              <input
                id="timestampInput"
                type="text"
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
                placeholder="e.g., 1678886400 or 1678886400000"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
              />
              <select
                value={timestampUnit}
                onChange={(e) => setTimestampUnit(e.target.value as 'seconds' | 'milliseconds')}
                className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
              >
                <option value="seconds">Seconds</option>
                <option value="milliseconds">Milliseconds</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={convertTimestampToDate}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
            >
              Convert Timestamp
            </button>
            <button
              onClick={getCurrentTimestamp}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-md transition-colors text-sm"
            >
              Get Current Timestamp
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Converted Date
            </label>
            <div className="relative">
              <textarea
                readOnly
                value={convertedDate}
                placeholder="Converted date will appear here..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm resize-none"
              />
              <button
                onClick={() => copyToClipboard(convertedDate, 'Converted Date')}
                className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-white transition-colors"
                aria-label="Copy converted date"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Date to Timestamp Converter */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Date to Timestamp
          </h2>
          <div className="mb-4">
            <label htmlFor="dateInput" className="block text-sm font-medium text-slate-300 mb-2">
              Date & Time String
            </label>
            <input
              id="dateInput"
              type="text"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              placeholder="e.g., 2023-10-27 10:30:00 GMT"
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
            />
            <p className="text-xs text-slate-400 mt-1">
              (Uses browser's date parsing. For best results, include timezone.)
            </p>
          </div>

          <div className="mb-6">
            <button
              onClick={convertDateToTimestamp}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
            >
              Convert Date
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Unix Timestamp (Seconds)
            </label>
            <div className="relative">
              <input
                readOnly
                value={convertedTimestampSeconds}
                placeholder="Timestamp in seconds..."
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
              />
              <button
                onClick={() => copyToClipboard(convertedTimestampSeconds, 'Timestamp (Seconds)')}
                className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-white transition-colors"
                aria-label="Copy timestamp in seconds"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Unix Timestamp (Milliseconds)
            </label>
            <div className="relative">
              <input
                readOnly
                value={convertedTimestampMilliseconds}
                placeholder="Timestamp in milliseconds..."
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
              />
              <button
                onClick={() => copyToClipboard(convertedTimestampMilliseconds, 'Timestamp (Milliseconds)')}
                className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-white transition-colors"
                aria-label="Copy timestamp in milliseconds"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default UnixTimestampEpochConverterPage;