"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { Clock, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const UnixTimestampEpochConverterPage = () => {
  const [timestampInput, setTimestampInput] = useState<string>('');
  const [timestampUnit, setTimestampUnit] = useState<'seconds' | 'milliseconds'>('seconds');
  const [convertedDate, setConvertedDate] = useState<string>('');

  const [dateInput, setDateInput] = useState<string>('');
  const [convertedSeconds, setConvertedSeconds] = useState<string>('');
  const [convertedMilliseconds, setConvertedMilliseconds] = useState<string>('');

  const formatDate = useCallback((ms: number): string => {
    if (isNaN(ms) || ms <= 0) {
      return 'Invalid Date';
    }
    try {
      const date = new Date(ms);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
        hour12: false,
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }, []);

  const convertTimestampToDate = useCallback(() => {
    const numTimestamp = parseFloat(timestampInput);
    if (isNaN(numTimestamp)) {
      setConvertedDate('Invalid Timestamp');
      return;
    }

    let ms = numTimestamp;
    if (timestampUnit === 'seconds') {
      ms *= 1000;
    }
    setConvertedDate(formatDate(ms));
  }, [timestampInput, timestampUnit, formatDate]);

  const convertDateToTimestamp = useCallback(() => {
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        setConvertedSeconds('Invalid Date');
        setConvertedMilliseconds('Invalid Date');
        return;
      }
      const ms = date.getTime();
      setConvertedMilliseconds(ms.toString());
      setConvertedSeconds(Math.floor(ms / 1000).toString());
    } catch (error) {
      setConvertedSeconds('Invalid Date');
      setConvertedMilliseconds('Invalid Date');
    }
  }, [dateInput]);

  useEffect(() => {
    convertTimestampToDate();
  }, [timestampInput, timestampUnit, convertTimestampToDate]);

  useEffect(() => {
    convertDateToTimestamp();
  }, [dateInput, convertDateToTimestamp]);

  useEffect(() => {
    // Set initial current date/time for the date input
    const now = new Date();
    setDateInput(now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$1-$2T$4:$5:$6')); // Format to YYYY-MM-DDTHH:MM:SS for better browser compatibility
    
    // Set initial current timestamp for the timestamp input
    const currentMs = Date.now();
    setTimestampInput(timestampUnit === 'seconds' ? Math.floor(currentMs / 1000).toString() : currentMs.toString());
  }, [timestampUnit]); // Re-run if unit changes to update current timestamp

  const handleTimestampInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimestampInput(e.target.value);
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInput(e.target.value);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (text === 'Invalid Date' || text === 'Invalid Timestamp' || !text) {
      toast.error(`Cannot copy ${label}: value is invalid or empty.`);
      return;
    }
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`${label} copied to clipboard!`))
      .catch(() => toast.error(`Failed to copy ${label}.`));
  };

  const setCurrentTimestamp = () => {
    const now = Date.now();
    const currentTimestamp = timestampUnit === 'seconds' ? Math.floor(now / 1000) : now;
    setTimestampInput(currentTimestamp.toString());
  };

  const setCurrentDate = () => {
    const now = new Date();
    setDateInput(now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$1-$2T$4:$5:$6'));
  };

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
                onChange={handleTimestampInputChange}
                placeholder="e.g., 1678886400 or 1678886400000"
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2.5 text-slate-100 placeholder-slate-500 text-sm transition-colors"
              />
              <button
                onClick={setCurrentTimestamp}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-md shadow-sm text-sm font-medium transition-colors"
              >
                Current
              </button>
            </div>
          </div>

          <div className="mb-6">
            <span className="block text-sm font-medium text-slate-300 mb-2">Unit</span>
            <div className="flex space-x-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600 bg-slate-900 border-slate-600 focus:ring-indigo-500"
                  name="timestampUnit"
                  value="seconds"
                  checked={timestampUnit === 'seconds'}
                  onChange={() => setTimestampUnit('seconds')}
                />
                <span className="ml-2 text-slate-300 text-sm">Seconds (Epoch)</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600 bg-slate-900 border-slate-600 focus:ring-indigo-500"
                  name="timestampUnit"
                  value="milliseconds"
                  checked={timestampUnit === 'milliseconds'}
                  onChange={() => setTimestampUnit('milliseconds')}
                />
                <span className="ml-2 text-slate-300 text-sm">Milliseconds</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Converted Date & Time
            </label>
            <div className="relative">
              <input
                type="text"
                value={convertedDate}
                readOnly
                className="w-full bg-slate-900 border border-slate-700 rounded-md shadow-sm p-2.5 pr-10 text-slate-100 text-sm font-mono cursor-text"
                placeholder="Result will appear here..."
              />
              <button
                onClick={() => copyToClipboard(convertedDate, 'Converted Date')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-indigo-400 transition-colors"
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
              Date & Time
            </label>
            <div className="flex gap-2">
              <input
                id="dateInput"
                type="text" // Using text for flexibility, could be datetime-local
                value={dateInput}
                onChange={handleDateInputChange}
                placeholder="e.g., 2023-03-15T00:00:00 or March 15, 2023 12:00:00 AM GMT"
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2.5 text-slate-100 placeholder-slate-500 text-sm transition-colors"
              />
              <button
                onClick={setCurrentDate}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-md shadow-sm text-sm font-medium transition-colors"
              >
                Current
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Enter a date string. Examples: "2023-03-15T00:00:00", "March 15, 2023 12:00:00 AM GMT", "now".
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Converted Unix Timestamp (Seconds)
            </label>
            <div className="relative">
              <input
                type="text"
                value={convertedSeconds}
                readOnly
                className="w-full bg-slate-900 border border-slate-700 rounded-md shadow-sm p-2.5 pr-10 text-slate-100 text-sm font-mono cursor-text"
                placeholder="Result will appear here..."
              />
              <button
                onClick={() => copyToClipboard(convertedSeconds, 'Unix Timestamp (Seconds)')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                aria-label="Copy converted seconds timestamp"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Converted Unix Timestamp (Milliseconds)
            </label>
            <div className="relative">
              <input
                type="text"
                value={convertedMilliseconds}
                readOnly
                className="w-full bg-slate-900 border border-slate-700 rounded-md shadow-sm p-2.5 pr-10 text-slate-100 text-sm font-mono cursor-text"
                placeholder="Result will appear here..."
              />
              <button
                onClick={() => copyToClipboard(convertedMilliseconds, 'Unix Timestamp (Milliseconds)')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                aria-label="Copy converted milliseconds timestamp"
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