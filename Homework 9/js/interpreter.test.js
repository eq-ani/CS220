import { parseExpression, parseProgram } from "../include/parser.js";
import { PARENT_STATE_KEY, interpExpression, interpStatement, interpProgram, } from "./interpreter.js";
// Helper to capture console.log output
const captureLogs = (fn) => {
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args);
    try {
        fn();
    }
    finally {
        console.log = originalLog;
    }
    return logs;
};
function expectExprToBe(src, expected) {
    const ast = parseExpression(src);
    expect(interpExpression({}, ast)).toEqual(expected);
}
function expectStmtToTransform(src, before, after) {
    const [stmt] = parseProgram(src);
    const state = { ...before };
    interpStatement(state, stmt);
    expect(state).toEqual(after);
}
function expectStateToBe(program, expected) {
    expect(interpProgram(parseProgram(program))).toEqual(expected);
}
// Expression evaluation tests
describe("interpExpression", () => {
    it("handles literals and variable lookup", () => {
        expectExprToBe("42", 42);
        expectExprToBe("true", true);
        expectExprToBe("false", false);
        const parent = { x: 1 };
        const child = { [PARENT_STATE_KEY]: parent, y: 2 };
        expect(interpExpression(child, parseExpression("x"))).toBe(1);
        expect(interpExpression(child, parseExpression("y"))).toBe(2);
    });
    it("evaluates arithmetic and mixed variable operations", () => {
        expectExprToBe("1 + 2", 3);
        expectExprToBe("5 - 3", 2);
        expectExprToBe("2 * 3", 6);
        expectExprToBe("8 / 2", 4);
        const st = { x: 3, y: 2 };
        expect(interpExpression(st, parseExpression("x * y + 1"))).toEqual(7);
    });
    it("throws on invalid arithmetic", () => {
        expect(() => interpExpression({}, parseExpression("true + 1"))).toThrow();
        expect(() => interpExpression({}, parseExpression("1 * false"))).toThrow();
        expect(() => interpExpression({}, parseExpression("1 / 0"))).toThrow();
    });
    it("evaluates comparisons and strict equality", () => {
        expectExprToBe("2 < 3", true);
        expectExprToBe("3 > 5", false);
        expect(() => interpExpression({}, parseExpression("true < false"))).toThrow();
        expectExprToBe("1 === 1", true);
        expectExprToBe("1 === 2", false);
        expectExprToBe("true === true", true);
        expectExprToBe("false === true", false);
        expectExprToBe("1 === true", false);
    });
    it("evaluates logical operators with short-circuit and type checks", () => {
        expectExprToBe("false && (1 / 0 === 0)", false);
        expectExprToBe("true && false", false);
        expectExprToBe("true && true", true);
        expect(() => interpExpression({}, parseExpression("1 && true"))).toThrow();
        expect(() => interpExpression({}, parseExpression("true && 1"))).toThrow();
        expectExprToBe("true || (1 / 0 === 0)", true);
        expectExprToBe("false || true", true);
        expectExprToBe("false || false", false);
        expect(() => interpExpression({}, parseExpression("false || 1"))).toThrow();
        expect(() => interpExpression({}, parseExpression("1 || true"))).toThrow();
        expectExprToBe("true || 0", true);
    });
    it("throws on undefined variables", () => {
        expect(() => interpExpression({}, parseExpression("z"))).toThrow();
    });
});
// Statement execution tests
describe("interpStatement", () => {
    it("handles declarations, assignments, and scope resolution", () => {
        expectStmtToTransform("let x = 3;", {}, { x: 3 });
        expect(() => interpStatement({ x: 1 }, parseProgram("let x = 2;")[0])).toThrow();
        expectStmtToTransform("x = 5;", { x: 1 }, { x: 5 });
        const parent = { x: 1 };
        const child = { [PARENT_STATE_KEY]: parent };
        interpStatement(child, parseProgram("x = 7;")[0]);
        expect(parent.x).toBe(7);
        expect(() => interpStatement({}, parseProgram("y = 10;")[0])).toThrow();
    });
    it("prints expressions via console.log", () => {
        const logs = captureLogs(() => interpStatement({}, parseProgram("print(2 + 3);")[0]));
        expect(logs).toEqual([[5]]);
    });
    it("executes if/else blocks without leaking scope", () => {
        expectStmtToTransform("if (true) { let b = 1; a = b; } else { a = 2; }", { a: 0 }, { a: 1 });
        expectStmtToTransform("if (false) { a = 1; } else { let b = 2; a = b; }", { a: 0 }, { a: 2 });
    });
    it("executes while loops correctly without scope pollution", () => {
        const state = { i: 0, sum: 0 };
        interpStatement(state, parseProgram("while (i < 3) { sum = sum + i; i = i + 1; }")[0]);
        expect(state).toEqual({ i: 3, sum: 3 });
        const emptyState = {};
        interpStatement(emptyState, parseProgram("while (false) { let x = 1; }")[0]);
        expect(emptyState).not.toHaveProperty("x");
    });
    it("allows inner shadowing without mutating outer variable", () => {
        const before = { x: 1 };
        expectStmtToTransform("if (true) { let x = 2; x = 3; } else { }", before, { x: 1 });
    });
});
// Program-level integration tests
describe("interpProgram", () => {
    it("executes sequences and returns final state", () => {
        expectStateToBe(`
      let x = 10;
      x = 20;
    `, { x: 20 });
        expect(() => expectStateToBe("let x = 1; let x = 2;", {})).toThrow();
        expect(() => expectStateToBe("x = 1;", {})).toThrow();
    });
    it("supports print in programs", () => {
        const logs = captureLogs(() => interpProgram(parseProgram("print(3 + 4);")));
        expect(logs).toEqual([[7]]);
    });
    it("maintains proper block scoping for if/while", () => {
        expectStateToBe(`
      let a = 5;
      if (a > 0) { let b = 1; } else { let b = 2; }
      `, { a: 5 });
        expectStateToBe(`
      let i = 0;
      let sum = 0;
      while (i < 3) {
        let temp = i;
        sum = sum + temp;
        i = i + 1;
      }
      `, { i: 3, sum: 3 });
    });
    it("shadows and prints inner variables correctly in programs", () => {
        const logs = captureLogs(() => interpProgram(parseProgram(`
        let x = 1;
        if (true) {
          let x = 2;
          print(x);
        } else {}
      `)));
        expect(logs).toEqual([[2]]);
    });
});
//# sourceMappingURL=interpreter.test.js.map