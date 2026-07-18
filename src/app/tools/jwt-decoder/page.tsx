"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Copy, XCircle } from 'lucide-react';

const toolSlug = "jwt-decoder";
const toolName = "JWT Decoder";
const description = "Decode JSON Web Tokens (JWT) to inspect header and payload.";

// Helper function to decode URL-safe base64
const base64UrlDecode = (str: string): string => {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw new Error('Illegal base64url string!');
  }
  return atob(output);
};

export default function JwtDecoderPage() {
  const [jwtToken, setJwtToken] = useState<string>('');
  const [decodedHeader, setDecodedHeader] = useState<object | null>(null);
  const [decodedPayload, setDecodedPayload] = useState<object | null>(null);
  const [signature, setSignature] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { addToHistory } = useToolStore();

  const decodeJwt = useCallback((token: string) => {
    if (!token) {
      setDecodedHeader(null);
      setDecodedPayload(null);
      setSignature('');
      setError('');
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format: must have 3 parts separated by dots.');
      }

      const [encodedHeader, encodedPayload, signaturePart] = parts;

      const decodedHeaderStr = base64UrlDecode(encodedHeader);
      const decodedPayloadStr = base64UrlDecode(encodedPayload);

      setDecodedHeader(JSON.parse(decodedHeaderStr));
      setDecodedPayload(JSON.parse(decodedPayloadStr));
      setSignature(signaturePart);
      setError('');
    } catch (e: any) {
      setDecodedHeader(null);
      setDecodedPayload(null);
      setSignature('');
      setError(`Error decoding JWT: ${e.message}`);
    }
  }, []);

  useEffect(() => {
    decodeJwt(jwtToken);
  }, [jwtToken, decodeJwt]);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const renderJsonOutput = (data: object | null, label: string) => (
    <div className="relative bg-slate-800 rounded-lg p-4 font-mono text-sm text-slate-200 shadow-inner min-h-[100px] flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-indigo-400">{label}</h3>
        {data && (
          <button
            onClick={() => handleCopy(JSON.stringify(data, null, 2), label)}
            className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-md transition-colors"
          >
            <Copy size={14} /> Copy
          </button>
        )}
      </div>
      {data ? (
        <pre className="flex-1 overflow-auto whitespace-pre-wrap break-all">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p className="text-slate-500 italic">No {label.toLowerCase()} to display.</p>
      )}
    </div>
  );

  return (
    <ToolPageWrapper toolSlug={toolSlug} toolName={toolName} description={description}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="jwtInput" className="text-slate-300 font-medium">
            Enter JWT Token:
          </label>
          <textarea
            id="jwtInput"
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
            rows={6}
            className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:outline-none rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 transition-colors font-mono text-sm resize-y"
            placeholder="Paste your JWT token here (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c)"
          />
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3">
            <XCircle size={20} className="text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderJsonOutput(decodedHeader, 'Header')}
          {renderJsonOutput(decodedPayload, 'Payload')}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="signatureOutput" className="text-slate-300 font-medium">
            Signature:
          </label>
          <div className="relative bg-slate-800 rounded-lg p-4 font-mono text-sm text-slate-200 shadow-inner min-h-[80px] flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-emerald-400">Signature</h3>
              {signature && (
                <button
                  onClick={() => handleCopy(signature, 'Signature')}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-md transition-colors"
                >
                  <Copy size={14} /> Copy
                </button>
              )}
            </div>
            {signature ? (
              <pre className="flex-1 overflow-auto whitespace-pre-wrap break-all">
                {signature}
              </pre>
            ) : (
              <p className="text-slate-500 italic">No signature to display.</p>
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}