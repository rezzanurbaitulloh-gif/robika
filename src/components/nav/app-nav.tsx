"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/design/icon";
import { cn } from "@/lib/utils";

const MOBILE_NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/world/world-1", label: "Quest", icon: "gamepad" },
  { href: "/learn", label: "Belajar", icon: "book" },
  { href: "/daily", label: "Daily", icon: "bolt" },
  { href: "/profile", label: "Profil", icon: "user" },
];

const DESKTOP_NAV: { href: string; label: string }[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/world/world-1", label: "Kode Quest" },
  { href: "/learn", label: "Belajar" },
  { href: "/codelab/codelab-hello", label: "CodeLab" },
  { href: "/codelab/playground", label: "Playground" },
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
      </nav>
    </>
  );
}