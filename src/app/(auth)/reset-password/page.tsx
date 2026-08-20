"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/db/client";
import { StatusChip } from "@/components/design/status-chip";
import { Icon } from "@/components/design/icon";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
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
            PASSWORD BARU
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Buat password baru untuk akunmu.
          </p>
        </div>

        <form onSubmit={(e) => void submit(e)} className="space-y-4">
          <div>
            <label
              className="mb-1 block text-xs text-muted-foreground"
              htmlFor="password"
            >
              PASSWORD BARU
            </label>
            <div className="relative">
              <input
                id="password"
                type={show ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 pr-10 text-sm outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
                aria-pressed={show}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition hover:text-foreground"
              >
                {show ? (
                  <Icon name="eyeOff" size={16} />
                ) : (
                  <Icon name="eye" size={16} />
                )}
              </button>
            </div>
          </div>
          <div>
            <label
              className="mb-1 block text-xs text-muted-foreground"
              htmlFor="confirm"
            >
              KONFIRMASI PASSWORD
            </label>
            <input
              id="confirm"
              type={show ? "text" : "password"}
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </form>

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