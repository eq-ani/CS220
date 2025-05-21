import { sempty, Stream, snode } from "../include/stream.js";

export type Series = Stream<number>;

export function addSeries(s: Stream<number>, t: Stream<number>): Stream<number> {
  if (t.isEmpty()) return s;
  else if (s.isEmpty()) return t;
  else {
    const head = t.head() + s.head();
    const tail = () => addSeries(t.tail(), s.tail());
    return snode(head, tail);
  }
}

export function prodSeries(s: Stream<number>, t: Stream<number>): Stream<number> {
  if (s.isEmpty() || t.isEmpty()) {
    return sempty();
  }
  const tX = t.map(x => x * s.head());
  const prod = snode(0, () => prodSeries(s.tail(), t));
  return addSeries(tX, prod);
}

export function derivSeries(s: Stream<number>): Stream<number> {
  if (s.tail().isEmpty()) {
    return snode(0, () => sempty());
  }
  function deriv(s: Stream<number>, x: number): Stream<number> {
    if (s.tail().isEmpty()) {
      return snode(s.head() * x, () => sempty());
    }
    return snode(s.head() * x, () => deriv(s.tail(), x + 1));
  }
  return deriv(s.tail(), 1);
}

export function coeff(s: Series, n: number): number[] {
  const ret = [];
  let curr = s;
  while (ret.length <= n && !curr.isEmpty()) {
    ret.push(curr.head());
    curr = curr.tail();
  }
  return ret;
}

export function evalSeries(s: Series, n: number): (x: number) => number {
  const coS = coeff(s, n);
  return (x: number) => {
    let total = 0,
      pow = 1;
    for (let i = 0; i < coS.length; i++) {
      total += coS[i] * pow;
      pow *= x;
    }
    return total;
  };
}

export function applySeries(f: (c: number) => number, v: number): Series {
  return snode(v, () => applySeries(f, f(v)));
}

export function expSeries(): Series {
  let num = 0;
  return applySeries(x => {
    num++;
    return x / num;
  }, 1);
}

export function recurSeries(coef: number[], init: number[]): Series {
  function func(arr: number[]): Series {
    const next = arr.reduce((acc, v, i) => acc + coef[i] * v, 0);
    const arr2 = arr.slice(1).concat([next]);
    return snode(arr[0], () => func(arr2));
  }
  return func(init);
}
