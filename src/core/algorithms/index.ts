import { AlgorithmInfo, StepSnapshot } from '../types';
import { bubbleSort } from './bubbleSort';
import { quickSort } from './quickSort';
import { mergeSort } from './mergeSort';
import { insertionSort } from './insertionSort';
import { selectionSort } from './selectionSort';
import { linearSearch } from './linearSearch';
import { binarySearch } from './binarySearch';

export interface AlgorithmRunner {
  (arr: number[], target?: number): { trace: StepSnapshot[]; stats: { comparisons: number; swaps: number; overwrites: number; totalSteps: number } };
}

export const ALGORITHM_REGISTRY: Record<string, { info: AlgorithmInfo; run: AlgorithmRunner }> = {
  bubble_sort: {
    info: {
      id: 'bubble_sort',
      name: 'Bubble Sort',
      category: 'Sorting',
      timeComplexity: {
        best: 'O(N)',
        average: 'O(N²)',
        worst: 'O(N²)',
      },
      spaceComplexity: 'O(1)',
      description: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
      lessonId: 'sorting-bubble',
      codeJS: `function bubbleSort(arr, tracer) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (tracer.compare(j, j + 1)) {
        tracer.swap(j, j + 1);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    },
    run: (arr) => bubbleSort(arr),
  },
  selection_sort: {
    info: {
      id: 'selection_sort',
      name: 'Selection Sort',
      category: 'Sorting',
      timeComplexity: {
        best: 'O(N²)',
        average: 'O(N²)',
        worst: 'O(N²)',
      },
      spaceComplexity: 'O(1)',
      description: 'Finds the minimum element from the unsorted sub-array and places it at the beginning of the unsorted sub-array.',
      lessonId: 'sorting-selection',
      codeJS: `function selectionSort(arr, tracer) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    tracer.markMin(minIdx);
    for (let j = i + 1; j < n; j++) {
      if (tracer.compare(minIdx, j)) {
        minIdx = j;
        tracer.markMin(minIdx);
      }
    }
    if (minIdx !== i) {
      tracer.swap(i, minIdx);
    }
    tracer.markSorted(i);
  }
  return arr;
}`,
    },
    run: (arr) => selectionSort(arr),
  },
  insertion_sort: {
    info: {
      id: 'insertion_sort',
      name: 'Insertion Sort',
      category: 'Sorting',
      timeComplexity: {
        best: 'O(N)',
        average: 'O(N²)',
        worst: 'O(N²)',
      },
      spaceComplexity: 'O(1)',
      description: 'Builds the final sorted array one item at a time by repeatedly taking the next element and inserting it into its correct position.',
      lessonId: 'sorting-insertion',
      codeJS: `function insertionSort(arr, tracer) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && tracer.compare(j, j + 1)) {
      tracer.swap(j, j + 1);
      j--;
    }
    tracer.markSorted(i);
  }
  return arr;
}`,
    },
    run: (arr) => insertionSort(arr),
  },
  quick_sort: {
    info: {
      id: 'quick_sort',
      name: 'Quick Sort',
      category: 'Sorting',
      timeComplexity: {
        best: 'O(N log N)',
        average: 'O(N log N)',
        worst: 'O(N²)',
      },
      spaceComplexity: 'O(log N)',
      description: 'Divide-and-conquer algorithm that selects a pivot element and partitions the array into sub-arrays.',
      lessonId: 'sorting-quick',
      codeJS: `function quickSort(arr, tracer) {
  // Lomuto partitioning quicksort
  return arr;
}`,
    },
    run: (arr) => quickSort(arr),
  },
  merge_sort: {
    info: {
      id: 'merge_sort',
      name: 'Merge Sort',
      category: 'Sorting',
      timeComplexity: {
        best: 'O(N log N)',
        average: 'O(N log N)',
        worst: 'O(N log N)',
      },
      spaceComplexity: 'O(N)',
      description: 'Stable divide-and-conquer algorithm that divides array into halves, sorts recursively, and merges.',
      lessonId: 'sorting-merge',
      codeJS: `function mergeSort(arr, tracer) {
  // Merge sort recursive
  return arr;
}`,
    },
    run: (arr) => mergeSort(arr),
  },
  linear_search: {
    info: {
      id: 'linear_search',
      name: 'Linear Search',
      category: 'Searching',
      timeComplexity: {
        best: 'O(1)',
        average: 'O(N)',
        worst: 'O(N)',
      },
      spaceComplexity: 'O(1)',
      description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.',
      lessonId: 'searching-linear',
      defaultTarget: 53,
      codeJS: `function linearSearch(arr, tracer, target = 53) {
  for (let i = 0; i < arr.length; i++) {
    if (tracer.searchExamine(i, target)) {
      tracer.markFound(i, target);
      return i;
    }
  }
  tracer.markNotFound(target);
  return -1;
}`,
    },
    run: (arr, target) => linearSearch(arr, target),
  },
  binary_search: {
    info: {
      id: 'binary_search',
      name: 'Binary Search',
      category: 'Searching',
      timeComplexity: {
        best: 'O(1)',
        average: 'O(log N)',
        worst: 'O(log N)',
      },
      spaceComplexity: 'O(1)',
      description: 'Searches a sorted array by repeatedly dividing the search interval in half.',
      lessonId: 'searching-binary',
      defaultTarget: 53,
      codeJS: `function binarySearch(arr, tracer, target = 53) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    tracer.setSearchRange(low, high, mid, target);
    if (tracer.searchExamine(mid, target)) {
      tracer.markFound(mid, target);
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  tracer.markNotFound(target);
  return -1;
}`,
    },
    run: (arr, target) => binarySearch(arr, target),
  },
};
