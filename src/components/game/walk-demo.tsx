"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FRAMES = [0, 1, 2, 3];

export function WalkDemo() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % FRAMES.length);
    }, 150);
    return () => clearInterval(id);
  }, []);

  return (
    <Image
      unoptimized
      src={`/assets/pixel/v2/bot1/walk-south/${frame}.png`}
      alt={`BOT-1 berjalan frame ${frame + 1}`}
      width={48}
      height={48}
      style={{ width: 144, height: 144 }}
      className="pixelated"
      priority={frame === 0}
    />
  );
}
