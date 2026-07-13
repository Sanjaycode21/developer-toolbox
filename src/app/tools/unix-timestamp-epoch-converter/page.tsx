'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';
import { Copy, Clock, CalendarDays, RefreshCcw } from 'lucide-react';

// Helper to format a Date object into various string representations
const formatDateTime = (date: Date) => {
  if (isNaN(date.getTime())) {
    return {
      local: 'Invalid Date',
      utc: 'Invalid Date',
      iso: 'Invalid Date',
    };
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  return {
    local: date.toLocaleString(undefined, options),
    utc: date.toUTCString(),
    iso: date.toISOString(),
  };
};

const UnixTimestampEpochConverterPage: React.FC = () => {
  const [unixInput, setUnixInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>('');
  const [convertedDate, setConvertedDate] = useState<ReturnType<typeof formatDateTime> | null>(null);
  const [convertedTimestamp, setConvertedTimestamp] = useState<number | null>(null);
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
  const [currentDateFormatted, setCurrentDateFormatted] = useState<ReturnType<typeof formatDateTime> | null>(null);

  const updateCurrentTime = useCallback(() => {
    const now = new Date();
    setCurrentTimestamp(Math.floor(now.getTime() / 1000));
    setCurrentDateFormatted(formatDateTime(now));
  }, []);

  useEffect(() => {
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000); // Update every second
    return () => clearInterval(interval);
  }, [updateCurrentTime]);

  // Set initial dateInput to current local time for convenience
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setDateInput(`${year}-${month}-${day}T${hours}:${minutes}`);
  }, []);

  const handleUnixToDate = () => {
    const timestamp = parseInt(unixInput, 10);
    if (isNaN(timestamp)) {
      toast.error('Please enter a valid Unix timestamp.');
      setConvertedDate(null);
      return;
    }
    // Unix timestamps are typically in seconds, Date expects milliseconds
    const date = new Date(timestamp * 1000);
    setConvertedDate(formatDateTime(date));
    toast.success('Timestamp converted!');
  };

  const handleDateToUnix = () => {
    if (!dateInput) {
      toast.error('Please select a date and time.');
      setConvertedTimestamp(null);
      return;
    }
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      toast.error('Invalid date and time format.');
      setConvertedTimestamp(null);
      return;
    }
    setConvertedTimestamp(Math.floor(date.getTime() / 1000));
    toast.success('Date converted!');
  };

  const copyToClipboard = async (text: string | number) => {
    try {
      await navigator.clipboard.writeText(String(text));
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy.');
      console.error('Failed to copy:', err);
    }
  };

  return (
    <ToolPageWrapper
      toolSlug="unix-timestamp-epoch-converter"
      toolName="Unix Timestamp & Epoch Converter"
      description="Convert Unix timestamps to human-readable dates and vice-versa."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Timestamp */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Current Timestamp
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Current Unix Timestamp (Epoch)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentTimestamp}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => copyToClipboard(currentTimestamp)}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                  aria-label="Copy current timestamp"
                >
                  <Copy className="w-4 h-4 text-slate-300" />
                </button>
                <button
                  onClick={updateCurrentTime}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                  aria-label="Refresh current timestamp"
                >
                  <RefreshCcw className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </div>
            {currentDateFormatted && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Current Date & Time</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentDateFormatted.local}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => copyToClipboard(currentDateFormatted.local)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                    aria-label="Copy current local date"
                  >
                    <Copy className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentDateFormatted.utc}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => copyToClipboard(currentDateFormatted.utc)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                    aria-label="Copy current UTC date"
                  >
                    <Copy className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentDateFormatted.iso}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => copyToClipboard(currentDateFormatted.iso)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                    aria-label="Copy current ISO date"
                  >
                    <Copy className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Unix Timestamp to Date */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-400" /> Unix Timestamp to Date
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="unix-input" className="block text-sm font-medium text-slate-300 mb-1">
                Unix Timestamp (e.g., 1678886400)
              </label>
              <input
                id="unix-input"
                type="text"
                value={unixInput}
                onChange={(e) => setUnixInput(e.target.value)}
                placeholder="Enter Unix timestamp"
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleUnixToDate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Convert Timestamp
            </button>

            {convertedDate && (
              <div className="space-y-2 mt-4">
                <label className="block text-sm font-medium text-slate-300">Converted Date & Time</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={convertedDate.local}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => copyToClipboard(convertedDate.local)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                    aria-label="Copy local date"
                  >
                    <Copy className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={convertedDate.utc}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => copyToClipboard(convertedDate.utc)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                    aria-label="Copy UTC date"
                  >
                    <Copy className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={convertedDate.iso}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => copyToClipboard(convertedDate.iso)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                    aria-label="Copy ISO date"
                  >
                    <Copy className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date to Unix Timestamp */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" /> Date to Unix Timestamp
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="date-input" className="block text-sm font-medium text-slate-300 mb-1">
                Select Date and Time
              </label>
              <input
                id="date-input"
                type="datetime-local"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleDateToUnix}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Convert Date
            </button>

            {convertedTimestamp !== null && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">Converted Unix Timestamp</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={convertedTimestamp}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => copyToClipboard(convertedTimestamp)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                    aria-label="Copy converted timestamp"
                  >
                    <Copy className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default UnixTimestampEpochConverterPage;