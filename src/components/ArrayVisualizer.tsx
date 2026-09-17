import React, { useState } from 'react';
import { StepSnapshot } from '../core/types';
import { ArrowRightLeft, Search, CheckCircle2, XCircle, Sparkles, Sliders, Shuffle, CornerDownLeft, AlertTriangle } from 'lucide-react';

interface ArrayVisualizerProps {
  currentStep: StepSnapshot | null;
  totalSteps?: number;
  title?: string;
  subtitle?: string;
  isCompact?: boolean;
  onRandomize?: () => void;
  target?: number;
  onTargetChange?: (val: number) => void;
  arrayInputText?: string;
  onArrayInputChange?: (text: string) => void;
  /** Called with a parsed, validated array once the user applies their custom input. */
  onApplyArray?: (values: number[]) => void;
  onPresetSelect?: (preset: 'random' | 'sorted' | 'reverse' | 'nearly_sorted') => void;
  arraySize?: number;
  onSizeChange?: (size: number) => void;
  /** Min/max allowed array length for custom input. Defaults match the size slider (4-25). */
  minArrayLength?: number;
  maxArrayLength?: number;
}

/**
 * Parses free-text array input like "42, 17, 89" or "42 17 89" into numbers.
 * Returns { values } on success, or { error } describing what's wrong.
 */
function parseArrayInput(
  text: string,
  minLength: number,
  maxLength: number
): { values: number[] } | { error: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { error: 'Enter at least one number.' };
  }

  const rawTokens = trimmed.split(/[\s,]+/).filter(Boolean);
  const values: number[] = [];

  for (const token of rawTokens) {
    const n = Number(token);
    if (!Number.isFinite(n)) {
      return { error: `"${token}" isn't a valid number.` };
    }
    values.push(Math.round(n));
  }

  if (values.length < minLength) {
    return { error: `Enter at least ${minLength} numbers.` };
  }
  if (values.length > maxLength) {
    return { error: `Enter at most ${maxLength} numbers.` };
  }
  if (values.some((v) => v < 0 || v > 999)) {
    return { error: 'Numbers must be between 0 and 999.' };
  }

  return { values };
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  currentStep,
  totalSteps = 42,
  title = 'Algorithm Visualizer',
  subtitle = 'STATE MUTATION',
  isCompact = false,
  onRandomize,
  target,
  onTargetChange,
  arrayInputText = '',
  onArrayInputChange,
  onApplyArray,
  onPresetSelect,
  arraySize = 10,
  onSizeChange,
  minArrayLength = 4,
  maxArrayLength = 25,
}) => {
  const [inputError, setInputError] = useState<string | null>(null);

  const handleApply = () => {
    const result = parseArrayInput(arrayInputText, minArrayLength, maxArrayLength);
    if ('error' in result) {
      setInputError(result.error);
      return;
    }
    setInputError(null);
    onApplyArray?.(result.values);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  const handleInputChange = (text: string) => {
    if (inputError) setInputError(null);
    onArrayInputChange?.(text);
  };

  if (!currentStep) {
    return (
      <div className="dark-panel rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
        <p className="text-slate-500 text-sm font-mono">No execution trace loaded.</p>
      </div>
    );
  }

  const {
    step,
    array,
    indices,
    type,
    sortedIndices,
    pivotIndex,
    minIndex,
    description,
    target: stepTarget,
    foundIndex,
    searchRange,
  } = currentStep;

  const activeTarget = stepTarget !== undefined ? stepTarget : target;
  const maxValue = Math.max(...array, 10);

  const compareLeftIdx = indices[0] !== undefined ? indices[0] : -1;
  const compareRightIdx = indices[1] !== undefined ? indices[1] : -1;

  const getBarConfig = (index: number) => {
    if (foundIndex === index || (type === 'FOUND' && indices.includes(index))) {
      return {
        barClass: 'bg-emerald-500 border-emerald-400 text-slate-950 font-black scale-110 shadow-lg shadow-emerald-500/50 glow-emerald animate-pulse-bar',
        valueClass: 'text-emerald-300 font-black scale-125',
        labelClass: 'bg-emerald-500 text-slate-950 font-black',
        labelText: 'FOUND!',
        isDimmed: false,
      };
    }

    let isOutsideSearchRange = false;
    if (searchRange) {
      if (index < searchRange.low || index > searchRange.high) {
        isOutsideSearchRange = true;
      }
    }

    if (searchRange) {
      if (searchRange.mid === index) {
        return {
          barClass: 'bg-amber-500 border-amber-400 text-slate-950 font-black scale-105 shadow-lg shadow-amber-500/40 glow-amber animate-pulse-bar',
          valueClass: 'text-amber-400 font-black scale-110',
          labelClass: 'bg-amber-500 text-slate-950 font-black',
          labelText: `mid:${index}`,
          isDimmed: false,
        };
      }
      if (searchRange.low === index && searchRange.high === index) {
        return {
          barClass: 'bg-cyan-400 border-cyan-300 text-slate-950 font-bold',
          valueClass: 'text-cyan-300 font-bold',
          labelClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold',
          labelText: `L/H:${index}`,
          isDimmed: false,
        };
      }
      if (searchRange.low === index) {
        return {
          barClass: 'bg-sky-500/80 border-sky-400 text-white font-bold',
          valueClass: 'text-sky-300 font-bold',
          labelClass: 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold',
          labelText: `low:${index}`,
          isDimmed: false,
        };
      }
      if (searchRange.high === index) {
        return {
          barClass: 'bg-purple-500/80 border-purple-400 text-white font-bold',
          valueClass: 'text-purple-300 font-bold',
          labelClass: 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold',
          labelText: `high:${index}`,
          isDimmed: false,
        };
      }
    }

    if (type === 'SEARCH_EXAMINE' && indices.includes(index)) {
      return {
        barClass: 'bg-amber-500 border-amber-400 text-slate-950 font-black scale-105 shadow-lg shadow-amber-500/40 glow-amber animate-pulse-bar',
        valueClass: 'text-amber-400 font-black scale-110',
        labelClass: 'bg-amber-500 text-slate-950 font-bold',
        labelText: `check:${index}`,
        isDimmed: false,
      };
    }

    if (minIndex === index || (type === 'MIN_HIGHLIGHT' && indices.includes(index))) {
      return {
        barClass: 'bg-purple-500 border-purple-400 text-white font-black scale-105 shadow-lg shadow-purple-500/40',
        valueClass: 'text-purple-300 font-black scale-110',
        labelClass: 'bg-purple-500 text-white font-bold',
        labelText: `min:${index}`,
        isDimmed: false,
      };
    }

    if (pivotIndex === index) {
      return {
        barClass: 'bg-cyan-400 border-cyan-300 text-slate-950 font-black shadow-lg shadow-cyan-400/30 glow-cyan',
        valueClass: 'text-cyan-300 font-extrabold',
        labelClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
        labelText: `pivot:${index}`,
        isDimmed: false,
      };
    }

    if (sortedIndices.includes(index)) {
      return {
        barClass: 'bg-white border-slate-200 text-slate-950 font-extrabold shadow-lg shadow-white/20 glow-white',
        valueClass: 'text-white font-black',
        labelClass: 'bg-slate-800 text-slate-300',
        labelText: 'sorted',
        isDimmed: false,
      };
    }

    if (index === compareLeftIdx && (type === 'COMPARE' || type === 'SWAP')) {
      return {
        barClass: 'bg-amber-500 border-amber-400 text-slate-950 font-black scale-[1.04] shadow-lg shadow-amber-500/40 glow-amber animate-pulse-bar',
        valueClass: 'text-amber-400 font-black scale-110',
        labelClass: 'bg-amber-500 text-slate-950 font-bold',
        labelText: `j:${index}`,
        isDimmed: false,
      };
    }
    if (index === compareRightIdx && (type === 'COMPARE' || type === 'SWAP')) {
      return {
        barClass: 'bg-orange-500 border-orange-400 text-white font-black scale-[1.04] shadow-lg shadow-orange-500/40 glow-orange animate-pulse-bar',
        valueClass: 'text-orange-400 font-black scale-110',
        labelClass: 'bg-orange-500 text-white font-bold',
        labelText: `j+1:${index}`,
        isDimmed: false,
      };
    }

    return {
      barClass: isOutsideSearchRange
        ? 'bg-[#121927]/40 border-slate-900 text-slate-600 opacity-30 scale-95'
        : 'bg-[#232f45] border-[#31415f] text-slate-300 hover:bg-[#2b3a54]',
      valueClass: isOutsideSearchRange ? 'text-slate-600' : 'text-slate-400',
      labelClass: isOutsideSearchRange ? 'text-slate-700' : 'text-slate-500',
      labelText: `idx ${index}`,
      isDimmed: isOutsideSearchRange,
    };
  };

  const isSwap = type === 'SWAP' || (type === 'COMPARE' && compareLeftIdx >= 0 && compareRightIdx >= 0 && array[compareLeftIdx] > array[compareRightIdx]);

  return (
    <div className={`dark-panel rounded-2xl ${isCompact ? 'p-4' : 'p-5 md:p-6'} relative flex flex-col justify-between transition-all border border-slate-800/90`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <h2 className="text-base md:text-lg font-extrabold text-white font-heading tracking-tight">{title}</h2>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded uppercase tracking-wider">
            {subtitle}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>60.0 FPS</span>
          </div>

          <div className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-[11px]">
            STEP: <strong className="text-amber-400">{step + 1} / {totalSteps}</strong>
          </div>
        </div>
      </div>

      <div className="bg-[#0b101b] border border-slate-800/90 rounded-xl p-2.5 mb-1 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-1 items-center gap-2 min-w-[260px]">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold shrink-0">
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Array Data:</span>
          </div>
          <input
            type="text"
            value={arrayInputText}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Enter numbers e.g. 42, 17, 89, 53, 24"
            aria-invalid={inputError ? true : undefined}
            className={`flex-1 bg-slate-950 border rounded-lg px-3 py-1.5 text-slate-100 font-mono text-xs focus:outline-none focus:ring-1 transition-all placeholder:text-slate-600 ${
              inputError
                ? 'border-rose-500/70 focus:border-rose-400 focus:ring-rose-400/50'
                : 'border-slate-800 focus:border-amber-400/80 focus:ring-amber-400/50'
            }`}
          />
          <button
            onClick={handleApply}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 rounded-lg text-[11px] font-bold transition-all active:scale-95"
            title="Apply custom array (Enter)"
          >
            <CornerDownLeft className="w-3 h-3" />
            <span>Apply</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] font-semibold mr-0.5 hidden xl:inline">Presets:</span>
          <button
            onClick={() => onPresetSelect && onPresetSelect('random')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-[11px] font-semibold transition-all active:scale-95 flex items-center gap-1"
            title="Random Array"
          >
            <Shuffle className="w-3 h-3 text-amber-400" />
            <span>Random</span>
          </button>
          <button
            onClick={() => onPresetSelect && onPresetSelect('sorted')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 rounded-lg text-[11px] font-semibold transition-all active:scale-95"
            title="Sorted Array"
          >
            Sorted
          </button>
          <button
            onClick={() => onPresetSelect && onPresetSelect('reverse')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 rounded-lg text-[11px] font-semibold transition-all active:scale-95"
            title="Reverse Array"
          >
            Reverse
          </button>
          <button
            onClick={() => onPresetSelect && onPresetSelect('nearly_sorted')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 rounded-lg text-[11px] font-semibold transition-all active:scale-95 hidden sm:inline-block"
            title="Nearly Sorted Array"
          >
            Nearly Sorted
          </button>
        </div>

        <div className="flex items-center gap-3">
          {onSizeChange && (
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span>Size: <strong className="text-amber-400 font-mono">{arraySize}</strong></span>
              <input
                type="range"
                min={4}
                max={25}
                value={arraySize}
                onChange={(e) => onSizeChange(Number(e.target.value))}
                className="w-16 accent-amber-500 cursor-pointer"
              />
            </div>
          )}

          {activeTarget !== undefined && onTargetChange && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-lg text-[11px] font-bold">
              <Search className="w-3 h-3" />
              <span>Target:</span>
              <input
                type="number"
                value={activeTarget}
                onChange={(e) => onTargetChange(Number(e.target.value))}
                className="w-12 bg-slate-950 border border-slate-700 text-white font-bold rounded px-1 text-center focus:outline-none focus:border-amber-400"
              />
            </div>
          )}
        </div>
      </div>

      {inputError && (
        <div className="flex items-center gap-1.5 mb-3 px-1 text-[11px] font-mono text-rose-400">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          <span>{inputError}</span>
        </div>
      )}
      {!inputError && <div className="mb-3" />}

      <div className="relative w-full">
        {type === 'FOUND' && (
          <div className="absolute top-2 right-4 z-10">
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-black shadow-xl flex items-center gap-2 glow-emerald">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>TARGET {activeTarget} FOUND AT INDEX [{foundIndex !== undefined ? foundIndex : indices[0]}]</span>
            </div>
          </div>
        )}

        {type === 'NOT_FOUND' && (
          <div className="absolute top-2 right-4 z-10">
            <div className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-black shadow-xl flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>TARGET {activeTarget} NOT FOUND</span>
            </div>
          </div>
        )}

        {compareLeftIdx >= 0 && compareRightIdx >= 0 && type !== 'FOUND' && (
          <div className="absolute top-2 right-4 z-10">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold shadow-xl flex items-center gap-2 ${
              isSwap
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-300 glow-orange'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-300 glow-amber'
            }`}>
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>
                {isSwap ? 'SWAP REQUIRED:' : 'COMPARE:'} {array[compareLeftIdx]} vs {array[compareRightIdx]}
              </span>
            </div>
          </div>
        )}

        <div className={`flex items-end justify-center gap-2 md:gap-3 w-full ${isCompact ? 'h-[200px]' : 'h-[280px] md:h-[320px]'} pt-10 pb-4 px-3 bg-[#090d16] rounded-xl border border-slate-800/90 shadow-inner overflow-x-auto`}>
          {array.map((value, idx) => {
            const heightPercent = Math.max((value / maxValue) * 100, 12);
            const { barClass, valueClass, labelClass, labelText } = getBarConfig(idx);

            return (
              <div
                key={idx}
                className="flex flex-col items-center flex-1 max-w-[56px] min-w-[24px] h-full justify-end group transition-all duration-200"
              >
                <span className={`text-xs font-mono mb-2 transition-all ${valueClass}`}>
                  {value}
                </span>

                <div
                  className={`w-full rounded-t-md border-t border-x transition-all duration-200 shadow-md ${barClass}`}
                  style={{ height: `${heightPercent}%` }}
                />

                <span className={`mt-2.5 px-1.5 py-0.5 text-[10px] font-mono rounded font-semibold transition-all ${labelClass}`}>
                  {labelText}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/80 font-mono text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="text-slate-300">Active / Compare</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-purple-500 shadow-sm shadow-purple-500/50" />
            <span className="text-slate-300">Minimum Index</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-slate-300 font-bold">Target Found</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-white shadow-sm shadow-white/50" />
            <span className="text-slate-300 font-semibold">Sorted Locked</span>
          </div>
        </div>

        <div className="text-slate-500 text-[10px] hidden sm:block truncate max-w-[320px]">
          {description}
        </div>
      </div>
    </div>
  );
};