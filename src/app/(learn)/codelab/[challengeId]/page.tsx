"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { challenges } from "@/content/codelab";
import { checkOutput } from "@/lib/codelab/check";
import { runChallenge } from "@/lib/codelab/runner";
import { CodeEditor } from "@/components/codelab/code-editor";
import { HintPanel } from "@/components/game/hint-panel";
import { StatusChip } from "@/components/design/status-chip";
import { BackButton } from "@/components/design/back-button";
import { Icon } from "@/components/design/icon";

export default function ChallengePage({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const [challengeId, setChallengeId] = useState("");

  void params.then((p) => setChallengeId(p.challengeId));

  const challenge = challenges.find((c) => c.id === challengeId);
  if (!challengeId) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Memuat...</div>;
  }
  if (!challenge) notFound();

  return <ChallengeInner key={challenge.id} challengeId={challenge.id} />;
}

function ChallengeInner({ challengeId }: { challengeId: string }) {
  const challenge = challenges.find((c) => c.id === challengeId)!;
  const [code, setCode] = useState(challenge.starterCode);
  const [stdout, setStdout] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [passed, setPassed] = useState<boolean | null>(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setError(undefined);
    if (challenge.kind === "preview") {
      setStdout("Preview dirender di panel kanan.");
      setPassed(null);
      setRunning(false);
      return;
    }
    const result = await runChallenge(challenge, code);
    setStdout(result.stdout);
    setError(result.error);
    if (!result.error) {
      const check = checkOutput(challenge.expected ?? "", result.stdout, {
        mode: challenge.mode,
      });
      setPassed(check.passed);
    } else {
      setPassed(false);
    }
    setRunning(false);
  };

  const previewHtml = challenge.kind === "preview" && challenge.html
    ? challenge.html.replace("__CODE__", `<script>${code}\n</script>`)
    : null;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6">
        <BackButton fallbackHref="/dashboard" />
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <h1 className="font-display text-2xl tracking-wide text-foreground">
            {challenge.title.id}
          </h1>
          <div className="flex items-center gap-2">
            <StatusChip
              status={challenge.lang === "python" ? "info" : "neutral"}
              label={
                challenge.kind === "fix-bug"
                  ? "FIX BUG"
                  : challenge.kind === "preview"
                    ? "PREVIEW"
                    : challenge.lang === "python"
                      ? "PYTHON"
                      : "JAVASCRIPT"
              }
            />
            {passed === true && <StatusChip status="success" label="LULUS" />}
            {passed === false && <StatusChip status="danger" label="BELUM" />}
          </div>
        </div>
        <p className="mt-2 text-sm text-foreground">{challenge.description.id}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {challenge.kind === "fix-bug" && challenge.bugs && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-4">
              <h3 className="mb-2 flex items-center gap-1.5 font-display text-sm tracking-wide text-rose-300">
                <Icon name="alert" size={18} />
                BUG YANG HARUS DIPERBAIKI
              </h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-foreground/90">
                {challenge.bugs.map((bug, i) => (
                  <li key={i}>{bug}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-border">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/60 px-4 py-2">
              <span className="font-display text-xs tracking-widest text-muted-foreground">
                {challenge.kind === "output"
                  ? "TULIS KODE"
                  : challenge.kind === "fix-bug"
                    ? "PERBAIKI KODE"
                    : challenge.kind === "preview"
                      ? "EDIT SKRIP"
                      : "LENGKAPI KODE"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCode(challenge.starterCode)}
                  className="rounded-lg border border-border px-3 py-1 text-xs transition hover:bg-muted"
                >
                  <span className="inline-flex items-center gap-1">
                    <Icon name="refresh" size={14} />
                    Reset
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => void run()}
                  disabled={running}
                  className="rounded-lg bg-accent px-4 py-1 text-sm font-semibold text-accent-foreground transition hover:brightness-110 disabled:opacity-50"
                >
                  {running ? (
                    "Menjalankan..."
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Icon name="play" size={14} />
                      Jalankan
                    </span>
                  )}
                </button>
              </div>
            </div>
            <CodeEditor
              value={code}
              onChange={setCode}
              height="280px"
              language={challenge.lang}
            />
          </div>

          {previewHtml ? (
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="border-b border-border bg-muted/60 px-4 py-2">
                <span className="font-display text-xs tracking-widest text-muted-foreground">
                  PREVIEW LIVE
                </span>
              </div>
              { }
              <iframe
                title="preview"
                sandbox="allow-scripts"
                srcDoc={previewHtml}
                className="h-72 w-full bg-white"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-slate-950 p-4">
              <div className="mb-2 font-display text-xs tracking-widest text-muted-foreground">
                OUTPUT
              </div>
              <pre className="min-h-[48px] whitespace-pre-wrap text-sm text-emerald-200">
                {error ? (
                  <span className="text-rose-300">{error}</span>
                ) : (
                  stdout || "— belum ada output —"
                )}
              </pre>
              {passed === false && !error && (
                <p className="mt-2 text-xs text-rose-300">
                  Output tidak cocok. Cek kembali kode kamu.
                </p>
              )}
            </div>
          )}
        </div>

        <HintPanel hints={challenge.hints} />
      </div>
    </main>
  );
}