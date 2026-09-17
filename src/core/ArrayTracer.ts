import { StepSnapshot, ActionType } from './types';

export class ArrayTracer {
  private currentArray: number[];
  private trace: StepSnapshot[] = [];
  private sortedSet: Set<number> = new Set();
  private pivotIndex?: number;
  private minIndex?: number;
  private comparisonsCount = 0;
  private swapsCount = 0;
  private overwritesCount = 0;

  constructor(initialArray: number[]) {
    this.currentArray = [...initialArray];
    this.pushSnapshot('INITIAL', [], 'Initial array state', undefined);
  }

  private pushSnapshot(
    type: ActionType,
    indices: number[],
    description: string,
    lineNumber?: number,
    auxiliaryArray?: number[],
    extra?: Partial<StepSnapshot>
  ) {
    this.trace.push({
      step: this.trace.length,
      lineNumber,
      array: [...this.currentArray],
      indices: [...indices],
      type,
      sortedIndices: Array.from(this.sortedSet).sort((a, b) => a - b),
      pivotIndex: this.pivotIndex,
      minIndex: this.minIndex,
      description,
      auxiliaryArray: auxiliaryArray ? [...auxiliaryArray] : undefined,
      ...extra,
    });
  }

  public compare(i: number, j: number, lineNumber?: number, customDesc?: string): boolean {
    this.comparisonsCount++;
    const desc = customDesc || `Comparing index ${i} (${this.currentArray[i]}) and index ${j} (${this.currentArray[j]})`;
    this.pushSnapshot('COMPARE', [i, j], desc, lineNumber);
    return this.currentArray[i] > this.currentArray[j];
  }

  public swap(i: number, j: number, lineNumber?: number, customDesc?: string): void {
    if (i === j) return;
    this.swapsCount++;
    const temp = this.currentArray[i];
    this.currentArray[i] = this.currentArray[j];
    this.currentArray[j] = temp;

    const desc = customDesc || `Swapping index ${i} (${this.currentArray[j]}) with index ${j} (${temp})`;
    this.pushSnapshot('SWAP', [i, j], desc, lineNumber);
  }

  public overwrite(index: number, value: number, lineNumber?: number, customDesc?: string, auxArray?: number[]): void {
    this.overwritesCount++;
    const prevVal = this.currentArray[index];
    this.currentArray[index] = value;
    const desc = customDesc || `Setting index ${index} to ${value} (was ${prevVal})`;
    this.pushSnapshot('OVERWRITE', [index], desc, lineNumber, auxArray);
  }

  public markSorted(index: number, lineNumber?: number): void {
    this.sortedSet.add(index);
    this.pushSnapshot('MARK_SORTED', [index], `Element at index ${index} (${this.currentArray[index]}) is now in sorted position`, lineNumber);
  }

  public markSortedFrom(startIndex: number, endIndex?: number, lineNumber?: number): void {
    const end = endIndex !== undefined ? endIndex : this.currentArray.length - 1;
    const newlySorted: number[] = [];
    for (let i = startIndex; i <= end; i++) {
      if (!this.sortedSet.has(i)) {
        this.sortedSet.add(i);
        newlySorted.push(i);
      }
    }
    this.pushSnapshot('MARK_SORTED', newlySorted, `Marked range [${startIndex}..${end}] as sorted`, lineNumber);
  }

  public setPivot(index: number | undefined, lineNumber?: number): void {
    this.pivotIndex = index;
    const desc = index !== undefined 
      ? `Set index ${index} (${this.currentArray[index]}) as current pivot`
      : `Cleared pivot`;
    this.pushSnapshot('PIVOT', index !== undefined ? [index] : [], desc, lineNumber);
  }

  public markMin(minIdx?: number, lineNumber?: number, customDesc?: string): void {
    this.minIndex = minIdx;
    const desc = customDesc || (minIdx !== undefined 
      ? `Marked index ${minIdx} (${this.currentArray[minIdx]}) as current minimum`
      : `Cleared minimum highlight`);
    this.pushSnapshot('MIN_HIGHLIGHT', minIdx !== undefined ? [minIdx] : [], desc, lineNumber, undefined, { minIndex: minIdx });
  }

  public searchExamine(i: number, target: number, lineNumber?: number, customDesc?: string): boolean {
    this.comparisonsCount++;
    const desc = customDesc || `Examining index ${i} (${this.currentArray[i]}) for target ${target}`;
    const isMatch = this.currentArray[i] === target;
    this.pushSnapshot('SEARCH_EXAMINE', [i], desc, lineNumber, undefined, { target });
    return isMatch;
  }

  public setSearchRange(
    low: number,
    high: number,
    mid?: number,
    target?: number,
    lineNumber?: number,
    customDesc?: string
  ): void {
    const desc = customDesc || `Setting search range [${low}..${high}]${mid !== undefined ? `, mid: ${mid}` : ''}`;
    this.pushSnapshot('SEARCH_RANGE', mid !== undefined ? [mid] : [], desc, lineNumber, undefined, {
      searchRange: { low, high, mid },
      target,
    });
  }

  public markFound(foundIndex: number, target: number, lineNumber?: number, customDesc?: string): void {
    const desc = customDesc || `Target ${target} found at index ${foundIndex}!`;
    this.pushSnapshot('FOUND', [foundIndex], desc, lineNumber, undefined, { target, foundIndex });
  }

  public markNotFound(target: number, lineNumber?: number, customDesc?: string): void {
    const desc = customDesc || `Target ${target} was not found in array`;
    this.pushSnapshot('NOT_FOUND', [], desc, lineNumber, undefined, { target });
  }

  public highlightLine(lineNumber: number, description?: string): void {
    this.pushSnapshot('LINE_HIGHLIGHT', [], description || `Executing line ${lineNumber}`, lineNumber);
  }

  public getTrace(): StepSnapshot[] {
    return this.trace;
  }

  public getStats() {
    return {
      comparisons: this.comparisonsCount,
      swaps: this.swapsCount,
      overwrites: this.overwritesCount,
      totalSteps: this.trace.length,
    };
  }
}
