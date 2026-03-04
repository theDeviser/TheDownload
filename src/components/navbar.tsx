"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Newspaper, LogOut, User, CreditCard } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const ADMIN_ROUTES = ["/dashboard", "/brain", "/settings"];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdminRoute = ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isAdminRoute) return null;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const displayName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Left: Logo */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="group flex items-center gap-2"
        >
          <Newspaper size={22} className="text-gold transition-transform group-hover:scale-105" />
          <span className="font-serif text-lg font-bold tracking-tight text-foreground">
            The Download
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-card-bg" />
          ) : user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="User menu"
                    className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2"
                  >
                    <Avatar>
                      {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="truncate text-sm font-medium text-foreground">
                        {displayName}
                      </span>
                      {user.email && (
                        <span className="truncate text-xs font-normal text-muted">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings/profile" className="cursor-pointer">
                      <User size={16} />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings/billing" className="cursor-pointer">
                      <CreditCard size={16} />
                      Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-400 focus:text-red-300"
                  >
                    <LogOut size={16} />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button size="sm" asChild>
                <Link href="/auth/login">Sign In / Join</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
