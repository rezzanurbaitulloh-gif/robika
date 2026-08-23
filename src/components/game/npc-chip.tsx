function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function NpcChip({
  name,
  size = 22,
  dim = false,
}: {
  name: string;
  size?: number;
  dim?: boolean;
}) {
  const hue = hashName(name) % 360;
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border font-display font-bold${dim ? "" : " breathe"}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.55),
        background: `hsl(${hue} 55% ${dim ? 12 : 18}%)`,
        color: `hsl(${hue} 80% ${dim ? 45 : 72}%)`,
        borderColor: `hsl(${hue} 65% ${dim ? 25 : 42}%)`,
        opacity: dim ? 0.5 : 1,
      }}
      title={name}
    >
      {initial}
    </span>
  );
}
