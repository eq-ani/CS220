import assert from "assert";

import type { StableMatcher, StableMatcherWithTrace } from "../include/stableMatching.js";

export function generateInput(n: number): number[][] {
  const ret: number[][] = [];
  function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  for (let i = 0; i < n; i++) {
    const a: number[] = [];
    for (let j = 0; j < n; j++) {
      a.push(j);
    }
    //fisher-yates shuffle
    for (let k = n - 1; k > 0; k--) {
      const j = randomInt(0, k + 1);
      [a[k], a[j]] = [a[j], a[k]];
    }
    ret.push(a);
  }
  return ret;
}

const NUM_TESTS = 75;
const N = 15;

/**
 * Tests whether or not the supplied function is a solution to the stable matching problem.
 * @param makeStableMatching A possible solution to the stable matching problem
 * @throws An `AssertionError` if `makeStableMatching` in not a solution to the stable matching problem
 */
export function stableMatchingOracle(makeStableMatching: StableMatcher): void {
  for (let i = 0; i < NUM_TESTS; ++i) {
    const companies = generateInput(N);
    const candidates = generateInput(N);
    //assert 1: verify that the length is the same
    const hires = makeStableMatching(companies, candidates);
    assert(companies.length === hires.length);
    //setup for next asserts: match arrays for companies and candidates
    const matchesCa: number[] = new Array<number>(N).fill(-1);
    const matchesCo: number[] = new Array<number>(N).fill(-1);
    //assert 2: check valid indicies and uniqueness; update matches
    for (let j = 0; j < hires.length; j++) {
      const ca = hires[j].candidate;
      const co = hires[j].company;
      assert(ca >= 0 && ca < N);
      assert(matchesCa[ca] === -1);
      assert(co >= 0 && co < N);
      assert(matchesCo[co] === -1);
      matchesCa[ca] = co;
      matchesCo[co] = ca;
    }
    //assert 3: check all companies and candidates are matched
    for (let k = 0; k < N; k++) {
      assert(matchesCa[k] !== -1);
      assert(matchesCo[k] !== -1);
    }
    //setup for assert 4: ranking array setup
    const rankCo: number[][] = new Array<number[]>(N);
    for (let co = 0; co < N; co++) {
      rankCo[co] = new Array<number>(N);
      for (let r = 0; r < N; r++) {
        const cand = companies[co][r];
        rankCo[co][cand] = r;
      }
    }
    const rankCa: number[][] = new Array<number[]>(N);
    for (let ca = 0; ca < N; ca++) {
      rankCa[ca] = new Array<number>(N);
      for (let r = 0; r < N; r++) {
        const cand = candidates[ca][r];
        rankCa[ca][cand] = r;
      }
    }
    //assert 4: check that the matching is stable
    for (let co = 0; co < N; co++) {
      const currCa = matchesCo[co];
      for (let ca = 0; ca < N; ca++) {
        if (ca === currCa) continue;
        if (rankCo[co][ca] < rankCo[co][currCa]) {
          const currCo = matchesCa[ca];
          if (rankCa[ca][co] < rankCa[ca][currCo]) {
            assert(false);
          }
        }
      }
    }
  }
}
// Part B

/**
 * Tests whether or not the supplied function follows the supplied algorithm.
 * @param makeStableMatchingTrace A possible solution to the stable matching problem and its possible steps
 * @throws An `AssertionError` if `makeStableMatchingTrace` does not follow the specified algorithm, or its steps (trace)
 * do not match with the result (out).
 */
function indexOf(arr: number[], value: number): number {
  for (let k = 0; k < arr.length; k++) {
    if (arr[k] === value) return k;
  }
  return -1;
}

export function stableMatchingRunOracle(makeStableMatchingTrace: StableMatcherWithTrace): void {
  for (let i = 0; i < NUM_TESTS; i++) {
    const companies = generateInput(N);
    const candidates = generateInput(N);
    const { trace, out } = makeStableMatchingTrace(companies, candidates);
    //track next proposal for each company and candidate
    const nextCo: number[] = new Array<number>(N).fill(0);
    const nextCa: number[] = new Array<number>(N).fill(0);
    //matching each company to a candidate and vice versa
    const matchesCo: number[] = new Array<number>(N).fill(-1);
    const matchesCa: number[] = new Array<number>(N).fill(-1);
    for (let j = 0; j < trace.length; j++) {
      const offer = trace[j];
      if (offer.fromCo) {
        const company = offer.from;
        const candidate = offer.to;
        //company must be unmatched
        assert(matchesCo[company] === -1);
        const expectedCandidate = companies[company][nextCo[company]];
        //company must be proposing to the expected candidate
        assert(candidate === expectedCandidate);
        //increment next proposal for company
        nextCo[company]++;
        if (matchesCa[candidate] === -1) {
          //unmatched candidate, match unconditionally
          matchesCa[candidate] = company;
          matchesCo[company] = candidate;
        } else {
          //matched candidate, check preference
          const currCo = matchesCa[candidate];
          const curr = indexOf(candidates[candidate], currCo);
          const offer = indexOf(candidates[candidate], company);
          if (offer < curr) {
            //candidate prefers new offer
            matchesCa[candidate] = company;
            matchesCo[company] = candidate;
            //unmatch the previously matched company
            matchesCo[currCo] = -1;
          }
          //otherwise candidate rejects offer
        }
      } else {
        //candidate makes an offer to company
        const candidate = offer.from;
        const company = offer.to;
        //candidate must be unmatched
        assert(matchesCa[candidate] === -1);
        //candidate must be proposing to the expected company
        const expectedCompany = candidates[candidate][nextCa[candidate]];
        assert(company === expectedCompany);
        //increment next proposal for candidate
        nextCa[candidate]++;
        if (matchesCo[company] === -1) {
          //unmatched company, match unconditionally
          matchesCo[company] = candidate;
          matchesCa[candidate] = company;
        } else {
          //matched company, check preference
          const currentCandidate = matchesCo[company];
          const posCurrent = indexOf(companies[company], currentCandidate);
          const posNew = indexOf(companies[company], candidate);
          if (posNew < posCurrent) {
            //company prefers new offer
            matchesCo[company] = candidate;
            matchesCa[candidate] = company;
            //unmatch the previously matched candidate
            matchesCa[currentCandidate] = -1;
          }
          //otherwise company rejects offer
        }
      }
    }
    //comparison between expected and actual matches
    const outCo: number[] = new Array<number>(N).fill(-1);
    const outCa: number[] = new Array<number>(N).fill(-1);
    //assign output matches
    for (let j = 0; j < out.length; j++) {
      const { company, candidate } = out[j];
      // Check that each company and candidate appears only once in the output.
      assert(outCo[company] === -1);
      assert(outCa[candidate] === -1);
      outCo[company] = candidate;
      outCa[candidate] = company;
    }
    //compare simulated to output matches
    for (let co = 0; co < N; co++) {
      assert(matchesCo[co] === outCo[co]);
    }
    for (let ca = 0; ca < N; ca++) {
      assert(matchesCa[ca] === outCa[ca]);
    }
    /*verify trace length
    const companiesSet = new Set<number>(out.map(hire => hire.company));
    const candidatesSet = new Set<number>(out.map(hire => hire.candidate));
    assert(companiesSet.size === N);
    assert(candidatesSet.size === N);
    */
  }
}
