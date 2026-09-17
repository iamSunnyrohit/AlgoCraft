import React from 'react';
import { Sparkles, Code2, BookOpen, BarChart3, GitCompare, Shuffle, ShieldCheck, Cpu, Terminal, FileCode2, User } from 'lucide-react';
import { ALGORITHM_REGISTRY } from '../core/algorithms';
import horizontalLogo from '../assets/horizontal.svg';

interface HeaderProps {
  activeTab: 'sandbox' | 'lessons' | 'benchmark' | 'diff';
  setActiveTab: (tab: 'sandbox' | 'lessons' | 'benchmark' | 'diff') => void;
  selectedAlgorithmId: string;
  setSelectedAlgorithmId: (id: string) => void;
  arraySize: number;
  setArraySize: (size: number) => void;
  onRandomizeArray: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedAlgorithmId,
  setSelectedAlgorithmId,
  arraySize,
  setArraySize,
  onRandomizeArray,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#080c14] border-b border-slate-800/80 px-4 lg:px-6 py-2.5">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
        {/* Left Section: Brand & File Selector */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <img src={horizontalLogo} alt="AlgoCraft" className="h-10 w-auto select-none" />
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Preset Algorithm Dropdown Pill */}
          <div className="flex items-center gap-2 bg-[#0d131f] border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedAlgorithmId}
              onChange={(e) => setSelectedAlgorithmId(e.target.value)}
              className="bg-transparent text-slate-200 font-mono font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {Object.values(ALGORITHM_REGISTRY).map(({ info }) => (
                <option key={info.id} value={info.id} className="bg-slate-900 text-slate-200">
                  {info.id}.py
                </option>
              ))}
            </select>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 rounded">
              Python 3.11 WASM
            </span>
            <span className="text-[10px] font-mono text-slate-400 hidden lg:inline">Pyodide</span>
          </div>
        </div>

        {/* Center Navigation Tabs (matching reference exact colors) */}
        <nav className="flex items-center gap-1.5 bg-[#0d131f] p-1 rounded-xl border border-slate-800/90 shadow-inner">
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'sandbox'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Visualizer IDE
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'diff'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Diff Engine
          </button>

          <button
            onClick={() => setActiveTab('benchmark')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'benchmark'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Benchmark & Big-O
          </button>

          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'lessons'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Learning Hub
          </button>
        </nav>

        {/* Right Section: Telemetry & User Badge */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-xs">
          {/* Telemetry pill */}
          <div className="flex items-center gap-2 px-3 py-1 bg-[#0d131f] border border-slate-800 rounded-xl text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px]">Sandboxed: <strong className="text-white">128MB RAM</strong> | 2.0s limit</span>
          </div>

          <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-[11px] font-bold">
            Trace: 4.2ms
          </div>

          {/* User profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold text-xs">
              SR
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-white leading-none">Sunny R.</span>
              <span className="text-[10px] text-amber-400 font-semibold">Lvl 4 Algorist</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
