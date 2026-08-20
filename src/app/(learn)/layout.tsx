import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { Icon, type IconName } from "@/components/design/icon";

const MOBILE_NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/world/world-1", label: "Quest", icon: "gamepad" },
  { href: "/learn", label: "Belajar", icon: "book" },
  { href: "/daily", label: "Daily", icon: "bolt" },
  { href: "/profile", label: "Profil", icon: "user" },
];

export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Robika" className="h-7 w-7 rounded-md" />
            <span className="font-display text-lg tracking-widest text-foreground">
              ROBIKA
            </span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/world/world-1" className="hover:text-foreground">
              Kode Quest
            </Link>
            <Link href="/learn" className="hover:text-foreground">
              Belajar
            </Link>
            <Link href="/codelab/codelab-hello" className="hover:text-foreground">
              CodeLab
            </Link>
            <Link href="/codelab/playground" className="hover:text-foreground">
              Playground
            </Link>
            <Link href="/daily" className="hover:text-foreground">
              Daily
            </Link>
            <Link href="/leaderboard" className="hover:text-foreground">
              Leaderboard
            </Link>
            <Link href="/mentor" className="hover:text-foreground">
              Mentor
            </Link>
            <Link href="/shop" className="hover:text-foreground">
              Shop
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-slate-950 text-muted-foreground transition hover:border-accent hover:text-foreground"
              aria-label="Buka profil"
              title="Profil"
            >
              <Icon name="user" size={18} />
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col pb-16 md:pb-0">{children}</div>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {MOBILE_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 py-2 text-[10px] text-muted-foreground hover:text-foreground"
          >
            <Icon name={item.icon} size={22} />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}