import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ArrayVisualizer } from './components/ArrayVisualizer';
import { PlaybackControls } from './components/PlaybackControls';
import { ExecutionTracePanel } from './components/ExecutionTracePanel';
import { CodeEditor } from './components/CodeEditor';
import { LessonViewer } from './components/LessonViewer';
import { BenchmarkPanel } from './components/BenchmarkPanel';
import { CodeDiffViewer } from './components/CodeDiffViewer';
import { ALGORITHM_REGISTRY } from './core/algorithms';
import { runUserCodeWithTracer } from './core/tracerInstrumenter';
import { StepSnapshot } from './core/types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'lessons' | 'benchmark' | 'diff'>('sandbox');
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState('bubble_sort');
  const [arraySize, setArraySize] = useState(10);
  const [initialArray, setInitialArray] = useState<number[]>([42, 17, 89, 53, 24, 68, 91, 12, 35, 76]);
  const [arrayInputText, setArrayInputText] = useState<string>('42, 17, 89, 53, 24, 68, 91, 12, 35, 76');

  const [target, setTarget] = useState<number>(53);

  const algoEntry = ALGORITHM_REGISTRY[selectedAlgorithmId] || ALGORITHM_REGISTRY['bubble_sort'];
  const [code, setCode] = useState(algoEntry.info.codeJS);
  const [customError, setCustomError] = useState<string | undefined>(undefined);

  const [trace, setTrace] = useState<StepSnapshot[]>([]);
  const [stats, setStats] = useState<{ comparisons: number; swaps: number; overwrites: number; totalSteps: number } | undefined>(undefined);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<number | null>(null);

  const handleArrayInputChange = (text: string) => {
    setArrayInputText(text);
    const parsed = text
      .split(/[\s,]+/)
      .map((val) => parseInt(val.trim(), 10))
      .filter((val) => !isNaN(val));

    if (parsed.length >= 2) {
      setInitialArray(parsed);
      setArraySize(parsed.length);
      setCurrentStepIdx(0);
      setIsPlaying(false);
    }
  };

  const handlePresetSelect = (preset: 'random' | 'sorted' | 'reverse' | 'nearly_sorted') => {
    let newArr: number[] = [];
    const size = arraySize || 10;

    if (preset === 'random') {
      newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 12);
    } else if (preset === 'sorted') {
      newArr = Array.from({ length: size }, (_, i) => Math.floor(((i + 1) * 90) / size));
    } else if (preset === 'reverse') {
      newArr = Array.from({ length: size }, (_, i) => Math.floor(((size - i) * 90) / size));
    } else if (preset === 'nearly_sorted') {
      newArr = Array.from({ length: size }, (_, i) => Math.floor(((i + 1) * 90) / size));
      if (newArr.length > 3) {
        const temp = newArr[2];
        newArr[2] = newArr[3];
        newArr[3] = temp;
      }
    }

    setInitialArray(newArr);
    setArrayInputText(newArr.join(', '));
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleSizeChange = (newSize: number) => {
    setArraySize(newSize);
    const newArr = Array.from({ length: newSize }, () => Math.floor(Math.random() * 85) + 12);
    setInitialArray(newArr);
    setArrayInputText(newArr.join(', '));
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleRandomizeArray = () => {
    handlePresetSelect('random');
  };

  useEffect(() => {
    setCode(algoEntry.info.codeJS);
    setCustomError(undefined);

    const isSearch = algoEntry.info.category === 'Searching';
    const activeTarget = algoEntry.info.defaultTarget || target;

    const result = algoEntry.run(initialArray, isSearch ? activeTarget : undefined);
    setTrace(result.trace);
    setStats(result.stats);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [selectedAlgorithmId, initialArray, target]);

  const handleRunCustomCode = (codeToRun: string) => {
    const result = runUserCodeWithTracer(codeToRun, initialArray);
    setTrace(result.trace);
    setStats(result.stats);
    setCustomError(result.error);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(50, Math.floor(400 / speed));
      timerRef.current = window.setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= trace.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, trace.length]);

  const currentStep = trace[currentStepIdx] || null;
  const isSearchAlgo = algoEntry.info.category === 'Searching';

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedAlgorithmId={selectedAlgorithmId}
        setSelectedAlgorithmId={setSelectedAlgorithmId}
        arraySize={arraySize}
        setArraySize={setArraySize}
        onRandomizeArray={handleRandomizeArray}
      />

      <main className="flex-1 max-w-[1800px] w-full mx-auto px-4 md:px-6 py-4">
        {activeTab === 'sandbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-7 flex flex-col">
              <ArrayVisualizer
                currentStep={currentStep}
                totalSteps={trace.length}
                title={algoEntry.info.name}
                subtitle={isSearchAlgo ? 'SEARCH TRAVERSAL' : 'ARRAY MUTATION'}
                onRandomize={handleRandomizeArray}
                target={isSearchAlgo ? target : undefined}
                onTargetChange={isSearchAlgo ? setTarget : undefined}
              />

              <PlaybackControls
                isPlaying={isPlaying}
                currentStepIndex={currentStepIdx}
                totalSteps={trace.length}
                speed={speed}
                onPlayPauseToggle={() => setIsPlaying(!isPlaying)}
                onStepForward={() => setCurrentStepIdx((prev) => Math.min(prev + 1, trace.length - 1))}
                onStepBackward={() => setCurrentStepIdx((prev) => Math.max(prev - 1, 0))}
                onJumpToStart={() => setCurrentStepIdx(0)}
                onJumpToEnd={() => setCurrentStepIdx(trace.length - 1)}
                onSeek={(idx: number) => setCurrentStepIdx(idx)}
                onSpeedChange={(s: number) => setSpeed(s)}
              />

              <ExecutionTracePanel currentStep={currentStep} trace={trace} />
            </div>

            <div className="lg:col-span-5 h-full">
              <CodeEditor
                code={code}
                onChangeCode={setCode}
                activeLineNumber={currentStep?.lineNumber}
                onRunCustomCode={handleRunCustomCode}
                onResetCode={() => {
                  setCode(algoEntry.info.codeJS);
                  setCustomError(undefined);
                  const result = algoEntry.run(initialArray, isSearchAlgo ? target : undefined);
                  setTrace(result.trace);
                  setStats(result.stats);
                  setCurrentStepIdx(0);
                }}
                error={customError}
                stats={stats}
              />
            </div>
          </div>
        )}

        {activeTab === 'lessons' && <LessonViewer />}

        {activeTab === 'benchmark' && <BenchmarkPanel algorithmId={selectedAlgorithmId} />}

        {activeTab === 'diff' && (
          <CodeDiffViewer algorithmId={selectedAlgorithmId} initialArray={initialArray} />
        )}
      </main>

      {/* Footer Status Bar */}
      <footer className="border-t border-slate-900 bg-[#070a10] px-6 py-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 font-bold">● AST Runtime Online</span>
          <span>Engine: WASM v1.14</span>
          <span>Deterministic Step Lock: Enabled</span>
        </div>
        <div>
          <span>FPS: <strong className="text-emerald-400">60.0</strong></span> | <span>Allocated Heap: <strong className="text-slate-300">14.8MB</strong></span> | <span>© 2025 AlgoCraft Studio</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
