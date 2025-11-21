"use client";

import usePWAInstall from "@/hooks/usePWAInstall";
import { useState } from "react";

export default function PWAPopup() {
  const { canInstall, triggerInstall } = usePWAInstall();
  const [open, setOpen] = useState(true);

  if (!canInstall || !open) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white shadow-xl p-4 rounded-xl border">
      <h3 className="font-semibold text-lg">Install ChronoTask</h3>
      <p className="text-sm text-gray-600 mt-1">
        Install our app for a better offline experience.
      </p>

      <div className="flex gap-3 mt-4">
        <button
          onClick={async () => {
            await triggerInstall();
            setOpen(false);
          }}
          className="px-4 py-2 rounded-md bg-black text-white"
        >
          Install
        </button>

        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-md bg-gray-200"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
