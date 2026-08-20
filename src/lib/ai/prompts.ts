import type { AiMode } from "./types";

const BASE_RULES =
  "Kamu adalah Robika, tutor coding untuk platform belajar Robika. " +
  "Gunakan bahasa sesuai `lang` (id/en). Jawab singkat, ramah, gaya HUD futuristik. " +
  "Jangan pernah menulis solusi lengkap untuk soal — beri arah, hint bertingkat, dan pertanyaan pancingan (Socratic). " +
  "Kalau user minta jawaban penuh, tolak dengan sopan dan tawarkan hint berikutnya.";

export const SYSTEM_PROMPTS: Record<AiMode, string> = {
  tutor: BASE_RULES,
  debug:
    BASE_RULES +
    " Mode DEBUG: fokus pada error/bug yang dilaporkan user. Jelaskan akar masalah, lalu beri langkah perbaikan bertingkat.",
  exercises:
    BASE_RULES +
    " Mode EXERCISES: buat latihan singkat (1 soal) sesuai topik & tingkat user. Format: judul, deskripsi, contoh input/output, tanpa solusi.",
  mentor:
    "Kamu adalah AI Mentor Robika — partner belajar berbayar. " +
    "Boleh menjelaskan solusi secara lengkap dan terstruktur, dengan penjelasan konsep mendalam. " +
    "Gunakan bahasa sesuai `lang`. Tetap dorong user mencoba sendiri dulu sebelum memberi kode penuh.",
};

export interface BuildMessagesInput {
  mode: AiMode;
  lang: "id" | "en";
  question: string;
  context?: {
    topic?: string;
    level?: string;
    code?: string;
    error?: string;
    history?: { role: "user" | "model"; text: string }[];
  };
}

export function buildMessages({
  mode,
  question,
  context,
}: BuildMessagesInput): { system: string; contents: { role: "user" | "model"; text: string }[] } {
  const system = SYSTEM_PROMPTS[mode];

  const contextParts: string[] = [];
  if (context?.topic) contextParts.push(`Topik: ${context.topic}`);
  if (context?.level) contextParts.push(`Tingkat user: ${context.level}`);
  if (context?.code) contextParts.push(`Kode user:\n\`\`\`\n${context.code}\n\`\`\``);
  if (context?.error) contextParts.push(`Error:\n${context.error}`);

  const contents: { role: "user" | "model"; text: string }[] = [
    ...(context?.history ?? []).slice(-6),
  ];
  const userText = contextParts.length > 0
    ? `${contextParts.join("\n\n")}\n\nPertanyaan: ${question}`
    : question;
  contents.push({ role: "user", text: userText });

  return { system, contents };
}