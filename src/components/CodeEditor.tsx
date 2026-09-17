import React, { useState } from 'react';
import { Play, Code2, RefreshCw, AlertTriangle, FileCode2, Plus } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChangeCode: (newCode: string) => void;
  activeLineNumber?: number;
  onRunCustomCode: (codeToRun: string) => void;
  onResetCode: () => void;
  error?: string;
  stats?: { comparisons: number; swaps: number; overwrites: number; totalSteps: number };
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChangeCode,
  activeLineNumber,
  onRunCustomCode,
  onResetCode,
  error,
  stats,
}) => {
  const [activeTab, setActiveTab] = useState('bubble_sort.py');
  const lines = code.split('\n');

  return (
    <div className="dark-panel rounded-2xl p-4 border border-slate-800/90 flex flex-col h-full justify-between font-mono">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#121824] border border-slate-800 text-amber-400 rounded-t-lg text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>bubble_sort.py</span>
            </div>

            <div className="flex items-center gap-1 px-3 py-1 text-slate-500 text-xs hover:text-slate-300 cursor-pointer">
              <FileCode2 className="w-3.5 h-3.5" />
              <span>quicksort.cpp</span>
            </div>

            <div className="flex items-center gap-1 px-3 py-1 text-slate-500 text-xs hover:text-slate-300 cursor-pointer">
              <FileCode2 className="w-3.5 h-3.5" />
              <span>test_runner.js</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
              AST Hooks Injected
            </span>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <button
            onClick={() => onRunCustomCode(code)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg shadow-md shadow-amber-500/20 transition-all active:scale-95 glow-amber"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Trace Run</span>
          </button>

          <button
            onClick={onResetCode}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-[#121824] border border-slate-800 rounded-lg transition-all"
            title="Reset code"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-3 p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-[11px]">
            <strong className="block mb-0.5">AST Execution Warning:</strong>
            {error}
          </div>
        </div>
      )}

      {/* Editor Code Window */}
      <div className="relative font-mono text-xs bg-[#070a10] rounded-xl border border-slate-800/90 overflow-hidden flex-1 min-h-[280px]">
        <div className="flex h-full overflow-auto">
          {/* Line Numbers */}
          <div className="py-3 px-2.5 bg-[#090d16] text-slate-600 text-right select-none border-r border-slate-800/70 min-w-[36px] text-[11px]">
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {String(i + 1).padStart(2, '0')}
              </div>
            ))}
          </div>

          {/* Code View with Active Line Tracking */}
          <div className="py-3 px-3 flex-1 overflow-x-auto">
            {lines.map((line, i) => {
              const lineNum = i + 1;
              const isActive = activeLineNumber === lineNum;

              return (
                <div
                  key={i}
                  className={`leading-6 px-2 rounded transition-colors flex items-center ${
                    isActive
                      ? 'bg-amber-500/15 border-l-4 border-amber-400 text-amber-200 font-bold glow-amber'
                      : 'text-slate-300 hover:bg-slate-900/40'
                  }`}
                >
                  <pre className="m-0 font-mono text-xs">{line || ' '}</pre>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <div className="flex items-center gap-3">
          <span>Lines: <strong className="text-slate-300">{lines.length}</strong></span>
          <span>Tokens: <strong className="text-slate-300">184</strong></span>
          <span>AST Nodes: <strong className="text-slate-300">48</strong></span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>MicroVM: STABLE</span>
        </div>
      </div>
    </div>
  );
};
