import { describe, it, expect } from "vitest";
import {
  activeFile,
  addFile,
  buildPreviewDoc,
  createProject,
  deleteFile,
  localStorageProjectStore,
  renameFile,
  setActive,
  setFileContent,
  type LabProject,
  type ProjectStore,
} from "./projects";

function memoryStore(initial: LabProject | null = null): ProjectStore & {
  saved: LabProject[];
} {
  let current: LabProject | null = initial;
  const saved: LabProject[] = [];
  return {
    saved,
    load() {
      return current;
    },
    save(project) {
      current = project;
      saved.push(project);
    },
  };
}

describe("createProject", () => {
  it("seeds html, css and js files with the first active", () => {
    const p = createProject("gerbang");
    expect(p.name).toBe("gerbang");
    expect(p.files.map((f) => f.name)).toEqual([
      "index.html",
      "style.css",
      "app.js",
    ]);
    expect(activeFile(p)?.name).toBe("index.html");
    expect(p.files[0].content).toContain("gerbang");
  });

  it("generates unique ids", () => {
    const a = createProject();
    const b = createProject();
    expect(a.id).not.toBe(b.id);
  });
});

describe("file operations", () => {
  it("adds a file with language inferred from extension", () => {
    const p = addFile(createProject(), "bot.py", "print(1)");
    const added = p.files.find((f) => f.name === "bot.py");
    expect(added?.langId).toBe("python");
    expect(added?.content).toBe("print(1)");
    expect(activeFile(p)?.name).toBe("bot.py");
  });

  it("ignores duplicate or empty names", () => {
    const base = createProject();
    expect(addFile(base, "app.js")).toBe(base);
    expect(addFile(base, "   ")).toBe(base);
  });

  it("renames a file and updates its language", () => {
    const base = createProject();
    const jsId = base.files[2].id;
    const p = renameFile(base, jsId, "util.py");
    expect(p.files[2].name).toBe("util.py");
    expect(p.files[2].langId).toBe("python");
  });

  it("rejects rename to a taken name", () => {
    const base = createProject();
    const jsId = base.files[2].id;
    expect(renameFile(base, jsId, "style.css")).toBe(base);
  });

  it("deletes a file and reactivates a neighbor", () => {
    const base = createProject();
    const first = base.files[0];
    const p = deleteFile(base, first.id);
    expect(p.files.length).toBe(2);
    expect(activeFile(p)?.name).toBe("style.css");
  });

  it("refuses to delete the last file", () => {
    const base = createProject();
    let p = deleteFile(base, base.files[0].id);
    p = deleteFile(p, p.files[0].id);
    expect(() => deleteFile(p, p.files[0].id)).toThrow(
      /Minimal satu file/,
    );
  });

  it("edits content immutably", () => {
    const base = createProject();
    const jsId = base.files[2].id;
    const p = setFileContent(base, jsId, "console.log('x')");
    expect(base.files[2].content).toBe("");
    expect(p.files[2].content).toBe("console.log('x')");
  });

  it("switches active file only for known ids", () => {
    const base = createProject();
    expect(setActive(base, "nope")).toBe(base);
    const p = setActive(base, base.files[1].id);
    expect(activeFile(p)?.name).toBe("style.css");
  });
});

describe("buildPreviewDoc", () => {
  it("assembles html body with css and js siblings", () => {
    const base = createProject();
    let p = setFileContent(
      base,
      base.files[0].id,
      "<h1>Halo</h1>",
    );
    p = setFileContent(p, p.files[1].id, "h1 { color: red; }");
    p = setFileContent(p, p.files[2].id, "console.log('go');");
    const doc = buildPreviewDoc(p.files);
    expect(doc.startsWith("<!DOCTYPE html>")).toBe(true);
    expect(doc).toContain("<style>h1 { color: red; }</style>");
    expect(doc).toContain("<h1>Halo</h1>");
    expect(doc).toContain("<script>console.log('go');</script>");
  });
});

describe("project store", () => {
  it("round-trips through a store", () => {
    const store = memoryStore();
    const p = createProject();
    store.save(p);
    expect(store.load()?.id).toBe(p.id);
    expect(store.saved.length).toBe(1);
  });

  it("treats corrupt payloads as empty", () => {
    const original = window.localStorage;
    const backing = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: (k: string) => backing.get(k) ?? null,
        setItem: (k: string, v: string) => void backing.set(k, v),
        removeItem: (k: string) => void backing.delete(k),
      },
      configurable: true,
    });
    try {
      window.localStorage.setItem("robika.codelab.project", "{broken");
      expect(localStorageProjectStore("robika.codelab.project").load()).toBeNull();
      window.localStorage.removeItem("robika.codelab.project");
      expect(localStorageProjectStore("robika.codelab.project").load()).toBeNull();
    } finally {
      Object.defineProperty(window, "localStorage", {
        value: original,
        configurable: true,
      });
    }
  });
});
