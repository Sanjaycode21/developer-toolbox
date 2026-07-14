"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';
import { Clock, Copy, CalendarDays } from 'lucide-react';

const UnixTimestampConverterPage: React.FC = () => {
  const [timestampInput, setTimestampInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>('');
  const [outputDate, setOutputDate] = useState<string>('');
  const [outputTimestampSeconds, setOutputTimestampSeconds] = useState<string>('');
  const [outputTimestampMilliseconds, setOutputTimestampMilliseconds] = useState<string>('');
  const [isMilliseconds, setIsMilliseconds] = useState<boolean>(false);

  // Helper to copy text to clipboard
  const copyToClipboard = useCallback((text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('Failed to copy!'));
  }, []);

  // Convert timestamp to date
  const convertTimestampToDate = useCallback((timestamp: string, useMs: boolean) => {
    if (!timestamp) {
      setOutputDate('');
      return;
    }
    const numTimestamp = parseInt(timestamp, 10);
    if (isNaN(numTimestamp)) {
      setOutputDate('Invalid timestamp');
      return;
    }
    const date = new Date(useMs ? numTimestamp : numTimestamp * 1000);
    if (isNaN(date.getTime())) {
      setOutputDate('Invalid timestamp');
      return;
    }
    setOutputDate(date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    }));
  }, []);

  // Convert date to timestamp
  const convertDateToTimestamp = useCallback((dateString: string) => {
    if (!dateString) {
      setOutputTimestampSeconds('');
      setOutputTimestampMilliseconds('');
      return;
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        setOutputTimestampSeconds('Invalid date');
        setOutputTimestampMilliseconds('Invalid date');
        return;
      }
      const seconds = Math.floor(date.getTime() / 1000);
      const milliseconds = date.getTime();
      setOutputTimestampSeconds(seconds.toString());
      setOutputTimestampMilliseconds(milliseconds.toString());
    } catch (error) {
      setOutputTimestampSeconds('Invalid date');
      setOutputTimestampMilliseconds('Invalid date');
    }
  }, []);

  // Handle timestamp input change
  const handleTimestampInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimestampInput(value);
    convertTimestampToDate(value, isMilliseconds);
  }, [convertTimestampToDate, isMilliseconds]);

  // Handle date input change
  const handleDateInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInput(value);
    convertDateToTimestamp(value);
  }, [convertDateToTimestamp]);

  // Toggle milliseconds/seconds
  const handleToggleMilliseconds = useCallback(() => {
    setIsMilliseconds(prev => {
      const newState = !prev;
      // Re-convert if timestamp input exists
      if (timestampInput) {
        convertTimestampToDate(timestampInput, newState);
      }
      return newState;
    });
  }, [timestampInput, convertTimestampToDate]);

  // Get current timestamp and update both sections
  const getCurrentTimestamp = useCallback(() => {
    const now = new Date();
    const currentSeconds = Math.floor(now.getTime() / 1000);
    const currentMilliseconds = now.getTime();

    // Update Timestamp to Date section
    const timestampToSet = isMilliseconds ? currentMilliseconds.toString() : currentSeconds.toString();
    setTimestampInput(timestampToSet);
    setOutputDate(now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    }));

    // Update Date to Timestamp section
    // Format for datetime-local input: YYYY-MM-DDTHH:MM
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const nowIso = `${year}-${month}-${day}T${hours}:${minutes}`;

    setDateInput(nowIso);
    setOutputTimestampSeconds(currentSeconds.toString());
    setOutputTimestampMilliseconds(currentMilliseconds.toString());
  }, [isMilliseconds]);

  // Initialize with current timestamp on mount
  useEffect(() => {
    getCurrentTimestamp();
  }, [getCurrentTimestamp]);

  return (
    <ToolPageWrapper
      toolSlug="unix-timestamp-epoch-converter"
      toolName="Unix Timestamp & Epoch Converter"
      description="Convert Unix timestamps to human-readable dates and vice-versa. Supports seconds and milliseconds."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timestamp to Date Converter */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Timestamp to Date
          </h2>
          <div className="mb-4">
            <label htmlFor="timestampInput" className="block text-sm font-medium text-slate-300 mb-2">
              Unix Timestamp ({isMilliseconds ? 'Milliseconds' : 'Seconds'})
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="timestampInput"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                value={timestampInput}
                onChange={handleTimestampInputChange}
                placeholder="e.g., 1678886400 or 1678886400000"
              />
              <button
                onClick={getCurrentTimestamp}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-1"
              >
                <Clock className="w-4 h-4" /> Now
              </button>
            </div>
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="isMilliseconds"
                checked={isMilliseconds}
                onChange={handleToggleMilliseconds}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-600 rounded bg-slate-700"
              />
              <label htmlFor="isMilliseconds" className="ml-2 text-sm text-slate-300 cursor-pointer">
                Input is in Milliseconds
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Converted Date
            </label>
            <div className="relative">
              <textarea
                readOnly
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm min-h-[80px] resize-none"
                value={outputDate}
                placeholder="Converted date will appear here..."
              />
              {outputDate && outputDate !== 'Invalid timestamp' && (
                <button
                  onClick={() => copyToClipboard(outputDate, 'Date copied to clipboard!')}
                  className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-white transition-colors"
                  aria-label="Copy date"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setTimestampInput('');
                setOutputDate('');
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md text-sm font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Date to Timestamp Converter */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-400" /> Date to Timestamp
          </h2>
          <div className="mb-4">
            <label htmlFor="dateInput" className="block text-sm font-medium text-slate-300 mb-2">
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="dateInput"
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
              value={dateInput}
              onChange={handleDateInputChange}
            />
            <p className="text-xs text-slate-400 mt-1">
              Enter a date and time. Uses your local timezone.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Converted Unix Timestamp (Seconds)
            </label>
            <div className="relative">
              <input
                readOnly
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                value={outputTimestampSeconds}
                placeholder="Converted timestamp in seconds..."
              />
              {outputTimestampSeconds && outputTimestampSeconds !== 'Invalid date' && (
                <button
                  onClick={() => copyToClipboard(outputTimestampSeconds, 'Timestamp (seconds) copied!')}
                  className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-white transition-colors"
                  aria-label="Copy timestamp seconds"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Converted Unix Timestamp (Milliseconds)
            </label>
            <div className="relative">
              <input
                readOnly
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                value={outputTimestampMilliseconds}
                placeholder="Converted timestamp in milliseconds..."
              />
              {outputTimestampMilliseconds && outputTimestampMilliseconds !== 'Invalid date' && (
                <button
                  onClick={() => copyToClipboard(outputTimestampMilliseconds, 'Timestamp (milliseconds) copied!')}
                  className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-white transition-colors"
                  aria-label="Copy timestamp milliseconds"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setDateInput('');
                setOutputTimestampSeconds('');
                setOutputTimestampMilliseconds('');
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md text-sm font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default UnixTimestampConverterPage;