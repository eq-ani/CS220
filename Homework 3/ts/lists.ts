import { List, node, empty, reverseList } from "../include/lists.js";

export function insertOrdered(lst: List<number>, el: number): List<number> {
  if (lst.isEmpty()) {
    return node(el, empty());
  }
  if (el <= lst.head()) {
    return node(el, lst);
  }
  return node(lst.head(), insertOrdered(lst.tail(), el));
}

export function everyNRev<T>(lst: List<T>, n: number): List<T> {
  let i = 0;
  return lst.reduce((curr, val) => {
    if (i % n === n - 1) {
      curr = node(val, curr);
    }
    i++;
    return curr;
  }, empty<T>());
}

export function everyNCond<T>(lst: List<T>, n: number, cond: (e: T) => boolean): List<T> {
  const retlist = lst.filter(cond);
  return reverseList(everyNRev(retlist, n));
}

export function keepTrendMiddles(
  lst: List<number>,
  allSatisfy: (prev: number, curr: number, next: number) => boolean
): List<number> {
  if (lst.isEmpty() || lst.tail().isEmpty() || lst.tail().tail().isEmpty()) {
    return empty();
  }
  let result = empty<number>();
  let prev = lst.head();
  let curr = lst.tail().head();
  let rest = lst.tail().tail();
  while (!rest.isEmpty()) {
    const next = rest.head();
    if (allSatisfy(prev, curr, next)) {
      result = node(curr, result);
    }
    prev = curr;
    curr = next;
    rest = rest.tail();
  }
  return reverseList(result);
}

export function keepLocalMaxima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (prev, curr, next) => prev < curr && curr > next);
}

export function keepLocalMinima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (prev, curr, next) => prev > curr && curr < next);
}

export function keepLocalMinimaAndMaxima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (prev, curr, next) => (prev > curr && curr < next) || (prev < curr && curr > next));
}

function computeProducts(lst: List<number>, valid: (num: number) => boolean): List<number> {
  let product = 1;
  return reverseList(
    lst.reduce((curr, val) => (valid(val) ? node((product *= val), curr) : ((product = 1), curr)), empty<number>())
  );
}

export function nonNegativeProducts(lst: List<number>): List<number> {
  return computeProducts(lst, num => num >= 0);
}

export function negativeProducts(lst: List<number>): List<number> {
  return computeProducts(lst, num => num < 0);
}

export function deleteFirst<T>(lst: List<T>, val: T): List<T> {
  if (lst.isEmpty()) {
    return empty();
  }
  return lst.head() === val ? lst.tail() : node(lst.head(), deleteFirst(lst.tail(), val));
}

export function deleteLast<T>(lst: List<T>, val: T): List<T> {
  if (lst.isEmpty()) {
    return empty();
  }
  return reverseList(deleteFirst(reverseList(lst), val));
}

export function squashList(lst: List<number | List<number>>): List<number> {
  const list = lst.reduce((curr, val) => {
    if (typeof val === "number") {
      return node(val, curr);
    } else {
      const sum = val.reduce((sum, num) => sum + num, 0);
      return node(sum, curr);
    }
  }, empty<number>());
  return reverseList(list);
}
