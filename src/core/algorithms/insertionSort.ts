import { ArrayTracer } from '../ArrayTracer';
import { StepSnapshot } from '../types';

export function insertionSort(arr: number[]): { trace: StepSnapshot[]; stats: ReturnType<ArrayTracer['getStats']> } {
  const tracer = new ArrayTracer(arr);
  const n = arr.length;

  tracer.markSorted(0, 3);

  for (let i = 1; i < n; i++) {
    tracer.highlightLine(5, `Picking element at index ${i} (${arr[i]}) to insert`);
    const key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      tracer.compare(j, j + 1, 8, `Comparing element at ${j} (${arr[j]}) with key (${key})`);
      tracer.overwrite(j + 1, arr[j], 9, `Shifting element ${arr[j]} right to index ${j + 1}`);
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
    tracer.overwrite(j + 1, key, 14, `Inserted key ${key} at index ${j + 1}`);
    tracer.markSortedFrom(0, i, 15);
  }

  tracer.markSortedFrom(0, n - 1, 18);

  return {
    trace: tracer.getTrace(),
    stats: tracer.getStats(),
  };
}
