export type ActionType = 
  | 'INITIAL'
  | 'COMPARE' 
  | 'SWAP' 
  | 'OVERWRITE' 
  | 'PIVOT' 
  | 'MARK_SORTED' 
  | 'LINE_HIGHLIGHT'
  | 'SEARCH_EXAMINE'
  | 'SEARCH_RANGE'
  | 'FOUND'
  | 'NOT_FOUND'
  | 'MIN_HIGHLIGHT';

export interface StepSnapshot {
  step: number;
  lineNumber?: number;
  array: number[];
  indices: number[];
  type: ActionType;
  sortedIndices: number[];
  pivotIndex?: number;
  description: string;
  auxiliaryArray?: number[];
  
  // Extended Search & Selection fields
  target?: number;
  foundIndex?: number;
  searchRange?: { low: number; high: number; mid?: number };
  minIndex?: number;
  metadata?: Record<string, any>;
}

export type AlgorithmCategory = 'Sorting' | 'Searching' | 'Graphs' | 'Trees';

export interface AlgorithmInfo {
  id: string;
  name: string;
  category: AlgorithmCategory;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
  codeJS: string;
  codePy?: string;
  codeCpp?: string;
  lessonId?: string;
  defaultTarget?: number;
}

export type QuizType = 'multiple_choice' | 'predict_output' | 'code_fill';

export interface QuizQuestion {
  id: string;
  lessonId: string;
  type: QuizType;
  question: string;
  options?: string[];
  correctAnswer: string | number | number[];
  explanation: string;
  initialArray?: number[];
  targetStep?: number;
}

export interface LessonModule {
  id: string;
  title: string;
  category: AlgorithmCategory;
  estimatedMinutes: number;
  summary: string;
  sections: {
    title: string;
    content: string;
    algorithmId?: string;
  }[];
  quizzes: QuizQuestion[];
}

export interface BenchmarkMetrics {
  n: number;
  comparisons: number;
  swaps: number;
  overwrites: number;
  executionTimeMs: number;
}

export interface UserProgress {
  completedLessons: string[];
  quizScores: Record<string, number>;
  masteryScores: Record<string, number>;
  savedSnippets: { id: string; title: string; code: string; language: string }[];
}
