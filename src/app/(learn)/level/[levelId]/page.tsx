import { notFound } from "next/navigation";
import { getLevel } from "@/content";
import { LevelClient } from "./level-client";

export default async function LevelPage({
  params,
  searchParams,
}: {
  params: Promise<{ levelId: string }>;
  searchParams: Promise<{ daily?: string }>;
}) {
  const { levelId } = await params;
  const { daily } = await searchParams;
  const level = getLevel(levelId);
  if (!level) notFound();

  return <LevelClient level={level} isDaily={daily === "1"} />;
}