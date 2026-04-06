"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar(): React.ReactElement | null {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/habits" className="text-lg font-semibold text-slate-900">
            Habit Tracker
          </Link>
          <Link
            href="/habits"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            My Habits
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user?.name || "User avatar"}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span className="text-sm text-slate-500">{session.user?.name}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}
