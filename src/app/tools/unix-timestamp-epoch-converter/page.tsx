"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';
import { Clock, CalendarDays, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';

const UnixTimestampConverterPage: React.FC = () => {
  const [timestampInput, setTimestampInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>('');
  const [timestampOutput, setTimestampOutput] = useState<string>('');
  const [dateOutput, setDateOutput] = useState<string>('');
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');

  const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'shortOffset',
  };

  const formatDate = useCallback((date: Date): string => {
    if (isNaN(date.getTime())) {
      return '';
    }
    try {
      return new Intl.DateTimeFormat('en-US', dateTimeFormatOptions).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return date.toISOString(); // Fallback
    }
  }, []);

  const handleTimestampToDateConversion = useCallback(() => {
    if (!timestampInput) {
      setDateOutput('');
      toast.error('Please enter a timestamp.');
      return;
    }

    const numTimestamp = Number(timestampInput);
    if (isNaN(numTimestamp)) {
      setDateOutput('');
      toast.error('Invalid timestamp. Please enter a numeric value.');
      return;
    }

    const date = new Date(unit === 'seconds' ? numTimestamp * 1000 : numTimestamp);
    if (isNaN(date.getTime())) {
      setDateOutput('');
      toast.error('Could not convert timestamp to a valid date.');
      return;
    }

    setDateOutput(formatDate(date));
    toast.success('Timestamp converted to date!');
  }, [timestampInput, unit, formatDate]);

  const handleDateToTimestampConversion = useCallback(() => {
    if (!dateInput) {
      setTimestampOutput('');
      toast.error('Please enter a date and time.');
      return;
    }

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setTimestampOutput('');
      toast.error('Invalid date format. Please use a recognized date string (e.g., "2023-10-27 10:30:00 GMT+0000").');
      return;
    }

    const timestamp = unit === 'seconds' ? Math.floor(date.getTime() / 1000) : date.getTime();
    setTimestampOutput(String(timestamp));
    toast.success('Date converted to timestamp!');
  }, [dateInput, unit]);

  const handleGetCurrentTimestamp = useCallback(() => {
    const now = new Date();
    const currentTimestamp = unit === 'seconds' ? Math.floor(now.getTime() / 1000) : now.getTime();
    setTimestampInput(String(currentTimestamp));
    setTimestampOutput(String(currentTimestamp));
    setDateInput(formatDate(now));
    setDateOutput(formatDate(now));
    toast.success('Current timestamp and date loaded!');
  }, [unit, formatDate]);

  const handleClear = useCallback(() => {
    setTimestampInput('');
    setDateInput('');
    setTimestampOutput('');
    setDateOutput('');
    setUnit('seconds');
    toast.success('All fields cleared!');
  }, []);

  // Effect to update outputs when unit changes
  useEffect(() => {
    if (timestampInput) {
      handleTimestampToDateConversion();
    }
    if (dateInput) {
      handleDateToTimestampConversion();
    }
  }, [unit, timestampInput, dateInput, handleTimestampToDateConversion, handleDateToTimestampConversion]);

  return (
    <ToolPageWrapper
      toolSlug="unix-timestamp-epoch-converter"
      toolName="Unix Timestamp & Epoch Converter"
      description="Convert Unix timestamps to human-readable dates and vice-versa, with support for seconds and milliseconds."
    >
      <div className="flex flex-col gap-6">
        {/* Unit Selector */}
        <div className="flex items-center gap-4 p-4 bg-slate-800 border border-slate-700 rounded-lg shadow-md">
          <span className="text-slate-300 font-medium">Timestamp Unit:</span>
          <div className="flex gap-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500"
                name="unit"
                value="seconds"
                checked={unit === 'seconds'}
                onChange={() => setUnit('seconds')}
              />
              <span className="ml-2 text-slate-200">Seconds</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500"
                name="unit"
                value="milliseconds"
                checked={unit === 'milliseconds'}
                onChange={() => setUnit('milliseconds')}
              />
              <span className="ml-2 text-slate-200">Milliseconds</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timestamp to Date Converter */}
          <div className="flex flex-col gap-4 p-6 bg-slate-800 border border-slate-700 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-400" /> Timestamp to Date
            </h3>
            <label htmlFor="timestampInput" className="text-sm font-medium text-slate-300">
              Enter Unix Timestamp ({unit === 'seconds' ? 'seconds' : 'milliseconds'})
            </label>
            <input
              id="timestampInput"
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder={`e.g., ${unit === 'seconds' ? '1678886400' : '1678886400000'}`}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors"
            />
            <button
              onClick={handleTimestampToDateConversion}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
            >
              Convert <ArrowRight className="h-4 w-4" />
            </button>
            <label htmlFor="dateOutput" className="text-sm font-medium text-slate-300 mt-2">
              Converted Date & Time
            </label>
            <textarea
              id="dateOutput"
              value={dateOutput}
              readOnly
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 outline-none resize-y font-mono"
              placeholder="Result will appear here..."
            />
          </div>

          {/* Date to Timestamp Converter */}
          <div className="flex flex-col gap-4 p-6 bg-slate-800 border border-slate-700 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-indigo-400" /> Date to Timestamp
            </h3>
            <label htmlFor="dateInput" className="text-sm font-medium text-slate-300">
              Enter Date & Time
            </label>
            <input
              id="dateInput"
              type="text"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              placeholder="e.g., 2023-10-27 10:30:00 GMT+0000"
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors"
            />
            <button
              onClick={handleDateToTimestampConversion}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
            >
              Convert <ArrowLeft className="h-4 w-4" />
            </button>
            <label htmlFor="timestampOutput" className="text-sm font-medium text-slate-300 mt-2">
              Converted Unix Timestamp ({unit === 'seconds' ? 'seconds' : 'milliseconds'})
            </label>
            <textarea
              id="timestampOutput"
              value={timestampOutput}
              readOnly
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 outline-none resize-y font-mono"
              placeholder="Result will appear here..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-4">
          <button
            onClick={handleGetCurrentTimestamp}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
          >
            <Clock className="h-5 w-5" /> Get Current Timestamp
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
          >
            <RotateCcw className="h-5 w-5" /> Clear All
          </button>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default UnixTimestampConverterPage;