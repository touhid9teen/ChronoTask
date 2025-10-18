"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useTaskManager, Task } from "@/components/hooks/useTaskManager";

interface ToggleBlock {
  id: string;
  title: string;
  content: string;
  open: boolean;
}

export default function TaskEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { tasks, setTasks } = useTaskManager();
  const taskId = params.taskId;

  const [taskTitle, setTaskTitle] = useState("");
  const [status, setStatus] = useState<Task["status"]>("not-completed");
  const [toggles, setToggles] = useState<ToggleBlock[]>([]);

  // Load task info
  useEffect(() => {
    if (!tasks.length) return;
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTaskTitle(task.title);
      setStatus(task.status);
      if (task.learningNotes) {
        try {
          // Parse JSON array of toggles
          const blocks: ToggleBlock[] = JSON.parse(task.learningNotes).map(
            (t: any, idx: number) => ({
              id: `toggle-${idx}`,
              title: t.title || "",
              content: t.content || "",
              open: false,
            })
          );
          setToggles(blocks);
        } catch (err) {
          console.error("Failed to parse learningNotes JSON", err);
          setToggles([]);
        }
      }
    }
  }, [tasks, taskId]);

  const addToggle = () => {
    setToggles((prev) => [
      ...prev,
      { id: `toggle-${prev.length}`, title: "", content: "", open: true },
    ]);
  };

  const updateToggle = (
    id: string,
    field: "title" | "content",
    value: string
  ) => {
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const toggleOpen = (id: string) => {
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, open: !t.open } : t))
    );
  };

  const saveTask = () => {
    if (!taskTitle.trim()) return;

    // Convert toggles to JSON string
    const learningNotes = JSON.stringify(
      toggles.map((t) => ({ title: t.title, content: t.content }))
    );

    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, title: taskTitle, learningNotes, status } : t
    );

    setTasks(updatedTasks);

    const storedQueue =
      JSON.parse(localStorage.getItem("taskQueueData") || "{}").queue || [];
    localStorage.setItem(
      "taskQueueData",
      JSON.stringify({ tasks: updatedTasks, queue: storedQueue })
    );

    router.push("/");
  };

  const handleTextareaInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    id: string
  ) => {
    updateToggle(id, "content", e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Auto resize after fetching data
  useEffect(() => {
    toggles.forEach((t) => {
      const el = document.getElementById(
        `textarea-${t.id}`
      ) as HTMLTextAreaElement;
      if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    });
  }, [toggles]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-background">
      <h1 className="text-2xl font-bold mb-2">What I Learned</h1>
      <div className="border-b border-gray-300 w-full"></div>

      <div className="w-full max-w-4xl p-6 space-y-4">
        {/* Task title */}
        <input
          type="text"
          placeholder="Task title..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="w-full text-2xl font-bold p-3 border border-border rounded-md"
        />

        {/* Toggles */}
        <div className="space-y-2">
          {toggles.map((t, idx) => (
            <Card key={t.id} className="border border-border p-2">
              <div
                className="flex items-center cursor-pointer select-none"
                onClick={() => toggleOpen(t.id)}
              >
                <span
                  className={`mr-2 transition-transform ${
                    t.open ? "rotate-90" : ""
                  }`}
                >
                  ▶
                </span>
                <input
                  type="text"
                  placeholder={`Toggle ${idx + 1} title`}
                  value={t.title}
                  onChange={(e) => updateToggle(t.id, "title", e.target.value)}
                  className="flex-1 border-b border-gray-300 focus:border-blue-500 p-1"
                />
              </div>
              {t.open && (
                <textarea
                  id={`textarea-${t.id}`}
                  placeholder="Write notes here..."
                  value={t.content}
                  onChange={(e) => handleTextareaInput(e, t.id)}
                  className="w-full mt-2 p-1 bg-transparent resize-none outline-none border-none"
                  style={{ overflow: "hidden" }}
                />
              )}
            </Card>
          ))}
        </div>

        <Button variant="outline" onClick={addToggle} className="mt-2">
          + Add Toggle
        </Button>

        <div className="flex justify-end">
          <Button onClick={saveTask} className="gap-2">
            <Save className="w-4 h-4" />
            Save Task
          </Button>
        </div>
      </div>
    </div>
  );
}
