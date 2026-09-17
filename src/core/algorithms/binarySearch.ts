import { ArrayTracer } from '../ArrayTracer';
import { StepSnapshot } from '../types';

export function binarySearch(
  arr: number[],
  target?: number
): { trace: StepSnapshot[]; stats: ReturnType<ArrayTracer['getStats']> } {
  const sortedArray = [...arr].sort((a, b) => a - b);
  const actualTarget = target !== undefined ? target : sortedArray[Math.floor(sortedArray.length / 2)] || 42;

  const tracer = new ArrayTracer(sortedArray);
  let low = 0;
  let high = sortedArray.length - 1;

  tracer.highlightLine(2, `Starting Binary Search for target ${actualTarget} on sorted array`);

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    tracer.setSearchRange(low, high, mid, actualTarget, 5, `Active range [${low}..${high}], calculated mid = ${mid} (value: ${sortedArray[mid]})`);

    const isMatch = tracer.searchExamine(mid, actualTarget, 6, `Comparing mid element at index ${mid} (${sortedArray[mid]}) with target ${actualTarget}`);

    if (sortedArray[mid] === actualTarget) {
      tracer.markFound(mid, actualTarget, 8, `Target ${actualTarget} FOUND at index ${mid}!`);
      return {
        trace: tracer.getTrace(),
        stats: tracer.getStats(),
      };
    } else if (sortedArray[mid] < actualTarget) {
      tracer.highlightLine(11, `arr[${mid}] (${sortedArray[mid]}) < ${actualTarget}; shifting low pointer to ${mid + 1}`);
      low = mid + 1;
    } else {
      tracer.highlightLine(14, `arr[${mid}] (${sortedArray[mid]}) > ${actualTarget}; shifting high pointer to ${mid - 1}`);
      high = mid - 1;
    }
  }

  tracer.markNotFound(actualTarget, 18, `Target ${actualTarget} was not found in array`);

  return {
    trace: tracer.getTrace(),
    stats: tracer.getStats(),
  };
}
