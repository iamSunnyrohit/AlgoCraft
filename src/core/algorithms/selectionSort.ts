import { ArrayTracer } from '../ArrayTracer';
import { StepSnapshot } from '../types';

export function selectionSort(arr: number[]): { trace: StepSnapshot[]; stats: ReturnType<ArrayTracer['getStats']> } {
  const tracer = new ArrayTracer(arr);
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    tracer.highlightLine(3, `Outer pass i = ${i}`);
    let minIdx = i;
    tracer.markMin(minIdx, 4, `Initial min assumed at index ${i} (${arr[i]})`);

    for (let j = i + 1; j < n; j++) {
      tracer.highlightLine(6, `Scanning element at j = ${j}`);
      if (tracer.compare(minIdx, j, 7, `Comparing current min at ${minIdx} (${arr[minIdx]}) with index ${j} (${arr[j]})`)) {
        minIdx = j;
        tracer.markMin(minIdx, 8, `Found new minimum at index ${minIdx} (${arr[minIdx]})`);
      }
    }

    if (minIdx !== i) {
      tracer.swap(i, minIdx, 12, `Swapping minimum at index ${minIdx} with position ${i}`);
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }

    tracer.markSorted(i, 14);
    tracer.markMin(undefined);
  }

  tracer.markSortedFrom(0, n - 1, 17);

  return {
    trace: tracer.getTrace(),
    stats: tracer.getStats(),
  };
}
