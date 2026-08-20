import challengesJson from "./challenges.json";
import type { CodeLabChallenge } from "@/lib/codelab/runner";

export const challenges = challengesJson.challenges as CodeLabChallenge[];

export function getChallenge(challengeId: string): CodeLabChallenge | undefined {
  return challenges.find((c) => c.id === challengeId);
}

export function validateChallenges(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const challenge of challenges) {
    if (!challenge.id || ids.has(challenge.id)) {
      errors.push(`invalid or duplicate id: ${challenge.id}`);
    }
    ids.add(challenge.id);

    if (!["javascript", "python"].includes(challenge.lang)) {
      errors.push(`${challenge.id}: invalid lang`);
    }
    if (!["output", "complete-code", "fix-bug", "preview"].includes(challenge.kind)) {
      errors.push(`${challenge.id}: invalid kind`);
    }
    if (challenge.kind === "preview") {
      if (!challenge.html || !challenge.html.toLowerCase().includes("<html")) {
        errors.push(`${challenge.id}: preview kind requires a full html document`);
      }
    } else {
      if (!challenge.expected || !challenge.starterCode || !challenge.solution) {
        errors.push(`${challenge.id}: missing expected/starterCode/solution`);
      }
    }
    if (challenge.kind === "fix-bug" && (!challenge.bugs || challenge.bugs.length === 0)) {
      errors.push(`${challenge.id}: fix-bug kind requires a bugs list`);
    }
    if (challenge.hints.length !== 3 || challenge.hints.some((t) => t.length === 0)) {
      errors.push(`${challenge.id}: hints must be 3 non-empty tiers`);
    }
    if (challenge.xpReward <= 0) {
      errors.push(`${challenge.id}: xpReward must be > 0`);
    }
  }

  if (challenges.length === 0) {
    errors.push("no challenges defined");
  }

  return { ok: errors.length === 0, errors };
}