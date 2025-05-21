import { Expression, Statement } from "../include/parser.js";

export type RuntimeValue = number | boolean;
export const PARENT_STATE_KEY = Symbol("[[PARENT]]");
export type State = { [PARENT_STATE_KEY]?: State; [k: string]: RuntimeValue };

export function interpExpression(s: State, e: Expression): RuntimeValue {
  switch (e.kind) {
    case "number":
    case "boolean":
      return e.value;

    case "variable": {
      let c: State | undefined = s;
      while (c) {
        if (Object.prototype.hasOwnProperty.call(c, e.name)) return c[e.name];
        c = c[PARENT_STATE_KEY];
      }
      throw new Error(`Undefined variable: ${e.name}`);
    }

    case "operator": {
      const op = e.operator;
      if (op === "&&") {
        const l = interpExpression(s, e.left);
        if (typeof l !== "boolean") throw new Error("Left operand of && must be boolean");
        if (!l) return false;
        const r = interpExpression(s, e.right);
        if (typeof r !== "boolean") throw new Error("Right operand of && must be boolean");
        return r;
      }
      if (op === "||") {
        const l = interpExpression(s, e.left);
        if (typeof l !== "boolean") throw new Error("Left operand of || must be boolean");
        if (l) return true;
        const r = interpExpression(s, e.right);
        if (typeof r !== "boolean") throw new Error("Right operand of || must be boolean");
        return r;
      }
      const l = interpExpression(s, e.left);
      const r = interpExpression(s, e.right);
      if (["+", "-", "*", "/"].includes(op)) {
        if (typeof l !== "number" || typeof r !== "number") throw new Error(`Operator ${op} requires number operands`);
        if (op === "/" && r === 0) throw new Error("Division by zero");
        return op === "+" ? l + r : op === "-" ? l - r : op === "*" ? l * r : l / r;
      }
      if (["<", ">"].includes(op)) {
        if (typeof l !== "number" || typeof r !== "number") throw new Error(`Operator ${op} requires number operands`);
        return op === "<" ? l < r : l > r;
      }
      if (op === "===") {
        return l === r;
      }
      throw new Error("Unknown operator");
    }

    default:
      throw new Error(`Unhandled expression kind: ${e.kind}`);
  }
}

export function interpStatement(s: State, stmt: Statement): void {
  switch (stmt.kind) {
    case "let": {
      if (Object.prototype.hasOwnProperty.call(s, stmt.name))
        throw new Error(`Variable ${stmt.name} already declared in this scope`);
      s[stmt.name] = interpExpression(s, stmt.expression);
      return;
    }
    case "assignment": {
      let c: State | undefined = s;
      while (c && !Object.prototype.hasOwnProperty.call(c, stmt.name)) c = c[PARENT_STATE_KEY];
      if (!c) throw new Error(`Assignment to undeclared variable ${stmt.name}`);
      c[stmt.name] = interpExpression(s, stmt.expression);
      return;
    }
    case "print": {
      console.log(interpExpression(s, stmt.expression));
      return;
    }
    case "if": {
      const cond = interpExpression(s, stmt.test);
      const scope: State = { [PARENT_STATE_KEY]: s };
      for (const st of cond ? stmt.truePart : stmt.falsePart) {
        interpStatement(scope, st);
      }
      return;
    }
    case "while": {
      let cond = interpExpression(s, stmt.test);
      while (cond) {
        const scope: State = { [PARENT_STATE_KEY]: s };
        for (const st of stmt.body) {
          interpStatement(scope, st);
        }
        cond = interpExpression(s, stmt.test);
      }
      return;
    }

    default:
      throw new Error(`Unhandled statement kind: ${stmt.kind}`);
  }
}

export function interpProgram(p: Statement[]): State {
  const g: State = {};
  for (const st of p) interpStatement(g, st);
  return g;
}
