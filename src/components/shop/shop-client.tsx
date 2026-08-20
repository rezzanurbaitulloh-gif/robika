"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/db/client";
import { StatusChip } from "@/components/design/status-chip";
import { BentoCard } from "@/components/design/bento-card";
import { BackButton } from "@/components/design/back-button";
import { Icon, type IconName } from "@/components/design/icon";
import { PAYMENT_ITEMS, type PaymentItem } from "@/lib/payments/packages";

const ITEMS = [
  {
    id: "skin-bot-classic",
    name: "BOT-1 Classic",
    rarity: "common",
    priceStars: 500,
    icon: "robot",
  },
  {
    id: "skin-bot-neon",
    name: "BOT-1 Neon",
    rarity: "epic",
    priceStars: 2500,
    icon: "bolt",
  },
  {
    id: "skin-bot-gold",
    name: "BOT-1 Gold",
    rarity: "legendary",
    priceGems: 250,
    icon: "trophy",
  },
  {
    id: "skin-bot-void",
    name: "BOT-1 Void",
    rarity: "mythic",
    priceGems: 600,
    icon: "moon",
  },
] as const;

const RARITY_TONE: Record<string, "neutral" | "info" | "warning" | "success"> = {
  common: "neutral",
  epic: "info",
  legendary: "warning",
  mythic: "success",
};

const TOPUP_ICON: Record<string, string> = {
  "hints-10": "star",
  "hints-30": "star",
  "hints-150": "star",
  "gems-100": "gem",
  "gems-300": "gem",
  "gems-700": "gem",
  "mentor-1m": "brain",
};

interface SnapResult {
  token: string;
  redirect_url: string;
  order_id: string;
  snap_base: string;
}

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

function loadSnap(baseUrl: string): Promise<{ pay: (token: string, handlers: object) => void }> {
  return new Promise((resolve, reject) => {
    const existing = (window as unknown as { snap?: { pay: (token: string, handlers: object) => void } }).snap;
    if (existing) {
      resolve(existing);
      return;
    }
    const script = document.createElement("script");
    script.src = `${baseUrl}/snap/snap.js`;
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "",
    );
    script.onload = () =>
      resolve((window as unknown as { snap: { pay: (token: string, handlers: object) => void } }).snap);
    script.onerror = () => reject(new Error("snap_load_failed"));
    document.body.appendChild(script);
  });
}

export function ShopClient() {
  const [owned, setOwned] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [trialEnds, setTrialEnds] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: inv } = await supabase.from("inventory").select("item_id");
      setOwned((inv ?? []).map((r) => r.item_id));
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("trial_ends_at, paid_until")
        .eq("profile_id", user.id)
        .maybeSingle();
      if (sub?.trial_ends_at) setTrialEnds(sub.trial_ends_at);
    })();
  }, []);

  const buy = async (itemId: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("inventory")
      .insert({ profile_id: user.id, item_id: itemId });
    if (!error) {
      setOwned((prev) => [...prev, itemId]);
    }
  };

  const checkout = async (item: PaymentItem) => {
    if (busy) return;
    setBusy(item.id);
    setNotice(null);
    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      });
      const data = (await response.json()) as SnapResult & { error?: string };
      if (!response.ok || !data.token) {
        setNotice({ tone: "error", text: `Gagal membuat transaksi: ${data.error ?? "unknown"}` });
        return;
      }
      const snap = await loadSnap(data.snap_base);
      snap.pay(data.token, {
        onSuccess: () =>
          setNotice({ tone: "success", text: "Pembayaran sukses — saldo dikreditkan otomatis." }),
        onPending: () =>
          setNotice({ tone: "success", text: "Menunggu pembayaran — saldo kredit setelah konfirmasi." }),
        onError: () => setNotice({ tone: "error", text: "Pembayaran dibatalkan atau gagal." }),
        onClose: () => setNotice(null),
      });
    } catch (err) {
      setNotice({
        tone: "error",
        text: `Gagal membuka pembayaran: ${err instanceof Error ? err.message : "unknown"}`,
      });
    } finally {
      setBusy(null);
    }
  };

  const activateTrial = async () => {
    setBusy("trial");
    setNotice(null);
    try {
      const response = await fetch("/api/payments/trial", { method: "POST" });
      const data = (await response.json()) as { trial_ends_at?: string; error?: string };
      if (!response.ok) {
        setNotice({ tone: "error", text: `Trial gagal: ${data.error ?? "unknown"}` });
        return;
      }
      setTrialEnds(data.trial_ends_at ?? null);
      setNotice({ tone: "success", text: "Trial Mentor 7 hari aktif. Selamat belajar!" });
    } finally {
      setBusy(null);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-2">
        <BackButton fallbackHref="/dashboard" />
      </div>
      <div className="mb-8">
        <h1 className="font-display text-3xl tracking-wide text-foreground">
          SHOP KOSMETIK
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bintang dari belajar, gem dari top-up. Murni kosmetik — tidak ada
          pay-to-win.
        </p>
      </div>

      {notice && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            notice.tone === "success"
              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
              : "border-rose-400/40 bg-rose-400/10 text-rose-300"
          }`}
        >
          {notice.text}
        </div>
      )}

      <section className="mb-12">
        <h2 className="mb-4 font-display text-xl tracking-wide text-foreground">
          SKIN BOT-1
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => {
            const isOwned = owned.includes(item.id);
            const rarity = RARITY_TONE[item.rarity];
            return (
              <BentoCard
                key={item.id}
                title={item.name}
                description={`Rarity: ${item.rarity}`}
                icon={<Icon name={item.icon as IconName} size={22} />}
                footer={
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg text-accent">
                      {"priceStars" in item
                        ? `${item.priceStars} stars`
                        : `${item.priceGems} gems`}
                    </span>
                    <button
                      type="button"
                      disabled={isOwned}
                      onClick={() => void buy(item.id)}
                      className="rounded-lg border border-accent/50 px-3 py-1 text-xs font-semibold text-accent transition hover:bg-accent/10 disabled:opacity-40"
                    >
                      {isOwned ? "Dimiliki" : "Beli"}
                    </button>
                  </div>
                }
              >
                <StatusChip status={rarity} label={item.rarity.toUpperCase()} />
              </BentoCard>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-1 font-display text-xl tracking-wide text-foreground">
          TOP-UP (MIDTRANS SANDBOX)
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Mode uji coba — pakai kartu tes Midtrans: 4811 1111 1111 1114, CVV
          apa pun, exp. bulan depan, OTP 112233.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PAYMENT_ITEMS.map((item) => (
            <BentoCard
              key={item.id}
              title={item.name}
              description={item.description}
              icon={<Icon name={(TOPUP_ICON[item.id] ?? "cart") as IconName} size={22} />}
              footer={
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg text-accent">
                    {formatPrice(item.price)}
                  </span>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => void checkout(item)}
                    className="rounded-lg border border-accent/50 px-3 py-1 text-xs font-semibold text-accent transition hover:bg-accent/10 disabled:opacity-40"
                  >
                    {busy === item.id ? "..." : "Beli"}
                  </button>
                </div>
              }
            >
              <StatusChip
                status={item.effect.type === "mentor" ? "info" : "neutral"}
                label={item.effect.type.toUpperCase()}
              />
            </BentoCard>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-1 font-display text-xl tracking-wide text-foreground">
          AI MENTOR
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Satu kali kesempatan trial 7 hari, lalu paket bulanan via top-up.
        </p>
        <BentoCard
          title="Mentor Trial 7 Hari"
          description={
            trialEnds
              ? `Aktif — berakhir ${new Date(trialEnds).toLocaleDateString("id-ID")}`
              : "Akses penuh AI Mentor, gratis 7 hari pertama."
          }
          icon={<Icon name="brain" size={22} />}
          footer={
            <button
              type="button"
              disabled={busy !== null || trialEnds !== null}
              onClick={() => void activateTrial()}
              className="rounded-lg border border-accent/50 px-3 py-1 text-xs font-semibold text-accent transition hover:bg-accent/10 disabled:opacity-40"
            >
              {trialEnds ? "Sudah Aktif" : busy === "trial" ? "..." : "Aktivasi Trial"}
            </button>
          }
        >
          <StatusChip
            status={trialEnds ? "success" : "warning"}
            label={trialEnds ? "TRIAL AKTIF" : "BELUM DIAKTIFKAN"}
          />
        </BentoCard>
      </section>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Pembelian skin bintang memakai saldo belajar (stars) — dikreditkan saat
        menyelesaikan level.{" "}
        <Link href="/dashboard" className="text-accent hover:underline">
          Kembali
        </Link>
      </p>
    </main>
  );
}