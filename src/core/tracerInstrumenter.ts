import { ArrayTracer } from './ArrayTracer';
import { StepSnapshot } from './types';

export function runUserCodeWithTracer(
  codeString: string,
  initialArray: number[],
  maxExecutionTimeMs = 2000
): { trace: StepSnapshot[]; stats: ReturnType<ArrayTracer['getStats']>; error?: string } {
  const tracer = new ArrayTracer(initialArray);
  const targetArray = [...initialArray];

  const proxiedArray = new Proxy(targetArray, {
    get(target, prop, receiver) {
      if (typeof prop === 'string' && !isNaN(Number(prop))) {
        const index = Number(prop);
      }
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      if (typeof prop === 'string' && !isNaN(Number(prop))) {
        const index = Number(prop);
        tracer.overwrite(index, value);
      }
      return Reflect.set(target, prop, value, receiver);
    },
  });

  const sandboxContext = {
    tracer: {
      compare: (i: number, j: number) => tracer.compare(i, j),
      swap: (i: number, j: number) => tracer.swap(i, j),
      overwrite: (i: number, val: number) => tracer.overwrite(i, val),
      markSorted: (i: number) => tracer.markSorted(i),
      markSortedFrom: (start: number, end?: number) => tracer.markSortedFrom(start, end),
      setPivot: (i?: number) => tracer.setPivot(i),
      markMin: (i?: number) => tracer.markMin(i),
      searchExamine: (i: number, target: number) => tracer.searchExamine(i, target),
      setSearchRange: (low: number, high: number, mid?: number, target?: number) => tracer.setSearchRange(low, high, mid, target),
      markFound: (foundIndex: number, target: number) => tracer.markFound(foundIndex, target),
      markNotFound: (target: number) => tracer.markNotFound(target),
      highlightLine: (line: number, msg?: string) => tracer.highlightLine(line, msg),
    },
    console: {
      log: (...args: any[]) => {},
    },
  };

  const startTime = performance.now();

  try {
    // Construct runnable function
    const wrappedCode = `
      "use strict";
      return function(arr, tracer) {
        ${codeString}
        if (typeof bubbleSort === 'function') bubbleSort(arr);
        else if (typeof quickSort === 'function') quickSort(arr);
        else if (typeof mergeSort === 'function') mergeSort(arr);
        else if (typeof sort === 'function') sort(arr);
        else if (typeof customSort === 'function') customSort(arr);
        else {
          // If no specific function found, execute directly
        }
      }
    `;

    const factory = new Function(wrappedCode);
    const userFn = factory();

    userFn(proxiedArray, sandboxContext.tracer);

    // Ensure all sorted at end if complete
    tracer.markSortedFrom(0, initialArray.length - 1);

    const endTime = performance.now();
    if (endTime - startTime > maxExecutionTimeMs) {
      return {
        trace: tracer.getTrace(),
        stats: tracer.getStats(),
        error: `Execution timed out (> ${maxExecutionTimeMs}ms)`,
      };
    }

    return {
      trace: tracer.getTrace(),
      stats: tracer.getStats(),
    };
  } catch (err: any) {
    return {
      trace: tracer.getTrace(),
      stats: tracer.getStats(),
      error: err.message || String(err),
    };
  }
}
