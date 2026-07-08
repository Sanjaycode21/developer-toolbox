'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, AlertCircle, Lightbulb } from 'lucide-react';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

// Dynamically import Toaster to avoid hydration issues
const Toaster = dynamic(() => import('react-hot-toast').then((mod) => mod.Toaster), { ssr: false });

interface MatchResult {
  index: number;
  value: string;
  groups: string[];
}

const commonRegexPatterns: { [key: string]: { pattern: string; description: string } } = {
  email: {
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    description: 'Matches a standard email address format.',
  },
  url: {
    pattern: '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$',
    description: 'Matches a common URL format, including http/https and optional path.',
  },
  phoneNumberUS: {
    pattern: '^\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$',
    description: 'Matches a 10-digit US phone number format (e.g., (123) 456-7890).',
  },
  dateYYYYMMDD: {
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
    description: 'Matches a date in YYYY-MM-DD format.',
  },
  uuid: {
    pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
    description: 'Matches a standard UUID (Universally Unique Identifier).',
  },
  ipAddressV4: {
    pattern: '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    description: 'Matches an IPv4 address.',
  },
  htmlTag: {
    pattern: '^<([a-z]+)([^>]*?)>(.*?)<\\/\\1>$',
    description: 'Matches a basic HTML tag with content.',
  },
};

const RegexTesterGeneratorPage = () => {
  const [pattern, setPattern] = useState<string>('');
  const [testString, setTestString] = useState<string>('');
  const [flags, setFlags] = useState<string[]>(['g']); // 'g' for global by default
  const [matches, setMatches] = useState<MatchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [generatedPattern, setGeneratedPattern] = useState<string>('');
  const [generationDescription, setGenerationDescription] = useState<string>('');

  const availableFlags = ['g', 'i', 'm', 'u', 's', 'y'];

  const handleFlagChange = useCallback((flag: string) => {
    setFlags((prevFlags) =>
      prevFlags.includes(flag) ? prevFlags.filter((f) => f !== flag) : [...prevFlags, flag]
    );
  }, []);

  const testRegex = useCallback(() => {
    setError(null);
    setMatches(null);
    if (!pattern) {
      setError('Regex pattern cannot be empty.');
      return;
    }

    try {
      const regex = new RegExp(pattern, flags.join(''));
      const results: MatchResult[] = [];
      let match;

      // Use matchAll for global flag, otherwise exec for first match
      if (flags.includes('g')) {
        const allMatches = testString.matchAll(regex);
        for (match of allMatches) {
          if (match.index !== undefined && match[0] !== undefined) {
            results.push({
              index: match.index,
              value: match[0],
              groups: match.slice(1),
            });
          }
        }
      } else {
        match = regex.exec(testString);
        if (match && match.index !== undefined && match[0] !== undefined) {
          results.push({
            index: match.index,
            value: match[0],
            groups: match.slice(1),
          });
        }
      }

      setMatches(results);
    } catch (e: any) {
      setError(e.message);
    }
  }, [pattern, testString, flags]);

  useEffect(() => {
    if (pattern && testString) {
      testRegex();
    }
  }, [pattern, testString, flags, testRegex]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const highlightMatches = useMemo(() => {
    if (!testString || !matches || matches.length === 0) {
      return <span className="text-slate-400">{testString}</span>;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`pre-${i}`} className="text-slate-400">
            {testString.substring(lastIndex, match.index)}
          </span>
        );
      }
      parts.push(
        <span key={`match-${i}`} className="bg-indigo-600/30 text-indigo-300 rounded px-0.5">
          {match.value}
        </span>
      );
      lastIndex = match.index + match.value.length;
    });

    if (lastIndex < testString.length) {
      parts.push(
        <span key="post" className="text-slate-400">
          {testString.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  }, [testString, matches]);

  const handleGeneratePattern = useCallback((key: string) => {
    const { pattern, description } = commonRegexPatterns[key];
    setGeneratedPattern(pattern);
    setGenerationDescription(description);
    setPattern(pattern); // Automatically set the generated pattern to the tester
    toast.success(`Generated '${key}' pattern.`);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:p-8"
    >
      <Toaster />
      <h1 className="text-4xl font-extrabold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
        Regex Tester & Generator
      </h1>
      <p className="text-lg text-slate-400 mb-8">
        Test regular expressions against text and generate common regex patterns.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regex Tester Section */}
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="text-indigo-400" size={24} /> Regex Tester
          </h2>
          <p className="text-slate-400 mb-6">Enter your regex pattern and test string to see matches.</p>

          <div className="mb-6">
            <label htmlFor="regex-pattern" className="block text-sm font-medium text-slate-300 mb-2">
              Regex Pattern
            </label>
            <div className="relative">
              <input
                id="regex-pattern"
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="e.g., ^\\d{3}-\\d{2}-\\d{4}$"
                className="w-full p-3 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">
                /{flags.join('')}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="test-string" className="block text-sm font-medium text-slate-300 mb-2">
              Test String
            </label>
            <textarea
              id="test-string"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              rows={6}
              placeholder="Enter the string to test against..."
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono"
            />
          </div>

          <div className="mb-6">
            <span className="block text-sm font-medium text-slate-300 mb-2">Flags</span>
            <div className="flex flex-wrap gap-3">
              {availableFlags.map((flag) => (
                <label key={flag} className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value={flag}
                    checked={flags.includes(flag)}
                    onChange={() => handleFlagChange(flag)}
                    className="form-checkbox h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-slate-300 text-sm font-mono">{flag}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg flex items-center gap-2 mb-6"
            >
              <AlertCircle size={20} />
              <span>Error: {error}</span>
            </motion.div>
          )}

          <div className="mb-6 p-4 bg-slate-800 border border-slate-700 rounded-lg min-h-[100px] overflow-auto">
            <h3 className="text-md font-medium text-slate-300 mb-2">Highlighted Test String:</h3>
            <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
              {highlightMatches}
            </pre>
          </div>

          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg min-h-[150px] overflow-auto">
            <h3 className="text-md font-medium text-slate-300 mb-2">Matches ({matches?.length || 0}):</h3>
            {matches && matches.length > 0 ? (
              <ul className="space-y-2">
                {matches.map((match, index) => (
                  <li key={index} className="bg-slate-700/50 p-2 rounded-md text-sm">
                    <p className="text-indigo-300 font-mono break-words">
                      Match {index + 1}: <span className="font-bold">{match.value}</span>
                    </p>
                    {match.groups.length > 0 && (
                      <p className="text-slate-400 text-xs mt-1">
                        Groups: [{match.groups.map((g) => `'${g}'`).join(', ')}]
                      </p>
                    )}
                    <p className="text-slate-500 text-xs">Index: {match.index}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500">No matches found or test string is empty.</p>
            )}
          </div>
        </div>

        {/* Regex Generator Section */}
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="text-purple-400" size={24} /> Regex Generator
          </h2>
          <p className="text-slate-400 mb-6">Select a common pattern to generate its regex.</p>

          <div className="mb-6">
            <label htmlFor="pattern-selector" className="block text-sm font-medium text-slate-300 mb-2">
              Select Common Pattern
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.keys(commonRegexPatterns).map((key) => (
                <motion.button
                  key={key}
                  onClick={() => handleGeneratePattern(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-indigo-700/40 border border-slate-700 rounded-lg text-slate-200 text-sm font-medium transition-colors"
                >
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </motion.button>
              ))}
            </div>
          </div>

          {generatedPattern && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-slate-800 border border-slate-700 rounded-lg"
            >
              <h3 className="text-md font-medium text-slate-300 mb-2">Generated Regex:</h3>
              <div className="relative flex items-center">
                <code className="flex-1 p-2 bg-slate-700 rounded-md text-indigo-300 font-mono text-sm break-all pr-10">
                  {generatedPattern}
                </code>
                <motion.button
                  onClick={() => copyToClipboard(generatedPattern)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-slate-600 hover:bg-slate-500 text-slate-200 transition-colors"
                  aria-label="Copy generated regex"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </motion.button>
              </div>
              {generationDescription && (
                <p className="text-slate-500 text-xs mt-2">{generationDescription}</p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RegexTesterGeneratorPage;
