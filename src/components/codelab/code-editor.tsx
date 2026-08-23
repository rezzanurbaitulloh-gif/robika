"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

const monacoSelf = self as unknown as {
  MonacoEnvironment?: {
    getWorker?: () => Worker;
  };
};

monacoSelf.MonacoEnvironment = {
  getWorker() {
    return new Worker(
      new URL("../../lib/codelab/monaco-editor-worker.ts", import.meta.url),
      { type: "module" },
    );
  },
};

loader.config({ monaco });

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  { ssr: false },
);

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: "javascript" | "python" | "html" | "css";
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
        className="flex items-center justify-center rounded-lg border border-border bg-input text-sm text-muted-foreground"
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
      loading={
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Memuat editor...
        </div>
      }
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
