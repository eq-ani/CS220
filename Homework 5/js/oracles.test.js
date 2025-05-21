import assert from "assert";
import { AssertionError } from "assert";
import { FLAWED_STABLE_MATCHING_SOLUTION_1, FLAWED_STABLE_MATCHING_SOLUTION_1_TRACE, STABLE_MATCHING_SOLUTION_1, STABLE_MATCHING_SOLUTION_1_TRACE, } from "../include/stableMatching.js";
import { generateInput, stableMatchingOracle, stableMatchingRunOracle } from "./oracles.js";
describe("generateInput", () => {
    // Tests for generateInput go here.
    it("should return an n x n array", () => {
        const n = 5;
        const x = generateInput(n);
        assert(x.length === n);
        for (let i = 0; i < n; i++) {
            assert(x[i].length === n);
        }
    });
    it("should work for n = 0", () => {
        const n = 0;
        const x = generateInput(n);
        assert(x.length === 0);
    });
    it("should work for n = 1", () => {
        const n = 1;
        const x = generateInput(n);
        assert(x.length === 1);
        assert(x[0].length === 1);
        assert(x[0][0] === 0);
    });
    it("should be random", () => {
        const n = 6;
        const x1 = generateInput(n);
        const x2 = generateInput(n);
        let allEqual = true;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (x1[i][j] !== x2[i][j]) {
                    allEqual = false;
                    break;
                }
            }
            if (!allEqual)
                break;
        }
        assert(!allEqual);
    });
});
// Part A
describe("Part A: stableMatchingOracle", () => {
    // You do not need to write more tests. The two provided are sufficient.
    // Given an correct solution, no assertion should fail, and no errors should be thrown
    it("should accept STABLE_MATCHING_SOLUTION_1", () => {
        expect(() => stableMatchingOracle(STABLE_MATCHING_SOLUTION_1)).not.toThrow();
    });
    // Given an incorrect solution, some assertion should fail
    it("should reject FLAWED_STABLE_MATCHING_SOLUTION_1", () => {
        expect(() => stableMatchingOracle(FLAWED_STABLE_MATCHING_SOLUTION_1)).toThrow(AssertionError);
    });
});
// Part B
describe("Part B: stableMatchingRunOracle", () => {
    // You do not need to write more tests than the two provided
    // Given an correct solution, no assertion should fail, and no errors should be thrown
    it("should accept STABLE_MATCHING_SOLUTION_1_TRACE", () => {
        expect(() => stableMatchingRunOracle(STABLE_MATCHING_SOLUTION_1_TRACE)).not.toThrow();
    });
    // Given an incorrect solution, some assertion should fail
    it("should reject FLAWED_STABLE_MATCHING_SOLUTION_1", () => {
        expect(() => stableMatchingRunOracle(FLAWED_STABLE_MATCHING_SOLUTION_1_TRACE)).toThrow(AssertionError);
    });
});
//# sourceMappingURL=oracles.test.js.map