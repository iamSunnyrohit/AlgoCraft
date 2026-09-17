import { LessonModule } from '../core/types';

export const LESSON_MODULES: LessonModule[] = [
  {
    id: 'sorting-bubble',
    title: 'Bubble Sort & Swapping Fundamentals',
    category: 'Sorting',
    estimatedMinutes: 15,
    summary: 'Learn how Bubble Sort repeatedly swaps adjacent out-of-order elements to bubble the largest item to the top.',
    sections: [
      {
        title: 'Core Concept & Invariant',
        content: `### How Bubble Sort Works
Bubble Sort is one of the simplest sorting algorithms. It works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order.

#### Algorithm Invariant
After pass $i$ (where $i$ starts at 0), the **$i$ largest elements** are guaranteed to be in their final sorted position at the end of the array.

$$\\text{Time Complexity: } O(N^2) \\quad | \\quad \\text{Space Complexity: } O(1)$$`,
        algorithmId: 'bubble_sort',
      },
      {
        title: 'Optimization with Early Termination',
        content: `If during an entire pass no swaps are performed, the array is already sorted! We can set a flag \`swapped = false\` and break early, giving a best-case time complexity of $O(N)$.`,
      },
    ],
    quizzes: [
      {
        id: 'q-bubble-1',
        lessonId: 'sorting-bubble',
        type: 'multiple_choice',
        question: 'What is the best-case time complexity of Bubble Sort when an early-termination swap flag is used on an already sorted array?',
        options: ['O(N²)', 'O(N log N)', 'O(N)', 'O(1)'],
        correctAnswer: 'O(N)',
        explanation: 'With a swap flag, if no swaps occur during the first pass, the algorithm terminates early after N comparisons.',
      },
      {
        id: 'q-bubble-2',
        lessonId: 'sorting-bubble',
        type: 'predict_output',
        question: 'Given the initial array [5, 1, 4, 2, 8], what will be the array state after the 1st outer pass of Bubble Sort?',
        options: ['[1, 4, 2, 5, 8]', '[1, 5, 4, 2, 8]', '[5, 1, 2, 4, 8]', '[1, 2, 4, 5, 8]'],
        correctAnswer: '[1, 4, 2, 5, 8]',
        explanation: 'Pass 1 compares and swaps 5 with 1, then 5 with 4, then 5 with 2. 5 stops before 8, yielding [1, 4, 2, 5, 8].',
      },
    ],
  },
  {
    id: 'sorting-quick',
    title: 'Quick Sort & Pivot Partitioning',
    category: 'Sorting',
    estimatedMinutes: 20,
    summary: 'Master divide-and-conquer sorting with Lomuto partitioning and pivot selection.',
    sections: [
      {
        title: 'Partitioning Strategy',
        content: `### Lomuto Partitioning
Quick Sort chooses a **pivot** element (e.g. the last element of the sub-array) and partitions all elements such that:
- Elements smaller than pivot go to the left
- Elements greater than or equal to pivot go to the right

$$\\text{Average Time: } O(N \\log N) \\quad | \\quad \\text{Worst Case: } O(N^2)$$`,
        algorithmId: 'quick_sort',
      },
    ],
    quizzes: [
      {
        id: 'q-quick-1',
        lessonId: 'sorting-quick',
        type: 'multiple_choice',
        question: 'Which pivot selection scenario causes Quick Sort to degrade to its worst-case O(N²) time complexity?',
        options: [
          'Selecting a random pivot element',
          'Selecting the median element',
          'Selecting the smallest or largest element in an already sorted array',
          'Selecting elements near the center',
        ],
        correctAnswer: 'Selecting the smallest or largest element in an already sorted array',
        explanation: 'Always choosing the extreme element creates unbalanced partitions of size 0 and N-1, leading to N recursive calls.',
      },
    ],
  },
  {
    id: 'sorting-merge',
    title: 'Merge Sort & Divide-and-Conquer',
    category: 'Sorting',
    estimatedMinutes: 20,
    summary: 'Understand guaranteed $O(N \\log N)$ sorting through recursive division and two-pointer merging.',
    sections: [
      {
        title: 'Two-Pointer Merging',
        content: `### Guaranteed O(N log N) Performance
Merge Sort divides the array into two halves, recursively sorts them, and merges the sorted sub-arrays using two pointers.

$$\\text{Time Complexity: } O(N \\log N) \\quad \\text{always} \\quad | \\quad \\text{Space Complexity: } O(N)$$`,
        algorithmId: 'merge_sort',
      },
    ],
    quizzes: [
      {
        id: 'q-merge-1',
        lessonId: 'sorting-merge',
        type: 'multiple_choice',
        question: 'Why does standard Merge Sort require O(N) auxiliary space complexity?',
        options: [
          'To store the call stack of recursion',
          'To create temporary sub-arrays during the merge phase',
          'To count comparisons during iteration',
          'It operates strictly in-place without extra space',
        ],
        correctAnswer: 'To create temporary sub-arrays during the merge phase',
        explanation: 'Out-of-place merging requires auxiliary array space proportional to N to hold merged elements.',
      },
    ],
  },
];
