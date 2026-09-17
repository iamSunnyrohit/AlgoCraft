import React from 'react';
import { StepSnapshot } from '../core/types';
import { Terminal, Cpu, Layers, Activity } from 'lucide-react';

interface ExecutionTracePanelProps {
  currentStep: StepSnapshot | null;
  trace: StepSnapshot[];
}

export const ExecutionTracePanel: React.FC<ExecutionTracePanelProps> = ({ currentStep, trace }) => {
  if (!currentStep) return null;

  const { step, lineNumber, type, indices, array, description } = currentStep;
  const isSwap = type === 'SWAP' || (indices.length >= 2 && array[indices[0]] > array[indices[1]]);

  // Recent step window for stream viewer
  const startIdx = Math.max(0, step - 2);
  const streamSteps = trace.slice(startIdx, step + 2);

  return (
    <div className="dark-panel rounded-2xl p-4 mt-4 border border-slate-800/90 font-mono text-xs">
      {/* Header Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-lg text-[11px] font-bold">
            <Activity className="w-3.5 h-3.5" />
            <span>Execution Trace (SDD Stream)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-1" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] hover:text-slate-200 cursor-pointer">
            <Layers className="w-3.5 h-3.5" />
            <span>Memory & Stack Frame</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] hover:text-slate-200 cursor-pointer">
            <Cpu className="w-3.5 h-3.5" />
            <span>MicroVM Telemetry</span>
          </div>
        </div>

        <div className="text-[10px] font-bold text-sky-400 tracking-wider">
          • DECOUPLED TRACE PLAYER
        </div>
      </div>

      {/* Grid: Trace Log Stream (Left) vs Scope Variables & JSON (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Step Log Stream */}
        <div className="lg:col-span-7 flex flex-col gap-2">
          {streamSteps.map((s) => {
            const isCurrent = s.step === step;
            return (
              <div
                key={s.step}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 shadow-md glow-amber'
                    : 'bg-[#070a10] border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500">#{s.step}</span>
                  <span className="text-[10px] font-bold bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                    L{s.lineNumber || 14}
                  </span>
                  <span className="font-bold text-amber-400 uppercase text-[11px]">{s.type}</span>
                  <span className="text-[11px] text-slate-200 truncate max-w-[240px]">{s.description}</span>
                </div>

                {isCurrent && (
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded ${
                    isSwap ? 'bg-orange-500 text-slate-950' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {isSwap ? 'SWAP REQUIRED' : 'VALID'}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Scope Variables & JSON Frame */}
        <div className="lg:col-span-5 bg-[#070a10] rounded-xl p-3 border border-slate-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 pb-1 border-b border-slate-800">
              <span>SCOPE: <strong className="text-white">BUBBLE_SORT()</strong></span>
              <span className="text-amber-400 font-bold">FRAME 0X07F4</span>
            </div>

            {/* Variable Grid */}
            <div className="grid grid-cols-4 gap-2 mb-3 text-center">
              <div className="bg-[#0f172a] p-1.5 rounded border border-slate-800">
                <span className="block text-[10px] text-slate-500">i</span>
                <span className="text-xs font-bold text-amber-400">{indices[0] !== undefined ? Math.floor(step / 5) : 0}</span>
              </div>
              <div className="bg-[#0f172a] p-1.5 rounded border border-slate-800">
                <span className="block text-[10px] text-slate-500">j</span>
                <span className="text-xs font-bold text-orange-400">{indices[0] !== undefined ? indices[0] : 0}</span>
              </div>
              <div className="bg-[#0f172a] p-1.5 rounded border border-slate-800">
                <span className="block text-[10px] text-slate-500">swapped</span>
                <span className="text-xs font-bold text-emerald-400">{isSwap ? 'True' : 'False'}</span>
              </div>
              <div className="bg-[#0f172a] p-1.5 rounded border border-slate-800">
                <span className="block text-[10px] text-slate-500">n</span>
                <span className="text-xs font-bold text-slate-200">{array.length}</span>
              </div>
            </div>

            {/* JSON Frame Spec */}
            <pre className="text-[10px] text-sky-300 bg-[#090d16] p-2 rounded border border-slate-800/80 overflow-x-auto">
{`{
  "step": ${step},
  "line_number": ${lineNumber || 14},
  "action": { "type": "${type}", "indices": [${indices.join(', ')}] },
  "palette": "Obsidian & Amber"
}`}
            </pre>
          </div>

          <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
            <span>Latency: <strong className="text-slate-300">3.8ms</strong></span>
            <span>Heap: <strong className="text-slate-300">14.2 / 128 MB</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
