export interface ChallengeCheck {
  kind: "output" | "complete-code";
  expected: string;
  mode: "exact" | "contains";
  caseInsensitive?: boolean;
}

export interface CheckResult {
  passed: boolean;
  expected: string;
  actual: string;
  firstDiffLine?: number;
}

export function normalizeOutput(raw: string): string {
  return raw
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .filter((line, index, lines) => {
      if (line !== "") return true;
      const prev = lines[index - 1];
      const next = lines[index + 1];
      return prev !== "" && next !== undefined && next !== "";
    })
    .join("\n")
    .trim();
}

export function checkOutput(
  expected: string,
  actual: string,
  options: Partial<Omit<ChallengeCheck, "kind" | "expected">> = {},
): CheckResult {
  const mode = options.mode ?? "exact";
  const caseInsensitive = options.caseInsensitive ?? false;

  const normExpected = normalizeOutput(expected);
  const normActual = normalizeOutput(actual);

  const compare = (a: string, b: string) =>
    caseInsensitive ? a.toLowerCase() === b.toLowerCase() : a === b;

  let passed = false;
  if (mode === "contains") {
    passed = normActual !== "" && normActual.includes(normExpected);
  } else {
    passed = compare(normExpected, normActual);
  }

  const result: CheckResult = {
    passed,
    expected: normExpected,
    actual: normActual,
  };

  if (!passed && mode === "exact") {
    const expectedLines = normExpected.split("\n");
    const actualLines = normActual.split("\n");
    const max = Math.max(expectedLines.length, actualLines.length);
    for (let i = 0; i < max; i++) {
      if (expectedLines[i] !== actualLines[i]) {
        result.firstDiffLine = i + 1;
        break;
      }
    }
  }

  return result;
}