"use client";

import { useEffect, useRef, useState } from "react";
import { BackButton } from "@/components/design/back-button";
import { Icon } from "@/components/design/icon";
import { runPython } from "@/lib/codelab/runner";

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
  alert("Selamat datang di Robika Playground!");
}`;

const DEFAULT_PY = `# Python — coba jalankan!
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

export default function PlaygroundPage() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [py, setPy] = useState(DEFAULT_PY);
  const [pyOutput, setPyOutput] = useState("");
  const [pyError, setPyError] = useState<string | undefined>();
  const [pyRunning, setPyRunning] = useState(false);
  const [tab, setTab] = useState<TabId>("html");
  const [doc, setDoc] = useState("");

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDoc(`<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`);
    }, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [html, css, js]);

  const runPy = async () => {
    if (pyRunning) return;
    setPyRunning(true);
    setPyError(undefined);
    setPyOutput("");
    try {
      const result = await runPython(py);
      setPyOutput(result.stdout);
      setPyError(result.error);
    } catch (err) {
      setPyError(err instanceof Error ? err.message : String(err));
    } finally {
      setPyRunning(false);
    }
  };

  const value = tab === "html" ? html : tab === "css" ? css : tab === "js" ? js : py;
  const onChange = (v: string) => {
    if (tab === "html") setHtml(v);
    else if (tab === "css") setCss(v);
    else if (tab === "js") setJs(v);
    else setPy(v);
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
      <div className="mb-4">
        <BackButton fallbackHref="/dashboard" />
        <h1 className="flex items-center gap-2 font-display text-2xl tracking-wide text-foreground">
          <Icon name="code" size={22} />
          CODE PLAYGROUND
        </h1>
        <p className="text-sm text-muted-foreground">
          Tulis HTML, CSS, JavaScript, atau Python — lihat hasilnya langsung di
          panel Preview.
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
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  tab === t.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
            {tab === "py" && (
              <button
                type="button"
                onClick={() => void runPy()}
                disabled={pyRunning}
                className="btn btn-accent btn-sm ml-auto"
              >
                {pyRunning ? "Menjalankan..." : "Jalankan Python"}
              </button>
            )}
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            className="h-96 w-full resize-none bg-input p-3 font-mono text-sm text-emerald-200 outline-none"
          />
          {tab === "py" && (
            <div className="border-t border-border bg-input p-3">
              <div className="mb-1 font-display text-xs tracking-widest text-muted-foreground">
                OUTPUT PYTHON
              </div>
              <pre className="min-h-[40px] whitespace-pre-wrap text-sm text-emerald-200">
                {pyError ? (
                  <span className="text-rose-300">{pyError}</span>
                ) : (
                  pyOutput || "— belum ada output —"
                )}
              </pre>
            </div>
          )}
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-border">
          <div className="border-b border-border bg-muted/60 px-4 py-2">
            <span className="font-display text-xs tracking-widest text-muted-foreground">
              PREVIEW LIVE
            </span>
          </div>
          { }
          <iframe
            title="playground preview"
            sandbox="allow-scripts allow-popups"
            srcDoc={doc}
            className="h-96 w-full bg-white"
          />
        </div>
      </div>
    </main>
  );
}