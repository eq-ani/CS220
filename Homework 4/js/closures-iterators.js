export function composeList(lst) {
    return (n) => lst.reduce((curr, func) => func(curr), n);
}
export function composeFunctions(fns) {
    return (x) => {
        const result = [x];
        fns.map(fn => result.push(fn(result[result.length - 1])));
        return result;
    };
}
export function composeBinary(funArr) {
    return (a) => (x) => funArr.reduce((curr, func) => func(curr, a), x);
}
export function enumRatios() {
    let total = 2;
    let n = 1;
    return () => {
        let d = total - n;
        const gcd = (x, y) => (y ? gcd(y, x % y) : x);
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
export function cycleArr(arr) {
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
                }
                else {
                    y = 0;
                    x++;
                }
            }
            throw new Error("Exhausted");
        },
    };
}
function nextL(lists, start) {
    for (let i = start; i < lists.length; i++) {
        if (!lists[i].isEmpty()) {
            return i;
        }
    }
    return lists.length;
}
export function dovetail(lists) {
    let i = 0, accessed = 0, count = 1;
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
//# sourceMappingURL=closures-iterators.js.map