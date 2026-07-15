"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';
import { Clock, Calendar, Hash } from 'lucide-react';

type TimeUnit = 'seconds' | 'milliseconds';

export default function UnixTimestampEpochConverterPage() {
  const [timestampInput, setTimestampInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>('');
  const [outputDate, setOutputDate] = useState<string>('');
  const [outputTimestamp, setOutputTimestamp] = useState<string>('');
  const [unit, setUnit] = useState<TimeUnit>('seconds');

  // Function to format a Date object into a human-readable string
  const formatDate = useCallback((date: Date): string => {
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    }).format(date);
  }, []);

  // Function to convert timestamp to date
  const convertTimestampToDate = useCallback((ts: string, currentUnit: TimeUnit) => {
    if (!ts) {
      setOutputDate('');
      return;
    }
    const numTs = Number(ts);
    if (isNaN(numTs)) {
      setOutputDate('Invalid Timestamp');
      return;
    }

    const date = currentUnit === 'seconds' ? new Date(numTs * 1000) : new Date(numTs);
    setOutputDate(formatDate(date));
  }, [formatDate]);

  // Function to convert date to timestamp
  const convertDateToTimestamp = useCallback((dt: string, currentUnit: TimeUnit) => {
    if (!dt) {
      setOutputTimestamp('');
      return;
    }
    try {
      const date = new Date(dt);
      if (isNaN(date.getTime())) {
        setOutputTimestamp('Invalid Date Format');
        return;
      }
      const msTimestamp = date.getTime();
      const resultTimestamp = currentUnit === 'seconds' ? Math.floor(msTimestamp / 1000) : msTimestamp;
      setOutputTimestamp(resultTimestamp.toString());
    } catch (error) {
      setOutputTimestamp('Invalid Date Format');
    }
  }, []);

  // Effect to re-convert when unit changes or inputs change
  useEffect(() => {
    convertTimestampToDate(timestampInput, unit);
    convertDateToTimestamp(dateInput, unit);
  }, [unit, timestampInput, dateInput, convertTimestampToDate, convertDateToTimestamp]);

  const handleTimestampInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimestampInput(value);
    // Conversion is handled by useEffect
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInput(value);
    // Conversion is handled by useEffect
  };

  const handleUnitChange = (newUnit: TimeUnit) => {
    setUnit(newUnit);
    toast.success(`Unit changed to ${newUnit}.`);
  };

  const handleGetCurrentTimestamp = () => {
    const now = new Date();
    const msTimestamp = now.getTime();
    const currentTimestamp = unit === 'seconds' ? Math.floor(msTimestamp / 1000) : msTimestamp;
    setTimestampInput(currentTimestamp.toString());
    setOutputDate(formatDate(now));
    toast.success('Current timestamp loaded!');
  };

  const handleClearAll = () => {
    setTimestampInput('');
    setDateInput('');
    setOutputDate('');
    setOutputTimestamp('');
    toast.success('Cleared all inputs and outputs.');
  };

  return (
    <ToolPageWrapper
      toolSlug="unix-timestamp-epoch-converter"
      toolName="Unix Timestamp & Epoch Converter"
      description="Convert Unix timestamps to human-readable dates and vice-versa, supporting seconds and milliseconds."
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Panel: Timestamp to Date */}
        <div className="flex-1 bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Timestamp to Date
          </h2>
          <div className="mb-4">
            <label htmlFor="timestampInput" className="block text-sm font-medium text-slate-300 mb-2">
              Unix Timestamp ({unit === 'seconds' ? 'seconds' : 'milliseconds'})
            </label>
            <input
              type="text"
              id="timestampInput"
              value={timestampInput}
              onChange={handleTimestampInputChange}
              placeholder={`Enter Unix timestamp in ${unit}...`}
              className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 transition-colors text-sm font-mono"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Converted Date
            </label>
            <div className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-300 text-sm font-mono min-h-[40px] flex items-center break-all">
              {outputDate || <span className="text-slate-500">Result will appear here...</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => convertTimestampToDate(timestampInput, unit)}
              className="flex-1 min-w-[120px] bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
            >
              Convert
            </button>
            <button
              onClick={handleGetCurrentTimestamp}
              className="flex-1 min-w-[120px] bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-md transition-colors text-sm"
            >
              Current Timestamp
            </button>
          </div>
        </div>

        {/* Right Panel: Date to Timestamp */}
        <div className="flex-1 bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" /> Date to Timestamp
          </h2>
          <div className="mb-4">
            <label htmlFor="dateInput" className="block text-sm font-medium text-slate-300 mb-2">
              Date & Time (e.g., "2023-10-27 10:30:00 UTC" or "Oct 27 2023 10:30:00 GMT")
            </label>
            <input
              type="text"
              id="dateInput"
              value={dateInput}
              onChange={handleDateInputChange}
              placeholder="Enter date and time..."
              className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 transition-colors text-sm font-mono"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Converted Unix Timestamp
            </label>
            <div className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-300 text-sm font-mono min-h-[40px] flex items-center break-all">
              {outputTimestamp || <span className="text-slate-500">Result will appear here...</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => convertDateToTimestamp(dateInput, unit)}
              className="flex-1 min-w-[120px] bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
            >
              Convert
            </button>
            <button
              onClick={() => {
                if (outputTimestamp) {
                  navigator.clipboard.writeText(outputTimestamp);
                  toast.success('Timestamp copied to clipboard!');
                } else {
                  toast.error('No timestamp to copy.');
                }
              }}
              className="flex-1 min-w-[120px] bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-md transition-colors text-sm"
            >
              Copy Timestamp
            </button>
          </div>
        </div>
      </div>

      {/* Global Controls */}
      <div className="mt-8 bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Hash className="w-5 h-5 text-purple-400" />
          <span className="text-slate-300 font-medium">Unit:</span>
          <div className="flex rounded-md overflow-hidden border border-slate-600">
            <button
              onClick={() => handleUnitChange('seconds')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                unit === 'seconds'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              Seconds
            </button>
            <button
              onClick={() => handleUnitChange('milliseconds')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                unit === 'milliseconds'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              Milliseconds
            </button>
          </div>
        </div>
        <button
          onClick={handleClearAll}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
        >
          Clear All
        </button>
      </div>
    </ToolPageWrapper>
  );
}