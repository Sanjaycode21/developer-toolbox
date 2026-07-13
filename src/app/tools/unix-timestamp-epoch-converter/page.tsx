"use client";

import React, { useState, useCallback, useEffect } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';

const UnixTimestampEpochConverterPage: React.FC = () => {
  const [timestampInput, setTimestampInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>('');
  const [convertedDate, setConvertedDate] = useState<string>('');
  const [convertedTimestamp, setConvertedTimestamp] = useState<string>('');

  const formatDate = useCallback((date: Date): string => {
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    // Format to YYYY-MM-DD HH:mm:ss UTC
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
  }, []);

  const convertTimestampToDate = useCallback(() => {
    if (!timestampInput) {
      setConvertedDate('');
      return;
    }
    const timestamp = parseInt(timestampInput, 10);
    if (isNaN(timestamp) || timestamp < 0) {
      toast.error("Please enter a valid positive Unix timestamp.");
      setConvertedDate("Invalid Timestamp");
      return;
    }
    // Unix timestamp is in seconds, Date constructor expects milliseconds
    const date = new Date(timestamp * 1000);
    setConvertedDate(formatDate(date));
  }, [timestampInput, formatDate]);

  const convertDateToTimestamp = useCallback(() => {
    if (!dateInput) {
      setConvertedTimestamp('');
      return;
    }
    try {
      // Attempt to parse the date string. new Date() is quite flexible.
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        toast.error("Please enter a valid date/time string.");
        setConvertedTimestamp("Invalid Date");
        return;
      }
      // Get Unix timestamp in seconds
      const timestamp = Math.floor(date.getTime() / 1000);
      setConvertedTimestamp(timestamp.toString());
    } catch (error) {
      toast.error("Error parsing date. Please check the format.");
      setConvertedTimestamp("Invalid Date");
    }
  }, [dateInput]);

  const setCurrentTimestamp = useCallback(() => {
    const now = new Date();
    const currentTimestamp = Math.floor(now.getTime() / 1000);
    setTimestampInput(currentTimestamp.toString());
    setDateInput(formatDate(now));
    setConvertedDate(formatDate(now)); // Directly set for current timestamp
    setConvertedTimestamp(currentTimestamp.toString()); // Directly set for current date
  }, [formatDate]);

  // Effect to run conversions when inputs change
  useEffect(() => {
    convertTimestampToDate();
  }, [timestampInput, convertTimestampToDate]);

  useEffect(() => {
    convertDateToTimestamp();
  }, [dateInput, convertDateToTimestamp]);

  return (
    <ToolPageWrapper
      toolSlug="unix-timestamp-epoch-converter"
      toolName="Unix Timestamp & Epoch Converter"
      description="Convert Unix timestamps to human-readable dates and vice versa."
    >
      <div className="space-y-8">
        {/* Get Current Timestamp */}
        <div className="p-6 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-xl font-semibold text-slate-200 mb-4">Current Timestamp</h3>
          <p className="text-slate-400 mb-4 text-sm">
            Quickly get the current Unix timestamp and its corresponding UTC date.
          </p>
          <button
            onClick={setCurrentTimestamp}
            className="w-full px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200"
          >
            Get Current Timestamp
          </button>
          {timestampInput && (
            <div className="mt-4 p-4 bg-slate-700 rounded-md text-slate-200 font-mono text-sm break-all">
              <p><strong>Timestamp:</strong> {timestampInput}</p>
              <p><strong>Date (UTC):</strong> {convertedDate}</p>
            </div>
          )}
        </div>

        {/* Timestamp to Date Converter */}
        <div className="p-6 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-xl font-semibold text-slate-200 mb-4">Timestamp to Date</h3>
          <p className="text-slate-400 mb-4 text-sm">
            Enter a Unix timestamp (seconds since Epoch) to convert it to a human-readable UTC date.
          </p>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="e.g., 1678886400"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-sm"
            />
            <button
              onClick={convertTimestampToDate}
              className="w-full px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200"
            >
              Convert Timestamp
            </button>
            {convertedDate && (
              <div className="mt-2 p-4 bg-slate-700 rounded-md text-slate-200 font-mono text-sm break-all">
                <p><strong>Result (UTC):</strong> {convertedDate}</p>
              </div>
            )}
          </div>
        </div>

        {/* Date to Timestamp Converter */}
        <div className="p-6 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-xl font-semibold text-slate-200 mb-4">Date to Timestamp</h3>
          <p className="text-slate-400 mb-4 text-sm">
            Enter a date and time string to convert it to a Unix timestamp (seconds since Epoch).
            (e.g., "2023-03-15 12:00:00 UTC" or "March 15, 2023 12:00:00 GMT+0")
          </p>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              placeholder="e.g., 2023-03-15 12:00:00 UTC"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-sm"
            />
            <button
              onClick={convertDateToTimestamp}
              className="w-full px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200"
            >
              Convert Date
            </button>
            {convertedTimestamp && (
              <div className="mt-2 p-4 bg-slate-700 rounded-md text-slate-200 font-mono text-sm break-all">
                <p><strong>Result (Timestamp):</strong> {convertedTimestamp}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default UnixTimestampEpochConverterPage;