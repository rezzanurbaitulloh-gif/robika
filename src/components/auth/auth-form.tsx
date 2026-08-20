"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/client";
import { StatusChip } from "@/components/design/status-chip";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleLogin = async () => {
    setOauthLoading(true);
    setError(null);
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    setOauthLoading(false);
    if (error) {
      setError(error.message);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                username: email.split("@")[0].slice(0, 20),
              },
            },
          });

    setLoading(false);
    if (error) {
      setError(
        mode === "register" && error.message.includes("already")
          ? "Email sudah terdaftar. Silakan masuk."
          : error.message,
      );
      return;
    }
    router.push(mode === "register" ? "/onboarding" : "/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl tracking-widest text-foreground">
          {mode === "login" ? "MASUK" : "DAFTAR"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login"
            ? "Selamat datang kembali, pelajar!"
            : "Mulai petualangan coding gratis."}
        </p>
      </div>

      <form onSubmit={(e) => void submit(e)} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground" htmlFor="email">
            EMAIL
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-slate-950 px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label
            className="mb-1 block text-xs text-muted-foreground"
            htmlFor="password"
          >
            PASSWORD
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-slate-950 px-3 py-2 pr-10 text-sm outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition hover:text-foreground"
            >
              {showPassword ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
            {error}
          </div>
        )}

        <div className="relative py-1 text-center">
          <span className="relative z-10 bg-background px-3 text-[10px] tracking-widest text-muted-foreground">
            ATAU
          </span>
          <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        </div>

        <button
          type="button"
          disabled={oauthLoading || loading}
          onClick={() => void googleLogin()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-slate-950 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
            />
          </svg>
          {oauthLoading ? "Mengarahkan ke Google..." : "Lanjutkan dengan Google"}
        </button>

        <button
          type="submit"
          disabled={loading || oauthLoading}
          className="w-full rounded-lg bg-accent px-4 py-2.5 font-semibold text-accent-foreground transition hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Memproses..." : mode === "login" ? "Masuk" : "Buat Akun"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            Belum punya akun?{" "}
            <Link href="/register" className="text-accent hover:underline">
              Daftar gratis
            </Link>
          </>
        ) : (
          <>
            Sudah punya akun?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Masuk
            </Link>
          </>
        )}
      </p>

      <div className="mt-8 flex justify-center">
        <StatusChip status="info" label="🔒 AMAN · FREE TIER" />
      </div>
    </div>
  );
}