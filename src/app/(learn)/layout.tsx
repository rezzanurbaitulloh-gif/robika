import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { AppNav } from "@/components/nav/app-nav";
import { Icon } from "@/components/design/icon";
import { StatusIndicator } from "@/components/system/status-indicator";
import { BotCompanion } from "@/components/companion/bot-companion";

export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-[#0c101d]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Robika" className="h-7 w-7 rounded-sm" />
            <span className="font-display text-lg tracking-widest text-cyan-300">
              ROBIKA
            </span>
          </Link>
          <AppNav />
          <div className="flex items-center gap-2">
            <StatusIndicator />
            <Link
              href="/profile"
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-input/40 text-muted-foreground transition hover:border-cyan-400/50 hover:text-cyan-200"
              aria-label="Buka profil"
              title="Profil"
            >
              <Icon name="user" size={17} />
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">{children}</div>
      <BotCompanion />
    </div>
  );
}