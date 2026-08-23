export type LanguageId = "html" | "css" | "javascript" | "python";

export type RunKind = "web" | "console";

export interface LanguageSpec {
  id: LanguageId;
  label: string;
  monaco: string;
  ext: string;
  run: RunKind;
  defaultCode: string;
}

export const LANGUAGES: Record<LanguageId, LanguageSpec> = {
  html: {
    id: "html",
    label: "HTML",
    monaco: "html",
    ext: ".html",
    run: "web",
    defaultCode: `<div class="kartu">
  <h2>Halo, Robika!</h2>
  <p>Bangun antarmuka BOT-1 di sini.</p>
</div>`,
  },
  css: {
    id: "css",
    label: "CSS",
    monaco: "css",
    ext: ".css",
    run: "web",
    defaultCode: `.kartu {
  padding: 24px;
  border-radius: 12px;
  background: #101826;
  color: #e2f1ff;
}`,
  },
  javascript: {
    id: "javascript",
    label: "JS",
    monaco: "javascript",
    ext: ".js",
    run: "web",
    defaultCode: `function sapa(nama) {
  return "Hai, " + nama + "!";
}

console.log(sapa("BOT-1"));
console.log("Energi:", 40 + 25);`,
  },
  python: {
    id: "python",
    label: "PY",
    monaco: "python",
    ext: ".py",
    run: "console",
    defaultCode: `nama = "Robika"
for i in range(1, 4):
    print(f"{i}. Halo {nama}!")
print("Total energi:", sum(range(1, 6)))`,
  },
};

export const LANGUAGE_LIST: LanguageSpec[] = [
  LANGUAGES.html,
  LANGUAGES.css,
  LANGUAGES.javascript,
  LANGUAGES.python,
];

export function languageById(id: string): LanguageSpec {
  return LANGUAGES[id as LanguageId];
}

export function languageByFile(fileName: string): LanguageSpec | undefined {
  const lower = fileName.toLowerCase();
  return LANGUAGE_LIST.find((spec) => lower.endsWith(spec.ext));
}
