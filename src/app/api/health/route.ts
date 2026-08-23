export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    service: "robika",
    time: new Date().toISOString(),
  });
}
