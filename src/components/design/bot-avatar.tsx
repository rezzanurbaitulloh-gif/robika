import type { SkinColors } from "@/lib/shop/catalog";

const OUTLINE = "#0b0e17";

export function BotAvatar({
  colors,
  size = 40,
  className,
}: {
  colors: SkinColors;
  size?: number;
  className?: string;
}) {
  const { body, visor, glow } = colors;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={className}
      role="img"
      aria-label="BOT-1"
    >
      {/* antena */}
      <rect x={7} y={0} width={2} height={1} fill={glow} />
      <rect x={7} y={1} width={2} height={2} fill={OUTLINE} />
      {/* kepala */}
      <rect x={3} y={3} width={10} height={6} fill={body} />
      <rect x={3} y={3} width={10} height={1} fill="#ffffff" opacity={0.18} />
      <rect x={3} y={8} width={10} height={1} fill={OUTLINE} opacity={0.35} />
      {/* visor + mata */}
      <rect x={5} y={5} width={6} height={2} fill={visor} />
      <rect x={6} y={5} width={1} height={1} fill={glow} />
      <rect x={9} y={5} width={1} height={1} fill={glow} />
      {/* badan */}
      <rect x={4} y={9} width={8} height={4} fill={body} />
      <rect x={4} y={12} width={8} height={1} fill={OUTLINE} opacity={0.35} />
      {/* lengan */}
      <rect x={2} y={9} width={2} height={3} fill={body} />
      <rect x={12} y={9} width={2} height={3} fill={body} />
      {/* inti dada */}
      <rect x={7} y={10} width={2} height={2} fill={glow} />
      {/* roda */}
      <rect x={4} y={13} width={8} height={2} fill={OUTLINE} />
      <rect x={5} y={13} width={1} height={1} fill={glow} opacity={0.7} />
      <rect x={10} y={13} width={1} height={1} fill={glow} opacity={0.7} />
    </svg>
  );
}
