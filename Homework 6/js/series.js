import { sempty, snode } from "../include/stream.js";
export function addSeries(s, t) {
    if (t.isEmpty())
        return s;
    else if (s.isEmpty())
        return t;
    else {
        const head = t.head() + s.head();
        const tail = () => addSeries(t.tail(), s.tail());
        return snode(head, tail);
    }
}
export function prodSeries(s, t) {
    if (s.isEmpty() || t.isEmpty()) {
        return sempty();
    }
    const tX = t.map(x => x * s.head());
    const prod = snode(0, () => prodSeries(s.tail(), t));
    return addSeries(tX, prod);
}
export function derivSeries(s) {
    if (s.tail().isEmpty()) {
        return snode(0, () => sempty());
    }
    function deriv(s, x) {
        if (s.tail().isEmpty()) {
            return snode(s.head() * x, () => sempty());
        }
        return snode(s.head() * x, () => deriv(s.tail(), x + 1));
    }
    return deriv(s.tail(), 1);
}
export function coeff(s, n) {
    const ret = [];
    let curr = s;
    while (ret.length <= n && !curr.isEmpty()) {
        ret.push(curr.head());
        curr = curr.tail();
    }
    return ret;
}
export function evalSeries(s, n) {
    const coS = coeff(s, n);
    return (x) => {
        let total = 0, pow = 1;
        for (let i = 0; i < coS.length; i++) {
            total += coS[i] * pow;
            pow *= x;
        }
        return total;
    };
}
export function applySeries(f, v) {
    return snode(v, () => applySeries(f, f(v)));
}
export function expSeries() {
    let num = 0;
    return applySeries(x => {
        num++;
        return x / num;
    }, 1);
}
export function recurSeries(coef, init) {
    function func(arr) {
        const next = arr.reduce((acc, v, i) => acc + coef[i] * v, 0);
        const arr2 = arr.slice(1).concat([next]);
        return snode(arr[0], () => func(arr2));
    }
    return func(init);
}
//# sourceMappingURL=series.js.map