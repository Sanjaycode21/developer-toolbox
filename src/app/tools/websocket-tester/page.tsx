"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ToolPageWrapper } from '@/components/ToolPageWrapper';
import { useToolStore } from '@/store/useToolStore';
import toast from 'react-hot-toast';
import { Globe, Send, XCircle, PlayCircle, Trash2 } from 'lucide-react';

interface WebSocketMessage {
  type: 'sent' | 'received' | 'status' | 'error';
  content: string;
  timestamp: number;
}

const WebSocketTesterPage: React.FC = () => {
  const toolSlug = "websocket-tester";
  const { addToHistory } = useToolStore();

  const [wsUrl, setWsUrl] = useState<string>('wss://echo.websocket.events');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [messageToSend, setMessageToSend] = useState<string>('');
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const messageLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    addToHistory(toolSlug);
  }, [addToHistory, toolSlug]);

  // Scroll to bottom of message log
  useEffect(() => {
    if (messageLogRef.current) {
      messageLogRef.current.scrollTop = messageLogRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = useCallback((message: WebSocketMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const handleConnectDisconnect = useCallback(() => {
    if (wsRef.current && (connectionStatus === 'connected' || connectionStatus === 'connecting')) {
      // Disconnect
      wsRef.current.close();
      wsRef.current = null;
      setConnectionStatus('disconnected');
      addMessage({ type: 'status', content: 'Disconnected from WebSocket.', timestamp: Date.now() });
      toast.success('Disconnected from WebSocket.');
    } else {
      // Connect
      if (!wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
        toast.error('Invalid WebSocket URL. Must start with ws:// or wss://');
        addMessage({ type: 'error', content: 'Invalid WebSocket URL. Must start with ws:// or wss://', timestamp: Date.now() });
        return;
      }

      setConnectionStatus('connecting');
      addMessage({ type: 'status', content: `Attempting to connect to ${wsUrl}...`, timestamp: Date.now() });

      try {
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setConnectionStatus('connected');
          addMessage({ type: 'status', content: 'Connected to WebSocket.', timestamp: Date.now() });
          toast.success('Connected to WebSocket!');
        };

        ws.onmessage = (event) => {
          addMessage({ type: 'received', content: event.data, timestamp: Date.now() });
        };

        ws.onerror = (error) => {
          console.error('WebSocket Error:', error);
          setConnectionStatus('error');
          addMessage({ type: 'error', content: `WebSocket Error: ${error}`, timestamp: Date.now() });
          toast.error('WebSocket connection error.');
        };

        ws.onclose = (event) => {
          if (connectionStatus !== 'disconnected') { // Only show if not intentionally disconnected
            setConnectionStatus('disconnected');
            addMessage({ type: 'status', content: `WebSocket Disconnected. Code: ${event.code}, Reason: ${event.reason || 'N/A'}`, timestamp: Date.now() });
            toast.error('WebSocket disconnected.');
          }
        };

        wsRef.current = ws;
      } catch (e: any) {
        setConnectionStatus('error');
        addMessage({ type: 'error', content: `Failed to create WebSocket: ${e.message}`, timestamp: Date.now() });
        toast.error(`Failed to create WebSocket: ${e.message}`);
      }
    }
  }, [wsUrl, connectionStatus, addMessage]);

  const handleSendMessage = useCallback(() => {
    if (wsRef.current && connectionStatus === 'connected' && messageToSend.trim()) {
      wsRef.current.send(messageToSend);
      addMessage({ type: 'sent', content: messageToSend, timestamp: Date.now() });
      setMessageToSend('');
    } else if (connectionStatus !== 'connected') {
      toast.error('Not connected to WebSocket.');
    } else if (!messageToSend.trim()) {
      toast.error('Message cannot be empty.');
    }
  }, [messageToSend, connectionStatus, addMessage]);

  const handleClearLog = useCallback(() => {
    setMessages([]);
    toast.success('Message log cleared.');
  }, []);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-emerald-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  return (
    <ToolPageWrapper
      toolSlug={toolSlug}
      toolName="WebSocket Tester"
      description="Connect to WebSocket servers, send messages, and view real-time communication logs."
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
        {/* Controls Panel */}
        <div className="flex-1 flex flex-col gap-4 p-6 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-2">Connection Settings</h2>

          {/* WebSocket URL Input */}
          <div>
            <label htmlFor="wsUrl" className="block text-sm font-medium text-slate-300 mb-1">
              WebSocket URL
            </label>
            <input
              id="wsUrl"
              type="text"
              value={wsUrl}
              onChange={(e) => setWsUrl(e.target.value)}
              placeholder="e.g., wss://echo.websocket.events"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
              disabled={connectionStatus === 'connecting'}
            />
          </div>

          {/* Connect/Disconnect Button */}
          <button
            onClick={handleConnectDisconnect}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors text-sm
              ${connectionStatus === 'connected'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }
              ${connectionStatus === 'connecting' ? 'opacity-75 cursor-not-allowed' : ''}
            `}
            disabled={connectionStatus === 'connecting'}
          >
            {connectionStatus === 'connected' ? <XCircle size={18} /> : <PlayCircle size={18} />}
            {connectionStatus === 'connected' ? 'Disconnect' : connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
          </button>

          {/* Connection Status */}
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className={`h-3 w-3 rounded-full ${getConnectionStatusColor()}`}></span>
            <span>Status: <span className="font-semibold capitalize">{connectionStatus}</span></span>
          </div>

          <h2 className="text-xl font-semibold text-slate-100 mt-4 mb-2">Send Message</h2>

          {/* Message Input */}
          <div>
            <label htmlFor="messageToSend" className="block text-sm font-medium text-slate-300 mb-1">
              Message to Send
            </label>
            <textarea
              id="messageToSend"
              value={messageToSend}
              onChange={(e) => setMessageToSend(e.target.value)}
              placeholder="Enter message to send..."
              rows={5}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm resize-y"
              disabled={connectionStatus !== 'connected'}
            ></textarea>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors text-sm
              ${connectionStatus === 'connected' && messageToSend.trim()
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }
            `}
            disabled={connectionStatus !== 'connected' || !messageToSend.trim()}
          >
            <Send size={18} /> Send Message
          </button>
        </div>

        {/* Message Log Panel */}
        <div className="flex-1 flex flex-col gap-4 p-6 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-slate-100">Message Log</h2>
            <button
              onClick={handleClearLog}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors"
            >
              <Trash2 size={14} /> Clear Log
            </button>
          </div>

          <div
            ref={messageLogRef}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-md p-4 overflow-y-auto text-sm font-mono text-slate-200 custom-scrollbar"
          >
            {messages.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No messages yet. Connect to a WebSocket to start logging.</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`mb-2 p-2 rounded-md ${
                  msg.type === 'sent' ? 'bg-indigo-900/30 border border-indigo-800' :
                  msg.type === 'received' ? 'bg-green-900/30 border border-green-800' :
                  msg.type === 'status' ? 'bg-slate-700/30 border border-slate-600 text-slate-400' :
                  'bg-red-900/30 border border-red-800 text-red-300'
                }`}>
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                    <span className={`font-semibold ${
                      msg.type === 'sent' ? 'text-indigo-300' :
                      msg.type === 'received' ? 'text-green-300' :
                      msg.type === 'status' ? 'text-slate-400' :
                      'text-red-300'
                    }`}>
                      {msg.type.toUpperCase()}
                    </span>
                    <span>{formatTimestamp(msg.timestamp)}</span>
                  </div>
                  <pre className="whitespace-pre-wrap break-words text-slate-100">{msg.content}</pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};

export default WebSocketTesterPage;