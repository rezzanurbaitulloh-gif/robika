"use client";

import { useState } from "react";
import { StatusChip } from "@/components/design/status-chip";
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
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={value}
        alt="Avatar"
        className={`object-cover ${className ?? ""}`}
      />
    );
  }
  return <span className={className ?? ""}>{value}</span>;
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
      <div className="overflow-hidden rounded-xl border border-border bg-slate-900/60">
        <div className="h-20 bg-gradient-to-r from-accent/30 via-accent/10 to-transparent" />
        <div className="px-5 pb-5">
          <div className="-mt-10 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-end gap-4">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-background bg-slate-950 text-4xl shadow-lg">
                <Avatar value={avatarUrl} className="h-full w-full" />
              </span>
              <div className="min-w-0 pb-1">
                <h1 className="truncate font-display text-xl tracking-wide text-foreground">
                  {shownName}
                </h1>
                <p className="truncate text-xs text-muted-foreground">
                  @{username} · {initial.email}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pb-1">
              <StatusChip status="info" label={`LV ${initial.level}`} />
              <StatusChip status="neutral" label={`XP ${initial.xp}`} />
              <StatusChip status="warning" label={`Stars ${initial.stars}`} />
              <StatusChip status="success" label={`Gems ${initial.gems}`} />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border bg-slate-950/60 p-3"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Icon name={item.icon} size={13} />
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">
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