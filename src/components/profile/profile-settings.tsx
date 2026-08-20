"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PRESET_AVATARS } from "@/lib/profile/validation";
import { StatusChip } from "@/components/design/status-chip";
import { Icon } from "@/components/design/icon";

interface ProfileSettingsProps {
  initial: {
    username: string;
    displayName: string;
    avatarUrl: string;
    skillLevel: "pemula" | "menengah" | "lanjut";
  };
  onUpdated?: (updated: {
    username?: string;
    displayName?: string;
    avatarUrl?: string;
    skillLevel?: "pemula" | "menengah" | "lanjut";
  }) => void;
}

const SKILL_OPTIONS = ["pemula", "menengah", "lanjut"] as const;

export function ProfileSettings({ initial, onUpdated }: ProfileSettingsProps) {
  const [username, setUsername] = useState(initial.username);
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [skillLevel, setSkillLevel] = useState(initial.skillLevel);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    tone: "success" | "danger";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const resizeToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("read_failed"));
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const max = 256;
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("canvas_unavailable"));
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => reject(new Error("image_decode_failed"));
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });

  const onFileChange = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await resizeToDataUrl(file);
      setAvatarUrl(dataUrl);
      setMessage(null);
    } catch {
      setMessage({ tone: "danger", text: "Gagal membaca gambar. Coba file lain." });
    }
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          display_name: displayName,
          avatar_url: avatarUrl,
          skill_level: skillLevel,
        }),
      });
      const data = (await response.json()) as { error?: string; field?: string; ok?: boolean };
      if (!response.ok) {
        setMessage({
          tone: "danger",
          text: data.error ?? "Gagal menyimpan perubahan.",
        });
        return;
      }
      setMessage({ tone: "success", text: "Profil berhasil diperbarui!" });
      onUpdated?.({
        username,
        displayName,
        avatarUrl,
        skillLevel,
      });
      router.refresh();
    } catch {
      setMessage({ tone: "danger", text: "Koneksi bermasalah. Coba lagi." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-slate-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-sm tracking-wide text-foreground">
          PENGATURAN PROFIL
        </h2>
        <span className="flex items-center gap-2">
          {saving ? (
            <StatusChip status="neutral" label="Menyimpan..." />
          ) : (
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-110 disabled:opacity-50"
            >
              Simpan
            </button>
          )}
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="profile-display-name"
              className="mb-1 block text-xs text-muted-foreground"
            >
              NAMA TAMPILAN
            </label>
            <input
              id="profile-display-name"
              value={displayName}
              maxLength={50}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-border bg-slate-950 px-3 py-2 text-sm outline-none focus:border-accent"
              placeholder="Nama yang ditampilkan"
            />
          </div>
          <div>
            <label
              htmlFor="profile-username"
              className="mb-1 block text-xs text-muted-foreground"
            >
              USERNAME
            </label>
            <input
              id="profile-username"
              value={username}
              maxLength={20}
              pattern="[a-zA-Z0-9_]{3,20}"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border bg-slate-950 px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              3–20 karakter, huruf/angka/underscore.
            </p>
          </div>
          <div>
            <label
              htmlFor="profile-skill"
              className="mb-1 block text-xs text-muted-foreground"
            >
              LEVEL KEAIHLIAN
            </label>
            <select
              id="profile-skill"
              value={skillLevel}
              onChange={(e) =>
                setSkillLevel(e.target.value as (typeof SKILL_OPTIONS)[number])
              }
              className="w-full rounded-lg border border-border bg-slate-950 px-3 py-2 text-sm outline-none focus:border-accent"
            >
              {SKILL_OPTIONS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <span className="mb-1 block text-xs text-muted-foreground">AVATAR</span>
          <div className="flex items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border bg-slate-950 text-3xl">
              {avatarUrl.length > 8 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                avatarUrl
              )}
            </span>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {PRESET_AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatarUrl(emoji)}
                    aria-label={`Pilih avatar ${emoji}`}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-lg transition hover:border-accent ${
                      avatarUrl === emoji
                        ? "border-accent bg-accent/20"
                        : "border-border bg-slate-950"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-accent/50 px-3 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent/10"
              >
                <Icon name="camera" size={14} /> Upload foto
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(e) => void onFileChange(e.target.files?.[0])}
              />
              <p className="text-[10px] text-muted-foreground">
                Foto dipangkas otomatis ke 256px (maks 300KB).
              </p>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`mt-4 rounded-lg border px-4 py-2.5 text-sm ${
            message.tone === "success"
              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
              : "border-rose-400/40 bg-rose-400/10 text-rose-300"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}