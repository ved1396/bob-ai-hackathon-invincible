import React, { useState } from 'react';
import { useBobDrawer } from '../../context/BobDrawerContext';

export const BobDrawer = () => {
  const {
    isOpen,
    pageContext,
    messages,
    isThinking,
    closeDrawer,
    setPageContext,
    sendMessage,
    openWithQuery,
    resetConversation
  } = useBobDrawer();

  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isThinking) return;
    sendMessage(inputVal.trim());
    setInputVal('');
  };

  const handleQueryClick = (query) => {
    sendMessage(query);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-40 transition-opacity duration-300 pointer-events-auto"
      />

      {/* Drawer Container */}
      <aside className="fixed top-0 right-0 h-full w-[450px] max-w-full bg-[#101416] border-l border-[#20292f] shadow-2xl z-50 flex flex-col justify-between transition-transform duration-300">
        {/* Drawer Header */}
        <div className="h-16 flex-shrink-0 px-5 border-b border-[#1d262c] bg-[#12171a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#18231c] border border-[#2b3e2e] flex items-center justify-center text-[#96be5d] shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">Bob</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#17241b] text-[#96be5d] border border-[#263a2a] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                  Operational
                </span>
              </div>
              <div className="text-[11px] text-[#71828f]">Grid Operations AI Assistant</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Active Context Tag */}
            <div className="px-2 py-1 rounded bg-[#192126] border border-[#26333c] text-[10px] font-mono text-[#8ea1b0] flex items-center gap-1">
              <span className="text-[#5b6f7e]">Context:</span>
              <span className="text-white font-medium">{pageContext}</span>
            </div>

            {/* Reset Thread */}
            <button
              onClick={resetConversation}
              title="Reset Conversation"
              className="p-1.5 rounded hover:bg-[#1c2429] text-[#7d909e] hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 12a9 9 0 0 1 15.5-6.4L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.4L3 16M3 21v-5h5" />
              </svg>
            </button>

            {/* Close Drawer */}
            <button
              onClick={closeDrawer}
              title="Close Drawer"
              className="p-1.5 rounded hover:bg-[#221818] text-[#7d909e] hover:text-red-400 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Context Simulator Strip */}
        <div className="px-5 py-2 bg-[#0d1113] border-b border-[#1a2227] flex items-center justify-between text-[11px] shrink-0">
          <span className="text-[#657785] text-[10px] uppercase font-mono tracking-wider">Simulate Context:</span>
          <div className="flex items-center gap-1">
            {['Overview', 'T-104', 'Weather', 'Sensors'].map(ctx => (
              <button
                key={ctx}
                onClick={() => setPageContext(ctx)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                  pageContext === ctx
                    ? 'bg-[#1d262c] text-white border border-[#2c3d2e]'
                    : 'bg-[#161e23] text-[#8fa1b0] hover:text-white hover:bg-[#1d262c]'
                }`}
              >
                {ctx}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Body Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-[#0f1315]">
          {/* Welcome Card & Suggested Inquiries if message history empty */}
          {messages.length === 0 && (
            <div className="space-y-4">
              <div className="bg-[#141b1e] border border-[#1e272d] rounded-lg p-4">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-6 h-6 rounded bg-[#1b281f] border border-[#2b412f] flex items-center justify-center text-[#96be5d] text-xs">
                    ✦
                  </div>
                  <h3 className="text-sm font-semibold text-white">How can Bob assist grid operations?</h3>
                </div>
                <p className="text-xs text-[#8c9ea9] leading-relaxed">
                  Synthesizing <strong className="text-white">ML Failure Risk</strong>, real-time <strong className="text-white">Weather Exposure</strong>, <strong className="text-white">Sensor Reliability</strong>, and <strong className="text-white">Incident Logs</strong> to guide dispatch and maintenance decisions.
                </p>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#637583] mb-2 px-1">
                  Suggested Operational Inquiries
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { q: "Which assets are at highest risk?", sub: "Ranks priority order across high failure-probability equipment" },
                    { q: "Why is T-104 critical?", sub: "87% failure probability telemetry and weather breakdown" },
                    { q: "What should we maintain today?", sub: "Actionable maintenance queue & crew dispatch plan" },
                    { q: "Where should crews be positioned?", sub: "Optimized pre-positioning near Zone 4 & Zone 2" },
                    { q: "Show critical assets affected by today's weather", sub: "Storm front corridor stress & wind loading surcharges" },
                    { q: "Show unresolved incidents.", sub: "INC-2041 (Overheating) and active storm response" }
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleQueryClick(item.q)}
                      className="w-full text-left p-2.5 rounded-md bg-[#13191c] hover:bg-[#182126] border border-[#1d272d] hover:border-[#2f3d47] transition-all group cursor-pointer"
                    >
                      <div className="text-xs font-medium text-white group-hover:text-[#96be5d] flex items-center justify-between">
                        <span>“{item.q}”</span>
                        <span className="text-[#4e5f6d] group-hover:text-[#96be5d]">→</span>
                      </div>
                      <div className="text-[11px] text-[#71828f] mt-0.5">{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages Feed */}
          {messages.map(msg => (
            <div key={msg.id} className={`space-y-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block max-w-[90%] rounded-lg p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#96be5d] text-[#0c0e12] font-medium'
                  : 'bg-[#141b1e] border border-[#1e272d] text-[#d1d5db]'
              }`}>
                {msg.sender === 'bob' && (
                  <div className="flex items-center gap-2 mb-1.5 text-[#96be5d] font-bold text-[11px] font-mono">
                    <span>✦ Bob Assistant</span>
                    <span className="text-[10px] text-zinc-500 font-normal">{msg.timestamp}</span>
                  </div>
                )}
                <p>{msg.text}</p>

                {/* Structured Metrics / Action Cards */}
                {msg.structuredResponse && (
                  <div className="mt-3 pt-2.5 border-t border-[#1d272d] text-left space-y-2.5">
                    {msg.structuredResponse.recommendation && (
                      <div className="p-2 rounded bg-[#0e1315] border border-[#1f2b33] text-[11px] text-amber-300 font-mono">
                        💡 {msg.structuredResponse.recommendation}
                      </div>
                    )}

                    {msg.structuredResponse.metrics && (
                      <div className="space-y-1.5 font-mono text-[11px]">
                        {msg.structuredResponse.metrics.map((m, idx) => (
                          <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-[#0d1113] border border-[#1a2227]">
                            <span className="text-zinc-300 font-medium">{m.label}</span>
                            <span className={m.isAlert ? "text-rose-400 font-bold" : "text-[#96be5d] font-semibold"}>
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.structuredResponse.actionButtons && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.structuredResponse.actionButtons.map((btn, idx) => (
                          <button
                            key={idx}
                            onClick={() => openWithQuery(btn.query)}
                            className="px-2.5 py-1 rounded bg-[#1e2d23] hover:bg-[#273d2f] text-[#96be5d] border border-[#2b3d2c] text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            {btn.label} →
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Thinking Indicator */}
          {isThinking && (
            <div className="flex items-center gap-2.5 px-3 py-2 bg-[#141b1f] border border-[#202b32] rounded-md w-fit">
              <svg className="animate-spin w-3.5 h-3.5 text-[#96be5d]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs text-[#9bb0be] font-mono">Bob is evaluating grid telemetry...</span>
            </div>
          )}
        </div>

        {/* Drawer Footer Input Form */}
        <div className="p-4 bg-[#12171a] border-t border-[#1d262c] flex-shrink-0">
          <form onSubmit={handleFormSubmit} className="relative flex items-center">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Bob about grid risk, equipment, or crew dispatch..."
              className="w-full bg-[#151c20] border border-[#232f38] rounded-lg pl-3 pr-10 py-2 text-xs text-white placeholder-[#586875] focus:outline-none focus:border-[#96be5d] focus:ring-1 focus:ring-[#96be5d] transition-all"
            />
            <button
              type="submit"
              disabled={isThinking || !inputVal.trim()}
              className="absolute right-2 text-[#96be5d] hover:text-white disabled:text-zinc-600 p-1 cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
};
