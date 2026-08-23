import { redirect } from "next/navigation";
import { PlaySlice } from "@/components/game/play-slice";
import { getFlags } from "@/lib/flags";

export const dynamic = "force-dynamic";

export default function PlayPage() {
  if (!getFlags().newVisualSystem && !getFlags().newWorld) redirect("/dashboard");
  return <PlaySlice />;
}
