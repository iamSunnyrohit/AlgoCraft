import { ArrayTracer } from '../ArrayTracer';
import { StepSnapshot } from '../types';

export function bubbleSort(arr: number[]): { trace: StepSnapshot[]; stats: ReturnType<ArrayTracer['getStats']> } {
  const tracer = new ArrayTracer(arr);
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    tracer.highlightLine(2, `Outer loop iteration i = ${i}`);
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      tracer.highlightLine(4, `Inner loop comparison j = ${j}`);

      if (tracer.compare(j, j + 1, 5)) {
        tracer.swap(j, j + 1, 6);
        swapped = true;
      }
    }

    tracer.markSorted(n - 1 - i, 8);

    if (!swapped) {
      tracer.highlightLine(9, 'No swaps occurred in pass; array is already sorted');
      break;
    }
  }

  tracer.markSortedFrom(0, n - 1, 12);

  return {
    trace: tracer.getTrace(),
    stats: tracer.getStats(),
  };
}
