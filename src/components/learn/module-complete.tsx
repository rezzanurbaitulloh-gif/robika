"use client";

import { useState } from "react";
import { StatusChip } from "@/components/design/status-chip";
import { Icon } from "@/components/design/icon";

export type LearnItemType = "module" | "quiz";

interface ModuleCompleteProps {
  itemType: LearnItemType;
  itemId: string;
  initialDone: boolean;
  quizPassed?: boolean;
}

export function ModuleComplete({
  itemType,
  itemId,
  initialDone,
  quizPassed,
}: ModuleCompleteProps) {
  const [done, setDone] = useState(initialDone);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    tone: "success" | "danger" | "info";
    text: string;
  } | null>(null);

  const isQuiz = itemType === "quiz";
  const canComplete = isQuiz ? quizPassed === true : true;

  const complete = async () => {
    if (done || busy || !canComplete) return;
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch("/api/learn/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_type: itemType, item_id: itemId }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        already_done?: boolean;
        xp?: number;
        stars?: number;
        leveled_up?: boolean;
        error?: string;
      };
      if (!response.ok || !data.ok) {
        setMessage({ tone: "danger", text: `Gagal: ${data.error ?? "unknown"}` });
        return;
      }
      setDone(true);
      if (data.already_done) {
        setMessage({ tone: "info", text: "Sudah diselesaikan sebelumnya." });
      } else {
        setMessage({
          tone: "success",
          text: `Selesai! +${data.xp} XP · +${data.stars} stars${data.leveled_up ? " · Naik level!" : ""}`,
        });
      }
    } catch {
      setMessage({ tone: "danger", text: "Koneksi bermasalah. Coba lagi." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-8 rounded-xl border border-accent/30 bg-accent/5 p-5">
      {message ? (
        <div
          className={`mb-3 rounded-lg border px-4 py-2.5 text-sm ${
            message.tone === "success"
              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
              : message.tone === "danger"
                ? "border-rose-400/40 bg-rose-400/10 text-rose-300"
                : "border-sky-400/40 bg-sky-400/10 text-sky-300"
          }`}
        >
          {message.text}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {done ? "Selesai" : "Tandai selesai"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isQuiz
              ? "Selesaikan kuis dengan benar untuk mendapat reward."
              : "Selesaikan materi ini untuk mendapat reward."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!done && (
            <StatusChip
              status="warning"
              label={isQuiz ? "+75 XP · +3 stars" : "+50 XP · +2 stars"}
            />
          )}
          <button
            type="button"
            disabled={done || busy || !canComplete}
            onClick={() => void complete()}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-40 ${
              done
                ? "cursor-default border border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                : "bg-accent text-accent-foreground hover:brightness-110"
            }`}
          >
            {done ? (
              <>
                <Icon name="check" size={16} /> Selesai
              </>
            ) : busy ? (
              "Menyimpan..."
            ) : (
              "Tandai Selesai"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}