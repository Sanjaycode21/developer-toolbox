'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, RefreshCcw } from 'lucide-react';

// Helper functions for generating options
const generateNumbers = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const minutesOptions = generateNumbers(0, 59);
const hoursOptions = generateNumbers(0, 23);
const dayOfMonthOptions = generateNumbers(1, 31);
const monthOptions = generateNumbers(1, 12);
const dayOfWeekOptions = generateNumbers(0, 6); // 0=Sunday, 6=Saturday

const monthNamesFull = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];
const monthNamesForSelect = ['', ...monthNamesFull]; // 1-indexed for direct use with month numbers 1-12

const dayOfWeekNamesFull = [
  'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'
];
// dayOfWeekNamesFull is already 0-indexed, matching cron's 0-6

interface CronFieldState {
  type: 'every' | 'specific' | 'range' | 'step';
  value: string; // e.g., "0,15,30", "0-15", "5" for step
}

const initialFieldState: CronFieldState = {
  type: 'every',
  value: '*',
};

const CronExpressionBuilder: React.FC = () => {
  const [minute, setMinute] = useState<CronFieldState>(initialFieldState);
  const [hour, setHour] = useState<CronFieldState>(initialFieldState);
  const [dayOfMonth, setDayOfMonth] = useState<CronFieldState>(initialFieldState);
  const [month, setMonth] = useState<CronFieldState>(initialFieldState);
  const [dayOfWeek, setDayOfWeek] = useState<CronFieldState>(initialFieldState);
  const [cronExpression, setCronExpression] = useState<string>('* * * * *');
  const [humanReadable, setHumanReadable] = useState<string>('Every minute, every hour, every day of month, every month, every day of week.');

  const { addToHistory } = useToolStore();
  const toolSlug = "cron-expression-builder";

  const buildCronString = useCallback(() => {
    const parts = [minute, hour, dayOfMonth, month, dayOfWeek].map(field => {
      if (field.type === 'every') return '*';
      if (field.type === 'specific' || field.type === 'range') return field.value;
      if (field.type === 'step') return `*/${field.value}`;
      return '*'; // Fallback
    });
    return parts.join(' ');
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const describeCron = useCallback((cron: string) => {
    const parts = cron.split(' ');
    if (parts.length !== 5) return 'Invalid cron expression format.';

    const [min, hr, dom, mon, dow] = parts;

    let description = 'Runs ';

    // Minute description
    if (min === '*') {
      description += 'every minute';
    } else if (min.startsWith('*/')) {
      description += `every ${min.substring(2)} minutes`;
    } else if (min.includes(',')) {
      description += `at minutes ${min}`;
    } else if (min.includes('-')) {
      description += `at minutes ${min}`;
    } else {
      description += `at minute ${min}`;
    }

    // Hour description
    if (hr === '*') {
      description += ', every hour';
    } else if (hr.startsWith('*/')) {
      description += `, every ${hr.substring(2)} hours`;
    } else if (hr.includes(',')) {
      description += `, at hours ${hr}`;
    } else if (hr.includes('-')) {
      description += `, at hours ${hr}`;
    } else {
      description += `, at hour ${hr}`;
    }

    // Day of Month description
    if (dom === '*') {
      description += ', every day of month';
    } else if (dom.startsWith('*/')) {
      description += `, every ${dom.substring(2)} days of month`;
    } else if (dom.includes(',')) {
      description += `, on days ${dom} of month`;
    } else if (dom.includes('-')) {
      description += `, on days ${dom} of month`;
    } else {
      description += `, on day ${dom} of month`;
    }

    // Month description
    if (mon === '*') {
      description += ', every month';
    } else if (mon.startsWith('*/')) {
      description += `, every ${mon.substring(2)} months`;
    } else if (mon.includes(',')) {
      const specificMonths = mon.split(',').map(m => monthNamesFull[parseInt(m) - 1]).join(', ');
      description += `, in ${specificMonths}`;
    } else if (mon.includes('-')) {
      const [start, end] = mon.split('-').map(m => monthNamesFull[parseInt(m) - 1]);
      description += `, from ${start} to ${end}`;
    } else {
      description += `, in ${monthNamesFull[parseInt(mon) - 1]}`;
    }

    // Day of Week description
    if (dow === '*') {
      description += ', every day of week.';
    } else if (dow.startsWith('*/')) {
      description += `, every ${dow.substring(2)} days of week.`;
    } else if (dow.includes(',')) {
      const specificDays = dow.split(',').map(d => dayOfWeekNamesFull[parseInt(d)]).join(', ');
      description += `, on ${specificDays}.`;
    } else if (dow.includes('-')) {
      const [start, end] = dow.split('-').map(d => dayOfWeekNamesFull[parseInt(d)]);
      description += `, from ${start} to ${end}.`;
    } else {
      description += `, on ${dayOfWeekNamesFull[parseInt(dow)]}.`;
    }

    return description.replace('Runs ,', 'Runs'); // Clean up initial comma if any
  }, []);

  useEffect(() => {
    const newCron = buildCronString();
    setCronExpression(newCron);
    setHumanReadable(describeCron(newCron));
    addToHistory(toolSlug);
  }, [minute, hour, dayOfMonth, month, dayOfWeek, buildCronString, describeCron, addToHistory, toolSlug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cronExpression);
    toast.success('Cron expression copied to clipboard!');
  };

  const handleReset = () => {
    setMinute(initialFieldState);
    setHour(initialFieldState);
    setDayOfMonth(initialFieldState);
    setMonth(initialFieldState);
    setDayOfWeek(initialFieldState);
    toast.success('Cron expression reset!');
  };

  const CronField: React.FC<{
    label: string;
    state: CronFieldState;
    setState: React.Dispatch<React.SetStateAction<CronFieldState>>;
    options: number[];
    nameMap?: string[]; // For months and days of week, 0-indexed or 1-indexed based on options
    minStep?: number;
    maxStep?: number;
  }> = ({ label, state, setState, options, nameMap, minStep = 1, maxStep = 59 }) => {
    const idPrefix = label.toLowerCase().replace(/\s/g, '-');

    const handleTypeChange = (type: CronFieldState['type']) => {
      let newValue = '*';
      if (type === 'specific') newValue = options[0]?.toString() || '0';
      if (type === 'range') newValue = `${options[0]}-${options[options.length - 1]}`;
      if (type === 'step') newValue = minStep.toString();
      setState({ type, value: newValue });
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setState(prev => ({ ...prev, value: e.target.value }));
    };

    const renderValueInput = () => {
      if (state.type === 'specific') {
        return (
          <select
            multiple
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:ring-indigo-500 h-24"
            value={state.value.split(',')}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
              setState(prev => ({ ...prev, value: selectedOptions.join(',') }));
            }}
          >
            {options.map(opt => (
              <option key={opt} value={opt}>
                {nameMap && nameMap[opt] ? nameMap[opt] : opt}
              </option>
            ))}
          </select>
        );
      } else if (state.type === 'range') {
        const [start, end] = state.value.split('-').map(Number);
        return (
          <div className="flex gap-2">
            <select
              className="w-1/2 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
              value={isNaN(start) ? options[0] : start}
              onChange={(e) => setState(prev => ({ ...prev, value: `${e.target.value}-${isNaN(end) ? options[options.length - 1] : end}` }))}
            >
              {options.map(opt => (
                <option key={`range-start-${opt}`} value={opt}>
                  {nameMap && nameMap[opt] ? nameMap[opt] : opt}
                </option>
              ))}
            </select>
            <span className="text-slate-400 flex items-center">-</span>
            <select
              className="w-1/2 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
              value={isNaN(end) ? options[options.length - 1] : end}
              onChange={(e) => setState(prev => ({ ...prev, value: `${isNaN(start) ? options[0] : start}-${e.target.value}` }))}
            >
              {options.map(opt => (
                <option key={`range-end-${opt}`} value={opt}>
                  {nameMap && nameMap[opt] ? nameMap[opt] : opt}
                </option>
              ))}
            </select>
          </div>
        );
      } else if (state.type === 'step') {
        return (
          <input
            type="number"
            min={minStep}
            max={maxStep}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
            value={state.value}
            onChange={handleValueChange}
          />
        );
      }
      return null;
    };

    return (
      <div className="p-4 border border-slate-700 rounded-lg bg-slate-800/50">
        <h3 className="text-lg font-semibold text-slate-100 mb-3">{label}</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="radio"
              name={`${idPrefix}-type`}
              value="every"
              checked={state.type === 'every'}
              onChange={() => handleTypeChange('every')}
              className="form-radio text-indigo-500 bg-slate-700 border-slate-600 focus:ring-indigo-500"
            />
            Every {label.toLowerCase().replace('day of ', '')}
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="radio"
              name={`${idPrefix}-type`}
              value="specific"
              checked={state.type === 'specific'}
              onChange={() => handleTypeChange('specific')}
              className="form-radio text-indigo-500 bg-slate-700 border-slate-600 focus:ring-indigo-500"
            />
            Specific {label.toLowerCase().replace('day of ', '')} (select multiple)
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="radio"
              name={`${idPrefix}-type`}
              value="range"
              checked={state.type === 'range'}
              onChange={() => handleTypeChange('range')}
              className="form-radio text-indigo-500 bg-slate-700 border-slate-600 focus:ring-indigo-500"
            />
            Range of {label.toLowerCase().replace('day of ', '')}
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="radio"
              name={`${idPrefix}-type`}
              value="step"
              checked={state.type === 'step'}
              onChange={() => handleTypeChange('step')}
              className="form-radio text-indigo-500 bg-slate-700 border-slate-600 focus:ring-indigo-500"
            />
            Every X {label.toLowerCase().replace('day of ', '')}
          </label>
        </div>
        <div className="mt-4">
          {renderValueInput()}
        </div>
      </div>
    );
  };

  return (
    <ToolPageWrapper
      toolSlug="cron-expression-builder"
      toolName="Cron Expression Builder"
      description="Generate cron expressions for scheduled tasks."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <CronField
            label="Minute"
            state={minute}
            setState={setMinute}
            options={minutesOptions}
            minStep={1}
            maxStep={59}
          />
          <CronField
            label="Hour"
            state={hour}
            setState={setHour}
            options={hoursOptions}
            minStep={1}
            maxStep={23}
          />
          <CronField
            label="Day of Month"
            state={dayOfMonth}
            setState={setDayOfMonth}
            options={dayOfMonthOptions}
            minStep={1}
            maxStep={31}
          />
          <CronField
            label="Month"
            state={month}
            setState={setMonth}
            options={monthOptions}
            nameMap={monthNamesForSelect}
            minStep={1}
            maxStep={12}
          />
          <CronField
            label="Day of Week"
            state={dayOfWeek}
            setState={setDayOfWeek}
            options={dayOfWeekOptions}
            nameMap={dayOfWeekNamesFull}
            minStep={1}
            maxStep={6}
          />
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">Generated Cron Expression</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={cronExpression}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-sm font-mono text-slate-200 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition-colors duration-200 flex items-center justify-center"
              aria-label="Copy cron expression"
            >
              <Copy size={18} />
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-200 transition-colors duration-200 flex items-center justify-center"
              aria-label="Reset fields"
            >
              <RefreshCcw size={18} />
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-slate-100">Human-Readable Description:</h3>
            <p className="text-slate-300 text-sm mt-2 bg-slate-900 border border-slate-700 rounded-md p-3">
              {humanReadable}
            </p>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default CronExpressionBuilder;