"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';
import { Copy, Clock, Calendar } from 'lucide-react';

const UnixTimestampEpochConverterPage: React.FC = () => {
  // --- State for Timestamp to Date conversion ---
  const [timestampInput, setTimestampInput] = useState<string>('');
  const [convertedDate, setConvertedDate] = useState<string>('');
  const [timestampTimezone, setTimestampTimezone] = useState<'local' | 'utc'>('local');

  // --- State for Date to Timestamp conversion ---
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [hour, setHour] = useState<string>('');
  const [minute, setMinute] = useState<string>('');
  const [second, setSecond] = useState<string>('');
  const [convertedTimestamp, setConvertedTimestamp] = useState<string>('');
  const [dateTimezone, setDateTimezone] = useState<'local' | 'utc'>('local');

  // --- Helper functions ---
  const formatDateTime = useCallback((date: Date, timezone: 'local' | 'utc'): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    if (timezone === 'utc') {
      return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
    } else {
      return date.toLocaleString(undefined, options);
    }
  }, []);

  const parseDateComponents = useCallback((
    y: string, m: string, d: string, h: string, min: string, s: string, timezone: 'local' | 'utc'
  ): Date | null => {
    const numY = parseInt(y, 10);
    const numM = parseInt(m, 10) - 1; // Month is 0-indexed
    const numD = parseInt(d, 10);
    const numH = parseInt(h, 10);
    const numMin = parseInt(min, 10);
    const numS = parseInt(s, 10);

    if (isNaN(numY) || isNaN(numM) || isNaN(numD) || isNaN(numH) || isNaN(numMin) || isNaN(numS)) {
      return null;
    }

    // Basic validation for common date ranges
    if (numM < 0 || numM > 11 || numD < 1 || numD > 31 || numH < 0 || numH > 23 || numMin < 0 || numMin > 59 || numS < 0 || numS > 59) {
      return null;
    }

    if (timezone === 'utc') {
      return new Date(Date.UTC(numY, numM, numD, numH, numMin, numS));
    } else {
      return new Date(numY, numM, numD, numH, numMin, numS);
    }
  }, []);

  // --- Timestamp to Date conversion logic ---
  const convertTimestampToDate = useCallback(() => {
    const timestamp = parseInt(timestampInput, 10);
    if (isNaN(timestamp) || timestamp < 0) {
      setConvertedDate('Invalid Unix Timestamp');
      return;
    }
    const date = new Date(timestamp * 1000);
    if (isNaN(date.getTime())) {
      setConvertedDate('Invalid Unix Timestamp');
      return;
    }
    setConvertedDate(formatDateTime(date, timestampTimezone));
  }, [timestampInput, timestampTimezone, formatDateTime]);

  useEffect(() => {
    if (timestampInput) {
      convertTimestampToDate();
    } else {
      setConvertedDate('');
    }
  }, [timestampInput, timestampTimezone, convertTimestampToDate]);

  const setTimestampToNow = useCallback(() => {
    const now = Math.floor(Date.now() / 1000);
    setTimestampInput(now.toString());
  }, []);

  // --- Date to Timestamp conversion logic ---
  const convertDateToTimestamp = useCallback(() => {
    const date = parseDateComponents(year, month, day, hour, minute, second, dateTimezone);
    if (!date || isNaN(date.getTime())) {
      setConvertedTimestamp('Invalid Date/Time');
      return;
    }
    setConvertedTimestamp(Math.floor(date.getTime() / 1000).toString());
  }, [year, month, day, hour, minute, second, dateTimezone, parseDateComponents]);

  useEffect(() => {
    // Only attempt conversion if all date components are provided
    if (year && month && day && hour && minute && second) {
      convertDateToTimestamp();
    } else {
      setConvertedTimestamp('');
    }
  }, [year, month, day, hour, minute, second, dateTimezone, convertDateToTimestamp]);

  const setDateToNow = useCallback(() => {
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const currentDay = now.getDate().toString().padStart(2, '0');
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentSecond = now.getSeconds().toString().padStart(2, '0');

    setYear(currentYear);
    setMonth(currentMonth);
    setDay(currentDay);
    setHour(currentHour);
    setMinute(currentMinute);
    setSecond(currentSecond);
  }, []);

  // --- Copy to clipboard ---
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy!');
      console.error('Failed to copy:', err);
    }
  };

  const inputClass = "w-full bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-md px-3 py-2 text-sm text-slate-200 placeholder-slate-500 transition-colors";
  const buttonClass = "px-4 py-2 rounded-md text-sm font-medium transition-colors";
  const secondaryButtonClass = `${buttonClass} bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600`;
  const toggleButtonClass = (isActive: boolean) =>
    `${buttonClass} ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'} flex-1`;

  return (
    <ToolPageWrapper
      toolSlug="unix-timestamp-epoch-converter"
      toolName="Unix Timestamp & Epoch Converter"
      description="Convert Unix timestamps to human-readable dates and vice-versa, with timezone support."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timestamp to Date */}
        <div className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Timestamp to Date
          </h2>
          <div className="mb-4">
            <label htmlFor="timestampInput" className="block text-sm font-medium text-slate-300 mb-2">
              Unix Timestamp (Epoch)
            </label>
            <input
              id="timestampInput"
              type="number"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="e.g., 1678886400"
              className={inputClass}
            />
          </div>

          <div className="mb-4 flex gap-2">
            <button onClick={setTimestampToNow} className={secondaryButtonClass}>
              Set to Now
            </button>
            <div className="flex-1 flex rounded-md overflow-hidden border border-slate-600">
              <button
                onClick={() => setTimestampTimezone('local')}
                className={toggleButtonClass(timestampTimezone === 'local')}
              >
                Local Time
              </button>
              <button
                onClick={() => setTimestampTimezone('utc')}
                className={toggleButtonClass(timestampTimezone === 'utc')}
              >
                UTC
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Converted Date
            </label>
            <div className="relative">
              <textarea
                readOnly
                value={convertedDate}
                placeholder="Converted date will appear here..."
                className={`${inputClass} h-24 resize-none`}
              />
              {convertedDate && convertedDate !== 'Invalid Unix Timestamp' && (
                <button
                  onClick={() => copyToClipboard(convertedDate)}
                  className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors"
                  aria-label="Copy converted date"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Date to Timestamp */}
        <div className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" /> Date to Timestamp
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label htmlFor="year" className="block text-xs font-medium text-slate-400 mb-1">Year</label>
              <input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="YYYY" className={inputClass} min="1900" max="2100" />
            </div>
            <div>
              <label htmlFor="month" className="block text-xs font-medium text-slate-400 mb-1">Month</label>
              <input id="month" type="number" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="MM" className={inputClass} min="1" max="12" />
            </div>
            <div>
              <label htmlFor="day" className="block text-xs font-medium text-slate-400 mb-1">Day</label>
              <input id="day" type="number" value={day} onChange={(e) => setDay(e.target.value)} placeholder="DD" className={inputClass} min="1" max="31" />
            </div>
            <div>
              <label htmlFor="hour" className="block text-xs font-medium text-slate-400 mb-1">Hour</label>
              <input id="hour" type="number" value={hour} onChange={(e) => setHour(e.target.value)} placeholder="HH" className={inputClass} min="0" max="23" />
            </div>
            <div>
              <label htmlFor="minute" className="block text-xs font-medium text-slate-400 mb-1">Minute</label>
              <input id="minute" type="number" value={minute} onChange={(e) => setMinute(e.target.value)} placeholder="MM" className={inputClass} min="0" max="59" />
            </div>
            <div>
              <label htmlFor="second" className="block text-xs font-medium text-slate-400 mb-1">Second</label>
              <input id="second" type="number" value={second} onChange={(e) => setSecond(e.target.value)} placeholder="SS" className={inputClass} min="0" max="59" />
            </div>
          </div>

          <div className="mb-4 flex gap-2">
            <button onClick={setDateToNow} className={secondaryButtonClass}>
              Set to Now
            </button>
            <div className="flex-1 flex rounded-md overflow-hidden border border-slate-600">
              <button
                onClick={() => setDateTimezone('local')}
                className={toggleButtonClass(dateTimezone === 'local')}
              >
                Local Time
              </button>
              <button
                onClick={() => setDateTimezone('utc')}
                className={toggleButtonClass(dateTimezone === 'utc')}
              >
                UTC
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Converted Unix Timestamp
            </label>
            <div className="relative">
              <input
                readOnly
                type="text" // Changed to text to allow "Invalid Date/Time" string
                value={convertedTimestamp}
                placeholder="Converted timestamp will appear here..."
                className={inputClass}
              />
              {convertedTimestamp && convertedTimestamp !== 'Invalid Date/Time' && (
                <button
                  onClick={() => copyToClipboard(convertedTimestamp)}
                  className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors"
                  aria-label="Copy converted timestamp"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default UnixTimestampEpochConverterPage;