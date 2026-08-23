"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { BackButton } from "@/components/design/back-button";
import { Icon } from "@/components/design/icon";
import { CodeEditor } from "@/components/codelab/code-editor";
import { runJavaScript, runPython } from "@/lib/codelab/runner";
import {
  languageById,
  languageByFile,
} from "@/lib/codelab/languages";
import {
  activeFile,
  addFile,
  buildPreviewDoc,
  createProject,
  deleteFile,
  localStorageProjectStore,
  renameFile,
  setActive,
  setFileContent,
  type LabProject,
  type ProjectStore,
} from "@/lib/codelab/projects";

type ExecState = "idle" | "running" | "done" | "error";

const STORE_KEY = "robika.codelab.project.v1";

function makeStore(): ProjectStore {
  return localStorageProjectStore(STORE_KEY);
}

const emptySubscribe = () => () => {};

export function StudioClient() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [edited, setEdited] = useState<LabProject | null>(null);
  const [execState, setExecState] = useState<ExecState>("idle");
  const [output, setOutput] = useState<string[]>([]);
  const [previewDoc, setPreviewDoc] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const [newName, setNewName] = useState("");
  const [addingFile, setAddingFile] = useState(false);
  const [storeRef] = useState(makeStore);

  const baseProject = useMemo(() => {
    if (!mounted) return null;
    return storeRef.load() ?? createProject();
  }, [mounted, storeRef]);
  const project = edited ?? baseProject;

  const runIdRef = useRef(0);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!project) return;
    storeRef.save(project);
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => {
      setPreviewDoc(buildPreviewDoc(project.files));
    }, 400);
    return () => {
      if (previewTimer.current) clearTimeout(previewTimer.current);
    };
  }, [project, storeRef]);

  const current = project ? activeFile(project) : undefined;
  const spec = current ? languageById(current.langId) : undefined;

  const execLabel = useMemo(() => {
    switch (execState) {
      case "running":
        return "MENJALANKAN…";
      case "done":
        return "SELESAI";
      case "error":
        return "ERROR";
      default:
        return "RUN";
    }
  }, [execState]);

  const handleRun = async () => {
    if (!current || !spec || execState === "running") return;
    if (spec.run === "web") {
      setPreviewDoc(buildPreviewDoc(project!.files));
      setPreviewKey((k) => k + 1);
      setExecState("done");
      return;
    }
    const id = ++runIdRef.current;
    setExecState("running");
    setOutput([]);
    const result =
      spec.id === "python"
        ? await runPython(current.content)
        : runJavaScript(current.content);
    if (runIdRef.current !== id) return;
    const lines = result.stdout ? result.stdout.split("\n") : [];
    if (result.error) {
      lines.push(`[error] ${result.error}`);
      setOutput(lines);
      setExecState("error");
      return;
    }
    setOutput(lines.length > 0 ? lines : ["(tanpa output)"]);
    setExecState("done");
  };

  const submitNewFile = () => {
    if (!project || !newName.trim()) {
      setAddingFile(false);
      setNewName("");
      return;
    }
    const name = newName.trim();
    const next = languageByFile(name)
      ? addFile(project, name)
      : addFile(project, `${name}.js`);
    if (next !== project) setEdited(next);
    setAddingFile(false);
    setNewName("");
  };

  if (!project || !current || !spec) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <p className="text-sm text-muted-foreground">Menyiapkan proyek…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <BackButton fallbackHref="/codelab" />
        <h1 className="flex items-center gap-2 font-display text-2xl tracking-wide text-foreground">
          <Icon name="code" size={22} />
          CODELAB STUDIO
        </h1>
        <span className="rounded-md border border-border bg-muted/60 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {project.name}
        </span>
        <button
          type="button"
          onClick={() => void handleRun()}
          disabled={execState === "running"}
          data-testid="studio-run"
          className={`ml-auto rounded-lg border px-4 py-2 font-display text-sm tracking-wide transition disabled:opacity-60 ${
            execState === "error"
              ? "border-rose-500/60 bg-rose-500/10 text-rose-300"
              : "border-accent/60 bg-accent/15 text-accent hover:bg-accent/25"
          }`}
        >
          ▶ {execLabel}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_minmax(0,420px)]">
        <aside className="overflow-hidden rounded-xl border border-border">
          <div className="border-b border-border bg-muted/60 px-3 py-2 font-display text-xs tracking-widest text-muted-foreground">
            EXPLORER
          </div>
          <ul className="p-1">
            {project.files.map((f) => {
              const fSpec = languageById(f.langId);
              const active = f.id === current.id;
              return (
                <li key={f.id} className="group flex items-center">
                  <button
                    type="button"
                    onClick={() => project && setEdited(setActive(project, f.id))}
                    aria-current={active}
                    className={`min-w-0 flex-1 truncate rounded-md px-2 py-1.5 text-left text-xs transition ${
                      active
                        ? "bg-accent/15 font-semibold text-accent"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.name}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      project && setEdited(deleteFile(project, f.id))
                    }
                    aria-label={`Hapus ${f.name}`}
                    className="mr-1 hidden px-1 text-[10px] text-muted-foreground hover:text-rose-300 group-hover:block"
                  >
                    ✕
                  </button>
                  <span className="pr-1 text-[9px] font-bold uppercase text-muted-foreground/70">
                    {fSpec.label}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-border p-1">
            {addingFile ? (
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={submitNewFile}
                onKeyDown={(e) => e.key === "Enter" && submitNewFile()}
                placeholder="nama-file.js"
                aria-label="Nama file baru"
                className="w-full rounded-md bg-input px-2 py-1.5 text-xs outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setAddingFile(true)}
                data-testid="studio-add-file"
                className="w-full rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground hover:text-accent"
              >
                + file baru
              </button>
            )}
          </div>
        </aside>

        <section className="flex min-h-[480px] flex-col overflow-hidden rounded-xl border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-3 py-2">
            <button
              type="button"
              onClick={() =>
                project &&
                setEdited(
                  renameFile(
                    project,
                    current.id,
                    window.prompt("Nama file:", current.name) ?? current.name,
                  ),
                )
              }
              className="font-mono text-xs font-semibold text-foreground underline-offset-4 hover:underline"
              title="Ganti nama file"
            >
              {current.name}
            </button>
            <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent">
              {spec.label}
            </span>
          </div>
          <CodeEditor
            value={current.content}
            onChange={(v) => setEdited(setFileContent(project, current.id, v))}
            language={
              spec.monaco as "javascript" | "python" | "html" | "css"
            }
            height="360px"
          />
          <div className="mt-auto border-t border-border bg-input p-3">
            <div className="mb-1 font-display text-xs tracking-widest text-muted-foreground">
              OUTPUT
            </div>
            <pre
              data-testid="studio-output"
              className={`max-h-32 min-h-[40px] overflow-auto whitespace-pre-wrap break-words text-sm ${
                execState === "error" ? "text-rose-300" : "text-emerald-200"
              }`}
            >
              {output.length > 0
                ? output.join("\n")
                : "— tekan RUN untuk menjalankan file aktif —"}
            </pre>
          </div>
        </section>

        <section className="flex min-h-[480px] flex-col overflow-hidden rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border bg-muted/60 px-3 py-2">
            <span className="font-display text-xs tracking-widest text-muted-foreground">
              PREVIEW LIVE
            </span>
            <button
              type="button"
              onClick={() => {
                setPreviewDoc(buildPreviewDoc(project.files));
                setPreviewKey((k) => k + 1);
              }}
              className="text-[10px] font-semibold uppercase text-muted-foreground hover:text-accent"
            >
              Muat ulang
            </button>
          </div>
          <iframe
            key={previewKey}
            title="studio preview"
            sandbox="allow-scripts allow-popups"
            srcDoc={previewDoc}
            className="h-full min-h-[400px] w-full flex-1 bg-white"
          />
        </section>
      </div>
    </main>
  );
}
