"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';
import { Copy, Clock, Calendar } from 'lucide-react';

const UnixTimestampEpochConverterPage: React.FC = () => {
  const [unixInput, setUnixInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>('');
  const [convertedDateLocal, setConvertedDateLocal] = useState<string>('');
  const [convertedDateUTC, setConvertedDateUTC] = useState<string>('');
  const [convertedUnix, setConvertedUnix] = useState<string>('');
  const [currentUnix, setCurrentUnix] = useState<string>('');
  const [currentDateLocal, setCurrentDateLocal] = useState<string>('');
  const [currentDateUTC, setCurrentDateUTC] = useState<string>('');

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`${label} copied to clipboard!`))
      .catch(() => toast.error(`Failed to copy ${label}.`));
  }, []);

  const formatDate = useCallback((timestamp: number, timezone: 'local' | 'utc'): string => {
    if (isNaN(timestamp)) return 'Invalid Timestamp';
    const date = new Date(timestamp * 1000); // Unix timestamp is in seconds, Date expects milliseconds

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
      return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    } else {
      return date.toLocaleString(undefined, options);
    }
  }, []);

  const convertUnixToDate = useCallback(() => {
    const timestamp = parseInt(unixInput, 10);
    if (isNaN(timestamp) || unixInput.trim() === '') {
      setConvertedDateLocal('Invalid Unix Timestamp');
      setConvertedDateUTC('Invalid Unix Timestamp');
      return;
    }
    setConvertedDateLocal(formatDate(timestamp, 'local'));
    setConvertedDateUTC(formatDate(timestamp, 'utc'));
  }, [unixInput, formatDate]);

  const convertDateToUnix = useCallback(() => {
    if (dateInput.trim() === '') {
      setConvertedUnix('Invalid Date/Time');
      return;
    }
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        setConvertedUnix('Invalid Date/Time');
        return;
      }
      setConvertedUnix(Math.floor(date.getTime() / 1000).toString());
    } catch (error) {
      setConvertedUnix('Invalid Date/Time');
    }
  }, [dateInput]);

  const updateCurrentTimestamps = useCallback(() => {
    const now = Math.floor(Date.now() / 1000);
    setCurrentUnix(now.toString());
    setCurrentDateLocal(formatDate(now, 'local'));
    setCurrentDateUTC(formatDate(now, 'utc'));
  }, [formatDate]);

  useEffect(() => {
    updateCurrentTimestamps();
    const interval = setInterval(updateCurrentTimestamps, 1000); // Update every second
    return () => clearInterval(interval);
  }, [updateCurrentTimestamps]);

  // Set initial dateInput to current local time in a format suitable for datetime-local input
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"
    setDateInput(formattedDate);
  }, []);


  return (
    <ToolPageWrapper
      toolSlug="unix-timestamp-epoch-converter"
      toolName="Unix Timestamp & Epoch Converter"
      description="Convert between Unix timestamps (Epoch) and human-readable dates and times."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Timestamp Section */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Current Timestamp
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Unix Timestamp (Epoch)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUnix}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => copyToClipboard(currentUnix, 'Current Unix Timestamp')}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                  title="Copy Unix Timestamp"
                >
                  <Copy className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Local Date & Time</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentDateLocal}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => copyToClipboard(currentDateLocal, 'Current Local Date')}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                  title="Copy Local Date & Time"
                >
                  <Copy className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">UTC Date & Time</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentDateUTC}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => copyToClipboard(currentDateUTC, 'Current UTC Date')}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                  title="Copy UTC Date & Time"
                >
                  <Copy className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Unix to Date Converter */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" /> Unix to Date
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="unix-input" className="block text-sm font-medium text-slate-300 mb-1">
                Enter Unix Timestamp (e.g., 1678886400)
              </label>
              <input
                id="unix-input"
                type="text"
                value={unixInput}
                onChange={(e) => setUnixInput(e.target.value)}
                placeholder="e.g., 1678886400"
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={convertUnixToDate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Convert Unix to Date
            </button>
            {convertedDateLocal && (
              <div className="space-y-2 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Local Date & Time</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={convertedDateLocal}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => copyToClipboard(convertedDateLocal, 'Converted Local Date')}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                      title="Copy Local Date & Time"
                    >
                      <Copy className="w-4 h-4 text-slate-300" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">UTC Date & Time</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={convertedDateUTC}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => copyToClipboard(convertedDateUTC, 'Converted UTC Date')}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                      title="Copy UTC Date & Time"
                    >
                      <Copy className="w-4 h-4 text-slate-300" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date to Unix Converter */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" /> Date to Unix
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="date-input" className="block text-sm font-medium text-slate-300 mb-1">
                Enter Date & Time (e.g., 2023-03-15T10:00:00)
              </label>
              <input
                id="date-input"
                type="datetime-local"
                step="1"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={convertDateToUnix}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Convert Date to Unix
            </button>
            {convertedUnix && (
              <div className="space-y-2 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Unix Timestamp (Epoch)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={convertedUnix}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => copyToClipboard(convertedUnix, 'Converted Unix Timestamp')}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                      title="Copy Unix Timestamp"
                    >
                      <Copy className="w-4 h-4 text-slate-300" />
                    </button>
                  </div>
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