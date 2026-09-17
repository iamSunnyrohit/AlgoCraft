import { ArrayTracer } from '../ArrayTracer';
import { StepSnapshot } from '../types';

export function quickSort(arr: number[]): { trace: StepSnapshot[]; stats: ReturnType<ArrayTracer['getStats']> } {
  const tracer = new ArrayTracer(arr);
  const n = arr.length;

  function partition(low: number, high: number): number {
    tracer.setPivot(high, 5); // Pivot chosen as high index
    let i = low - 1;

    for (let j = low; j < high; j++) {
      tracer.highlightLine(8, `Comparing element ${j} with pivot at ${high}`);
      if (!tracer.compare(j, high, 9, `Comparing element at ${j} (${arr[j]}) with pivot (${arr[high]})`)) {
        i++;
        if (i !== j) {
          tracer.swap(i, j, 11);
        }
      }
    }

    tracer.swap(i + 1, high, 14, `Placing pivot into correct sorted position ${i + 1}`);
    tracer.setPivot(undefined);
    tracer.markSorted(i + 1, 15);
    return i + 1;
  }

  function helper(low: number, high: number) {
    if (low < high) {
      const p = partition(low, high);
      helper(low, p - 1);
      helper(p + 1, high);
    } else if (low === high) {
      tracer.markSorted(low, 22);
    }
  }

  helper(0, n - 1);
  tracer.markSortedFrom(0, n - 1, 25);

  return {
    trace: tracer.getTrace(),
    stats: tracer.getStats(),
  };
}
