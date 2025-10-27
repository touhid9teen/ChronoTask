"use client";
import { Button } from "@/components/ui/button";
import {
  Home,
  CheckSquare,
  LogIn,
  LogOut,
  Cloud,
  CloudOff,
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

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
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-black">Task Queue</h1>

          {/* Sync Status Indicator */}
          {session && (
            <div className="flex items-center gap-1.5 text-xs">
              {syncStatus === "syncing" ? (
                <div className="flex items-center gap-1.5 text-blue-600">
                  <Cloud className="w-3.5 h-3.5 animate-pulse" />
                  <span>Syncing...</span>
                </div>
              ) : useDrive ? (
                <div className="flex items-center gap-1.5 text-green-600">
                  <Cloud className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Drive</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-gray-400">
                  <CloudOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Local</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setView("home")}
            variant={view === "home" ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>

          <Button
            onClick={() => setView("completed")}
            variant={view === "completed" ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Completed</span>
          </Button>

          {session ? (
            <div className="flex items-center gap-2">
              {/* User Info (optional) */}
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="hidden lg:inline">{session.user?.email}</span>
              </div>

              <Button
                onClick={() => signOut()}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => signIn("google")}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
              size="sm"
              disabled={status === "loading"}
            >
              <LogIn className="w-4 h-4" />
              {status === "loading" ? (
                "Loading..."
              ) : (
                <span className="hidden sm:inline">Sign in with Google</span>
              )}
              <span className="sm:hidden">Google</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
