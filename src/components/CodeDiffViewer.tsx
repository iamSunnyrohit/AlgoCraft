import React, { useState } from 'react';
import { ArrayVisualizer } from './ArrayVisualizer';
import { PlaybackControls } from './PlaybackControls';
import { ALGORITHM_REGISTRY } from '../core/algorithms';
import { runUserCodeWithTracer } from '../core/tracerInstrumenter';
import { GitCompare, AlertCircle, CheckCircle, RefreshCw, Sparkles } from 'lucide-react';

interface CodeDiffViewerProps {
  algorithmId: string;
  initialArray: number[];
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({ algorithmId, initialArray }) => {
  const canonicalEntry = ALGORITHM_REGISTRY[algorithmId] || ALGORITHM_REGISTRY['bubble_sort'];

  // User custom code state for side-by-side comparison
  const [customCode, setCustomCode] = useState<string>(
    `// Custom implementation (e.g. unoptimized Bubble Sort missing swap flag)
function customSort(arr, tracer) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1; j++) {
      if (tracer.compare(j, j + 1)) {
        tracer.swap(j, j + 1);
      }
    }
  }
}`
  );

  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Generate Trace A (User Implementation)
  const traceA = runUserCodeWithTracer(customCode, initialArray).trace;

  // Generate Trace B (Canonical Implementation)
  const traceB = canonicalEntry.run(initialArray).trace;

  const maxSteps = Math.max(traceA.length, traceB.length);

  // Divergence analysis: find step index where action types or array states differ
  let divergenceStep: number | null = null;
  const minSteps = Math.min(traceA.length, traceB.length);
  for (let s = 0; s < minSteps; s++) {
    const snapA = traceA[s];
    const snapB = traceB[s];
    if (snapA.type !== snapB.type || snapA.array.join(',') !== snapB.array.join(',')) {
      divergenceStep = s;
      break;
    }
  }

  const currentSnapA = traceA[Math.min(stepIdx, traceA.length - 1)] || null;
  const currentSnapB = traceB[Math.min(stepIdx, traceB.length - 1)] || null;

  return (
    <div className="max-w-7xl mx-auto py-4 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GitCompare className="w-6 h-6 text-indigo-400" />
              <h1 className="text-2xl font-extrabold text-white font-heading">
                Code-to-Visualization Diffing Engine
              </h1>
            </div>
            <p className="text-xs text-slate-300">
              Run custom code side-by-side with canonical <strong className="text-white">{canonicalEntry.info.name}</strong> to inspect execution step divergence.
            </p>
          </div>

          {divergenceStep !== null ? (
            <div className="px-4 py-2 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-mono font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Divergence detected at step <strong>{divergenceStep + 1}</strong></span>
            </div>
          ) : (
            <div className="px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Traces align perfectly!</span>
            </div>
          )}
        </div>
      </div>

      {/* Dual Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visualizer A: Custom User Code */}
        <ArrayVisualizer
          currentStep={currentSnapA}
          title="Trace A: Custom Code Implementation"
          subtitle={`Total steps: ${traceA.length}`}
          isCompact
        />

        {/* Visualizer B: Canonical Reference Code */}
        <ArrayVisualizer
          currentStep={currentSnapB}
          title={`Trace B: Canonical ${canonicalEntry.info.name}`}
          subtitle={`Total steps: ${traceB.length}`}
          isCompact
        />
      </div>

      {/* Playback & Seek Controls */}
      <PlaybackControls
        isPlaying={isPlaying}
        currentStepIndex={stepIdx}
        totalSteps={maxSteps}
        speed={speed}
        onPlayPauseToggle={() => setIsPlaying(!isPlaying)}
        onStepForward={() => setStepIdx((prev) => Math.min(prev + 1, maxSteps - 1))}
        onStepBackward={() => setStepIdx((prev) => Math.max(prev - 1, 0))}
        onJumpToStart={() => setStepIdx(0)}
        onJumpToEnd={() => setStepIdx(maxSteps - 1)}
        onSeek={(idx) => setStepIdx(idx)}
        onSpeedChange={(s) => setSpeed(s)}
      />
    </div>
  );
};
