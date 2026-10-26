"use client";

import {
  Component,
  FolderKanban,
  LayoutDashboard,
  type LucideIcon,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import project from "@/project.json";

import { cn } from "@/lib/utils";

type NavigationItem = Readonly<{
  href: string;
  label: string;
  icon: LucideIcon;
}>;

type SidebarNavigationItemProps = NavigationItem &
  Readonly<{
    isActive: boolean;
  }>;

const primaryNavigationItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/settings", label: "Settings", icon: Settings },
] as const satisfies readonly NavigationItem[];

function isNavigationItemActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNavigationItem({
  href,
  label,
  icon: Icon,
  isActive,
}: SidebarNavigationItemProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "focus-visible:ring-primary/70 flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
        isActive
          ? "bg-primary/10 text-primary ring-primary/15 ring-1 ring-inset"
          : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="border-border/70 bg-background fixed inset-y-0 left-0 z-30 flex w-20 flex-col border-r"
      aria-label="Primary navigation"
    >
      <Link
        href="/"
        className="border-border/70 focus-visible:ring-primary flex h-16 items-center justify-center border-b focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
        aria-label={`${project.name} home`}
      >
        <span className="bg-primary/12 text-primary ring-primary/20 flex size-9 items-center justify-center rounded-lg font-mono text-xs font-semibold ring-1 ring-inset">
          <Component className="size-5" aria-hidden="true" />
        </span>
      </Link>

      <nav className="flex flex-col gap-1.5 p-2.5">
        {primaryNavigationItems.map((item) => (
          <SidebarNavigationItem
            key={item.href}
            {...item}
            isActive={isNavigationItemActive(pathname, item.href)}
          />
        ))}
      </nav>
    </aside>
  );
}
