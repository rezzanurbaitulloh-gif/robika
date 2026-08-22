"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/design/icon";
import { cn } from "@/lib/utils";

const MOBILE_NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/world/world-1", label: "Quest", icon: "gamepad" },
  { href: "/learn", label: "Belajar", icon: "book" },
  { href: "/daily", label: "Daily", icon: "bolt" },
];

const MORE_ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: "/codelab", label: "CodeLab", icon: "code" },
  { href: "/codelab/studio", label: "CodeLab Studio", icon: "pen" },
  { href: "/leaderboard", label: "Leaderboard", icon: "trophy" },
  { href: "/mentor", label: "AI Mentor", icon: "brain" },
  { href: "/shop", label: "Shop", icon: "cart" },
  { href: "/certificate", label: "Sertifikat", icon: "certificate" },
  { href: "/profile", label: "Profil", icon: "user" },
];

const DESKTOP_NAV: { href: string; label: string }[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/world/world-1", label: "Kode Quest" },
  { href: "/learn", label: "Belajar" },
  { href: "/codelab", label: "CodeLab" },
  { href: "/codelab/studio", label: "Studio" },
  { href: "/daily", label: "Daily" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/mentor", label: "Mentor" },
  { href: "/shop", label: "Shop" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function AppNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  return (
    <>
      <nav
        aria-label="Navigasi utama"
        className="hidden items-center gap-4 text-sm text-muted-foreground md:flex"
      >
        {DESKTOP_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-md px-2 py-1 transition hover:text-foreground",
                active &&
                  "bg-accent/10 font-semibold text-accent",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <nav
        aria-label="Navigasi bawah"
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        {MOBILE_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 py-2 text-[10px] transition hover:text-foreground",
                active
                  ? "text-accent"
                  : "text-muted-foreground",
              )}
            >
              <Icon name={item.icon} size={22} />
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5",
                  active && "bg-accent/10",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={moreOpen}
          aria-controls="nav-more-menu"
          onClick={() => setMoreOpen((open) => !open)}
          className={cn(
            "flex flex-col items-center gap-1 py-2 text-[10px] transition",
            moreOpen ? "text-accent" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon name={moreOpen ? "x" : "menu"} size={22} />
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5",
              moreOpen && "bg-accent/10",
            )}
          >
            Lainnya
          </span>
        </button>
      </nav>

      {moreOpen && (
        <div
          id="nav-more-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu fitur lainnya"
          className="fixed inset-0 z-50 flex items-end md:hidden"
        >
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/60 backdrop-blur-sm"
          />
          <div className="relative mx-auto w-full max-w-lg rounded-t-2xl border-t border-x border-border bg-card p-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted" />
            <p className="mb-3 px-1 font-display text-xs tracking-widest text-muted-foreground">
              SEMUA FITUR
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MORE_ITEMS.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm transition hover:border-accent/50",
                      active
                        ? "border-accent/60 text-accent"
                        : "text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "rounded-md p-1.5",
                        active ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon name={item.icon} size={16} />
                    </span>
                    <span className="truncate font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}