import React from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
} from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentStepIndex: number;
  totalSteps: number;
  speed: number;
  onPlayPauseToggle: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onJumpToStart: () => void;
  onJumpToEnd: () => void;
  onSeek: (stepIndex: number) => void;
  onSpeedChange: (speed: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  currentStepIndex,
  totalSteps,
  speed,
  onPlayPauseToggle,
  onStepForward,
  onStepBackward,
  onJumpToStart,
  onJumpToEnd,
  onSeek,
  onSpeedChange,
}) => {
  const isAtEnd = totalSteps > 0 && currentStepIndex >= totalSteps - 1;
  const isAtStart = currentStepIndex <= 0;

  return (
    <div className="dark-panel rounded-2xl p-4 mt-3 border border-slate-800/90 font-mono">
      <div className="flex flex-col gap-3">
        {/* Timeline Slider with Telemetry */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span className="text-slate-300">
              Deterministic Step: <strong className="text-amber-400 font-bold">Step {currentStepIndex + 1} of {totalSteps}</strong>
            </span>
            <div className="flex items-center gap-3 text-[10px]">
              <span>BUFFERED: <strong className="text-slate-200">100%</strong></span>
              <span>TIME: <strong className="text-emerald-400">42.8ms</strong></span>
            </div>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={Math.max(0, totalSteps - 1)}
              value={currentStepIndex}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="w-full h-2 bg-[#090d16] rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Playback Button Controls (Matching Reference Screenshot Layout) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/70">
          <div className="flex items-center gap-2">
            {/* Jump to Start */}
            <button
              onClick={onJumpToStart}
              disabled={isAtStart}
              className="px-2.5 py-1.5 bg-[#121927] hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-bold disabled:opacity-30 transition-all active:scale-95"
              title="First Step"
            >
              |&lt;
            </button>

            {/* Step Back */}
            <button
              onClick={onStepBackward}
              disabled={isAtStart}
              className="px-3 py-1.5 bg-[#121927] hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-bold disabled:opacity-30 transition-all active:scale-95"
              title="Step Backward"
            >
              &lt;
            </button>

            {/* Primary Play / Pause Button (Golden Amber) */}
            <button
              onClick={onPlayPauseToggle}
              className={`px-5 py-1.5 rounded-lg text-xs font-black flex items-center gap-2 transition-all shadow-md active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 glow-amber'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 glow-amber'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isAtEnd ? 'REPLAY' : 'PLAY TRACE'}</span>
                </>
              )}
            </button>

            {/* Step Forward */}
            <button
              onClick={onStepForward}
              disabled={isAtEnd}
              className="px-3 py-1.5 bg-[#121927] hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-bold disabled:opacity-30 transition-all active:scale-95"
              title="Step Forward"
            >
              &gt;
            </button>

            {/* Jump to End */}
            <button
              onClick={onJumpToEnd}
              disabled={isAtEnd}
              className="px-2.5 py-1.5 bg-[#121927] hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-bold disabled:opacity-30 transition-all active:scale-95"
              title="Last Step"
            >
              &gt;|
            </button>
          </div>

          {/* Speed & Audio controls */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-[#090d16] p-1 rounded-lg border border-slate-800">
              {[0.5, 1.0, 2.0, 4.0].map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`px-2 py-0.5 text-[10px] rounded font-bold transition-all ${
                    speed === s
                      ? 'bg-amber-500 text-slate-950 font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s === 4.0 ? 'Max' : `${s}x`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
