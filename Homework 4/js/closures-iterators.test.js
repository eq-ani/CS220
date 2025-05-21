import assert from "assert";
import { node, empty, arrayToList } from "../include/lists.js";
// listToArray and arrayToList are provided for your testing convenience only.
import { composeList, composeFunctions, composeBinary, enumRatios, cycleArr, dovetail, } from "./closures-iterators.js";
describe("composeList", () => {
    // Tests for composeList go here
    it("should return the identity function", () => {
        const emptyList = empty();
        const composed = composeList(emptyList);
        assert(composed(0) === 0);
        assert(composed(3) === 3);
    });
    it("should apply a single function correctly", () => {
        const addFour = (x) => x + 4;
        const singleFnList = node(addFour, empty());
        const composed = composeList(singleFnList);
        assert(composed(3) === 7);
    });
    it("should compose multiple functions in order", () => {
        const addSeven = (x) => x + 7;
        const multiplyTwo = (x) => x * 2;
        const funcList = node(addSeven, node(multiplyTwo, empty()));
        const composed = composeList(funcList);
        assert(composed(4) === 22);
    });
    it("should respect function order", () => {
        const multiplyTwo = (x) => x * 2;
        const addSeven = (x) => x + 7;
        const funcList = node(multiplyTwo, node(addSeven, empty()));
        const composed = composeList(funcList);
        assert(composed(4) === 15);
    });
    it("should handle functions that always return the same value", () => {
        const constant = (_) => 42;
        const funcList = node(constant, node(constant, empty()));
        const composed = composeList(funcList);
        assert(composed(7) === 42);
    });
    it("should correctly handle function chains with division", () => {
        const half = (x) => x / 2;
        const subtractOne = (x) => x - 1;
        const funcList = node(half, node(subtractOne, empty()));
        const composed = composeList(funcList);
        assert(composed(8) === 3);
    });
    it("should work with non-number types", () => {
        const a = (s) => s + "a";
        const b = (s) => s + "b";
        const funcList1 = node(a, node(b, empty()));
        let composed = composeList(funcList1);
        assert(composed("x") === "xab");
        const funcList2 = node(b, node(a, empty()));
        composed = composeList(funcList2);
        assert(composed("x") === "xba");
    });
});
describe("composeFunctions", () => {
    // Tests for composeFunctions go here
    it("should return an array with only the input", () => {
        const funcs = [];
        const composed = composeFunctions(funcs);
        assert.deepStrictEqual(composed(5), [5]);
        assert.deepStrictEqual(composed(10), [10]);
    });
    it("should handle functions that do nothing", () => {
        const identity = (x) => x;
        const funcs = [identity, identity, identity];
        const composed = composeFunctions(funcs);
        assert.deepStrictEqual(composed(10), [10, 10, 10, 10]);
    });
    it("should apply a single function correctly", () => {
        const addFour = (x) => x + 4;
        const funcs = [addFour];
        const composed = composeFunctions(funcs);
        assert.deepStrictEqual(composed(3), [3, 7]);
    });
    it("should compose multiple functions in order", () => {
        const addSeven = (x) => x + 7;
        const multiplyTwo = (x) => x * 2;
        const funcs = [addSeven, multiplyTwo];
        const composed = composeFunctions(funcs);
        assert.deepStrictEqual(composed(4), [4, 11, 22]);
    });
    it("should handle a mix of increasing and decreasing functions", () => {
        const addSeven = (x) => x + 7;
        const subtractTwo = (x) => x - 2;
        const funcs = [addSeven, subtractTwo, addSeven, subtractTwo];
        const composed = composeFunctions(funcs);
        assert.deepStrictEqual(composed(5), [5, 12, 10, 17, 15]);
    });
    it("should respect function order", () => {
        const multiplyTwo = (x) => x * 2;
        const addSeven = (x) => x + 7;
        const funcs = [multiplyTwo, addSeven];
        const composed = composeFunctions(funcs);
        assert.deepStrictEqual(composed(4), [4, 8, 15]);
    });
    it("should work with non-number types", () => {
        const a = (s) => s + "a";
        const b = (s) => s + "b";
        const funcs1 = [a, b];
        let composed = composeFunctions(funcs1);
        assert.deepStrictEqual(composed("x"), ["x", "xa", "xab"]);
        const funcs2 = [b, a];
        composed = composeFunctions(funcs2);
        assert.deepStrictEqual(composed("x"), ["x", "xb", "xba"]);
    });
});
describe("composeBinary", () => {
    // Tests for composeBinary go here
    it("should return the identity function", () => {
        const composed = composeBinary([]);
        assert(composed(4)(3) === 3);
        assert(composed(10)(5) === 5);
    });
    it("should apply a single binary function correctly", () => {
        const add = (x, y) => x + y;
        const composed = composeBinary([add]);
        assert(composed(4)(3) === 7);
    });
    it("should compose multiple functions in order", () => {
        const add = (x, y) => x + y;
        const multiply = (x, y) => x * y;
        const composed = composeBinary([add, multiply]);
        assert(composed(2)(3) === 10);
    });
    it("should handle a mix of addition and subtraction functions", () => {
        const add = (x, y) => x + y;
        const subtract = (x, y) => x - y;
        const composed = composeBinary([add, subtract]);
        assert.strictEqual(composed(2)(5), 5);
    });
    it("should handle multiplication followed by modulo operation", () => {
        const multiply = (x, y) => x * y;
        const modulo = (x, y) => x % y;
        const composed = composeBinary([multiply, modulo]);
        assert.strictEqual(composed(5)(4), 0);
    });
    it("should respect function order", () => {
        const multiply = (x, y) => x * y;
        const add = (x, y) => x + y;
        const composed = composeBinary([multiply, add]);
        assert(composed(2)(3) === 8);
    });
    it("should work with non-number types", () => {
        const concat = (x, y) => x + y;
        const composed1 = composeBinary([concat]);
        assert(composed1("a")("x") === "xa");
        const composed2 = composeBinary([concat, concat]);
        assert(composed2("a")("x") === "xaa");
    });
});
describe("enumRatios", () => {
    //Tests for enumRatios go here
    it("should correctly generate fractions", () => {
        const nextRatio = enumRatios();
        assert(nextRatio() === 1 / 1);
        assert(nextRatio() === 2 / 1);
        assert(nextRatio() === 1 / 2);
        assert(nextRatio() === 3 / 1);
        assert(nextRatio() === 1 / 3);
    });
    it("should correctly generate at least 15 fractions", () => {
        const nextRatio = enumRatios();
        const results = [];
        for (let i = 0; i < 15; i++) {
            results.push(nextRatio());
        }
        assert(results.length === 15);
    });
    it("should correctly avoid duplicates", () => {
        const nextRatio = enumRatios();
        const expected = [1 / 1, 2 / 1, 1 / 2, 3 / 1, 1 / 3];
        for (const fraction of expected) {
            assert(nextRatio() === fraction);
        }
    });
    it("should handle the case where gcd is already 1", () => {
        const iter = enumRatios();
        assert.strictEqual(iter(), 1 / 1);
        assert.strictEqual(iter(), 2 / 1);
        assert.strictEqual(iter(), 1 / 2);
        assert.strictEqual(iter(), 3 / 1);
    });
    it("should correctly increment total when n reaches 0", () => {
        const iter = enumRatios();
        let lastValue = 0;
        for (let i = 0; i < 100; i++) {
            lastValue = iter();
        }
        assert(lastValue > 0);
    });
    it("should correctly handle large fractions without breaking", () => {
        const iter = enumRatios();
        let last = 0;
        for (let i = 0; i < 100; i++) {
            last = iter();
        }
        assert(last > 0 && last < 1);
    });
});
describe("cycleArr", () => {
    // Tests for cycleArr go here
    it("should iterate in cycled order for numeric arrays", () => {
        const arr = [
            [1, 2, 3],
            [4, 5],
            [6, 7, 8, 9],
        ];
        const iter = cycleArr(arr);
        const result = [];
        while (iter.hasNext()) {
            result.push(iter.next());
        }
        assert.deepStrictEqual(result, [1, 4, 6, 2, 5, 7, 3, 8, 9]);
    });
    it("should iterate in cycled order for string arrays", () => {
        const arr = [["a", "b"], ["c"], ["d", "e", "f"]];
        const iter = cycleArr(arr);
        const result = [];
        while (iter.hasNext()) {
            result.push(iter.next());
        }
        assert.deepStrictEqual(result, ["a", "c", "d", "b", "e", "f"]);
    });
    it("should handle an empty array of arrays", () => {
        const arr = [];
        const iter = cycleArr(arr);
        assert(!iter.hasNext());
    });
    it("should handle arrays with empty subarrays", () => {
        const arr = [[], [], []];
        const iter = cycleArr(arr);
        assert(!iter.hasNext());
    });
    it("should throw an error when next() is called after exhaustion", () => {
        const arr = [[1, 2], [3], [4, 5]];
        const iter = cycleArr(arr);
        while (iter.hasNext()) {
            iter.next();
        }
        assert.throws(() => iter.next(), /Exhausted/);
    });
    it("should work with arrays containing only one row", () => {
        const arr = [[1, 2, 3]];
        const iter = cycleArr(arr);
        const result = [];
        while (iter.hasNext())
            result.push(iter.next());
        assert.deepStrictEqual(result, [1, 2, 3]);
    });
    it("should work with a single empty row", () => {
        const arr = [[]];
        const iter = cycleArr(arr);
        assert(!iter.hasNext());
    });
});
describe("dovetail", () => {
    // Tests for dovetail go here
    describe("dovetail", () => {
        it("should iterate in dovetail order for numeric lists", () => {
            const list1 = arrayToList([1, 2, 3]);
            const list2 = arrayToList([4, 5]);
            const list3 = arrayToList([6, 7, 8, 9]);
            const lists = [list1, list2, list3];
            const iter = dovetail(lists);
            const result = [];
            while (iter.hasNext()) {
                result.push(iter.next());
            }
            assert.deepStrictEqual(result, [1, 2, 4, 3, 5, 6, 7, 8, 9]);
        });
        it("should iterate in dovetail order for string lists", () => {
            const list1 = arrayToList(["a", "b"]);
            const list2 = arrayToList(["c"]);
            const list3 = arrayToList(["d", "e", "f"]);
            const lists = [list1, list2, list3];
            const iter = dovetail(lists);
            const result = [];
            while (iter.hasNext()) {
                result.push(iter.next());
            }
            assert.deepStrictEqual(result, ["a", "b", "c", "d", "e", "f"]);
        });
        it("should handle an empty list of lists", () => {
            const lists = [];
            const iter = dovetail(lists);
            assert(!iter.hasNext());
        });
        it("should handle lists with only empty sublists", () => {
            const lists = [empty(), empty(), empty()];
            const iter = dovetail(lists);
            assert(!iter.hasNext());
        });
        it("should handle a single non-empty list", () => {
            const list1 = arrayToList([1, 2, 3]);
            const lists = [list1];
            const iter = dovetail(lists);
            const result = [];
            while (iter.hasNext()) {
                result.push(iter.next());
            }
            assert.deepStrictEqual(result, [1, 2, 3]);
        });
        it("should correctly dovetail when all lists have only one element", () => {
            const list1 = arrayToList([1]);
            const list2 = arrayToList([2]);
            const list3 = arrayToList([3]);
            const lists = [list1, list2, list3];
            const iter = dovetail(lists);
            const result = [];
            while (iter.hasNext())
                result.push(iter.next());
            assert.deepStrictEqual(result, [1, 2, 3]);
        });
        it("should correctly dovetail when lists have large differences in length", () => {
            const list1 = arrayToList([1]);
            const list2 = arrayToList([2, 3, 4, 5, 6]);
            const list3 = arrayToList([7, 8]);
            const lists = [list1, list2, list3];
            const iter = dovetail(lists);
            const result = [];
            while (iter.hasNext())
                result.push(iter.next());
            assert.deepStrictEqual(result, [1, 2, 7, 3, 8, 4, 5, 6]);
        });
        it("should handle lists with different lengths", () => {
            const list1 = arrayToList([1, 2]);
            const list2 = arrayToList([3, 4, 5, 6]);
            const list3 = arrayToList([7]);
            const lists = [list1, list2, list3];
            const iter = dovetail(lists);
            const result = [];
            while (iter.hasNext()) {
                result.push(iter.next());
            }
            assert.deepStrictEqual(result, [1, 2, 3, 4, 7, 5, 6]);
        });
    });
});
//# sourceMappingURL=closures-iterators.test.js.map