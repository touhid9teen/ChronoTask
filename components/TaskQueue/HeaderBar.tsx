"use client";
import { Button } from "@/components/ui/button";
import { Home, CheckSquare, LogIn, LogOut } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function HeaderBar({ view, setView }: any) {
  const { data: session, status } = useSession();

  console.log("view:", view);

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-black">Task Queue</h1>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setView("home")}
            variant={view === "home" ? "default" : "outline"}
            size="sm"
          >
            <Home className="w-4 h-4" /> Home
          </Button>

          <Button
            onClick={() => setView("completed")}
            variant={view === "completed" ? "default" : "outline"}
            size="sm"
          >
            <CheckSquare className="w-4 h-4" /> Completed
          </Button>

          {session ? (
            <Button
              onClick={() => signOut()}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          ) : (
            <Button
              onClick={() => signIn("google")}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
              size="sm"
              disabled={status === "loading"}
            >
              <LogIn className="w-4 h-4" />
              {status === "loading" ? "Loading..." : "Google"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
