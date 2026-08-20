export const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export const SKILL_LEVELS = ["pemula", "menengah", "lanjut"] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

const MAX_AVATAR_BYTES = 300_000;
const DATA_URL_PATTERN = /^data:image\/(png|jpeg|webp|gif);base64,/;
const PRESET_AVATAR_PATTERN = /^[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u200D]+\s{0,2}[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u200D]*$/u;

export function validateUsername(username: string): string | null {
  if (!USERNAME_PATTERN.test(username)) {
    return "Username 3–20 karakter, hanya huruf, angka, atau underscore.";
  }
  return null;
}

export function validateDisplayName(displayName: string): string | null {
  const trimmed = displayName.trim();
  if (trimmed.length === 0 || trimmed.length > 50) {
    return "Nama tampilan 1–50 karakter.";
  }
  return null;
}

export function validateAvatar(avatarUrl: string): string | null {
  const trimmed = avatarUrl.trim();
  if (trimmed.length === 0) return "Avatar tidak boleh kosong.";

  if (trimmed.length <= 8) {
    if (!PRESET_AVATAR_PATTERN.test(trimmed)) return "Avatar preset tidak valid.";
    return null;
  }

  if (!trimmed.startsWith("data:image/")) return "Avatar harus gambar (data URL).";
  if (!DATA_URL_PATTERN.test(trimmed)) return "Format gambar tidak didukung.";
  if (trimmed.length > MAX_AVATAR_BYTES) return "Ukuran avatar maksimal 300KB.";
  return null;
}

export function validateSkillLevel(level: string): string | null {
  if (!SKILL_LEVELS.includes(level as SkillLevel)) {
    return "Level keahlian tidak dikenal.";
  }
  return null;
}

export const PRESET_AVATARS = [
  "🤖", "🦊", "🐱", "🐼", "🦁", "🐸",
  "👾", "⭐", "🚀", "🌙", "🐙", "🦄",
] as const;