import assert from "assert";
import { node, empty, listToArray, arrayToList } from "../include/lists.js";
// listToArray and arrayToList are provided for your testing convenience only.
import { insertOrdered, everyNRev, everyNCond, keepTrendMiddles, keepLocalMaxima, keepLocalMinima, keepLocalMinimaAndMaxima, nonNegativeProducts, negativeProducts, deleteFirst, deleteLast, squashList, } from "./lists.js";
function arrayeq(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    return arr1.every((value, index) => value === arr2[index]);
}
describe("insertOrdered", () => {
    // Tests for insertOrdered go here
    it("should return a different list", () => {
        const lst = arrayToList([]);
        const result = insertOrdered(lst, 1);
        assert(result !== lst);
    });
    it("should work on an empty list", () => {
        const lst = arrayToList([]);
        const result = insertOrdered(lst, 1);
        assert(arrayeq(listToArray(result), [1]));
    });
    it("should insert an element that is less than the head", () => {
        const lst = arrayToList([2, 3, 4]);
        const result = insertOrdered(lst, 1);
        assert(arrayeq(listToArray(result), [1, 2, 3, 4]));
    });
    it("should insert elements in sorted order", () => {
        const lst = arrayToList([1, 3, 5]);
        const result = insertOrdered(lst, 4);
        assert(arrayeq(listToArray(result), [1, 3, 4, 5]));
    });
});
describe("everyNRev", () => {
    // Tests for everyNRev go here
    it("should return a different list", () => {
        const lst = arrayToList([]);
        const result = everyNRev(lst, 1);
        assert(result !== lst);
    });
    it("should return an empty list (every 0th element", () => {
        const lst = arrayToList([1, 2, 3]);
        const result = everyNRev(lst, 0);
        assert(arrayeq(listToArray(result), []));
    });
    it("should only reverse the list", () => {
        const lst = arrayToList([1, 2, 3]);
        const result = everyNRev(lst, 1);
        assert(arrayeq(listToArray(result), [3, 2, 1]));
    });
    it("should return every third element in reverse", () => {
        const lst = arrayToList([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const result = everyNRev(lst, 3);
        assert(arrayeq(listToArray(result), [9, 6, 3]));
    });
    it("should return every 8th element in reverse (2)", () => {
        let lst = empty();
        for (let i = 16; i >= 1; i--) {
            lst = node(i, lst);
        }
        const result = everyNRev(lst, 8);
        assert(arrayeq(listToArray(result), [16, 8]));
    });
});
describe("everyNCond", () => {
    // Tests for everyNCond go here
    it("should return a different list", () => {
        const lst = arrayToList([]);
        const result = everyNCond(lst, 1, () => true);
        assert(result !== lst);
    });
    it("should apply the condition correctly", () => {
        const lst = arrayToList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const result = everyNCond(lst, 4, x => x % 2 === 0);
        assert(arrayeq(listToArray(result), [8]));
    });
    it("should not be reversed", () => {
        const lst = arrayToList(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
        const result = everyNCond(lst, 1, x => x === "a" || x === "e" || x === "i");
        assert(arrayeq(listToArray(result), ["a", "e", "i"]));
    });
    it("should return an empty list when n > valid elements", () => {
        const lst = arrayToList([1, 2, 3, 4, 5]);
        const result = everyNCond(lst, 3, x => x % 2 === 0);
        assert(arrayeq(listToArray(result), []));
    });
});
describe("keepTrendMiddles", () => {
    // Tests for keepTrendMiddles go here
    it("should return a different list", () => {
        const lst = arrayToList([1, 3, 2, 4, 5, 6, 4]);
        const result = keepTrendMiddles(lst, (prev, curr, next) => prev < curr && next < curr);
        assert(result !== lst);
    });
    it("should return an empty list if there are not enough elements", () => {
        const emptyList = empty();
        const singleElementList = arrayToList([1]);
        const twoElementList = arrayToList([1, 2]);
        const result1 = keepTrendMiddles(emptyList, (prev, curr, next) => prev < curr && next < curr);
        const result2 = keepTrendMiddles(singleElementList, (prev, curr, next) => prev < curr && next < curr);
        const result3 = keepTrendMiddles(twoElementList, (prev, curr, next) => prev < curr && next < curr);
        assert(result1.isEmpty());
        assert(result2.isEmpty());
        assert(result3.isEmpty());
    });
    it("should keep only local maxima", () => {
        const lst = arrayToList([1, 3, 2, 4, 5, 6, 4, 8, 7]);
        const result = keepTrendMiddles(lst, (prev, curr, next) => prev < curr && next < curr);
        assert(arrayeq(listToArray(result), [3, 6, 8]));
    });
    it("should keep only local minima", () => {
        const lst = arrayToList([5, 3, 6, 2, 7, 8, 1, 4]);
        const result = keepTrendMiddles(lst, (prev, curr, next) => prev > curr && next > curr);
        assert(arrayeq(listToArray(result), [3, 2, 1]));
    });
});
describe("keepLocalMaxima", () => {
    //Tests for keepLocalMaxima go here
    it("should return a different list", () => {
        const lst = arrayToList([1, 3, 2, 4, 5, 6, 4]);
        const result = keepLocalMaxima(lst);
        assert(result !== lst);
    });
    it("should return an empty list", () => {
        const lst = arrayToList([1, 2, 3, 4, 5, 6]);
        const result = keepLocalMaxima(lst);
        assert(result.isEmpty());
    });
    it("should return local maxima", () => {
        const lst = arrayToList([1, 3, 2, 4, 5, 6, 4, 8, 7]);
        const result = keepLocalMaxima(lst);
        assert(arrayeq(listToArray(result), [3, 6, 8]));
    });
    it("should return local maxima (negative numbers)", () => {
        const lst = arrayToList([-5, -3, -4, -2, -1, -6, -3]);
        const result = keepLocalMaxima(lst);
        assert(arrayeq(listToArray(result), [-3, -1]));
    });
    it("should return local maxima (duplicates)", () => {
        const lst = arrayToList([1, 2, 2, 1, 3, 1]);
        const result = keepLocalMaxima(lst);
        assert(arrayeq(listToArray(result), [3]));
    });
    it("should return local maxima (3 duplicates so no maxima)", () => {
        const lst = arrayToList([1, 2, 2, 2, 1]);
        const result = keepLocalMaxima(lst);
        assert(arrayeq(listToArray(result), []));
    });
});
describe("keepLocalMinima", () => {
    // Tests for keepLocalMinima go here
    it("should return a different list", () => {
        const lst = arrayToList([1, 3, 2, 4, 5, 6, 4]);
        const result = keepLocalMinima(lst);
        assert(result !== lst);
    });
    it("should return an empty list", () => {
        const lst = arrayToList([6, 5, 4, 3, 2, 1]);
        const result = keepLocalMinima(lst);
        assert(result.isEmpty());
    });
    it("should return local minima", () => {
        const lst = arrayToList([5, 3, 6, 2, 7, 8, 1, 4]);
        const result = keepLocalMinima(lst);
        assert(arrayeq(listToArray(result), [3, 2, 1]));
    });
    it("should return local minima (negative)", () => {
        const lst = arrayToList([-10, -1, -9, -1, -10, -1]);
        const result = keepLocalMinima(lst);
        assert(arrayeq(listToArray(result), [-9, -10]));
    });
    it("should return local minima (duplicates)", () => {
        const lst = arrayToList([3, 2, 1, 1, 2, 3, 1, 3]);
        const result = keepLocalMinima(lst);
        assert(arrayeq(listToArray(result), [1]));
    });
});
describe("keepLocalMinimaAndMaxima", () => {
    // Tests for keepLocalMinimaAndMaxima go here
    it("should return an empty list", () => {
        const lst = arrayToList([1, 1, 1, 1, 1, 1]);
        const result = keepLocalMinimaAndMaxima(lst);
        assert(result.isEmpty());
    });
    it("should return local minima (only minima exist)", () => {
        const lst = arrayToList([7, 5, 6, 9]);
        const result = keepLocalMinimaAndMaxima(lst);
        assert(arrayeq(listToArray(result), [5]));
    });
    it("should return local maxima (only maxima exist)", () => {
        const lst = arrayToList([3, 8, 7]);
        const result = keepLocalMinimaAndMaxima(lst);
        assert(arrayeq(listToArray(result), [8]));
    });
    it("should return local maxima and minima", () => {
        const lst = arrayToList([2, 1, 3, 7, 2, 8, 4, 6, 6]);
        const result = keepLocalMinimaAndMaxima(lst);
        assert(arrayeq(listToArray(result), [1, 7, 2, 8, 4]));
    });
    it("should return local maxima and minima (duplicates)", () => {
        const list = arrayToList([3, 2, 1, 1, 2, 3, 1, 3]);
        const result = keepLocalMinimaAndMaxima(list);
        assert(arrayeq(listToArray(result), [3, 1]));
    });
});
describe("nonNegativeProducts", () => {
    //Tests for nonNegativeProducts go here
    it("should return a different list", () => {
        const lst = arrayToList([1, 3, 2, 4, 5, 6, 4]);
        const result = nonNegativeProducts(lst);
        assert(result !== lst);
    });
    it("should return an empty list for an empty lst", () => {
        const lst = empty();
        const result = nonNegativeProducts(lst);
        assert(result.isEmpty());
    });
    it("should handle lists with all negative numbers", () => {
        const lst = arrayToList([-1, -2, -3]);
        const result = nonNegativeProducts(lst);
        assert(result.isEmpty());
    });
    it("should handle varied numbers", () => {
        const lst = arrayToList([2, 3, -1, 0.5, 2]);
        const result = nonNegativeProducts(lst);
        assert(arrayeq(listToArray(result), [2, 6, 0.5, 1]));
    });
    it("should handle lists with all nonnegative numbers", () => {
        const lst = arrayToList([1, 2, 3, 4]);
        const result = nonNegativeProducts(lst);
        assert(arrayeq(listToArray(result), [1, 2, 6, 24]));
    });
    it("should handle lists containing zeroes correctly", () => {
        const lst = arrayToList([0, 1, 2, 3, 0, 4, 5]);
        const result = nonNegativeProducts(lst);
        assert(arrayeq(listToArray(result), [0, 0, 0, 0, 0, 0, 0]));
    });
    it("should handle lists with a single nonnegative element", () => {
        const lst = arrayToList([3]);
        const result = nonNegativeProducts(lst);
        assert(arrayeq(listToArray(result), [3]));
    });
    it("should return an empty list for a single negative element", () => {
        const lst = arrayToList([-3]);
        const result = nonNegativeProducts(lst);
        assert(result.isEmpty());
    });
    it("should handle lists where negatives appear at the start and end", () => {
        const lst = arrayToList([-1, 2, 3, -4]);
        const result = nonNegativeProducts(lst);
        assert(arrayeq(listToArray(result), [2, 6]));
    });
    it("should handle alternating negative and nonnegative values", () => {
        const lst = arrayToList([1, -1, 2, -2, 3, -3, 4]);
        const result = nonNegativeProducts(lst);
        assert(arrayeq(listToArray(result), [1, 2, 3, 4]));
    });
    it("should handle a list of all zeros", () => {
        const lst = arrayToList([0, 0, 0]);
        const result = nonNegativeProducts(lst);
        assert(arrayeq(listToArray(result), [0, 0, 0]));
    });
    it("should handle multiple 0's correctly", () => {
        const lst = arrayToList([1, 2, 0, -3, 4, 0, 5]);
        const result = nonNegativeProducts(lst);
        assert(arrayeq(listToArray(result), [1, 2, 0, 4, 0, 0]));
    });
    it("should handle a leading 0 correctly", () => {
        const lst = arrayToList([0, 3, 4]);
        const result = nonNegativeProducts(lst);
        assert(arrayeq(listToArray(result), [0, 0, 0]));
    });
});
describe("negativeProducts", () => {
    // Tests for nonNegativeProducts go here
    it("should return a different list", () => {
        const lst = arrayToList([1, 3, 2, 4, 5, 6, 4]);
        const result = negativeProducts(lst);
        assert(result !== lst);
    });
    it("should handle an empty list", () => {
        const lst = empty();
        const result = negativeProducts(lst);
        assert(result.isEmpty());
    });
    it("should handle lists with all non-negative numbers", () => {
        const lst = arrayToList([1, 2, 3]);
        const result = negativeProducts(lst);
        assert(result.isEmpty());
    });
    it("should handle varied numbers", () => {
        const lst = arrayToList([-3, -6, 2, -2, -1, -2]);
        const result = negativeProducts(lst);
        assert(arrayeq(listToArray(result), [-3, 18, -2, 2, -4]));
    });
    it("should handle lists with all negative numbers", () => {
        const lst = arrayToList([-1, -2, -3, -4]);
        const result = negativeProducts(lst);
        assert(arrayeq(listToArray(result), [-1, 2, -6, 24]));
    });
    it("should handle lists containing zeroes correctly", () => {
        const lst = arrayToList([0, -1, -2, -3, 0, -4, -5]);
        const result = negativeProducts(lst);
        assert(arrayeq(listToArray(result), [-1, 2, -6, -4, 20]));
    });
    it("should handle lists with a single negative element", () => {
        const lst = arrayToList([-3]);
        const result = negativeProducts(lst);
        assert(arrayeq(listToArray(result), [-3]));
    });
    it("should return an empty list for a single nonnegative element", () => {
        const lst = arrayToList([3]);
        const result = negativeProducts(lst);
        assert(result.isEmpty());
    });
    it("should handle lists where negatives appear at the start and end", () => {
        const lst = arrayToList([-1, -2, 3, -4, -5]);
        const result = negativeProducts(lst);
        assert(arrayeq(listToArray(result), [-1, 2, -4, 20]));
    });
    it("should handle alternating negative and nonnegative values", () => {
        const lst = arrayToList([-1, 2, -2, 3, -3, 4, -4]);
        const result = negativeProducts(lst);
        assert(arrayeq(listToArray(result), [-1, -2, -3, -4]));
    });
    it("should return an empty list for all-zero lst", () => {
        const lst = arrayToList([0, 0, 0]);
        const result = negativeProducts(lst);
        assert(result.isEmpty());
    });
    it("should handle multiple 0s correctly", () => {
        const lst = arrayToList([-1, -2, 0, 3, -4, 0, -5]);
        const result = negativeProducts(lst);
        assert(arrayeq(listToArray(result), [-1, 2, -4, -5]));
    });
});
describe("deleteFirst", () => {
    // Tests for deleteFirst go here
    it("should return a different list", () => {
        const lst = arrayToList([1, 2, 3, 4]);
        const result = deleteFirst(lst, 2);
        assert(result !== lst);
    });
    it("should remove the first occurrence of a value", () => {
        const lst = arrayToList([1, 2, 3, 4]);
        const result = deleteFirst(lst, 2);
        assert(arrayeq(listToArray(result), [1, 3, 4]));
    });
    it("should remove the first occurrence even if repeated", () => {
        const lst = arrayToList([1, 2, 3, 2, 4]);
        const result = deleteFirst(lst, 2);
        assert(arrayeq(listToArray(result), [1, 3, 2, 4]));
    });
    it("should remove the head if it matches", () => {
        const lst = arrayToList([5, 6, 7, 8]);
        const result = deleteFirst(lst, 5);
        assert(arrayeq(listToArray(result), [6, 7, 8]));
    });
    it("should return the same list if value is not present", () => {
        const lst = arrayToList([1, 3, 5, 7]);
        const result = deleteFirst(lst, 4);
        assert(arrayeq(listToArray(result), [1, 3, 5, 7]));
    });
    it("should handle an empty list", () => {
        const lst = empty();
        const result = deleteFirst(lst, 1);
        assert(result.isEmpty());
    });
    it("should handle a single-element list (removal)", () => {
        const lst = arrayToList([10]);
        const result = deleteFirst(lst, 10);
        assert(result.isEmpty());
    });
    it("should handle a single-element list (no removal)", () => {
        const lst = arrayToList([10]);
        const result = deleteFirst(lst, 5);
        assert(arrayeq(listToArray(result), [10]));
    });
});
describe("deleteLast", () => {
    // Tests for deleteLast go here
    it("should return a different list", () => {
        const lst = arrayToList([1, 2, 3, 4]);
        const result = deleteLast(lst, 2);
        assert(result !== lst);
    });
    it("should remove the last occurrence of a value", () => {
        const lst = arrayToList([1, 2, 3, 2, 4]);
        const result = deleteLast(lst, 2);
        assert(arrayeq(listToArray(result), [1, 2, 3, 4]));
    });
    it("should remove the tail if it matches", () => {
        const lst = arrayToList([5, 6, 7, 8]);
        const result = deleteLast(lst, 8);
        assert(arrayeq(listToArray(result), [5, 6, 7]));
    });
    it("should return the same list if value is not present", () => {
        const lst = arrayToList([1, 3, 5, 7]);
        const result = deleteLast(lst, 4);
        assert(arrayeq(listToArray(result), [1, 3, 5, 7]));
    });
    it("should handle an empty list", () => {
        const lst = empty();
        const result = deleteLast(lst, 1);
        assert(result.isEmpty());
    });
    it("should handle a single-element list (removal)", () => {
        const lst = arrayToList([10]);
        const result = deleteLast(lst, 10);
        assert(result.isEmpty());
    });
    it("should handle a single-element list (no removal)", () => {
        const lst = arrayToList([10]);
        const result = deleteLast(lst, 5);
        assert(arrayeq(listToArray(result), [10]));
    });
    it("should remove only the last occurrence when duplicates exist", () => {
        const lst = arrayToList([3, 1, 3, 5, 3, 7]);
        const result = deleteLast(lst, 3);
        assert(arrayeq(listToArray(result), [3, 1, 3, 5, 7]));
    });
    it("should remove the only element in a list with one occurrence", () => {
        const lst = arrayToList([4]);
        const result = deleteLast(lst, 4);
        assert(result.isEmpty());
    });
    it("should correctly remove the last occurrence from a long list", () => {
        const lst = arrayToList([1, 2, 3, 4, 5, 6, 3, 7, 8]);
        const result = deleteLast(lst, 3);
        assert(arrayeq(listToArray(result), [1, 2, 3, 4, 5, 6, 7, 8]));
    });
});
describe("squashList", () => {
    it("should return a different list", () => {
        const lst = arrayToList([1, arrayToList([2, 3]), 4]);
        const result = squashList(lst);
        assert(result !== lst);
    });
    it("should handle an empty list", () => {
        // Tests for squashList go here
        const lst = empty();
        const result = squashList(lst);
        assert(result.isEmpty());
    });
    it("should handle a list with only numbers", () => {
        const lst = arrayToList([1, 2, 3, 4, 5]);
        const result = squashList(lst);
        assert(arrayeq(listToArray(result), [1, 2, 3, 4, 5]));
    });
    it("should handle a list with a single inner list", () => {
        const lst = arrayToList([1, arrayToList([2, 3]), 4]);
        const result = squashList(lst);
        assert(arrayeq(listToArray(result), [1, 5, 4]));
    });
    it("should handle multiple inner lists", () => {
        const lst = arrayToList([arrayToList([1, 2, 3]), 4, arrayToList([5, 6, 7]), 8]);
        const result = squashList(lst);
        assert(arrayeq(listToArray(result), [6, 4, 18, 8]));
    });
    it("should handle nested empty lists", () => {
        const lst = arrayToList([1, arrayToList([]), 2, arrayToList([3, 4])]);
        const result = squashList(lst);
        assert(arrayeq(listToArray(result), [1, 0, 2, 7]));
    });
    it("should handle a list of only inner lists", () => {
        const lst = arrayToList([arrayToList([1, 2]), arrayToList([3, 4]), arrayToList([5, 6])]);
        const result = squashList(lst);
        assert(arrayeq(listToArray(result), [3, 7, 11]));
    });
    it("should handle an inner list with a single element", () => {
        const lst = arrayToList([1, arrayToList([2]), 3]);
        const result = squashList(lst);
        assert(arrayeq(listToArray(result), [1, 2, 3]));
    });
    it("should handle a mix of numbers and nested empty lists", () => {
        const lst = arrayToList([1, arrayToList([]), 2, arrayToList([]), 3]);
        const result = squashList(lst);
        assert(arrayeq(listToArray(result), [1, 0, 2, 0, 3]));
    });
    it("should correctly sum negative numbers in inner lists", () => {
        const lst = arrayToList([1, arrayToList([-2, -3]), 4]);
        const result = squashList(lst);
        assert(arrayeq(listToArray(result), [1, -5, 4]));
    });
});
//# sourceMappingURL=lists.test.js.map