"use client";

import { useEffect, useRef, useState } from "react";
import { BackButton } from "@/components/design/back-button";
import { Icon } from "@/components/design/icon";
import { runJavaScript, runPython } from "@/lib/codelab/runner";

const DEFAULT_HTML = `<div class="card">
  <h2>Halo, Robika!</h2>
  <p>Ketik HTML, CSS, dan JS di panel kiri.</p>
  <button onclick="greet()">Klik aku</button>
</div>`;

const DEFAULT_CSS = `body {
  margin: 0;
  display: grid;
  place-items: center;
  min-height: 100vh;
  background: #0f172a;
  font-family: system-ui, sans-serif;
}

.card {
  padding: 40px 32px;
  border-radius: 16px;
  background: linear-gradient(135deg, #7c3aed, #0ea5e9);
  color: #fff;
  text-align: center;
  box-shadow: 0 20px 60px rgba(124, 58, 237, 0.4);
}

button {
  margin-top: 16px;
  padding: 10px 18px;
  border: 0;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  font-weight: 700;
  cursor: pointer;
}`;

const DEFAULT_JS = `function greet() {
  alert("Selamat datang di CodeLab Studio!");
}
console.log("JS berjalan — setiap ketikan tampil di sini.");
console.log(2 + 3 * 4);`;

const DEFAULT_PY = `# Python — hasilnya muncul live di bawah!
nama = "Robika"
for i in range(1, 6):
    print(f"{i}. Halo {nama}!")
print("Total:", sum(range(1, 6)))`;

const TABS = [
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "js", label: "JS" },
  { id: "py", label: "PY" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function StudioClient() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [py, setPy] = useState(DEFAULT_PY);
  const [jsOutput, setJsOutput] = useState("");
  const [jsError, setJsError] = useState<string | undefined>();
  const [pyOutput, setPyOutput] = useState("");
  const [pyError, setPyError] = useState<string | undefined>();
  const [pyLoading, setPyLoading] = useState(false);
  const [pyRunning, setPyRunning] = useState(false);
  const [tab, setTab] = useState<TabId>("html");
  const [doc, setDoc] = useState("");

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pyRunId = useRef(0);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDoc(`<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`);
    }, 400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [html, css, js]);

  useEffect(() => {
    const id = ++pyRunId.current;
    const t = setTimeout(() => {
      setPyRunning(true);
      setPyLoading(true);
      void (async () => {
        const result = await runPython(py);
        if (pyRunId.current !== id) return;
        setPyOutput(result.stdout);
        setPyError(result.error);
        setPyRunning(false);
        setPyLoading(false);
      })();
    }, 800);
    return () => clearTimeout(t);
  }, [py]);

  const runJsLive = () => {
    const result = runJavaScript(js);
    setJsOutput(result.stdout);
    setJsError(result.error);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      runJsLive();
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [js]);

  const value =
    tab === "html" ? html : tab === "css" ? css : tab === "js" ? js : py;
  const onChange = (v: string) => {
    if (tab === "html") setHtml(v);
    else if (tab === "css") setCss(v);
    else if (tab === "js") setJs(v);
    else setPy(v);
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
      <div className="mb-4">
        <BackButton fallbackHref="/codelab" />
        <h1 className="flex items-center gap-2 font-display text-2xl tracking-wide text-foreground">
          <Icon name="code" size={22} />
          CODELAB STUDIO
        </h1>
        <p className="text-sm text-muted-foreground">
          Pilih bahasa (HTML, CSS, JavaScript, Python) — hasilnya tampil{" "}
          <span className="font-semibold text-foreground">live di panel kanan</span>{" "}
          saat kamu mengetik.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="flex items-center gap-1 border-b border-border bg-muted/60 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-pressed={tab === t.id}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  tab === t.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
            <span className="ml-auto flex items-center gap-1 pr-1 text-[10px] font-semibold text-muted-foreground">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  pyRunning && tab === "py"
                    ? "animate-pulse bg-accent"
                    : "bg-emerald-400"
                }`}
              />
              {pyRunning && tab === "py"
                ? "LIVE..."
                : "LIVE"}
            </span>
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            aria-label={`Editor ${tab.toUpperCase()}`}
            className="h-96 w-full resize-none bg-input p-3 font-mono text-sm text-emerald-200 outline-none"
          />
          {(tab === "js" || tab === "py") && (
            <div className="border-t border-border bg-input p-3">
              <div className="mb-1 font-display text-xs tracking-widest text-muted-foreground">
                OUTPUT {tab.toUpperCase()}
              </div>
              <pre className="min-h-[40px] whitespace-pre-wrap text-sm text-emerald-200">
                {(tab === "js" ? jsError : pyError) ? (
                  <span className="text-rose-300">
                    {tab === "js" ? jsError : pyError}
                  </span>
                ) : (
                  (tab === "js" ? jsOutput : pyOutput) ||
                  "— belum ada output —"
                )}
              </pre>
              {tab === "py" && pyLoading && (
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Memuat runtime Python… (jalankan otomatis setiap ketikan)
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-border">
          <div className="border-b border-border bg-muted/60 px-4 py-2">
            <span className="font-display text-xs tracking-widest text-muted-foreground">
              PREVIEW LIVE
            </span>
          </div>
          <iframe
            title="studio preview"
            sandbox="allow-scripts allow-popups"
            srcDoc={doc}
            className="h-96 w-full bg-white"
          />
        </div>
      </div>
    </main>
  );
}