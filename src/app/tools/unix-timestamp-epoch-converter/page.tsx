"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';
import { Copy, Clock, CalendarDays } from 'lucide-react';

const UnixTimestampEpochConverter: React.FC = () => {
  // State for current timestamp
  const [currentUnixTimestamp, setCurrentUnixTimestamp] = useState<number>(0);
  const [currentDateUTC, setCurrentDateUTC] = useState<string>('');
  const [currentDateLocal, setCurrentDateLocal] = useState<string>('');

  // State for Unix Timestamp to Date conversion
  const [unixTimestampInput, setUnixTimestampInput] = useState<string>('');
  const [convertedDateUTC, setConvertedDateUTC] = useState<string>('');
  const [convertedDateLocal, setConvertedDateLocal] = useState<string>('');
  const [convertedDateISO, setConvertedDateISO] = useState<string>('');

  // State for Date to Unix Timestamp conversion
  const [dateInput, setDateInput] = useState<string>('');
  const [convertedTimestamp, setConvertedTimestamp] = useState<string>('');

  // Helper to copy text to clipboard
  const copyToClipboard = useCallback((text: string, label: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } else {
      toast.error(`Nothing to copy for ${label}.`);
    }
  }, []);

  // Update current time every second
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const timestamp = Math.floor(now.getTime() / 1000);
      setCurrentUnixTimestamp(timestamp);
      setCurrentDateUTC(now.toUTCString());
      setCurrentDateLocal(now.toLocaleString());
    };

    updateCurrentTime(); // Initial call
    const intervalId = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Initialize date input with current local time
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setDateInput(`${year}-${month}-${day}T${hours}:${minutes}`);
  }, []);

  // Handle Unix Timestamp input change
  const handleUnixTimestampChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUnixTimestampInput(value);

    const timestamp = parseInt(value, 10);
    if (!isNaN(timestamp) && timestamp >= 0) {
      const date = new Date(timestamp * 1000);
      setConvertedDateUTC(date.toUTCString());
      setConvertedDateLocal(date.toLocaleString());
      setConvertedDateISO(date.toISOString());
    } else {
      setConvertedDateUTC('');
      setConvertedDateLocal('');
      setConvertedDateISO('');
    }
  }, []);

  // Handle Date input change
  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInput(value);

    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setConvertedTimestamp(Math.floor(date.getTime() / 1000).toString());
      } else {
        setConvertedTimestamp('');
      }
    } else {
      setConvertedTimestamp('');
    }
  }, []);

  return (
    <ToolPageWrapper
      toolSlug="unix-timestamp-epoch-converter"
      toolName="Unix Timestamp & Epoch Converter"
      description="Convert between Unix timestamps (Epoch) and human-readable dates, and view the current timestamp."
    >
      <div className="space-y-8">
        {/* Current Timestamp */}
        <section className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Current Timestamp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">Unix Timestamp (Epoch)</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={currentUnixTimestamp}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm font-mono pr-10"
                />
                <button
                  onClick={() => copyToClipboard(currentUnixTimestamp.toString(), 'Current Unix Timestamp')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors p-1"
                  aria-label="Copy current Unix timestamp"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">Date (UTC)</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={currentDateUTC}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm font-mono pr-10"
                />
                <button
                  onClick={() => copyToClipboard(currentDateUTC, 'Current UTC Date')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors p-1"
                  aria-label="Copy current UTC date"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-400 text-sm font-medium mb-1">Date (Local Time)</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={currentDateLocal}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm font-mono pr-10"
                />
                <button
                  onClick={() => copyToClipboard(currentDateLocal, 'Current Local Date')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors p-1"
                  aria-label="Copy current local date"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Unix Timestamp to Date Converter */}
        <section className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-400" /> Unix Timestamp to Date
          </h2>
          <div className="mb-4">
            <label htmlFor="unixTimestampInput" className="block text-slate-400 text-sm font-medium mb-1">
              Enter Unix Timestamp
            </label>
            <input
              id="unixTimestampInput"
              type="number"
              value={unixTimestampInput}
              onChange={handleUnixTimestampChange}
              placeholder="e.g., 1678886400"
              className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 rounded-md py-2 px-3 text-slate-200 text-sm transition-colors"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">Converted Date (UTC)</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={convertedDateUTC}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm font-mono pr-10"
                />
                <button
                  onClick={() => copyToClipboard(convertedDateUTC, 'UTC Date')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors p-1"
                  aria-label="Copy converted UTC date"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">Converted Date (Local Time)</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={convertedDateLocal}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm font-mono pr-10"
                />
                <button
                  onClick={() => copyToClipboard(convertedDateLocal, 'Local Date')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors p-1"
                  aria-label="Copy converted local date"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">Converted Date (ISO 8601)</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={convertedDateISO}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm font-mono pr-10"
                />
                <button
                  onClick={() => copyToClipboard(convertedDateISO, 'ISO 8601 Date')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors p-1"
                  aria-label="Copy converted ISO 8601 date"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Date to Unix Timestamp Converter */}
        <section className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" /> Date to Unix Timestamp
          </h2>
          <div className="mb-4">
            <label htmlFor="dateInput" className="block text-slate-400 text-sm font-medium mb-1">
              Select Date and Time (Local)
            </label>
            <input
              id="dateInput"
              type="datetime-local"
              value={dateInput}
              onChange={handleDateChange}
              className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 rounded-md py-2 px-3 text-slate-200 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1">Converted Unix Timestamp</label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={convertedTimestamp}
                className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm font-mono pr-10"
              />
              <button
                onClick={() => copyToClipboard(convertedTimestamp, 'Converted Unix Timestamp')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors p-1"
                aria-label="Copy converted Unix timestamp"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </ToolPageWrapper>
  );
};

export default UnixTimestampEpochConverter;