'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Clock, Copy, CalendarDays, RefreshCcw } from 'lucide-react';

const toolSlug = "unix-timestamp-epoch-converter";
const toolName = "Unix Timestamp & Epoch Converter";
const toolDescription = "Convert Unix timestamps to human-readable dates and vice versa.";

type TimeUnit = 'seconds' | 'milliseconds';

export default function UnixTimestampEpochConverterPage() {
  const { addToHistory } = useToolStore();

  const [timestampInput, setTimestampInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>('');
  const [unit, setUnit] = useState<TimeUnit>('seconds');

  const [convertedDate, setConvertedDate] = useState<string>('');
  const [convertedTimestamp, setConvertedTimestamp] = useState<string>('');

  const [currentTimestampSeconds, setCurrentTimestampSeconds] = useState<string>('');
  const [currentTimestampMilliseconds, setCurrentTimestampMilliseconds] = useState<string>('');
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory]);

  const formatUtcDate = useCallback((timestampMs: number | null): string => {
    if (timestampMs === null || isNaN(timestampMs)) {
      return 'Invalid Date';
    }
    const date = new Date(timestampMs);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
      timeZoneName: 'short',
    }).format(date);
  }, []);

  const updateCurrentTime = useCallback(() => {
    const now = Date.now(); // milliseconds
    setCurrentTimestampMilliseconds(now.toString());
    setCurrentTimestampSeconds(Math.floor(now / 1000).toString());
    setCurrentDateTime(formatUtcDate(now));
  }, [formatUtcDate]);

  useEffect(() => {
    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(intervalId);
  }, [updateCurrentTime]);

  const handleTimestampToDateConversion = useCallback(() => {
    const numTimestamp = parseInt(timestampInput, 10);
    if (isNaN(numTimestamp)) {
      setConvertedDate('Invalid Timestamp Input');
      return;
    }

    const timestampMs = unit === 'seconds' ? numTimestamp * 1000 : numTimestamp;
    setConvertedDate(formatUtcDate(timestampMs));
  }, [timestampInput, unit, formatUtcDate]);

  const handleDateToTimestampConversion = useCallback(() => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setConvertedTimestamp('Invalid Date Input');
      return;
    }

    const timestampMs = date.getTime();
    const resultTimestamp = unit === 'seconds' ? Math.floor(timestampMs / 1000) : timestampMs;
    setConvertedTimestamp(resultTimestamp.toString());
  }, [dateInput, unit]);

  const copyToClipboard = useCallback((text: string, label: string) => {
    if (text === '' || text === 'Invalid Timestamp Input' || text === 'Invalid Date Input') {
      toast.error(`Cannot copy ${label} as it's empty or invalid.`);
      return;
    }
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`${label} copied to clipboard!`))
      .catch(() => toast.error(`Failed to copy ${label}.`));
  }, []);

  const commonInputClasses = "w-full bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-md px-3 py-2 text-sm text-slate-200 placeholder-slate-500 transition-colors";
  const commonButtonClasses = "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2";
  const copyButtonClasses = "p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors flex items-center justify-center";
  const clearButtonClasses = "p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors flex items-center justify-center";
  const outputDisplayClasses = "w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 font-mono break-all min-h-[40px] flex items-center";
  const radioInputClasses = "h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500 focus:ring-2 checked:bg-indigo-600 checked:border-transparent";


  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName={toolName}
      description={toolDescription}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Time Section */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" /> Current Time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1">Epoch (Seconds)</label>
              <div className="flex gap-2">
                <div className={outputDisplayClasses}>{currentTimestampSeconds}</div>
                <button
                  onClick={() => copyToClipboard(currentTimestampSeconds, 'Current Epoch (Seconds)')}
                  className={copyButtonClasses}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1">Epoch (Milliseconds)</label>
              <div className="flex gap-2">
                <div className={outputDisplayClasses}>{currentTimestampMilliseconds}</div>
                <button
                  onClick={() => copyToClipboard(currentTimestampMilliseconds, 'Current Epoch (Milliseconds)')}
                  className={copyButtonClasses}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1">UTC Date & Time</label>
              <div className="flex gap-2">
                <div className={outputDisplayClasses}>{currentDateTime}</div>
                <button
                  onClick={() => copyToClipboard(currentDateTime, 'Current UTC Date & Time')}
                  className={copyButtonClasses}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timestamp to Date Converter */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-indigo-400" /> Timestamp to Date
          </h2>
          <div className="mb-4">
            <label htmlFor="timestampInput" className="block text-slate-400 text-xs font-medium mb-1">
              Unix Timestamp
            </label>
            <div className="flex gap-2">
              <input
                id="timestampInput"
                type="text"
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
                placeholder="e.g., 1678886400 or 1678886400000"
                className={commonInputClasses}
              />
              <button
                onClick={() => { setTimestampInput(''); setConvertedDate(''); }}
                className={clearButtonClasses}
                title="Clear input"
              >
                <RefreshCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-slate-400 text-xs font-medium mb-2">Unit</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className={radioInputClasses}
                  name="timestampUnit"
                  value="seconds"
                  checked={unit === 'seconds'}
                  onChange={() => setUnit('seconds')}
                />
                <span className="ml-2 text-slate-300 text-sm">Seconds</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className={radioInputClasses}
                  name="timestampUnit"
                  value="milliseconds"
                  checked={unit === 'milliseconds'}
                  onChange={() => setUnit('milliseconds')}
                />
                <span className="ml-2 text-slate-300 text-sm">Milliseconds</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleTimestampToDateConversion}
            className={commonButtonClasses + " w-full mb-4"}
          >
            Convert to Date
          </button>

          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1">Converted UTC Date & Time</label>
            <div className="flex gap-2">
              <div className={outputDisplayClasses}>{convertedDate}</div>
              <button
                onClick={() => copyToClipboard(convertedDate, 'Converted Date')}
                className={copyButtonClasses}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Date to Timestamp Converter */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" /> Date to Timestamp
          </h2>
          <div className="mb-4">
            <label htmlFor="dateInput" className="block text-slate-400 text-xs font-medium mb-1">
              Date & Time (e.g., 2023-03-15 12:00:00 UTC)
            </label>
            <div className="flex gap-2">
              <input
                id="dateInput"
                type="text"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                placeholder="e.g., 2023-03-15 12:00:00 UTC or March 15, 2023 12:00:00 GMT"
                className={commonInputClasses}
              />
              <button
                onClick={() => { setDateInput(''); setConvertedTimestamp(''); }}
                className={clearButtonClasses}
                title="Clear input"
              >
                <RefreshCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-slate-400 text-xs font-medium mb-2">Unit</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className={radioInputClasses}
                  name="dateUnit"
                  value="seconds"
                  checked={unit === 'seconds'}
                  onChange={() => setUnit('seconds')}
                />
                <span className="ml-2 text-slate-300 text-sm">Seconds</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className={radioInputClasses}
                  name="dateUnit"
                  value="milliseconds"
                  checked={unit === 'milliseconds'}
                  onChange={() => setUnit('milliseconds')}
                />
                <span className="ml-2 text-slate-300 text-sm">Milliseconds</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleDateToTimestampConversion}
            className={commonButtonClasses + " w-full mb-4"}
          >
            Convert to Timestamp
          </button>

          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1">Converted Timestamp</label>
            <div className="flex gap-2">
              <div className={outputDisplayClasses}>{convertedTimestamp}</div>
              <button
                onClick={() => copyToClipboard(convertedTimestamp, 'Converted Timestamp')}
                className={copyButtonClasses}
                title="Copy to clipboard"
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