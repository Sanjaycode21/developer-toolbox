"use client";

import React, { useState, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import toast from 'react-hot-toast';
import { Clock, CalendarDays, ArrowRight } from 'lucide-react';

const UnixTimestampEpochConverterPage: React.FC = () => {
  const [unixInput, setUnixInput] = useState<string>('');
  const [dateOutput, setDateOutput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>('');
  const [unixOutput, setUnixOutput] = useState<string>('');

  const convertUnixToDate = useCallback(() => {
    if (!unixInput) {
      setDateOutput('');
      toast.error('Please enter a Unix timestamp.');
      return;
    }
    const timestamp = parseInt(unixInput, 10);
    if (isNaN(timestamp) || timestamp < 0) {
      setDateOutput('');
      toast.error('Invalid Unix timestamp. Please enter a positive number.');
      return;
    }

    try {
      // Unix timestamps are typically in seconds, JavaScript Date expects milliseconds
      const date = new Date(timestamp * 1000);
      if (isNaN(date.getTime())) {
        setDateOutput('');
        toast.error('Could not convert timestamp to a valid date.');
        return;
      }
      setDateOutput(date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      }));
      toast.success('Timestamp converted successfully!');
    } catch (error) {
      setDateOutput('');
      toast.error('An error occurred during conversion.');
      console.error(error);
    }
  }, [unixInput]);

  const convertDateToUnix = useCallback(() => {
    if (!dateInput) {
      setUnixOutput('');
      toast.error('Please enter a date and time string.');
      return;
    }

    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        setUnixOutput('');
        toast.error('Invalid date format. Please use a recognized date string (e.g., "2023-10-27 10:30:00 UTC").');
        return;
      }
      // Unix timestamp in seconds
      setUnixOutput(Math.floor(date.getTime() / 1000).toString());
      toast.success('Date converted successfully!');
    } catch (error) {
      setUnixOutput('');
      toast.error('An error occurred during conversion.');
      console.error(error);
    }
  }, [dateInput]);

  const getCurrentTimestamp = useCallback(() => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const nowAsDate = new Date(nowInSeconds * 1000);

    setUnixInput(nowInSeconds.toString());
    setDateInput(nowAsDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    }));
    setDateOutput(nowAsDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    }));
    setUnixOutput(nowInSeconds.toString());
    toast.success('Current timestamp loaded!');
  }, []);

  return (
    <ToolPageWrapper
      toolSlug="unix-timestamp-epoch-converter"
      toolName="Unix Timestamp & Epoch Converter"
      description="Convert Unix timestamps to human-readable dates and vice-versa. Supports current timestamp generation."
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Current Timestamp Section */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Current Timestamp
          </h2>
          <p className="text-slate-400 mb-4">Get the current Unix timestamp and its corresponding human-readable date.</p>
          <button
            onClick={getCurrentTimestamp}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Get Current Timestamp
          </button>
          {unixInput && (
            <div className="mt-4 p-4 bg-slate-700 rounded-md text-slate-200 font-mono text-sm break-all">
              <p className="mb-1">Unix Timestamp: <span className="text-indigo-300">{unixInput}</span></p>
              <p>Date & Time: <span className="text-indigo-300">{dateOutput}</span></p>
            </div>
          )}
        </div>

        {/* Unix Timestamp to Date Converter */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-400" /> Unix Timestamp to Date
          </h2>
          <p className="text-slate-400 mb-4">Enter a Unix timestamp (in seconds) to convert it to a human-readable date and time.</p>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={unixInput}
              onChange={(e) => setUnixInput(e.target.value)}
              placeholder="e.g., 1678886400"
              className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-md px-4 py-2 text-slate-200 placeholder-slate-500 transition-colors text-sm"
            />
            <button
              onClick={convertUnixToDate}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Convert to Date <ArrowRight className="inline-block ml-2 w-4 h-4" />
            </button>
            {dateOutput && (
              <div className="mt-2 p-4 bg-slate-700 rounded-md text-slate-200 font-mono text-sm break-all">
                <p>Converted Date: <span className="text-emerald-300">{dateOutput}</span></p>
              </div>
            )}
          </div>
        </div>

        {/* Date to Unix Timestamp Converter */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" /> Date to Unix Timestamp
          </h2>
          <p className="text-slate-400 mb-4">Enter a date and time string to convert it to a Unix timestamp (in seconds).</p>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              placeholder="e.g., 2023-03-15 00:00:00 UTC"
              className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-md px-4 py-2 text-slate-200 placeholder-slate-500 transition-colors text-sm"
            />
            <button
              onClick={convertDateToUnix}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Convert to Timestamp <ArrowRight className="inline-block ml-2 w-4 h-4" />
            </button>
            {unixOutput && (
              <div className="mt-2 p-4 bg-slate-700 rounded-md text-slate-200 font-mono text-sm break-all">
                <p>Converted Timestamp: <span className="text-sky-300">{unixOutput}</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default UnixTimestampEpochConverterPage;