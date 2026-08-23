"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { ProfileSettings } from "@/components/profile/profile-settings";

export interface ProfileViewInitial {
  username: string;
  displayName: string;
  avatarUrl: string;
  skillLevel: "pemula" | "menengah" | "lanjut";
  email: string;
  level: number;
  xp: number;
  stars: number;
  gems: number;
  streak: number;
  badgeCount: number;
  createdAt: string | null;
}

export function isImageAvatar(value: string): boolean {
  return value.startsWith("data:") || value.startsWith("http");
}

export function Avatar({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  if (isImageAvatar(value)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={value}
        alt="Avatar"
        className={`object-cover ${className ?? ""}`}
      />
    );
  }
  if (value) {
    return <span className={className ?? ""}>{value}</span>;
  }
  return (
    <span
      className={`flex items-center justify-center bg-[#141a2e] text-cyan-300 ${className ?? ""}`}
      aria-hidden="true"
    >
      <Icon name="robot" size={40} />
    </span>
  );
}

export function ProfileView({ initial }: { initial: ProfileViewInitial }) {
  const [username, setUsername] = useState(initial.username);
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [skillLevel, setSkillLevel] = useState(initial.skillLevel);

  const shownName = displayName || username || "Pelajar";

  const stats: { label: string; value: string; icon: IconName }[] = [
    { label: "Streak", value: `${initial.streak} hari`, icon: "flame" },
    { label: "Badge", value: `${initial.badgeCount} / 10`, icon: "medal" },
    { label: "Level keahlian", value: skillLevel, icon: "layers" },
    {
      label: "Bergabung",
      value: initial.createdAt
        ? new Date(initial.createdAt).toLocaleDateString("id-ID", {
            month: "short",
            year: "numeric",
          })
        : "-",
      icon: "calendar",
    },
  ];

  return (
    <>
      <div className="base-floor scanline overflow-hidden rounded-md border border-border">
        <div className="px-5 pb-5 pt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-end gap-4">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-sm border-2 border-border bg-[#141a2e] text-4xl">
                <Avatar value={avatarUrl} className="h-full w-full" />
              </span>
              <div className="min-w-0 pb-1">
                <p className="font-display text-[10px] uppercase tracking-widest text-cyan-300/70">
                  ▸ KARTU OPERATUR
                </p>
                <h1 className="truncate font-display text-xl tracking-wide text-foreground">
                  {shownName}
                </h1>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  @{username} · {initial.email}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pb-1">
              <span className="rounded-sm border border-cyan-400/40 bg-cyan-400/10 px-2 py-1 font-display text-xs tracking-wide text-cyan-300">
                LV {initial.level}
              </span>
              <span className="rounded-sm border border-border bg-input/40 px-2 py-1 font-display text-xs tracking-wide text-muted-foreground">
                XP {initial.xp}
              </span>
              <span className="inline-flex items-center gap-1 rounded-sm border border-amber-400/40 bg-amber-400/10 px-2 py-1 font-display text-xs tracking-wide text-amber-300">
                <Icon name="star" size={12} /> {initial.stars}
              </span>
              <span className="inline-flex items-center gap-1 rounded-sm border border-fuchsia-400/40 bg-fuchsia-400/10 px-2 py-1 font-display text-xs tracking-wide text-fuchsia-300">
                <Icon name="gem" size={12} /> {initial.gems}
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-sm border border-border bg-[#0c101d] p-3"
              >
                <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  <Icon name={item.icon} size={13} />
                  {item.label}
                </div>
                <div className="mt-1 text-center font-display text-sm uppercase tracking-wider text-foreground">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ProfileSettings
          initial={{
            username,
            displayName,
            avatarUrl,
            skillLevel,
          }}
          onUpdated={(updated) => {
            if (updated.username !== undefined) setUsername(updated.username);
            if (updated.displayName !== undefined) setDisplayName(updated.displayName);
            if (updated.avatarUrl !== undefined) setAvatarUrl(updated.avatarUrl);
            if (updated.skillLevel !== undefined) setSkillLevel(updated.skillLevel);
          }}
        />
      </div>
    </>
  );
}