import { node, empty, reverseList } from "../include/lists.js";
export function insertOrdered(lst, el) {
    if (lst.isEmpty()) {
        return node(el, empty());
    }
    if (el <= lst.head()) {
        return node(el, lst);
    }
    return node(lst.head(), insertOrdered(lst.tail(), el));
}
export function everyNRev(lst, n) {
    let i = 0;
    return lst.reduce((curr, val) => {
        if (i % n === n - 1) {
            curr = node(val, curr);
        }
        i++;
        return curr;
    }, empty());
}
export function everyNCond(lst, n, cond) {
    const retlist = lst.filter(cond);
    return reverseList(everyNRev(retlist, n));
}
export function keepTrendMiddles(lst, allSatisfy) {
    if (lst.isEmpty() || lst.tail().isEmpty() || lst.tail().tail().isEmpty()) {
        return empty();
    }
    let result = empty();
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
export function keepLocalMaxima(lst) {
    return keepTrendMiddles(lst, (prev, curr, next) => prev < curr && curr > next);
}
export function keepLocalMinima(lst) {
    return keepTrendMiddles(lst, (prev, curr, next) => prev > curr && curr < next);
}
export function keepLocalMinimaAndMaxima(lst) {
    return keepTrendMiddles(lst, (prev, curr, next) => (prev > curr && curr < next) || (prev < curr && curr > next));
}
function computeProducts(lst, valid) {
    let product = 1;
    return reverseList(lst.reduce((curr, val) => (valid(val) ? node((product *= val), curr) : ((product = 1), curr)), empty()));
}
export function nonNegativeProducts(lst) {
    return computeProducts(lst, num => num >= 0);
}
export function negativeProducts(lst) {
    return computeProducts(lst, num => num < 0);
}
export function deleteFirst(lst, val) {
    if (lst.isEmpty()) {
        return empty();
    }
    return lst.head() === val ? lst.tail() : node(lst.head(), deleteFirst(lst.tail(), val));
}
export function deleteLast(lst, val) {
    if (lst.isEmpty()) {
        return empty();
    }
    return reverseList(deleteFirst(reverseList(lst), val));
}
export function squashList(lst) {
    const list = lst.reduce((curr, val) => {
        if (typeof val === "number") {
            return node(val, curr);
        }
        else {
            const sum = val.reduce((sum, num) => sum + num, 0);
            return node(sum, curr);
        }
    }, empty());
    return reverseList(list);
}
//# sourceMappingURL=lists.js.map