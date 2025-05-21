import { Stream, to, from } from "../include/stream.js";
import {
  addSeries,
  prodSeries,
  derivSeries,
  coeff,
  evalSeries,
  applySeries,
  expSeries,
  recurSeries,
} from "./series.js";

function expectStreamToBe<T>(s: Stream<T>, a: T[]) {
  for (const element of a) {
    expect(s.isEmpty()).toBe(false);
    expect(s.head()).toBe(element);

    s = s.tail();
  }

  expect(s.isEmpty()).toBe(true);
}

function helper<T>(s: Stream<T>, prefix: T[]) {
  for (const element of prefix) {
    expect(s.isEmpty()).toBe(false);
    expect(s.head()).toBe(element);
    s = s.tail();
  }
}

describe("addSeries", () => {
  it("adds simple streams together", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 5);
    const b = to(1, 5);
    const c = addSeries(a, b);

    expectStreamToBe(c, [2, 4, 6, 8, 10]);
  });

  it("handles streams of different lengths", () => {
    const longer = to(1, 3);
    const shorter = to(4, 5);
    const sum = addSeries(longer, shorter);
    expectStreamToBe(sum, [5, 7, 3]);
  });
  it("handles adding two infinite streams", () => {
    const s1 = from(1);
    const s2 = from(2);
    const sum = addSeries(s1, s2);
    let s = sum;
    expect(s.head()).toBe(3);
    s = s.tail();
    expect(s.head()).toBe(5);
    s = s.tail();
    expect(s.head()).toBe(7);
    s = s.tail();
    expect(s.head()).toBe(9);
  });
});

describe("prodSeries", () => {
  it("multiplies two series correctly", () => {
    const s = to(1, 3);
    const t = to(4, 6);
    const expected = [4, 13, 28, 27, 18];
    expectStreamToBe(prodSeries(s, t), expected);
  });
  it("handles different length series", () => {
    const s = to(1, 2);
    const t = to(3, 5);
    const expected = [3, 10, 13, 10];
    expectStreamToBe(prodSeries(s, t), expected);
  });

  it("handles infinite streams", () => {
    const from1 = from(1);
    const from2 = from(2);
    const product = prodSeries(from1, from2);
    let s = product;
    expect(s.head()).toBe(2);
    s = s.tail();
    expect(s.head()).toBe(7);
    s = s.tail();
    expect(s.head()).toBe(16);
    s = s.tail();
    expect(s.head()).toBe(30);
  });
});

describe("derivSeries", () => {
  it("handles a one element series", () => {
    const constant = to(5, 5);
    const derived = derivSeries(constant);
    expectStreamToBe(derived, [0]);
  });

  it("handles a multiple element series", () => {
    const x = to(1, 4);
    const deriv = derivSeries(x);
    expectStreamToBe(deriv, [2, 6, 12]);
  });

  it("handles an infinite series", () => {
    const x = from(1);
    const deriv = derivSeries(x);
    let s = deriv;
    expect(s.head()).toBe(2);
    s = s.tail();
    expect(s.head()).toBe(6);
    s = s.tail();
    expect(s.head()).toBe(12);
    s = s.tail();
    expect(s.head()).toBe(20);
  });
});

describe("coeff", () => {
  it("extracts coeffecients of first n + 1 elements", () => {
    const x = to(1, 5);
    expect(coeff(x, 2)).toEqual([1, 2, 3]);
  });

  it("extracts coeffecients of all elements", () => {
    const x = to(1, 3);
    expect(coeff(x, 5)).toEqual([1, 2, 3]);
  });

  it("extracts exactly n+1 coefficients from an infinite stream", () => {
    const x = from(10);
    expect(coeff(x, 4)).toEqual([10, 11, 12, 13, 14]);
  });
});
describe("evalSeries", () => {
  it("handles finite series", () => {
    const series = to(1, 3);
    const poly = evalSeries(series, 2);
    expect(poly(0)).toBe(1);
    expect(poly(1)).toBe(6);
    expect(poly(2)).toBe(17);
  });

  it("handles finite series (out of bounds)", () => {
    const series = to(1, 2);
    const poly = evalSeries(series, 3);
    expect(poly(3)).toBe(7);
  });

  it("handles an infinite series", () => {
    const series = from(1);
    const poly = evalSeries(series, 3);
    expect(poly(1)).toBe(10);
    expect(poly(2)).toBe(49);
  });
});

describe("applySeries", () => {
  it("generates an increasing series using f(x) = x + 1", () => {
    const x = applySeries(x => x + 1, 1);
    helper(x, [1, 2, 3, 4, 5]);
  });

  it("generates a doubling series using f(x) = 2 * x", () => {
    const x = applySeries(x => 2 * x, 1);
    helper(x, [1, 2, 4, 8, 16]);
  });

  it("generates a constant series using f(x) = x", () => {
    const x = applySeries(x => x, 7);
    helper(x, [7, 7, 7, 7, 7]);
  });
});

describe("expSeries", () => {
  it("generates correct first five coefficients", () => {
    const series = expSeries();
    let s: Stream<number> = series;
    expect(s.head()).toBeCloseTo(1);
    s = s.tail();
    expect(s.head()).toBeCloseTo(1);
    s = s.tail();
    expect(s.head()).toBeCloseTo(0.5);
    s = s.tail();
    expect(s.head()).toBeCloseTo(1 / 6);
  });

  it("produces a non-empty infinite stream", () => {
    const series = expSeries();
    let s: Stream<number> = series;
    for (let i = 0; i < 20; i++) {
      expect(s.isEmpty()).toBe(false);
      s = s.tail();
    }
  });

  it("follows the correct formula", () => {
    const series = expSeries();
    let s: Stream<number> = series;
    let current = s.head();
    for (let n = 1; n <= 5; n++) {
      s = s.tail();
      const next = s.head();
      expect(next).toBeCloseTo(current / n);
      current = next;
    }
  });
});

describe("recurSeries", () => {
  it("computes sequence 1 (fib)", () => {
    const fib = recurSeries([1, 1], [0, 1]);
    helper(fib, [0, 1, 1, 2, 3, 5, 8]);
  });

  it("computes sequence 2 (geometric series)", () => {
    const geo = recurSeries([2], [3]);
    helper(geo, [3, 6, 12, 24, 48]);
  });

  it("computes sequence 3 (trib)", () => {
    const trib = recurSeries([1, 1, 1], [0, 0, 1]);
    helper(trib, [0, 0, 1, 1, 2, 4, 7, 13]);
  });
});
