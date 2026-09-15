import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Bot, 
  Send, 
  Trash2, 
  X, 
  Maximize2, 
  Minimize2, 
  AlertCircle, 
  Sparkles,
  Zap,
  RotateCcw,
  CheckCircle2,
  Play
} from 'lucide-react';
import { executeBobAction, BASE_URL } from '../services/api';

const SUGGESTED_QUESTIONS = [
  "Which asset has the highest failure risk?",
  "Why is T-104 critical?",
  "What is the current grid status?",
  "Which assets are critical?",
  "What preventive action should be taken?",
  "Compare T-104 and T-208."
];

export const GridGuardChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `**GridGuard AI Assistant Online.** Verified connection established with the Grid Failure Prediction ML engine & PostgreSQL SCADA telemetry.

Ask any diagnostic inquiry regarding monitored substations, real-time sensor telemetries, failure probability rankings, or recommended preventive protocols.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [executingActionId, setExecutingActionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setErrorMessage(null);
    setInputMessage('');

    const userMessageObj = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessageObj]);
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome-1')
        .slice(-6)
        .map((m) => ({
          sender: m.sender,
          text: m.text,
        }));

      const res = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const responseText = data.response || data.text || 'No response returned from GridGuard AI.';

      const assistantMessageObj = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: data.actions || [],
        structuredResponse: data.structuredResponse || (data.recommendation ? { recommendation: data.recommendation, metrics: data.metrics } : null)
      };

      setMessages((prev) => [...prev, assistantMessageObj]);
    } catch (err) {
      console.error('GridGuard AI Chat error:', err);
      setErrorMessage(err.message || 'Unable to communicate with GridGuard AI service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = async (action, actionIdx) => {
    setExecutingActionId(`${action.actionType}-${actionIdx}`);
    try {
      const result = await executeBobAction(action.actionType, action.payload);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-action-${Date.now()}`,
          sender: 'assistant',
          text: `✅ **Operational Action Executed on PostgreSQL Database:**\n\n${result.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } catch (err) {
      setErrorMessage(`Action failed: ${err.message}`);
    } finally {
      setExecutingActionId(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `**Chat history cleared.** Ready for diagnostic inquiries on the grid failure prediction system.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorMessage(null);
  };

  return (
    <>
      {/* Floating Chatbot Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:px-4 sm:py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold shadow-2xl flex items-center gap-2.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-cyan-400/40"
          aria-label="Open GridGuard AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
          </div>
          <span className="hidden sm:inline font-mono text-xs tracking-wider uppercase font-extrabold">
            GridGuard AI
          </span>
        </button>
      )}

      {/* Expandable Chatbot Overlay Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 flex flex-col bg-[#0d1322] border border-cyan-500/40 shadow-2xl overflow-hidden font-mono ${
            isExpanded
              ? 'inset-3 sm:inset-6 rounded-xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[480px] h-[580px] max-h-[88vh] rounded-xl'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-[#0a0f1d] border-b border-slate-800 flex items-center justify-between select-none">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                  <span>GridGuard AI Assistant</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-cyan-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AI Assistant</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 text-[10px]">Gemini + ML Ground Truth</span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleClearChat}
                title="Clear current-session chat history"
                className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore window size' : 'Expand window'}
                className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors hidden sm:inline-block cursor-pointer"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chatbot"
                className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Suggested Questions Horizontal Bar */}
          <div className="px-3 py-2 bg-slate-950/70 border-b border-slate-800/80 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1 flex-shrink-0 mr-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Suggested:
            </span>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-cyan-950/80 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700/60 text-[11px] transition-all cursor-pointer flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#080d1a] text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-xl px-3.5 py-2.5 shadow-md ${
                      isUser
                        ? 'bg-cyan-600 text-slate-950 font-medium rounded-br-none'
                        : 'bg-[#121a2d] border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center gap-1.5 mb-1.5 text-cyan-400 font-bold text-[11px]">
                        <Bot className="w-3.5 h-3.5" />
                        <span>GridGuard AI</span>
                        <span className="text-slate-500 font-normal ml-auto">{msg.timestamp}</span>
                      </div>
                    )}
                    
                    <div className="prose prose-invert prose-xs max-w-none leading-relaxed text-slate-200">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>

                    {/* Executable Actions Buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-800 space-y-1.5">
                        <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                          Recommended Actions:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.actions.map((act, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleExecuteAction(act, idx)}
                              disabled={executingActionId !== null}
                              className="px-2.5 py-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-cyan-100 font-semibold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                            >
                              <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.structuredResponse && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-2 text-left">
                        {msg.structuredResponse.recommendation && (
                          <div className="p-2 rounded bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300">
                            💡 {msg.structuredResponse.recommendation}
                          </div>
                        )}
                        {msg.structuredResponse.metrics && (
                          <div className="space-y-1 text-[11px]">
                            {msg.structuredResponse.metrics.map((m, idx) => (
                              <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-slate-900/80 border border-slate-800">
                                <span className="text-slate-300 font-medium">{m.label}</span>
                                <span className={m.isAlert ? "text-rose-400 font-bold" : "text-emerald-400 font-semibold"}>
                                  {m.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#121a2d] border border-slate-800 w-fit text-cyan-400 text-xs">
                <Zap className="w-3.5 h-3.5 animate-spin" />
                <span>GridGuard AI evaluating grid telemetry...</span>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-[#0a0f1d] border-t border-slate-800">
            <div className="relative flex items-center">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask GridGuard AI about failure risk, equipment, or telemetry..."
                rows={1}
                className="w-full bg-[#121929] border border-slate-800 rounded-lg pl-3 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="absolute right-2.5 text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 p-1 cursor-pointer transition-colors"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
