"use client";
import { useEffect, useState } from "react";

export default function usePWAInstall() {
  const [promptEvent, setPromptEvent] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setPromptEvent(e); // Save the event so we can trigger it later
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerInstall = async () => {
    if (!promptEvent) return;

    promptEvent.prompt();
    const result = await promptEvent.userChoice;
    return result.outcome; // accepted / dismissed
  };

  return { canInstall: !!promptEvent, triggerInstall };
}
