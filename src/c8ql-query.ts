import { C8Collection, isC8Collection } from "./collection";

export interface C8QLQuery {
  query: string;
  bindVars: { [key: string]: any };
}

export interface C8QLLiteral {
  toC8QL: () => string;
}

export type C8QLValue =
  | string
  | number
  | boolean
  | C8Collection
  | C8QLLiteral;

export function isC8QLQuery(query: any): query is C8QLQuery {
  return Boolean(query && query.query && query.bindVars);
}

export function isC8QLLiteral(literal: any): literal is C8QLLiteral {
  return Boolean(literal && typeof literal.toC8QL === "function");
}

export function c8ql(
  strings: TemplateStringsArray,
  ...args: C8QLValue[]
): C8QLQuery {
  const bindVars: C8QLQuery["bindVars"] = {};
  const bindVals = [];
  let query = strings[0];
  for (let i = 0; i < args.length; i++) {
    const rawValue = args[i];
    let value = rawValue;
    if (isC8QLLiteral(rawValue)) {
      query += `${rawValue.toC8QL()}${strings[i + 1]}`;
      continue;
    }
    const index = bindVals.indexOf(rawValue);
    const isKnown = index !== -1;
    let name = `value${isKnown ? index : bindVals.length}`;
    if (isC8Collection(rawValue)) {
      name = `@${name}`;
      value = rawValue.name;
    }
    if (!isKnown) {
      bindVals.push(rawValue);
      bindVars[name] = value;
    }
    query += `@${name}${strings[i + 1]}`;
  }
  return { query, bindVars };
}

export namespace c8ql {
  export const literal = (value: any): C8QLLiteral => ({
    toC8QL() {
      return String(value);
    }
  });
}
