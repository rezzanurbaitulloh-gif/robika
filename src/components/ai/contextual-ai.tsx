"use client";

import { useEffect, useRef, useState } from "react";
import { streamAiChat } from "@/lib/ai/client";
import type { AiContext, AiMode } from "@/lib/ai/types";

interface ContextualAiProps {
  mode: AiMode;
  label: string;
  question: string;
  context?: AiContext;
  testId?: string;
}

const ERROR_TEXT: Record<string, string> = {
  quota_exceeded: "Kuota AI harianmu sudah habis. Coba lagi besok!",
  mentor_locked: "AI Mentor belum aktif. Mulai trial atau berlangganan dulu.",
};

export function ContextualAi({
  mode,
  label,
  question,
  context,
  testId,
}: ContextualAiProps) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const ask = async () => {
    if (busy) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setOpen(true);
    setAnswer("");
    setErrorText(null);
    setBusy(true);

    let buffer = "";
    const result = await streamAiChat(mode, question, context, {
      signal: controller.signal,
      onToken: (token) => {
        buffer += token;
        setAnswer(buffer);
      },
    });

    if (!result.ok && buffer === "") {
      setErrorText(
        ERROR_TEXT[result.error ?? ""] ??
          "AI sedang tidak tersedia. Coba lagi sebentar.",
      );
    }
    if (!controller.signal.aborted) setBusy(false);
  };

  const close = () => {
    abortRef.current?.abort();
    setOpen(false);
    setBusy(false);
  };

  return (
    <span className="inline-flex flex-col items-start gap-1 align-top">
      <button
        type="button"
        onClick={() => void ask()}
        className="rounded-sm border border-cyan-400/50 bg-cyan-400/10 px-2 py-0.5 font-display text-[10px] uppercase tracking-wider text-cyan-300 transition hover:bg-cyan-400/20"
      >
        {label}
      </button>
      {open && (
        <span
          data-testid={testId ? `${testId}-panel` : undefined}
          className="block w-full min-w-[220px] rounded-sm border border-cyan-400/30 bg-[#101527] p-2 text-left text-xs leading-relaxed text-cyan-50"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Tutup"
            className="float-right ml-2 text-muted-foreground hover:text-rose-300"
          >
            ✕
          </button>
          {errorText ? (
            <span className="text-rose-300">{errorText}</span>
          ) : (
            <>
              {answer || "..."}
              {busy && <span className="animate-pulse">▋</span>}
            </>
          )}
        </span>
      )}
    </span>
  );
}
