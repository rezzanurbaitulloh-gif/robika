import { createServerSupabase } from "@/lib/db/server";
import {
  validateAvatar,
  validateDisplayName,
  validateSkillLevel,
  validateUsername,
} from "@/lib/profile/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ProfilePatch {
  username?: string;
  display_name?: string;
  avatar_url?: string;
  skill_level?: string;
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const [{ data: profile }, { data: wallet }, { data: achievements }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, username, display_name, avatar_url, skill_level, level, xp, streak, created_at",
        )
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("wallets")
        .select("stars, gems")
        .eq("profile_id", user.id)
        .maybeSingle<{ stars: number; gems: number }>(),
      supabase
        .from("achievements")
        .select("badge_id", { count: "exact", head: true })
        .eq("profile_id", user.id),
    ]);

  if (!profile) return Response.json({ error: "no_profile" }, { status: 404 });

  return Response.json({
    ok: true,
    profile: {
      ...profile,
      email: user.email,
      stars: wallet?.stars ?? 0,
      gems: wallet?.gems ?? 0,
      badges: achievements?.length ?? 0,
    },
  });
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  let body: ProfilePatch;
  try {
    body = (await request.json()) as ProfilePatch;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const updates: Record<string, string> = {};

  if (body.username !== undefined) {
    const username = cleanString(body.username);
    const error = validateUsername(username);
    if (error) return Response.json({ error, field: "username" }, { status: 400 });

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user.id)
      .maybeSingle();
    if (existing) {
      return Response.json(
        { error: "Username sudah dipakai pengguna lain.", field: "username" },
        { status: 409 },
      );
    }
    updates.username = username;
  }

  if (body.display_name !== undefined) {
    const displayName = cleanString(body.display_name);
    const error = validateDisplayName(displayName);
    if (error) return Response.json({ error, field: "display_name" }, { status: 400 });
    updates.display_name = displayName;
  }

  if (body.avatar_url !== undefined) {
    const avatarUrl = cleanString(body.avatar_url);
    const error = validateAvatar(avatarUrl);
    if (error) return Response.json({ error, field: "avatar_url" }, { status: 400 });
    updates.avatar_url = avatarUrl;
  }

  if (body.skill_level !== undefined) {
    const skillLevel = cleanString(body.skill_level);
    const error = validateSkillLevel(skillLevel);
    if (error) return Response.json({ error, field: "skill_level" }, { status: 400 });
    updates.skill_level = skillLevel;
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "no_updates" }, { status: 400 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", user.id)
    .select(
      "id, username, display_name, avatar_url, skill_level, level, xp, streak",
    )
    .single();

  if (error) {
    if (error.code === "23505") {
      return Response.json(
        { error: "Username sudah dipakai pengguna lain.", field: "username" },
        { status: 409 },
      );
    }
    return Response.json({ error: "update_failed" }, { status: 500 });
  }

  return Response.json({ ok: true, profile });
}