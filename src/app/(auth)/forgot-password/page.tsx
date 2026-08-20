"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/db/client";
import { getSiteUrl } from "@/lib/site-url";
import { StatusChip } from "@/components/design/status-chip";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Robika"
            className="mx-auto mb-4 h-14 w-14 rounded-2xl border border-accent/30 shadow-[0_0_24px_rgba(59,130,246,0.25)]"
          />
          <h1 className="glow-text font-display text-2xl tracking-widest text-accent">
            RESET PASSWORD
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kami kirimkan tautan reset ke email kamu.
          </p>
        </div>

        {sent ? (
          <div className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-center text-sm text-emerald-200">
            Tautan reset terkirim ke <span className="font-semibold">{email}</span>.
            Periksa kotak masuk (dan spam).
          </div>
        ) : (
          <form onSubmit={(e) => void submit(e)} className="space-y-4">
            <div>
              <label
                className="mb-1 block text-xs text-muted-foreground"
                htmlFor="email"
              >
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent btn-md w-full"
            >
              {loading ? "Mengirim..." : "Kirim Tautan Reset"}
            </button>
          </form>
        )}

        <div className="mt-6 flex flex-col items-center gap-3">
          <Link href="/login" className="text-sm text-accent hover:underline">
            Kembali ke masuk
          </Link>
          <StatusChip status="info" label="AMAN · FREE TIER" />
        </div>
      </div>
    </main>
  );
}