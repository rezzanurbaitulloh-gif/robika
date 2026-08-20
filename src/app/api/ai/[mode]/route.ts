import { createServerSupabase } from "@/lib/db/server";
import { encodeSse, streamAiSse } from "@/lib/ai/stream";
import type { AiContext, AiMode } from "@/lib/ai/types";
import { AiQuotaExceededError } from "@/lib/ai/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_MODES: AiMode[] = ["tutor", "debug", "exercises", "mentor"];

interface ChatBody {
  lang?: "id" | "en";
  question?: string;
  context?: AiContext;
  image?: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ mode: string }> },
) {
  const { mode } = await params;
  if (!ALLOWED_MODES.includes(mode as AiMode)) {
    return Response.json({ error: "unknown_mode" }, { status: 400 });
  }

  let body: ChatBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const question = (body.question ?? "").trim();
  if (!question) {
    return Response.json({ error: "empty_question" }, { status: 400 });
  }

  const image = body.image;
  if (image && !image.startsWith("data:image/")) {
    return Response.json({ error: "invalid_image" }, { status: 400 });
  }
  if (image && image.length > 5 * 1024 * 1024) {
    return Response.json({ error: "image_too_large" }, { status: 413 });
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  if (mode === "mentor") {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("trial_ends_at, paid_until, plan")
      .eq("profile_id", user.id)
      .maybeSingle<{
        trial_ends_at: string | null;
        paid_until: string | null;
        plan: string;
      }>();
    const now = new Date();
    const active =
      sub &&
      (sub.plan === "mentor" ||
        (sub.trial_ends_at !== null && new Date(sub.trial_ends_at) > now) ||
        (sub.paid_until !== null && new Date(sub.paid_until) > now));
    if (!active) {
      return Response.json({ error: "mentor_locked" }, { status: 403 });
    }
  }

  const lang = body.lang === "en" ? "en" : "id";

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(encodeSse(data)));

      send({ type: "start", mode });
      try {
        for await (const token of streamAiSse(
          user.id,
          mode as AiMode,
          lang,
          question,
          body.context,
          image,
        )) {
          send({ type: "token", token });
        }
        send({ type: "done" });
      } catch (err) {
        if (err instanceof AiQuotaExceededError) {
          send({ type: "error", error: "quota_exceeded" });
        } else {
          send({ type: "error", error: "provider_unavailable" });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}