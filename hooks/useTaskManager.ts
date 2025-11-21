"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface Task {
  id: string;
  title: string;
  status: "not-completed" | "completed";
  date: string;
  learningNotes?: string;
}

interface TaskData {
  tasks: Task[];
  queue: Task[];
}

export function useTaskManager() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [queue, setQueue] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "error">(
    "idle"
  );
  const [useDrive, setUseDrive] = useState(false);

  const DRIVE_FILE_NAME = "taskQueueData.json";

  // Check Drive first, then localStorage
  useEffect(() => {
    const initializeData = async () => {
      // Wait for auth to finish loading
      if (status === "loading") return;

      const isDriveAvailable =
        status === "authenticated" && session?.accessToken;

      let dataLoaded = false;

      // PRIORITY 1: Try to load from Google Drive first
      if (isDriveAvailable) {
        try {
          setSyncStatus("syncing");
          console.log("→ Attempting to load from Google Drive...");

          const response = await fetch("/api/drive/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName: DRIVE_FILE_NAME }),
          });

          if (response.ok) {
            const data: TaskData = await response.json();
            setTasks(data.tasks || []);
            setQueue(data.queue || []);
            setUseDrive(true);
            dataLoaded = true;
            console.log("✓ Data loaded from Google Drive");
            setSyncStatus("idle");
          } else if (response.status === 404) {
            console.log("→ No file found in Drive, checking localStorage...");
            // File doesn't exist in Drive, continue to localStorage
          } else {
            throw new Error(`Drive API error: ${response.status}`);
          }
        } catch (error) {
          console.error("✗ Drive download failed:", error);
          setSyncStatus("error");
          // Continue to localStorage fallback
        }
      } else {
        console.log("→ User not authenticated, using localStorage only");
      }

      // PRIORITY 2: Load from localStorage if Drive failed or unavailable
      if (!dataLoaded) {
        const localData = loadFromLocalStorage();
        if (localData) {
          setTasks(localData.tasks);
          setQueue(localData.queue);
          console.log("✓ Data loaded from localStorage");

          // If Drive is available but had no file, upload localStorage data to Drive
          if (isDriveAvailable) {
            uploadToCloud(localData);
          }
        } else {
          console.log("→ No data found in localStorage, starting fresh");
        }
        setSyncStatus("idle");
      }

      setIsLoaded(true);
    };

    initializeData();
  }, [status, session]);

  // Save data when updated (after initial load)
  useEffect(() => {
    if (!isLoaded) return;

    const saveData = async () => {
      const data: TaskData = { tasks, queue };

      // Always save to localStorage as backup
      localStorage.setItem("taskQueueData", JSON.stringify(data));

      // If Drive is available, sync to Drive
      if (status === "authenticated" && session?.accessToken) {
        await uploadToCloud(data);
      }
    };

    saveData();
  }, [tasks, queue, isLoaded, status, session]);

  // Helper: Load from localStorage
  const loadFromLocalStorage = (): TaskData | null => {
    try {
      const stored = localStorage.getItem("taskQueueData");
      if (stored) {
        const data: TaskData = JSON.parse(stored);
        return {
          tasks: data.tasks || [],
          queue: data.queue || [],
        };
      }
    } catch (err) {
      console.error("Failed to parse localStorage data", err);
    }
    return null;
  };

  // Helper: Upload to Google Drive
  const uploadToCloud = async (data: TaskData) => {
    try {
      setSyncStatus("syncing");
      const formData = new FormData();
      formData.append("fileName", DRIVE_FILE_NAME);
      formData.append("content", JSON.stringify(data));

      const response = await fetch("/api/drive/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUseDrive(true);
        console.log("✓ Synced to Google Drive");
        setSyncStatus("idle");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("✗ Drive sync failed:", error);
      setSyncStatus("error");
      // Data is still saved in localStorage
    }
  };

  // Manual sync function
  const forceSyncToDrive = async (): Promise<boolean> => {
    if (status !== "authenticated" || !session?.accessToken) {
      console.error("Not authenticated");
      return false;
    }

    const data: TaskData = { tasks, queue };
    await uploadToCloud(data);
    return syncStatus !== "error";
  };

  return {
    tasks,
    setTasks,
    queue,
    setQueue,
    isLoaded,
    syncStatus,
    useDrive,
    forceSyncToDrive,
  };
}
