import React, { useState } from 'react';
import { LESSON_MODULES } from '../data/lessonsData';
import { ArrayVisualizer } from './ArrayVisualizer';
import { PlaybackControls } from './PlaybackControls';
import { ALGORITHM_REGISTRY } from '../core/algorithms';
import { StepSnapshot } from '../core/types';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Award, BookOpen, HelpCircle, ChevronRight } from 'lucide-react';

export const LessonViewer: React.FC = () => {
  const [activeLessonId, setActiveLessonId] = useState(LESSON_MODULES[0].id);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const activeLesson = LESSON_MODULES.find((l) => l.id === activeLessonId) || LESSON_MODULES[0];

  const demoAlgoId = activeLesson.sections.find((s) => s.algorithmId)?.algorithmId || 'bubble_sort';
  const algoEntry = ALGORITHM_REGISTRY[demoAlgoId] || ALGORITHM_REGISTRY['bubble_sort'];
  
  const sampleArray = [5, 1, 4, 2, 8];
  const { trace } = algoEntry.run(sampleArray);

  const handleSelectOption = (questionId: string, option: string) => {
    if (quizSubmitted[questionId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitAnswer = (questionId: string, correctAnswer: string) => {
    setQuizSubmitted((prev) => ({ ...prev, [questionId]: true }));
    if (selectedAnswers[questionId] === correctAnswer) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto py-4">
      {/* Sidebar Lesson Navigation */}
      <div className="lg:col-span-4 glass-panel rounded-2xl p-4 md:p-6 border border-slate-800">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <h2 className="text-base font-bold text-white font-heading">Guided Learning Modules</h2>
        </div>

        <div className="flex flex-col gap-3">
          {LESSON_MODULES.map((lesson) => {
            const isActive = lesson.id === activeLesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => {
                  setActiveLessonId(lesson.id);
                  setCurrentStepIdx(0);
                  setIsPlaying(false);
                }}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/40 border-indigo-500/50 text-white shadow-lg'
                    : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    {lesson.category} • {lesson.estimatedMinutes} mins
                  </span>
                  {isActive && <ChevronRight className="w-4 h-4 text-indigo-400" />}
                </div>
                <h3 className="text-sm font-bold font-heading mb-1">{lesson.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{lesson.summary}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Lesson Content & Embedded Visualizer */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Lesson Theory Header */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800">
          <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
            {activeLesson.category} Module
          </span>
          <h1 className="text-2xl font-extrabold text-white font-heading mt-2 mb-3">
            {activeLesson.title}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            {activeLesson.summary}
          </p>

          {/* Embedded Interactive Demo Visualizer */}
          <div className="mt-6">
            <ArrayVisualizer
              currentStep={trace[currentStepIdx] || null}
              title={`Embedded Visualizer: ${algoEntry.info.name}`}
              subtitle="Interactive sample array [5, 1, 4, 2, 8]"
              isCompact
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
              onSeek={(idx) => setCurrentStepIdx(idx)}
              onSpeedChange={(s) => setSpeed(s)}
            />
          </div>
        </div>

        {/* Quizzes Section */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-800">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white font-heading">Interactive Knowledge Check</h2>
          </div>

          <div className="flex flex-col gap-6">
            {activeLesson.quizzes.map((quiz, qIdx) => {
              const selected = selectedAnswers[quiz.id];
              const submitted = quizSubmitted[quiz.id];
              const isCorrect = selected === quiz.correctAnswer;

              return (
                <div
                  key={quiz.id}
                  className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      Question {qIdx + 1}
                    </span>
                    {submitted && (
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-white">{quiz.question}</p>

                  {/* Multiple Choice Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {quiz.options?.map((opt, optIdx) => {
                      const isSelected = selected === opt;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(quiz.id, opt)}
                          className={`p-3 rounded-xl text-left text-xs font-medium transition-all border ${
                            isSelected
                              ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold shadow-md'
                              : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit Button */}
                  {!submitted ? (
                    <button
                      onClick={() => handleSubmitAnswer(quiz.id, String(quiz.correctAnswer))}
                      disabled={!selected}
                      className="self-end px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                      <strong className="text-white block mb-1">Explanation:</strong>
                      {quiz.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
