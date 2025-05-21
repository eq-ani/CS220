import { from } from "../include/stream.js";
import { addSeries } from "./series.js";
function computeNTimes(s, n) {
    for (let i = 0; i < n && !s.isEmpty(); i++) {
        s = s.tail();
    }
}
function debug(s, depth = 5) {
    if (s.isEmpty())
        return `sempty`;
    return depth <= 0 ? `...` : `${s.head()} -> ${debug(s.tail(), depth - 1)}`;
}
const a = from(0);
const b = from(0);
const c = addSeries(a, b);
computeNTimes(a, 5);
computeNTimes(b, 5);
computeNTimes(c, 5);
console.log(`(${debug(a)}) + (${debug(b)}) = ${debug(c)}`);
//# sourceMappingURL=main.js.map