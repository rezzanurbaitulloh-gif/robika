import {
  languageByFile,
  type LanguageId,
} from "./languages";

export interface LabFile {
  id: string;
  name: string;
  langId: LanguageId;
  content: string;
}

export interface LabProject {
  id: string;
  name: string;
  files: LabFile[];
  activeFileId: string;
  updatedAt: number;
}

export interface ProjectStore {
  load(): LabProject | null;
  save(project: LabProject): void;
}

let counter = 0;

export function makeId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

function makeFile(name: string, content: string): LabFile {
  const spec = languageByFile(name);
  return {
    id: makeId("file"),
    name,
    langId: (spec?.id ?? "javascript") as LanguageId,
    content,
  };
}

const SEED_FILES: { name: string; content: string }[] = [
  { name: "index.html", content: "" },
  { name: "style.css", content: "" },
  { name: "app.js", content: "" },
];

export function createProject(name = "proyek-baru"): LabProject {
  const files = SEED_FILES.map((seed) => ({
    ...makeFile(seed.name, seed.content),
    content:
      seed.name === "index.html"
        ? `<h1>${name}</h1>`
        : seed.content,
  }));
  return {
    id: makeId("proj"),
    name,
    files,
    activeFileId: files[0].id,
    updatedAt: Date.now(),
  };
}

function touch(project: LabProject, patch: Partial<LabProject>): LabProject {
  return { ...project, ...patch, updatedAt: Date.now() };
}

export function addFile(
  project: LabProject,
  fileName: string,
  content = "",
): LabProject {
  const trimmed = fileName.trim();
  if (!trimmed) return project;
  if (project.files.some((f) => f.name === trimmed)) return project;
  const file = makeFile(trimmed, content);
  return touch(project, {
    files: [...project.files, file],
    activeFileId: file.id,
  });
}

export function renameFile(
  project: LabProject,
  fileId: string,
  nextName: string,
): LabProject {
  const trimmed = nextName.trim();
  if (!trimmed) return project;
  if (
    project.files.some((f) => f.id !== fileId && f.name === trimmed)
  ) {
    return project;
  }
  const spec = languageByFile(trimmed);
  return touch(project, {
    files: project.files.map((f) =>
      f.id === fileId
        ? {
            ...f,
            name: trimmed,
            langId: ((spec?.id ?? f.langId) as LanguageId),
          }
        : f,
    ),
  });
}

export function deleteFile(project: LabProject, fileId: string): LabProject {
  if (project.files.length <= 1) {
    throw new Error("Minimal satu file harus tersisa");
  }
  const idx = project.files.findIndex((f) => f.id === fileId);
  if (idx === -1) return project;
  const files = project.files.filter((f) => f.id !== fileId);
  const activeFileId =
    project.activeFileId === fileId
      ? files[Math.max(0, idx - 1)].id
      : project.activeFileId;
  return touch(project, { files, activeFileId });
}

export function setActive(
  project: LabProject,
  fileId: string,
): LabProject {
  if (!project.files.some((f) => f.id === fileId)) return project;
  return touch(project, { activeFileId: fileId });
}

export function setFileContent(
  project: LabProject,
  fileId: string,
  content: string,
): LabProject {
  return touch(project, {
    files: project.files.map((f) =>
      f.id === fileId ? { ...f, content } : f,
    ),
  });
}

export function activeFile(project: LabProject): LabFile | undefined {
  return (
    project.files.find((f) => f.id === project.activeFileId) ??
    project.files[0]
  );
}

export function buildPreviewDoc(files: LabFile[]): string {
  const css = files
    .filter((f) => f.langId === "css")
    .map((f) => f.content)
    .join("\n");
  const js = files
    .filter((f) => f.langId === "javascript")
    .map((f) => f.content)
    .join("\n");
  const html =
    files.find((f) => f.langId === "html")?.content ?? "";
  return `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
}

export function localStorageProjectStore(key: string): ProjectStore {
  return {
    load() {
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as LabProject;
        if (!parsed?.files?.length || !parsed.activeFileId) return null;
        return parsed;
      } catch {
        return null;
      }
    },
    save(project) {
      try {
        window.localStorage.setItem(key, JSON.stringify(project));
      } catch {
        return;
      }
    },
  };
}
