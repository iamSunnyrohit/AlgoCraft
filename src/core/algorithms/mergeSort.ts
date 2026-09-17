import { ArrayTracer } from '../ArrayTracer';
import { StepSnapshot } from '../types';

export function mergeSort(arr: number[]): { trace: StepSnapshot[]; stats: ReturnType<ArrayTracer['getStats']> } {
  const tracer = new ArrayTracer(arr);
  const tempArray = [...arr];

  function merge(left: number, mid: number, right: number) {
    const leftCopy = tempArray.slice(left, mid + 1);
    const rightCopy = tempArray.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftCopy.length && j < rightCopy.length) {
      const actualLeftIdx = left + i;
      const actualRightIdx = mid + 1 + j;

      if (leftCopy[i] <= rightCopy[j]) {
        tracer.compare(actualLeftIdx, actualRightIdx, 10, `Comparing left sub-array element (${leftCopy[i]}) with right sub-array element (${rightCopy[j]})`);
        tempArray[k] = leftCopy[i];
        tracer.overwrite(k, leftCopy[i], 12, `Copying ${leftCopy[i]} back into position ${k}`);
        i++;
      } else {
        tracer.compare(actualLeftIdx, actualRightIdx, 10, `Comparing left sub-array element (${leftCopy[i]}) with right sub-array element (${rightCopy[j]})`);
        tempArray[k] = rightCopy[j];
        tracer.overwrite(k, rightCopy[j], 15, `Copying ${rightCopy[j]} back into position ${k}`);
        j++;
      }
      k++;
    }

    while (i < leftCopy.length) {
      tempArray[k] = leftCopy[i];
      tracer.overwrite(k, leftCopy[i], 20, `Copying remaining left element ${leftCopy[i]} to index ${k}`);
      i++;
      k++;
    }

    while (j < rightCopy.length) {
      tempArray[k] = rightCopy[j];
      tracer.overwrite(k, rightCopy[j], 25, `Copying remaining right element ${rightCopy[j]} to index ${k}`);
      j++;
      k++;
    }
  }

  function helper(left: number, right: number) {
    if (left >= right) {
      if (left === right) tracer.markSorted(left);
      return;
    }
    const mid = Math.floor((left + right) / 2);
    helper(left, mid);
    helper(mid + 1, right);
    merge(left, mid, right);
  }

  helper(0, arr.length - 1);
  tracer.markSortedFrom(0, arr.length - 1, 35);

  return {
    trace: tracer.getTrace(),
    stats: tracer.getStats(),
  };
}
