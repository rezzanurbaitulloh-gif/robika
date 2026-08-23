"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/design/icon";
import { isFlagEnabled } from "@/lib/flags";
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

const DESKTOP_NAV_BASE: { href: string; label: string }[] = [
  { href: "/dashboard", label: "Base" },
  { href: "/world/world-1", label: "Kode Quest" },
  { href: "/world/world-2", label: "Distrik Gerbang" },
  { href: "/learn", label: "Akademi" },
  { href: "/codelab", label: "CodeLab" },
  { href: "/codelab/studio", label: "Studio" },
  { href: "/daily", label: "Misi Harian" },
  { href: "/leaderboard", label: "Peringkat" },
  { href: "/mentor", label: "Mentor AI" },
  { href: "/shop", label: "Toko" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function AppNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const desktopNav = isFlagEnabled("newAdventure")
    ? DESKTOP_NAV_BASE
    : DESKTOP_NAV_BASE.filter((i) => i.href !== "/world/world-2");

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
        className="hidden items-center gap-1 md:flex"
      >
        {desktopNav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-sm border px-2 py-1 font-display text-[11px] uppercase tracking-wider transition",
                active
                  ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200"
                  : "border-transparent text-foreground/55 hover:border-cyan-400/30 hover:text-foreground",
              )}
            >
              {active && <span className="mr-1 text-cyan-300">▸</span>}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <nav
        aria-label="Navigasi bawah"
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-border bg-[#0c101d]/95 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {MOBILE_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-0.5 py-2 font-display text-[9px] uppercase tracking-wider transition",
                active ? "text-cyan-300" : "text-foreground/45 hover:text-foreground/75",
              )}
            >
              {active && <span className="absolute inset-x-4 top-0 h-0.5 bg-cyan-300" />}
              <Icon name={item.icon} size={20} />
              <span>{item.label}</span>
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
            "relative flex flex-col items-center gap-0.5 py-2 font-display text-[9px] uppercase tracking-wider transition",
            moreOpen ? "text-cyan-300" : "text-foreground/45 hover:text-foreground/75",
          )}
        >
          {moreOpen && <span className="absolute inset-x-4 top-0 h-0.5 bg-cyan-300" />}
          <Icon name={moreOpen ? "x" : "menu"} size={20} />
          <span>Lainnya</span>
        </button>
      </nav>

      {moreOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <div
            id="nav-more-menu"
            role="dialog"
            aria-label="Menu fitur lainnya"
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-2 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] mx-auto max-w-sm animate-pop rounded-md border border-border bg-[#141a2e] p-3 shadow-2xl"
          >
            <p className="mb-2 px-1 font-display text-[10px] uppercase tracking-widest text-cyan-300/70">
              ▸ SEMUA MODUL
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
                      "flex items-center gap-2.5 rounded-sm border bg-[#0c101d] px-3 py-2.5 transition",
                      active
                        ? "border-cyan-400/50 text-cyan-200"
                        : "border-border text-foreground hover:border-cyan-400/40",
                    )}
                  >
                    <span
                      className={cn(
                        "rounded-sm border border-border bg-input/40 p-1.5",
                        active && "border-cyan-400/40 text-cyan-300",
                      )}
                    >
                      <Icon name={item.icon} size={15} />
                    </span>
                    <span className="truncate font-display text-xs uppercase tracking-wider">
                      {item.label}
                    </span>
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
