export interface CodeLabChallenge {
  id: string;
  title: { id: string; en: string };
  lang: "javascript" | "python";
  kind: "output" | "complete-code" | "fix-bug" | "preview";
  description: { id: string; en: string };
  expected?: string;
  mode: "exact" | "contains";
  starterCode: string;
  solution: string;
  hints: string[][];
  xpReward: number;
  bugs?: string[];
  html?: string;
}

export interface RunnerResult {
  stdout: string;
  error?: string;
}

function formatArg(arg: unknown): string {
  if (typeof arg === "string") return arg;
  if (typeof arg === "object" && arg !== null) {
    try {
      return JSON.stringify(arg);
    } catch {
      return String(arg);
    }
  }
  return String(arg);
}

export function runJavaScript(code: string): RunnerResult {
  const logs: string[] = [];
  const sandboxConsole = new Proxy(console, {
    get(target, prop) {
      if (prop === "log" || prop === "info") {
        return (...args: unknown[]) => logs.push(args.map(formatArg).join(" "));
      }
      if (prop === "error" || prop === "warn") {
        return (...args: unknown[]) => logs.push(args.map(formatArg).join(" "));
      }
      return Reflect.get(target, prop);
    },
  });

  try {
    new Function("console", code)(sandboxConsole);
  } catch (err) {
    return {
      stdout: logs.join("\n"),
      error: err instanceof Error ? err.message : String(err),
    };
  }
  return { stdout: logs.join("\n") };
}

type PyodideModule = {
  runPythonAsync: (code: string) => Promise<string>;
  setStdout: (opts: { batched: (text: string) => void }) => void;
};

declare global {
  function loadPyodide(options?: { indexURL?: string }): Promise<PyodideModule>;
}

let pyodideModule: Promise<PyodideModule> | null = null;

function loadPyodide(): Promise<PyodideModule> {
  if (!pyodideModule) {
    pyodideModule = (async () => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.27.4/full/pyodide.js";
      document.head.appendChild(script);
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => reject(new Error("failed to load pyodide"));
      });
      return (
        globalThis as unknown as Record<
          string,
          (o?: { indexURL?: string }) => Promise<PyodideModule>
        >
      ).loadPyodide();
    })();
  }
  return pyodideModule;
}

export async function runPython(code: string): Promise<RunnerResult> {
  const pyodide = await getPyodide();
  const logs: string[] = [];
  try {
    pyodide.setStdout({ batched: (text: string) => logs.push(text) });
    await pyodide.runPythonAsync(code);
  } catch (err) {
    return {
      stdout: logs.join("\n"),
      error: err instanceof Error ? err.message : String(err),
    };
  }
  return { stdout: logs.join("\n") };
}

function getPyodide(): Promise<PyodideModule> {
  return loadPyodide();
}

export async function runChallenge(
  challenge: Pick<CodeLabChallenge, "lang">,
  code: string,
): Promise<RunnerResult> {
  if (challenge.lang === "python") return runPython(code);
  return runJavaScript(code);
}