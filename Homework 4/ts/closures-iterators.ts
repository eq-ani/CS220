import { List } from "../include/lists.js";

export interface MyIterator<T> {
  hasNext: () => boolean;
  next: () => T;
}

export function composeList<T>(lst: List<(n: T) => T>): (n: T) => T {
  return (n: T) => lst.reduce((curr, func) => func(curr), n);
}

export function composeFunctions<T>(fns: ((x: T) => T)[]): (x: T) => T[] {
  return (x: T) => {
    const result = [x];
    fns.map(fn => result.push(fn(result[result.length - 1])));
    return result;
  };
}

export function composeBinary<T, U>(funArr: ((arg1: T, arg2: U) => T)[]): (a: U) => (x: T) => T {
  return (a: U) => (x: T) => funArr.reduce((curr, func) => func(curr, a), x);
}

export function enumRatios(): () => number {
  let total = 2;
  let n = 1;
  return () => {
    let d = total - n;
    const gcd = (x: number, y: number): number => (y ? gcd(y, x % y) : x);
    while (gcd(n, d) !== 1) {
      --n;
      if (n === 0) {
        n = ++total;
      }
      d = total - n;
    }
    const result = n / d;
    --n;
    if (n === 0) {
      n = ++total;
    }
    return result;
  };
}

export function cycleArr<T>(arr: T[][]): MyIterator<T> {
  const totalElements = arr.reduce((sum, row) => sum + row.length, 0);
  let count = 0;
  let x = 0;
  let y = 0;

  return {
    hasNext: () => count < totalElements,
    next: () => {
      while (count < totalElements) {
        if (y < arr.length) {
          if (x < arr[y].length) {
            count++;
            return arr[y++][x];
          }
          y++;
        } else {
          y = 0;
          x++;
        }
      }
      throw new Error("Exhausted");
    },
  };
}
function nextL<T>(lists: List<T>[], start: number): number {
  for (let i = start; i < lists.length; i++) {
    if (!lists[i].isEmpty()) {
      return i;
    }
  }
  return lists.length;
}

export function dovetail<T>(lists: List<T>[]): MyIterator<T> {
  let i = 0,
    accessed = 0,
    count = 1;
  return {
    hasNext: () => lists.some(list => !list.isEmpty()),
    next: () => {
      i = nextL(lists, i);
      if (accessed >= count || i >= lists.length) {
        count++;
        accessed = 0;
        i = nextL(lists, 0);
      }
      accessed++;
      const val = lists[i].head();
      lists[i] = lists[i++].tail();
      return val;
    },
  };
}
