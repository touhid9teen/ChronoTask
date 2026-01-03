"use client";
import { Button } from "@/components/ui/button";
import {
  Home,
  CheckSquare,
  LogIn,
  LogOut,
  Cloud,
  CloudOff,
  Info,
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

interface HeaderBarProps {
  view: string;
  setView: (view: string) => void;
  syncStatus?: "idle" | "syncing" | "error";
  useDrive?: boolean;
}

export default function HeaderBar({
  view,
  setView,
  syncStatus,
  useDrive,
}: HeaderBarProps) {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-gray-900">ChronoTask</h1>
          
          {/* Sync Status - Only show when signed in */}
          {session && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              {syncStatus === "syncing" ? (
                <div className="flex items-center gap-1.5 text-blue-600">
                  <Cloud className="w-3.5 h-3.5 animate-pulse" />
                  <span>Syncing...</span>
                </div>
              ) : useDrive ? (
                <div className="flex items-center gap-1.5 text-green-600">
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Synced</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-gray-400">
                  <CloudOff className="w-3.5 h-3.5" />
                  <span>Local</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation and Actions */}
        <div className="flex items-center gap-2">
          {/* Navigation Buttons */}
          <nav className="flex gap-1">
            <Button
              onClick={() => setView("home")}
              variant={view === "home" ? "default" : "ghost"}
              size="sm"
              className="gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>

            <Button
              onClick={() => setView("completed")}
              variant={view === "completed" ? "default" : "ghost"}
              size="sm"
              className="gap-1.5"
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Completed</span>
            </Button>

            <Link href="/about">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
              </Button>
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-2 ml-2 pl-2 border-l">
            {session ? (
              <>
                {/* User Info - Desktop only */}
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="hidden md:block w-7 h-7 rounded-full border"
                  />
                )}

                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => signIn("google")}
                variant="default"
                size="sm"
                className="gap-1.5"
                disabled={status === "loading"}
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {status === "loading" ? "Loading..." : "Sign in"}
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
