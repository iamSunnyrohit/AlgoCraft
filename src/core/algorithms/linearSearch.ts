import { ArrayTracer } from '../ArrayTracer';
import { StepSnapshot } from '../types';

export function linearSearch(
  arr: number[],
  target: number = arr[Math.floor(arr.length / 2)] || 42
): { trace: StepSnapshot[]; stats: ReturnType<ArrayTracer['getStats']> } {
  const tracer = new ArrayTracer(arr);
  const n = arr.length;

  tracer.highlightLine(2, `Starting Linear Search for target ${target}`);

  for (let i = 0; i < n; i++) {
    tracer.highlightLine(4, `Checking element at index ${i}`);
    const isMatch = tracer.searchExamine(i, target, 5, `Checking if arr[${i}] (${arr[i]}) equals target ${target}`);

    if (isMatch) {
      tracer.markFound(i, target, 6, `Target ${target} found at index ${i}!`);
      return {
        trace: tracer.getTrace(),
        stats: tracer.getStats(),
      };
    }
  }

  tracer.markNotFound(target, 11, `Target ${target} was not found in the array`);

  return {
    trace: tracer.getTrace(),
    stats: tracer.getStats(),
  };
}
