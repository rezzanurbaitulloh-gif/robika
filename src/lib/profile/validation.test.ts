import { describe, it, expect } from "vitest";
import {
  validateUsername,
  validateDisplayName,
  validateAvatar,
  validateSkillLevel,
  USERNAME_PATTERN,
} from "./validation";

describe("validateUsername", () => {
  it("accepts 3-20 alphanumeric or underscore", () => {
    expect(validateUsername("bot1")).toBeNull();
    expect(validateUsername("pelajar_hebat99")).toBeNull();
  });

  it("rejects too short or too long", () => {
    expect(validateUsername("ab")).not.toBeNull();
    expect(validateUsername("a".repeat(21))).not.toBeNull();
  });

  it("rejects spaces and symbols", () => {
    expect(validateUsername("has nama")).not.toBeNull();
    expect(validateUsername("name!")).not.toBeNull();
  });

  it("exports a usable pattern", () => {
    expect(USERNAME_PATTERN.test("valid_name1")).toBe(true);
    expect(USERNAME_PATTERN.test("bad name")).toBe(false);
  });
});

describe("validateDisplayName", () => {
  it("accepts up to 50 chars", () => {
    expect(validateDisplayName("BOT-1 Super")).toBeNull();
    expect(validateDisplayName("a".repeat(50))).toBeNull();
  });

  it("rejects empty or too long", () => {
    expect(validateDisplayName("")).not.toBeNull();
    expect(validateDisplayName("a".repeat(51))).not.toBeNull();
  });
});

describe("validateAvatar", () => {
  it("accepts short preset emoji avatars", () => {
    expect(validateAvatar("🤖")).toBeNull();
    expect(validateAvatar("🦊")).toBeNull();
  });

  it("accepts a data-url image under 300KB", () => {
    const small = `data:image/jpeg;base64,${"A".repeat(1000)}`;
    expect(validateAvatar(small)).toBeNull();
  });

  it("rejects huge data urls", () => {
    const huge = `data:image/jpeg;base64,${"A".repeat(500_000)}`;
    expect(validateAvatar(huge)).not.toBeNull();
  });

  it("rejects non-image data urls", () => {
    expect(validateAvatar("data:text/html;base64,AAAA")).not.toBeNull();
  });

  it("rejects other garbage", () => {
    expect(validateAvatar("javascript:alert(1)")).not.toBeNull();
    expect(validateAvatar("")).not.toBeNull();
  });
});

describe("validateSkillLevel", () => {
  it("accepts known levels", () => {
    expect(validateSkillLevel("pemula")).toBeNull();
    expect(validateSkillLevel("menengah")).toBeNull();
    expect(validateSkillLevel("lanjut")).toBeNull();
  });

  it("rejects unknown levels", () => {
    expect(validateSkillLevel("expert")).not.toBeNull();
    expect(validateSkillLevel("")).not.toBeNull();
  });
});