"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  { ssr: false },
);

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: "javascript" | "python";
  height?: string;
}

const emptySubscribe = () => () => {};

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  height = "320px",
}: CodeEditorProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-border bg-slate-950 text-sm text-muted-foreground"
        style={{ height }}
      >
        Memuat editor...
      </div>
    );
  }

  return (
    <MonacoEditor
      height={height}
      language={language}
      theme="vs-dark"
      value={value}
      onChange={(next) => onChange(next ?? "")}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "Fira Code, monospace",
        scrollBeyondLastLine: false,
        padding: { top: 12, bottom: 12 },
        tabSize: 2,
      }}
    />
  );
}