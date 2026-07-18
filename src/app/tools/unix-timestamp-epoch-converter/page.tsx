"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, Copy, Calendar, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';

const toolSlug = "unix-timestamp-epoch-converter";
const toolName = "Unix Timestamp & Epoch Converter";
const description = "Convert Unix timestamps to human-readable dates and vice-versa.";

export default function UnixTimestampEpochConverterPage() {
  const { addToHistory } = useToolStore();

  const [timestampInput, setTimestampInput] = useState<string>('');
  const [timestampUnit, setTimestampUnit] = useState<'seconds' | 'milliseconds'>('seconds');
  const [convertedDate, setConvertedDate] = useState<string>('');

  const [dateInput, setDateInput] = useState<string>('');
  const [convertedTimestampSeconds, setConvertedTimestampSeconds] = useState<string>('');
  const [convertedTimestampMilliseconds, setConvertedTimestampMilliseconds] = useState<string>('');

  const [currentTimestampSeconds, setCurrentTimestampSeconds] = useState<string>('');
  const [currentTimestampMilliseconds, setCurrentTimestampMilliseconds] = useState<string>('');

  const timestampInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // --- Helper Functions ---
  const copyToClipboard = useCallback((text: string, label: string) => {
    if (!text) {
      toast.error(`Nothing to copy for ${label}.`);
      return;
    }
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`${label} copied to clipboard!`))
      .catch(() => toast.error(`Failed to copy ${label}.`));
  }, []);

  const formatDate = useCallback((ms: number | null): string => {
    if (ms === null || isNaN(ms)) return '';
    try {
      return new Date(ms).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Use 24-hour format
        timeZoneName: 'short',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }, []);

  const parseDateToMs = useCallback((dateString: string): number | null => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date.getTime();
    } catch (error) {
      return null;
    }
  }, []);

  // --- Conversion Logic ---

  // Timestamp to Date
  const convertTimestampToDate = useCallback(() => {
    addToHistory(toolSlug);
    const numTimestamp = parseFloat(timestampInput);
    if (isNaN(numTimestamp)) {
      setConvertedDate('');
      return;
    }

    let ms = numTimestamp;
    if (timestampUnit === 'seconds') {
      ms *= 1000;
    }
    setConvertedDate(formatDate(ms));
  }, [timestampInput, timestampUnit, formatDate, addToHistory]);

  // Date to Timestamp
  const convertDateToTimestamp = useCallback(() => {
    addToHistory(toolSlug);
    const ms = parseDateToMs(dateInput);
    if (ms === null) {
      setConvertedTimestampSeconds('');
      setConvertedTimestampMilliseconds('');
      return;
    }
    setConvertedTimestampMilliseconds(ms.toString());
    setConvertedTimestampSeconds(Math.floor(ms / 1000).toString());
  }, [dateInput, parseDateToMs, addToHistory]);

  // --- Effects ---

  // Update current timestamps periodically
  useEffect(() => {
    const updateCurrentTimestamps = () => {
      const now = Date.now();
      setCurrentTimestampMilliseconds(now.toString());
      setCurrentTimestampSeconds(Math.floor(now / 1000).toString());
    };

    updateCurrentTimestamps(); // Initial update
    const intervalId = setInterval(updateCurrentTimestamps, 1000); // Update every second
    return () => clearInterval(intervalId);
  }, []);

  // Debounce timestamp input conversion
  useEffect(() => {
    const handler = setTimeout(() => {
      convertTimestampToDate();
    }, 300); // Debounce for 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [timestampInput, timestampUnit, convertTimestampToDate]);

  // Debounce date input conversion
  useEffect(() => {
    const handler = setTimeout(() => {
      convertDateToTimestamp();
    }, 300); // Debounce for 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [dateInput, convertDateToTimestamp]);

  // Set initial date input to current date/time
  useEffect(() => {
    setDateInput(new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }));
  }, []);

  // --- Event Handlers ---
  const handleTimestampInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimestampInput(e.target.value);
  };

  const handleTimestampUnitChange = (unit: 'seconds' | 'milliseconds') => {
    setTimestampUnit(unit);
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInput(e.target.value);
  };

  const handleGetCurrentTimestamp = () => {
    const now = Date.now();
    if (timestampUnit === 'seconds') {
      setTimestampInput(Math.floor(now / 1000).toString());
    } else {
      setTimestampInput(now.toString());
    }
    timestampInputRef.current?.focus();
  };

  const handleClearTimestampInput = () => {
    setTimestampInput('');
    setConvertedDate('');
    timestampInputRef.current?.focus();
  };

  const handleClearDateInput = () => {
    setDateInput('');
    setConvertedTimestampSeconds('');
    setConvertedTimestampMilliseconds('');
    dateInputRef.current?.focus();
  };

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName={toolName}
      description={description}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timestamp to Date Converter */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Hash className="h-5 w-5 text-indigo-400" /> Timestamp to Date
          </h2>
          <div className="mb-4">
            <label htmlFor="timestampInput" className="block text-sm font-medium text-slate-300 mb-2">
              Unix Timestamp
            </label>
            <input
              ref={timestampInputRef}
              type="text"
              id="timestampInput"
              value={timestampInput}
              onChange={handleTimestampInputChange}
              placeholder="e.g., 1678886400 or 1678886400000"
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="mb-6">
            <span className="block text-sm font-medium text-slate-300 mb-2">Unit</span>
            <div className="flex space-x-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500"
                  name="timestampUnit"
                  value="seconds"
                  checked={timestampUnit === 'seconds'}
                  onChange={() => handleTimestampUnitChange('seconds')}
                />
                <span className="ml-2 text-slate-300">Seconds (Epoch)</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500"
                  name="timestampUnit"
                  value="milliseconds"
                  checked={timestampUnit === 'milliseconds'}
                  onChange={() => handleTimestampUnitChange('milliseconds')}
                />
                <span className="ml-2 text-slate-300">Milliseconds</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Converted Date/Time
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={convertedDate}
                placeholder="Result will appear here"
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-text"
              />
              <button
                onClick={() => copyToClipboard(convertedDate, 'Converted Date')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
                aria-label="Copy converted date"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <button
              onClick={handleGetCurrentTimestamp}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Clock className="h-4 w-4" /> Get Current Timestamp
            </button>
            <button
              onClick={handleClearTimestampInput}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Date to Timestamp Converter */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-400" /> Date to Timestamp
          </h2>
          <div className="mb-4">
            <label htmlFor="dateInput" className="block text-sm font-medium text-slate-300 mb-2">
              Date and Time (Local)
            </label>
            <input
              ref={dateInputRef}
              type="text"
              id="dateInput"
              value={dateInput}
              onChange={handleDateInputChange}
              placeholder="e.g., 03/15/2023, 00:00:00 AM (24-hour format)"
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <p className="text-xs text-slate-400 mt-1">
              Enter a date/time string. Example: "03/15/2023, 00:00:00" or "2023-03-15T00:00:00".
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Converted Unix Timestamps
            </label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={convertedTimestampSeconds}
                  placeholder="Seconds (Epoch)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md pl-24 pr-16 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-text"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">Seconds:</span>
                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-500 text-xs">Epoch</span>
                <button
                  onClick={() => copyToClipboard(convertedTimestampSeconds, 'Converted Seconds Timestamp')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
                  aria-label="Copy converted seconds timestamp"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={convertedTimestampMilliseconds}
                  placeholder="Milliseconds"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md pl-24 pr-16 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-text"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">Milliseconds:</span>
                <button
                  onClick={() => copyToClipboard(convertedTimestampMilliseconds, 'Converted Milliseconds Timestamp')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
                  aria-label="Copy converted milliseconds timestamp"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleClearDateInput}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Current Timestamps Display */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" /> Current Unix Timestamps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Current Seconds (Epoch)
              </label>
              <input
                type="text"
                readOnly
                value={currentTimestampSeconds}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 cursor-text"
              />
              <button
                onClick={() => copyToClipboard(currentTimestampSeconds, 'Current Seconds Timestamp')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
                aria-label="Copy current seconds timestamp"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Current Milliseconds
              </label>
              <input
                type="text"
                readOnly
                value={currentTimestampMilliseconds}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 cursor-text"
              />
              <button
                onClick={() => copyToClipboard(currentTimestampMilliseconds, 'Current Milliseconds Timestamp')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
                aria-label="Copy current milliseconds timestamp"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}