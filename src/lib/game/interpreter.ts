import type { GameLevel } from "./validate";

export type SimDir = "N" | "E" | "S" | "W";

export type SimEvent =
  | { kind: "move"; from: { x: number; y: number }; to: { x: number; y: number }; crashed?: boolean; won?: boolean }
  | { kind: "turn"; dir: SimDir }
  | { kind: "openGate"; count: number };

export interface JsSimulationResult {
  status: "ok" | "error" | "timeout";
  error?: string;
  won: boolean;
  crashed: boolean;
  coins: number;
  steps: number;
  position: { x: number; y: number };
  gatesOpened: number;
  events: SimEvent[];
}

export class InterpreterError extends Error {}

type TokKind = "num" | "ident" | "kw" | "punct" | "eof";

interface Token {
  kind: TokKind;
  value: string;
  pos: number;
}

const KEYWORDS = new Set([
  "let",
  "var",
  "const",
  "if",
  "else",
  "while",
  "for",
  "function",
  "return",
  "true",
  "false",
]);

const MULTI_PUNCT = [
  "===",
  "!==",
  "==",
  "!=",
  "<=",
  ">=",
  "&&",
  "||",
  "++",
  "--",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
];

const SINGLE_PUNCT = "{}();,<>=!+-*/%".split("");

function stripComments(code: string): string {
  return code.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, "");
}

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }
    if (/[0-9]/.test(ch)) {
      const start = i;
      while (i < src.length && /[0-9]/.test(src[i])) i += 1;
      tokens.push({ kind: "num", value: src.slice(start, i), pos: start });
      continue;
    }
    if (/[A-Za-z_$]/.test(ch)) {
      const start = i;
      while (i < src.length && /[A-Za-z0-9_$]/.test(src[i])) i += 1;
      const word = src.slice(start, i);
      tokens.push({
        kind: KEYWORDS.has(word) ? "kw" : "ident",
        value: word,
        pos: start,
      });
      continue;
    }
    const two = src.slice(i, i + 3);
    const matchedMulti =
      MULTI_PUNCT.find((p) => p === two) ?? MULTI_PUNCT.find((p) => p === src.slice(i, i + 2));
    if (matchedMulti) {
      tokens.push({ kind: "punct", value: matchedMulti, pos: i });
      i += matchedMulti.length;
      continue;
    }
    if (SINGLE_PUNCT.includes(ch)) {
      tokens.push({ kind: "punct", value: ch, pos: i });
      i += 1;
      continue;
    }
    throw new InterpreterError(`Karakter tidak dikenal "${ch}" di posisi ${i}`);
  }
  tokens.push({ kind: "eof", value: "", pos: src.length });
  return tokens;
}

type Expr =
  | { t: "num"; v: number }
  | { t: "bool"; v: boolean }
  | { t: "ident"; name: string; pos: number }
  | { t: "bin"; op: string; l: Expr; r: Expr }
  | { t: "un"; op: string; e: Expr }
  | { t: "call"; name: string; args: Expr[]; pos: number }
  | { t: "assign"; name: string; compound: string | null; e: Expr; pos: number }
  | { t: "update"; name: string; op: "++" | "--"; prefix: boolean; pos: number };

type Stmt =
  | { t: "decl"; name: string; init: Expr | null; pos: number }
  | { t: "expr"; e: Expr }
  | { t: "if"; cond: Expr; then: Stmt[]; els: Stmt[] | null }
  | { t: "while"; cond: Expr; body: Stmt[]; pos: number }
  | { t: "for"; init: Stmt | null; cond: Expr | null; update: Expr | null; body: Stmt[]; pos: number }
  | { t: "func"; name: string; body: Stmt[] }
  | { t: "return"; e: Expr | null }
  | { t: "block"; body: Stmt[] };

class Parser {
  private toks: Token[];
  private i = 0;

  constructor(src: string) {
    this.toks = tokenize(src);
  }

  private peek(offset = 0): Token {
    return this.toks[Math.min(this.i + offset, this.toks.length - 1)];
  }

  private next(): Token {
    const tok = this.peek();
    this.i = Math.min(this.i + 1, this.toks.length - 1);
    return tok;
  }

  private isPunct(value: string): boolean {
    const tok = this.peek();
    return tok.kind === "punct" && tok.value === value;
  }

  private isKw(value: string): boolean {
    const tok = this.peek();
    return tok.kind === "kw" && tok.value === value;
  }

  private eatPunct(value: string): void {
    if (!this.isPunct(value)) {
      const tok = this.peek();
      throw new InterpreterError(`Diharapkan "${value}" tetapi ada "${tok.value || "akhir kode"}"`);
    }
    this.next();
  }

  private eatKw(value: string): void {
    if (!this.isKw(value)) {
      const tok = this.peek();
      throw new InterpreterError(`Diharapkan "${value}" tetapi ada "${tok.value || "akhir kode"}"`);
    }
    this.next();
  }

  parseProgram(): Stmt[] {
    const stmts: Stmt[] = [];
    while (this.peek().kind !== "eof") stmts.push(this.parseStatement());
    return stmts;
  }

  private parseBlock(): Stmt[] {
    this.eatPunct("{");
    const stmts: Stmt[] = [];
    while (!this.isPunct("}")) {
      if (this.peek().kind === "eof") throw new InterpreterError("Kurung tutup } hilang");
      stmts.push(this.parseStatement());
    }
    this.eatPunct("}");
    return stmts;
  }

  private parseStatement(): Stmt {
    const tok = this.peek();
    if (tok.kind === "kw") {
      switch (tok.value) {
        case "let":
        case "var":
        case "const":
          return this.parseDecl();
        case "if":
          return this.parseIf();
        case "while":
          return this.parseWhile();
        case "for":
          return this.parseFor();
        case "function":
          return this.parseFunction();
      case "return": {
          this.next();
          if (this.isPunct(";")) {
            this.next();
            return { t: "return", e: null };
          }
          const e = this.parseExpr();
          this.eatPunct(";");
          return { t: "return", e };
        }
      }
    }
    if (tok.kind === "punct" && tok.value === "{") {
      const body = this.parseBlock();
      return { t: "block", body };
    }
    const e = this.parseExpr();
    this.eatPunct(";");
    return { t: "expr", e };
  }

  private parseDecl(): Stmt {
    this.next();
    const nameTok = this.next();
    if (nameTok.kind !== "ident") throw new InterpreterError("Nama variabel tidak valid");
    let init: Expr | null = null;
    if (this.isPunct("=")) {
      this.next();
      init = this.parseExpr();
    }
    this.eatPunct(";");
    return { t: "decl", name: nameTok.value, init, pos: nameTok.pos };
  }

  private parseIf(): Stmt {
    this.eatKw("if");
    this.eatPunct("(");
    const cond = this.parseExpr();
    this.eatPunct(")");
    const then = this.parseStatementOrBlock();
    let els: Stmt[] | null = null;
    if (this.isKw("else")) {
      this.next();
      els = this.parseStatementOrBlock();
    }
    return { t: "if", cond, then, els };
  }

  private parseStatementOrBlock(): Stmt[] {
    if (this.isPunct("{")) return this.parseBlock();
    return [this.parseStatement()];
  }

  private parseWhile(): Stmt {
    const tok = this.next();
    this.eatPunct("(");
    const cond = this.parseExpr();
    this.eatPunct(")");
    const body = this.parseStatementOrBlock();
    return { t: "while", cond, body, pos: tok.pos };
  }

  private parseFor(): Stmt {
    const tok = this.next();
    this.eatPunct("(");
    let init: Stmt | null = null;
    if (this.isPunct(";")) {
      this.next();
    } else if (this.isKw("let") || this.isKw("var") || this.isKw("const")) {
      init = this.parseDecl();
    } else {
      const e = this.parseExpr();
      this.eatPunct(";");
      init = { t: "expr", e };
    }
    let cond: Expr | null = null;
    if (!this.isPunct(";")) cond = this.parseExpr();
    this.eatPunct(";");
    let update: Expr | null = null;
    if (!this.isPunct(")")) update = this.parseExpr();
    this.eatPunct(")");
    const body = this.parseStatementOrBlock();
    return { t: "for", init, cond, update, body, pos: tok.pos };
  }

  private parseFunction(): Stmt {
    this.eatKw("function");
    const nameTok = this.next();
    if (nameTok.kind !== "ident") throw new InterpreterError("Nama fungsi tidak valid");
    this.eatPunct("(");
    if (!this.isPunct(")")) {
      throw new InterpreterError(
        "Fungsi dengan parameter belum didukung di dunia ROBIKA (gunakan fungsi tanpa parameter)",
      );
    }
    this.eatPunct(")");
    const body = this.parseBlock();
    return { t: "func", name: nameTok.value, body };
  }

  private parseExpr(): Expr {
    return this.parseAssignment();
  }

  private parseAssignment(): Expr {
    const left = this.parseOr();
    const tok = this.peek();
    if (tok.kind !== "punct") return left;
    if (tok.value === "=" && left.t === "ident") {
      this.next();
      const e = this.parseAssignment();
      return { t: "assign", name: left.name, compound: null, e, pos: left.pos };
    }
    const compounds = ["+=", "-=", "*=", "/=", "%="];
    if (compounds.includes(tok.value) && left.t === "ident") {
      this.next();
      const e = this.parseAssignment();
      return { t: "assign", name: left.name, compound: tok.value[0], e, pos: left.pos };
    }
    return left;
  }

  private parseOr(): Expr {
    let l = this.parseAnd();
    while (this.isPunct("||")) {
      this.next();
      const r = this.parseAnd();
      l = { t: "bin", op: "||", l, r };
    }
    return l;
  }

  private parseAnd(): Expr {
    let l = this.parseEquality();
    while (this.isPunct("&&")) {
      this.next();
      const r = this.parseEquality();
      l = { t: "bin", op: "&&", l, r };
    }
    return l;
  }

  private parseEquality(): Expr {
    let l = this.parseRelational();
    for (;;) {
      const tok = this.peek();
      if (tok.kind === "punct" && ["==", "!=", "===", "!=="].includes(tok.value)) {
        this.next();
        const r = this.parseRelational();
        l = { t: "bin", op: tok.value, l, r };
      } else return l;
    }
  }

  private parseRelational(): Expr {
    let l = this.parseAdditive();
    for (;;) {
      const tok = this.peek();
      if (tok.kind === "punct" && ["<", ">", "<=", ">="].includes(tok.value)) {
        this.next();
        const r = this.parseAdditive();
        l = { t: "bin", op: tok.value, l, r };
      } else return l;
    }
  }

  private parseAdditive(): Expr {
    let l = this.parseMultiplicative();
    for (;;) {
      const tok = this.peek();
      if (tok.kind === "punct" && (tok.value === "+" || tok.value === "-")) {
        this.next();
        const r = this.parseMultiplicative();
        l = { t: "bin", op: tok.value, l, r };
      } else return l;
    }
  }

  private parseMultiplicative(): Expr {
    let l = this.parseUnary();
    for (;;) {
      const tok = this.peek();
      if (tok.kind === "punct" && ["*", "/", "%"].includes(tok.value)) {
        this.next();
        const r = this.parseUnary();
        l = { t: "bin", op: tok.value, l, r };
      } else return l;
    }
  }

  private parseUnary(): Expr {
    const tok = this.peek();
    if (tok.kind === "punct" && (tok.value === "!" || tok.value === "-" || tok.value === "+")) {
      this.next();
      const e = this.parseUnary();
      return { t: "un", op: tok.value, e };
    }
    if (tok.kind === "punct" && (tok.value === "++" || tok.value === "--")) {
      this.next();
      const target = this.parseUnary();
      if (target.t !== "ident")
        throw new InterpreterError(`${tok.value} hanya untuk variabel`);
      return { t: "update", name: target.name, op: tok.value as "++" | "--", prefix: true, pos: target.pos };
    }
    return this.parsePostfix();
  }

  private parsePostfix(): Expr {
    let e = this.parsePrimary();
    for (;;) {
      const tok = this.peek();
      if (tok.kind === "punct" && (tok.value === "++" || tok.value === "--") && e.t === "ident") {
        this.next();
        e = { t: "update", name: e.name, op: tok.value as "++" | "--", prefix: false, pos: e.pos };
      } else return e;
    }
  }

  private parsePrimary(): Expr {
    const tok = this.next();
    if (tok.kind === "num") return { t: "num", v: Number(tok.value) };
    if (tok.kind === "kw" && (tok.value === "true" || tok.value === "false")) {
      return { t: "bool", v: tok.value === "true" };
    }
    if (tok.kind === "ident") {
      if (this.isPunct("(")) {
        this.next();
        const args: Expr[] = [];
        while (!this.isPunct(")")) {
          args.push(this.parseExpr());
          if (this.isPunct(",")) this.next();
        }
        this.eatPunct(")");
        return { t: "call", name: tok.value, args, pos: tok.pos };
      }
      return { t: "ident", name: tok.value, pos: tok.pos };
    }
    if (tok.kind === "punct" && tok.value === "(") {
      const e = this.parseExpr();
      this.eatPunct(")");
      return e;
    }
    throw new InterpreterError(
      `Token tak terduga "${tok.value || "akhir kode"}" di karakter ${tok.pos}`,
    );
  }
}

interface EnvFrame {
  vars: Map<string, number | boolean>;
  parent: EnvFrame | null;
}

class ReturnSignal {
  constructor(public value: Value) {}
}

type Value = number | boolean;

interface RunContext {
  steps: number;
  maxSteps: number;
  depth: number;
  functions: Map<string, Stmt[]>;
}

const BUILTIN_MATH = new Set(["abs", "min", "max", "floor"]);

export class JsWorldSimulator {
  private grid: string[];
  private width: number;
  private height: number;
  private px = 0;
  private py = 0;
  private dirIndex = 1;
  private coins = 0;
  private crashed = false;
  private won = false;
  private gatesOpened = 0;
  private events: SimEvent[] = [];
  private goalType: "reach" | "collect";
  private coinsNeeded: number;
  private ctx: RunContext;

  private static DIRS: Array<{ dx: number; dy: number }> = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
  ];

  private static DIR_NAMES: SimDir[] = ["N", "E", "S", "W"];

  constructor(level: GameLevel, maxSteps: number) {
    this.grid = [...level.grid];
    this.height = level.grid.length;
    this.width = level.grid[0]?.length ?? 0;
    this.goalType = level.goal.type === "collect" ? "collect" : "reach";
    this.coinsNeeded = level.goal.type === "collect" ? (level.goal.target ?? 1) : 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x] === "P") {
          this.px = x;
          this.py = y;
        }
      }
    }
    this.ctx = { steps: 0, maxSteps, depth: 0, functions: new Map() };
  }

  private tileAt(x: number, y: number): string {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return "#";
    return this.grid[y][x];
  }

  private solid(tile: string): boolean {
    return tile === "#" || tile === "S" || tile === "D";
  }

  private tick(): void {
    this.ctx.steps += 1;
    if (this.ctx.steps > this.ctx.maxSteps) {
      throw new InterpreterError("Program berjalan terlalu lama (kemungkinan infinite loop)");
    }
  }

  private ahead(): string {
    const vec = JsWorldSimulator.DIRS[this.dirIndex];
    return this.tileAt(this.px + vec.dx, this.py + vec.dy);
  }

  private moveForward(): void {
    this.tick();
    const from = { x: this.px, y: this.py };
    const vec = JsWorldSimulator.DIRS[this.dirIndex];
    const tile = this.ahead();
    if (this.solid(tile)) {
      this.crashed = true;
      this.events.push({
        kind: "move",
        from,
        to: { x: this.px + vec.dx, y: this.py + vec.dy },
        crashed: true,
      });
      throw new InterpreterError(
        tile === "D"
          ? "BOT-1 menabrak gerbang yang masih terkunci"
          : "BOT-1 menabrak dinding atau bahaya",
      );
    }
    this.px += vec.dx;
    this.py += vec.dy;
    if (tile === "C") this.coins += 1;
    if (tile === "G") {
      this.won = this.goalType === "reach" || this.coins >= this.coinsNeeded;
    }
    this.events.push({
      kind: "move",
      from,
      to: { x: this.px, y: this.py },
      won: this.won || undefined,
    });
  }

  private turn(delta: number): void {
    this.tick();
    this.dirIndex = (this.dirIndex + delta + 4) % 4;
    this.events.push({ kind: "turn", dir: JsWorldSimulator.DIR_NAMES[this.dirIndex] });
  }

  private openGate(): Value {
    this.tick();
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x] === "D") {
          this.grid[y] = this.grid[y].slice(0, x) + "." + this.grid[y].slice(x + 1);
          this.gatesOpened += 1;
        }
      }
    }
    this.events.push({ kind: "openGate", count: this.gatesOpened });
    return true;
  }

  private callApi(name: string, args: Value[]): Value {
    switch (name) {
      case "moveForward":
        this.moveForward();
        return true;
      case "turnLeft":
        this.turn(-1);
        return true;
      case "turnRight":
        this.turn(1);
        return true;
      case "blockedAhead":
        this.tick();
        return this.solid(this.ahead());
      case "canMove":
        this.tick();
        return !this.solid(this.ahead());
      case "atGoal":
        this.tick();
        return this.tileAt(this.px, this.py) === "G";
      case "openGate":
        return this.openGate();
      default:
        break;
    }
    if (name.startsWith("Math.") && BUILTIN_MATH.has(name.slice(5))) {
      this.tick();
      const a = args[0];
      const b = args[1];
      if (typeof a !== "number" || (name.slice(5) !== "abs" && typeof b !== "number")) {
        throw new InterpreterError("Math.* membutuhkan angka");
      }
      const na: number = a;
      const nb: number = b as number;
      switch (name.slice(5)) {
        case "abs":
          return Math.abs(na);
        case "min":
          return Math.min(na, nb);
        case "max":
          return Math.max(na, nb);
        default:
          return Math.floor(na);
      }
    }
    throw new InterpreterError(`Perintah "${name}" tidak dikenal oleh BOT-1`);
  }

  run(programAst: Stmt[]): JsSimulationResult {
    try {
      this.execBlock(programAst, { vars: new Map(), parent: null }, false);
    } catch (err) {
      if (err instanceof InterpreterError) {
        return this.result("error", err.message);
      }
      throw err;
    }
    if (!this.won && !this.crashed) {
      this.won =
        this.tileAt(this.px, this.py) === "G" &&
        (this.goalType === "reach" || this.coins >= this.coinsNeeded);
    }
    return this.result("ok", undefined);
  }

  private result(status: JsSimulationResult["status"], error?: string): JsSimulationResult {
    return {
      status,
      error,
      won: this.won,
      crashed: this.crashed,
      coins: this.coins,
      steps: this.ctx.steps,
      position: { x: this.px, y: this.py },
      gatesOpened: this.gatesOpened,
      events: [...this.events],
    };
  }

  private truthy(v: Value): boolean {
    return typeof v === "boolean" ? v : v !== 0;
  }

  private lookup(env: EnvFrame, name: string): Value {
    let frame: EnvFrame | null = env;
    while (frame) {
      if (frame.vars.has(name)) return frame.vars.get(name) as Value;
      frame = frame.parent;
    }
    throw new InterpreterError(`Variabel "${name}" belum dideklarasikan`);
  }

  private assignVar(env: EnvFrame, name: string, value: Value): void {
    let frame: EnvFrame | null = env;
    while (frame) {
      if (frame.vars.has(name)) {
        frame.vars.set(name, value);
        return;
      }
      frame = frame.parent;
    }
    throw new InterpreterError(`Variabel "${name}" belum dideklarasikan`);
  }

  private execBlock(stmts: Stmt[], env: EnvFrame, inFunction: boolean): void {
    for (const st of stmts) this.execStmt(st, env, inFunction);
  }

  private execStmt(st: Stmt, env: EnvFrame, inFunction: boolean): void {
    if (this.won || this.crashed) return;
    this.tick();
    switch (st.t) {
      case "decl": {
        env.vars.set(st.name, st.init ? this.evalExpr(st.init, env) : 0);
        return;
      }
      case "expr":
        this.evalExpr(st.e, env);
        return;
      case "if": {
        if (this.truthy(this.evalExpr(st.cond, env))) this.execBlock(st.then, { vars: new Map(), parent: env }, inFunction);
        else if (st.els) this.execBlock(st.els, { vars: new Map(), parent: env }, inFunction);
        return;
      }
      case "while": {
        let guard = 0;
        while (this.truthy(this.evalExpr(st.cond, env))) {
          guard += 1;
          if (guard > 10_000)
            throw new InterpreterError("Loop while berjalan terlalu banyak iterasi");
          this.execBlock(st.body, { vars: new Map(), parent: env }, inFunction);
          if (this.won || this.crashed) return;
        }
        return;
      }
      case "for": {
        const loopEnv: EnvFrame = { vars: new Map(), parent: env };
        if (st.init) this.execStmt(st.init, loopEnv, inFunction);
        let guard = 0;
        while (st.cond === null || this.truthy(this.evalExpr(st.cond, loopEnv))) {
          guard += 1;
          if (guard > 10_000)
            throw new InterpreterError("Loop for berjalan terlalu banyak iterasi");
          this.execBlock(st.body, { vars: new Map(), parent: loopEnv }, inFunction);
          if (this.won || this.crashed) return;
          if (st.update) this.evalExpr(st.update, loopEnv);
        }
        return;
      }
      case "func":
        this.ctx.functions.set(st.name, st.body);
        return;
      case "block":
        this.execBlock(st.body, { vars: new Map(), parent: env }, inFunction);
        return;
      case "return": {
        if (!inFunction) throw new InterpreterError("return hanya boleh di dalam fungsi");
        const value = st.e ? this.evalExpr(st.e, env) : 0;
        throw new ReturnSignal(value);
      }
    }
  }

  private evalExpr(e: Expr, env: EnvFrame): Value {
    switch (e.t) {
      case "num":
        return e.v;
      case "bool":
        return e.v;
      case "ident":
        return this.lookup(env, e.name);
      case "bin":
        return this.evalBin(e, env);
      case "un": {
        const v = this.evalExpr(e.e, env);
        if (e.op === "!") return !this.truthy(v);
        if (e.op === "-") return -v;
        return v;
      }
      case "assign": {
        let value = this.evalExpr(e.e, env);
        if (e.compound) {
          const cur = this.lookup(env, e.name);
          value = this.applyBinary(e.compound, cur, value);
        }
        if (typeof value !== "number" && typeof value !== "boolean")
          throw new InterpreterError("Nilai tidak valid");
        this.assignVar(env, e.name, value);
        return value;
      }
      case "update": {
        const cur = this.lookup(env, e.name);
        if (typeof cur !== "number")
          throw new InterpreterError(`Variabel "${e.name}" harus angka untuk ++/--`);
        const next = e.op === "++" ? cur + 1 : cur - 1;
        this.assignVar(env, e.name, next);
        return e.prefix ? next : cur;
      }
      case "call": {
        const args = e.args.map((a) => this.evalExpr(a, env));
        const userFn = this.ctx.functions.get(e.name);
        if (userFn) {
          this.ctx.depth += 1;
          if (this.ctx.depth > 32)
            throw new InterpreterError("Pemanggilan fungsi terlalu dalam (rekursi tak berujung?)");
          try {
            this.tick();
            this.execBlock(userFn, { vars: new Map(), parent: env }, true);
          } catch (signal) {
            if (signal instanceof ReturnSignal) {
              return signal.value;
            }
            throw signal;
          } finally {
            this.ctx.depth -= 1;
          }
          return 0;
        }
        return this.callApi(e.name, args);
      }
    }
  }

  private evalBin(e: Extract<Expr, { t: "bin" }>, env: EnvFrame): Value {
    if (e.op === "||") {
      const l = this.evalExpr(e.l, env);
      return this.truthy(l) ? true : this.truthy(this.evalExpr(e.r, env));
    }
    if (e.op === "&&") {
      const l = this.evalExpr(e.l, env);
      return !this.truthy(l) ? false : this.truthy(this.evalExpr(e.r, env));
    }
    const l = this.evalExpr(e.l, env);
    const r = this.evalExpr(e.r, env);
    return this.applyBinary(e.op, l, r);
  }

  private num(op: string, v: Value): number {
    if (typeof v !== "number") {
      throw new InterpreterError(`Operator "${op}" membutuhkan angka`);
    }
    return v;
  }

  private applyBinary(op: string, l: Value, r: Value): Value {
    switch (op) {
      case "+":
        return this.num(op, l) + this.num(op, r);
      case "-":
        return this.num(op, l) - this.num(op, r);
      case "*":
        return this.num(op, l) * this.num(op, r);
      case "/": {
        const rl = this.num(op, l);
        const rr = this.num(op, r);
        if (rr === 0) throw new InterpreterError("Pembagian dengan nol");
        return rl / rr;
      }
      case "%": {
        const rl = this.num(op, l);
        const rr = this.num(op, r);
        if (rr === 0) throw new InterpreterError("Modulo dengan nol");
        return rl % rr;
      }
      case "<":
      case ">":
      case "<=":
      case ">=": {
        const rl = this.num(op, l);
        const rr = this.num(op, r);
        if (op === "<") return rl < rr;
        if (op === ">") return rl > rr;
        if (op === "<=") return rl <= rr;
        return rl >= rr;
      }
      case "==":
      case "===":
        return l === r;
      case "!=":
      case "!==":
        return l !== r;
      default:
        throw new InterpreterError(`Operator "${op}" tidak didukung`);
    }
  }
}

export function simulateWithJs(level: GameLevel, code: string, options?: { maxSteps?: number }): JsSimulationResult {
  const maxSteps = options?.maxSteps ?? 100_000;
  let ast: Stmt[];
  try {
    ast = new Parser(stripComments(code)).parseProgram();
  } catch (err) {
    if (err instanceof InterpreterError) {
      return {
        status: "error",
        error: err.message,
        won: false,
        crashed: false,
        coins: 0,
        steps: 0,
        position: { x: 0, y: 0 },
        gatesOpened: 0,
        events: [],
      };
    }
    throw err;
  }
  const sim = new JsWorldSimulator(level, maxSteps);
  return sim.run(ast);
}
