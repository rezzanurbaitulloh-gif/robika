export type UserLevel = "pemula" | "menengah" | "lanjut";

export interface AssessmentQuestion {
  question: string;
  options: { label: string; score: number }[];
}

export const QUESTIONS: AssessmentQuestion[] = [
  {
    question: "Seberapa sering kamu menulis kode?",
    options: [
      { label: "Belum pernah", score: 1 },
      { label: "Pernah coba beberapa kali", score: 2 },
      { label: "Beberapa kali dalam sebulan", score: 3 },
      { label: "Hampir setiap minggu", score: 4 },
      { label: "Hampir setiap hari", score: 5 },
    ],
  },
  {
    question: "Apa itu variabel dalam pemrograman?",
    options: [
      { label: "Angka acak", score: 1 },
      { label: "Tempat menyimpan nilai", score: 4 },
      { label: "Sebuah fungsi", score: 2 },
      { label: "Jenis error", score: 1 },
    ],
  },
  {
    question: "Apa fungsi dari for loop?",
    options: [
      { label: "Menjalankan kode berulang", score: 4 },
      { label: "Membaca file", score: 1 },
      { label: "Menghapus data", score: 1 },
      { label: "Tidak tahu", score: 0 },
    ],
  },
  {
    question: "Apa itu array?",
    options: [
      { label: "Kumpulan data dalam satu variabel", score: 4 },
      { label: "Jenis keyboard", score: 1 },
      { label: "Error syntax", score: 1 },
      { label: "Tidak tahu", score: 0 },
    ],
  },
  {
    question: "Jika kamu menemukan error, apa langkah pertamamu?",
    options: [
      { label: "Panik dan menyerah", score: 1 },
      { label: "Membaca pesan error lalu memperbaiki", score: 5 },
      { label: "Menghapus semua kode", score: 1 },
      { label: "Bertanya ke orang lain tanpa mencoba", score: 2 },
    ],
  },
];

export function classifyAnswers(answers: number[]): UserLevel {
  const total = answers.reduce((sum, score) => sum + score, 0);
  const max = QUESTIONS.length * 5;
  return classifyLevel(total, max);
}

export function classifyLevel(score: number, maxScore: number): UserLevel {
  if (maxScore <= 0) {
    throw new RangeError("maxScore must be positive");
  }
  if (score < 0) {
    throw new RangeError("score must be non-negative");
  }
  const ratio = Math.min(score / maxScore, 1);
  if (ratio < 0.4) return "pemula";
  if (ratio < 0.7) return "menengah";
  return "lanjut";
}