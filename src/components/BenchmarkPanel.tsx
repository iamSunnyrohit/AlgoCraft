import React, { useState, useEffect } from 'react';
import { ALGORITHM_REGISTRY } from '../core/algorithms';
import { BenchmarkMetrics } from '../core/types';
import { BarChart3, Zap, Clock, Activity, Play } from 'lucide-react';

interface BenchmarkPanelProps {
  algorithmId: string;
}

export const BenchmarkPanel: React.FC<BenchmarkPanelProps> = ({ algorithmId }) => {
  const [metrics, setMetrics] = useState<BenchmarkMetrics[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const algoEntry = ALGORITHM_REGISTRY[algorithmId] || ALGORITHM_REGISTRY['bubble_sort'];

  const runBenchmark = () => {
    setIsRunning(true);
    const inputSizes = [10, 50, 100, 250, 500];
    const results: BenchmarkMetrics[] = [];

    setTimeout(() => {
      for (const n of inputSizes) {
        const testArray = Array.from({ length: n }, () => Math.floor(Math.random() * 1000) + 1);

        const startTime = performance.now();
        const { stats } = algoEntry.run(testArray);
        const endTime = performance.now();

        results.push({
          n,
          comparisons: stats.comparisons,
          swaps: stats.swaps,
          overwrites: stats.overwrites,
          executionTimeMs: Number((endTime - startTime).toFixed(2)),
        });
      }

      setMetrics(results);
      setIsRunning(false);
    }, 100);
  };

  useEffect(() => {
    runBenchmark();
  }, [algorithmId]);

  const maxComparisons = metrics.length > 0 ? Math.max(...metrics.map((m) => m.comparisons), 100) : 100;

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 max-w-7xl mx-auto my-4 border border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white font-heading">
              Empirical Runtime & Operations Benchmarking
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Real performance analysis for <strong className="text-white">{algoEntry.info.name}</strong> across array sizes $N = [10..500]$
          </p>
        </div>

        <button
          onClick={runBenchmark}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-semibold text-xs rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {isRunning ? (
            <Activity className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          <span>{isRunning ? 'Running Benchmarks...' : 'Re-Run Synthetic Benchmark'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Best Case Time</span>
          <span className="text-xl font-mono font-extrabold text-emerald-400 mt-1">
            {algoEntry.info.timeComplexity.best}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Average Time</span>
          <span className="text-xl font-mono font-extrabold text-amber-400 mt-1">
            {algoEntry.info.timeComplexity.average}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Worst Case Time</span>
          <span className="text-xl font-mono font-extrabold text-rose-400 mt-1">
            {algoEntry.info.timeComplexity.worst}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Auxiliary Space</span>
          <span className="text-xl font-mono font-extrabold text-cyan-400 mt-1">
            {algoEntry.info.spaceComplexity}
          </span>
        </div>
      </div>

      <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800/90 shadow-inner">
        <h3 className="text-sm font-bold text-white font-heading mb-6 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Empirical Operations Count ($N$ vs Comparisons)</span>
        </h3>

        <div className="flex items-end justify-between gap-4 h-[240px] pt-4 pb-2 px-4 border-b border-slate-800">
          {metrics.map((m) => {
            const heightPercent = Math.max((m.comparisons / maxComparisons) * 100, 8);
            return (
              <div key={m.n} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-mono font-bold text-amber-400 mb-1">
                  {m.comparisons.toLocaleString()} ops
                </span>
                <div
                  className="w-full max-w-[48px] bg-gradient-to-t from-indigo-600 via-purple-600 to-amber-500 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="mt-3 text-xs font-mono font-semibold text-slate-300">
                  N={m.n}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-4 font-semibold">Array Size (N)</th>
                <th className="py-2.5 px-4 font-semibold text-amber-400">Comparisons</th>
                <th className="py-2.5 px-4 font-semibold text-rose-400">Swaps</th>
                <th className="py-2.5 px-4 font-semibold text-purple-400">Overwrites</th>
                <th className="py-2.5 px-4 font-semibold text-emerald-400">Duration (ms)</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m.n} className="border-b border-slate-900/60 hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 text-white font-bold">N = {m.n}</td>
                  <td className="py-3 px-4 text-amber-300">{m.comparisons.toLocaleString()}</td>
                  <td className="py-3 px-4 text-rose-300">{m.swaps.toLocaleString()}</td>
                  <td className="py-3 px-4 text-purple-300">{m.overwrites.toLocaleString()}</td>
                  <td className="py-3 px-4 text-emerald-300">{m.executionTimeMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
