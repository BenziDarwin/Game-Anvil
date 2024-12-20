"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hammer } from "lucide-react";
import { auth } from "@/firebase/config";

const routes = [
  {
    href: "/explore",
    label: "Explore",
  },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-6 lg:gap-10">
      <Link href="/" className="flex items-center gap-2">
        <Hammer className="h-8 w-8 text-orange-500" />
        <span className="font-bold text-xl hidden md:inline-block">
          Game Anvil
        </span>
      </Link>
      <nav className="flex items-center gap-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-orange-500",
              pathname === route.href
                ? "text-orange-500"
                : "text-muted-foreground",
            )}
          >
            {route.label}
          </Link>
        ))}
        {auth.currentUser ? (
          <Link
            key="/profile"
            href="/profile"
            className={cn(
              "text-sm font-medium transition-colors hover:text-orange-500",
              pathname === "/profile"
                ? "text-orange-500"
                : "text-muted-foreground",
            )}
          >
            Profile
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
