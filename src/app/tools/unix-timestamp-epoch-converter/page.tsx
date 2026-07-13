"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { ClipboardCopy } from 'lucide-react';
import toast from 'react-hot-toast';

const UnixTimestampEpochConverter: React.FC = () => {
  const [timestampInput, setTimestampInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>('');
  const [timestampUnit, setTimestampUnit] = useState<'seconds' | 'milliseconds'>('seconds');

  const [convertedDate, setConvertedDate] = useState<string>('');
  const [convertedTimestampSeconds, setConvertedTimestampSeconds] = useState<string>('');
  const [convertedTimestampMilliseconds, setConvertedTimestampMilliseconds] = useState<string>('');

  const formatDate = useCallback((timestampMs: number): string => {
    if (isNaN(timestampMs)) return 'Invalid Date';
    const date = new Date(timestampMs);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'shortOffset'
    });
  }, []);

  const parseDateToTimestamps = useCallback((dateString: string) => {
    if (!dateString.trim()) {
      setConvertedTimestampSeconds('');
      setConvertedTimestampMilliseconds('');
      return;
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      setConvertedTimestampSeconds('Invalid Date');
      setConvertedTimestampMilliseconds('Invalid Date');
    } else {
      const ms = date.getTime();
      setConvertedTimestampMilliseconds(ms.toString());
      setConvertedTimestampSeconds(Math.floor(ms / 1000).toString());
    }
  }, []);

  const convertTimestampToDate = useCallback((timestampStr: string, unit: 'seconds' | 'milliseconds') => {
    if (!timestampStr.trim()) {
      setConvertedDate('');
      return;
    }
    const num = parseInt(timestampStr, 10);
    if (isNaN(num)) {
      setConvertedDate('Invalid Timestamp');
      return;
    }

    let timestampMs = num;
    if (unit === 'seconds') {
      timestampMs = num * 1000;
    }
    setConvertedDate(formatDate(timestampMs));
  }, [formatDate]);

  // Effect to update conversions when inputs or unit change
  useEffect(() => {
    convertTimestampToDate(timestampInput, timestampUnit);
  }, [timestampInput, timestampUnit, convertTimestampToDate]);

  useEffect(() => {
    parseDateToTimestamps(dateInput);
  }, [dateInput, parseDateToTimestamps]);

  // Set initial values and update "Now" buttons periodically
  useEffect(() => {
    const updateNowValues = () => {
      const now = new Date();
      const currentMs = now.getTime();
      const currentSeconds = Math.floor(currentMs / 1000);

      // Only set if inputs are empty to avoid overwriting user input
      if (!timestampInput) {
        setTimestampInput(timestampUnit === 'seconds' ? currentSeconds.toString() : currentMs.toString());
      }
      if (!dateInput) {
        setDateInput(now.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZoneName: 'shortOffset'
        }));
      }
    };

    updateNowValues(); // Set initial values
    const interval = setInterval(updateNowValues, 1000); // Update every second
    return () => clearInterval(interval);
  }, [timestampInput, dateInput, timestampUnit]); // Depend on inputs to avoid overwriting

  const handleTimestampInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimestampInput(e.target.value);
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInput(e.target.value);
  };

  const handleTimestampUnitChange = (unit: 'seconds' | 'milliseconds') => {
    setTimestampUnit(unit);
    // Re-evaluate timestamp input with new unit
    convertTimestampToDate(timestampInput, unit);
  };

  const setTimestampToNow = () => {
    const now = new Date();
    const currentMs = now.getTime();
    const currentSeconds = Math.floor(currentMs / 1000);
    setTimestampInput(timestampUnit === 'seconds' ? currentSeconds.toString() : currentMs.toString());
  };

  const setDateToNow = () => {
    const now = new Date();
    setDateInput(now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'shortOffset'
    }));
  };

  const copyToClipboard = (text: string, label: string) => {
    if (text === 'Invalid Date' || text === 'Invalid Timestamp' || !text) {
      toast.error(`Cannot copy ${label}: invalid or empty value.`);
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <ToolPageWrapper
      toolSlug="unix-timestamp-epoch-converter"
      toolName="Unix Timestamp & Epoch Converter"
      description="Convert Unix timestamps to human-readable dates and vice-versa."
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Timestamp to Date Converter */}
        <div className="flex-1 bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Timestamp to Date</h2>
          <div className="mb-4">
            <label htmlFor="timestampInput" className="block text-sm font-medium text-slate-300 mb-2">
              Unix Timestamp
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="timestampInput"
                type="text"
                value={timestampInput}
                onChange={handleTimestampInputChange}
                placeholder={timestampUnit === 'seconds' ? 'e.g., 1678886400' : 'e.g., 1678886400000'}
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 rounded-md px-4 py-2 text-slate-200 placeholder-slate-500 text-sm transition-colors"
              />
              <button
                onClick={setTimestampToNow}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-md text-sm transition-colors"
              >
                Now
              </button>
            </div>
            <div className="flex gap-4 mt-2">
              <label className="inline-flex items-center text-sm text-slate-300">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600 bg-slate-900 border-slate-600 focus:ring-indigo-500"
                  name="timestampUnit"
                  value="seconds"
                  checked={timestampUnit === 'seconds'}
                  onChange={() => handleTimestampUnitChange('seconds')}
                />
                <span className="ml-2">Seconds</span>
              </label>
              <label className="inline-flex items-center text-sm text-slate-300">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600 bg-slate-900 border-slate-600 focus:ring-indigo-500"
                  name="timestampUnit"
                  value="milliseconds"
                  checked={timestampUnit === 'milliseconds'}
                  onChange={() => handleTimestampUnitChange('milliseconds')}
                />
                <span className="ml-2">Milliseconds</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="convertedDate" className="block text-sm font-medium text-slate-300 mb-2">
              Converted Date & Time
            </label>
            <div className="bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-200 text-sm font-mono flex items-center justify-between min-h-[40px]">
              <span id="convertedDate" className="break-all pr-2">
                {convertedDate || 'Enter a timestamp to convert'}
              </span>
              <button
                onClick={() => copyToClipboard(convertedDate, 'Converted Date')}
                className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Copy converted date"
              >
                <ClipboardCopy size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Date to Timestamp Converter */}
        <div className="flex-1 bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Date to Timestamp</h2>
          <div className="mb-4">
            <label htmlFor="dateInput" className="block text-sm font-medium text-slate-300 mb-2">
              Date & Time String
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="dateInput"
                type="text"
                value={dateInput}
                onChange={handleDateInputChange}
                placeholder="e.g., 2023-03-15 10:00:00 UTC"
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 rounded-md px-4 py-2 text-slate-200 placeholder-slate-500 text-sm transition-colors"
              />
              <button
                onClick={setDateToNow}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-md text-sm transition-colors"
              >
                Now
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Supports various formats (e.g., "YYYY-MM-DD HH:MM:SS", "March 15, 2023 10:00:00 GMT+0000")
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="convertedTimestampSeconds" className="block text-sm font-medium text-slate-300 mb-2">
              Unix Timestamp (Seconds)
            </label>
            <div className="bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-200 text-sm font-mono flex items-center justify-between min-h-[40px]">
              <span id="convertedTimestampSeconds" className="break-all pr-2">
                {convertedTimestampSeconds || 'Enter a date to convert'}
              </span>
              <button
                onClick={() => copyToClipboard(convertedTimestampSeconds, 'Unix Timestamp (Seconds)')}
                className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Copy Unix timestamp in seconds"
              >
                <ClipboardCopy size={16} />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="convertedTimestampMilliseconds" className="block text-sm font-medium text-slate-300 mb-2">
              Unix Timestamp (Milliseconds)
            </label>
            <div className="bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-200 text-sm font-mono flex items-center justify-between min-h-[40px]">
              <span id="convertedTimestampMilliseconds" className="break-all pr-2">
                {convertedTimestampMilliseconds || 'Enter a date to convert'}
              </span>
              <button
                onClick={() => copyToClipboard(convertedTimestampMilliseconds, 'Unix Timestamp (Milliseconds)')}
                className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Copy Unix timestamp in milliseconds"
              >
                <ClipboardCopy size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default UnixTimestampEpochConverter;