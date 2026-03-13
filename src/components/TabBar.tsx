"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

const tabs = [
  {
    name: "首页",
    href: "/",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--yj-primary)" : "var(--yj-text-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    name: "对话",
    href: "/chat",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--yj-primary)" : "var(--yj-text-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    name: "我的",
    href: "/profile",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--yj-primary)" : "var(--yj-text-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export function TabBar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Don't show tab bar if not logged in
  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--yj-bg-secondary)] border-t border-[var(--yj-divider)] safe-area-bottom">
      <div className="mx-auto max-w-md flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 py-1 px-4 transition-colors"
            >
              {tab.icon(isActive)}
              <span
                className={`text-[10px] ${
                  isActive
                    ? "text-[var(--yj-primary)] font-medium"
                    : "text-[var(--yj-text-muted)]"
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
