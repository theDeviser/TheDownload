"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Brain,
  Users,
  Settings,
  Newspaper,
  ScrollText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inbox / Feed", icon: LayoutDashboard },
  { href: "/brain", label: "Knowledge Base", icon: Brain },
  { href: "/dashboard/logs", label: "Logs", icon: ScrollText },
  { href: "#", label: "Subscribers", icon: Users, disabled: true },
  { href: "#", label: "Settings", icon: Settings, disabled: true },
];

const STORAGE_KEY = "td-sidebar-collapsed";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  const sidebarWidth = collapsed ? "w-16" : "w-[250px]";
  const mainMargin = collapsed ? "ml-16" : "ml-[250px]";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-card-border bg-card-bg transition-all duration-200 ${sidebarWidth}`}
      >
        {/* Logo */}
        <div className="border-b border-card-border px-3 py-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 overflow-hidden"
          >
            <div className="flex shrink-0 items-center justify-center pl-1">
              <Newspaper size={20} className="text-gold" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="block truncate font-serif text-lg font-bold tracking-tight text-foreground">
                  The Download
                </span>
                <span className="block font-sans text-[11px] leading-tight text-muted">
                  Admin Console
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 px-2 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href) && item.href !== "#";
            const Icon = item.icon;

            if (item.disabled) {
              return (
                <div
                  key={item.label}
                  className={`flex cursor-not-allowed items-center rounded-lg px-3 py-2.5 text-muted/40 ${collapsed ? "justify-center" : "gap-3"}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="font-sans text-sm">{item.label}</span>
                      <span className="ml-auto rounded bg-card-border px-1.5 py-0.5 font-sans text-[10px] text-muted/50">
                        Soon
                      </span>
                    </>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-lg px-3 py-2.5 transition-colors ${collapsed ? "justify-center" : "gap-3"} ${
                  isActive
                    ? "bg-gold/10 text-gold"
                    : "text-muted hover:bg-card-border/50 hover:text-foreground"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="font-sans text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-card-border px-2 py-3">
          <div
            className={`flex items-center ${collapsed ? "justify-center" : "justify-between px-2"}`}
          >
            {!collapsed && (
              <span className="font-sans text-[11px] text-muted/50">v2.0</span>
            )}
            <ThemeToggle />
          </div>
          <button
            onClick={toggleCollapsed}
            className={`mt-2 flex w-full items-center rounded-lg px-3 py-2 text-muted transition-colors hover:bg-card-border/50 hover:text-foreground ${collapsed ? "justify-center" : "gap-3"}`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} className="shrink-0" />
                <span className="font-sans text-xs">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`flex-1 px-8 py-8 transition-all duration-200 ${mainMargin}`}
      >
        {children}
      </main>
    </div>
  );
}
