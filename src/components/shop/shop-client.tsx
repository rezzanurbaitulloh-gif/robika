"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/db/client";
import { StatusChip } from "@/components/design/status-chip";
import { BackButton } from "@/components/design/back-button";
import { Icon, type IconName } from "@/components/design/icon";
import { BotAvatar } from "@/components/design/bot-avatar";
import { PAYMENT_ITEMS, type PaymentItem } from "@/lib/payments/packages";
import { SKIN_ITEMS, type SkinItem } from "@/lib/shop/catalog";

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
  const [equipped, setEquipped] = useState<string | null>(null);
  const [balance, setBalance] = useState<{ stars: number; gems: number } | null>(null);
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
      const { data: wallet } = await supabase
        .from("wallets")
        .select("stars, gems")
        .eq("profile_id", user.id)
        .maybeSingle();
      if (wallet) setBalance({ stars: wallet.stars ?? 0, gems: wallet.gems ?? 0 });
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("trial_ends_at, paid_until")
        .eq("profile_id", user.id)
        .maybeSingle();
      if (sub?.trial_ends_at) setTrialEnds(sub.trial_ends_at);
      const { data: profile } = await supabase
        .from("profiles")
        .select("skin_id")
        .eq("id", user.id)
        .maybeSingle<{ skin_id: string | null }>();
      setEquipped(profile?.skin_id ?? null);
    })();
  }, []);

  const equip = async (item: SkinItem) => {
    if (busy) return;
    setBusy(item.id);
    setNotice(null);
    try {
      const res = await fetch("/api/profile/skin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      });
      if (res.ok) {
        setEquipped(item.id);
        setNotice({ tone: "success", text: `${item.name} dipakai — BOT-1 di game ikut berubah!` });
      } else {
        setNotice({ tone: "error", text: "Gagal memakai skin. Coba lagi." });
      }
    } finally {
      setBusy(null);
    }
  };

  const buy = async (item: SkinItem) => {
    if (busy) return;
    setBusy(item.id);
    setNotice(null);
    try {
      const response = await fetch("/api/shop/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: item.id }),
      });
      const data = (await response.json()) as { error?: string; balance?: number };
      if (!response.ok) {
        if (response.status === 402) {
          setNotice({
            tone: "error",
            text: `Saldo tidak cukup — butuh ${data.balance}${item.priceStars !== undefined ? " stars" : " gems"}.`,
          });
        } else if (data.error === "already_owned") {
          setNotice({ tone: "error", text: "Skin ini sudah kamu miliki." });
        } else {
          setNotice({
            tone: "error",
            text: `Gagal membeli: ${data.error ?? "unknown"}`,
          });
        }
        return;
      }
      setOwned((prev) => [...prev, item.id]);
      setBalance((prev) =>
        prev
          ? item.priceStars !== undefined
            ? { ...prev, stars: prev.stars - (item.priceStars ?? 0) }
            : { ...prev, gems: prev.gems - (item.priceGems ?? 0) }
          : prev,
      );
      setNotice({ tone: "success", text: `${item.name} dibeli!` });
    } finally {
      setBusy(null);
    }
  };

  const canAfford = (item: SkinItem) =>
    balance === null ||
    (item.priceStars !== undefined
      ? balance.stars >= item.priceStars
      : balance.gems >= (item.priceGems ?? 0));

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
        if (data.error === "trial_used") {
          setNotice({ tone: "error", text: "Trial sudah pernah digunakan — maksimal satu kali per akun." });
        } else if (data.error === "already_paid") {
          setNotice({ tone: "success", text: "Langganan kamu sudah aktif — tidak perlu trial." });
        } else {
          setNotice({ tone: "error", text: `Trial gagal: ${data.error ?? "unknown"}` });
        }
        return;
      }
      setTrialEnds(data.trial_ends_at ?? null);
      setNotice({ tone: "success", text: "Trial Mentor 7 hari aktif. Selamat belajar!" });
    } finally {
      setBusy(null);
    }
  };

  const buyButtonClass =
    "rounded-sm border border-cyan-400/40 px-2.5 py-1 font-display text-[11px] uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:hover:bg-transparent";

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <div className="mb-2">
        <BackButton fallbackHref="/dashboard" />
      </div>
      <div className="base-floor scanline relative mb-6 overflow-hidden rounded-md border border-border p-5">
        <div className="absolute right-3 top-3 flex gap-1.5">
          <span className="blink h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400/40" />
        </div>
        <p className="font-display text-[10px] uppercase tracking-widest text-cyan-300/70">
          ▸ HANGAR PERDAGANGAN · MOD KOSMETIK
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl tracking-wide sm:text-3xl text-foreground">
            TOKO
          </h1>
          {balance && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-sm border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 font-display text-xs tracking-wide text-amber-300">
                <Icon name="star" size={14} /> {balance.stars}
              </span>
              <span className="inline-flex items-center gap-1 rounded-sm border border-fuchsia-400/40 bg-fuchsia-400/10 px-2.5 py-1 font-display text-xs tracking-wide text-fuchsia-300">
                <Icon name="gem" size={14} /> {balance.gems}
              </span>
            </div>
          )}
        </div>
        <p className="mt-1 max-w-lg text-sm text-muted-foreground">
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
        <h2 className="mb-4 font-display text-sm uppercase tracking-widest text-cyan-300/80">
          ▸ INVENTARIS SKIN BOT-1
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SKIN_ITEMS.map((item) => {
            const isOwned = owned.includes(item.id);
            const isEquipped = equipped === item.id;
            const rarity = RARITY_TONE[item.rarity];
            const afford = canAfford(item);
            return (
              <div
                key={item.id}
                className={`flex flex-col rounded-sm border bg-[#0c101d] p-4 transition ${
                  isEquipped
                    ? "border-cyan-400/50"
                    : "border-border hover:border-cyan-400/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <StatusChip status={rarity} label={item.rarity.toUpperCase()} />
                  {isEquipped && (
                    <span className="font-display text-[9px] tracking-widest text-cyan-300">
                      [DIPAKAI]
                    </span>
                  )}
                </div>
                <div
                  className="mx-auto my-4 rounded-sm border border-border bg-background/60 p-3"
                  style={{ boxShadow: `0 0 12px ${item.colors.glow}33` }}
                >
                  <BotAvatar colors={item.colors} size={48} />
                </div>
                <p className="font-display text-sm uppercase tracking-wider text-foreground">
                  {item.name}
                </p>
                <p className="mt-0.5 font-display text-base text-amber-300">
                  {isOwned
                    ? isEquipped
                      ? "TERPAKAI"
                      : "DIMILIKI"
                    : item.priceStars !== undefined
                      ? `${item.priceStars} ★`
                      : `${item.priceGems} ◆`}
                </p>
                <div className="mt-3 flex justify-end">
                  {isOwned ? (
                    <button
                      type="button"
                      disabled={isEquipped || busy !== null}
                      onClick={() => void equip(item)}
                      className={buyButtonClass}
                    >
                      {isEquipped ? "✓ Dipakai" : busy === item.id ? "..." : "Pakai"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busy !== null || !afford}
                      onClick={() => void buy(item)}
                      className={buyButtonClass}
                    >
                      {busy === item.id ? "..." : afford ? "Beli" : "Saldo kurang"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-1 font-display text-sm uppercase tracking-widest text-cyan-300/80">
          ▸ ISI ULANG SALDO (MIDTRANS SANDBOX)
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Mode uji coba — pakai kartu tes Midtrans: 4811 1111 1111 1114, CVV
          apa pun, exp. bulan depan, OTP 112233.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PAYMENT_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col rounded-sm border border-border bg-[#0c101d] p-4 transition hover:border-cyan-400/40"
            >
              <span className="grid h-10 w-10 place-items-center rounded-sm border border-border bg-input/30 text-cyan-300">
                <Icon name={(TOPUP_ICON[item.id] ?? "cart") as IconName} size={20} />
              </span>
              <p className="mt-3 font-display text-sm uppercase tracking-wider text-foreground">
                {item.name}
              </p>
              <p className="mt-1 flex-1 text-xs text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <StatusChip
                  status={item.effect.type === "mentor" ? "info" : "neutral"}
                  label={item.effect.type.toUpperCase()}
                />
                <span className="font-display text-base text-amber-300">
                  {formatPrice(item.price)}
                </span>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => void checkout(item)}
                  className={buyButtonClass}
                >
                  {busy === item.id ? "..." : "Beli"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-1 font-display text-sm uppercase tracking-widest text-cyan-300/80">
          ▸ AI MENTOR
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Satu kali kesempatan trial 7 hari, lalu paket bulanan via top-up.
        </p>
        <div className="rounded-sm border border-border bg-[#0c101d] p-5 transition hover:border-cyan-400/40 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-sm border border-border bg-input/30 text-fuchsia-300">
                <Icon name="brain" size={18} />
              </span>
              <p className="font-display text-sm uppercase tracking-wider text-foreground">
                Mentor Trial 7 Hari
              </p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {trialEnds
                ? `Aktif — berakhir ${new Date(trialEnds).toLocaleDateString("id-ID")}`
                : "Akses penuh AI Mentor, gratis 7 hari pertama."}
            </p>
            <div className="mt-3">
              <StatusChip
                status={trialEnds ? "success" : "warning"}
                label={trialEnds ? "TRIAL AKTIF" : "BELUM DIAKTIFKAN"}
              />
            </div>
          </div>
          <button
            type="button"
            disabled={busy !== null || trialEnds !== null}
            onClick={() => void activateTrial()}
            className={`${buyButtonClass} mt-4 shrink-0 sm:mt-0`}
          >
            {trialEnds ? "Sudah Aktif" : busy === "trial" ? "..." : "Aktivasi Trial"}
          </button>
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Pembelian skin bintang memakai saldo belajar (stars) — dikreditkan saat
        menyelesaikan level.{" "}
        <Link href="/dashboard" className="text-cyan-300 hover:underline">
          Kembali ke base
        </Link>
      </p>
    </main>
  );
}