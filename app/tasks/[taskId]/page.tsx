"use client";

import { useTaskManager } from "@/hooks/useTaskManager";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface ToggleBlock {
  id: string;
  title: string;
  content: string;
  open: boolean;
}

export default function TaskEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { tasks, setTasks, isLoaded, syncStatus } = useTaskManager();
  const taskId = params.taskId as string;
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const [taskTitle, setTaskTitle] = useState("");
  const [toggles, setToggles] = useState<ToggleBlock[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-resize textarea helper
  const autoResize = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (!isLoaded || !tasks.length) return;
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTaskTitle(task.title);
      if (task.learningNotes) {
        try {
          const blocks: ToggleBlock[] = JSON.parse(task.learningNotes).map(
            (t: any, idx: number) => ({
              id: `toggle-${idx}`,
              title: t.title || "",
              content: t.content || "",
              open: false,
            })
          );
          setToggles(blocks);
        } catch {
          setToggles([]);
        }
      }
    } else router.push("/");
  }, [tasks, taskId, isLoaded, router]);

  // Auto-resize textareas when toggles open or content changes
  useEffect(() => {
    toggles.forEach((t) => {
      if (t.open) {
        setTimeout(() => autoResize(textareaRefs.current[t.id]), 0);
      }
    });
  }, [toggles]);

  const addToggle = () =>
    setToggles((prev) => [
      ...prev,
      { id: `toggle-${Date.now()}`, title: "", content: "", open: true },
    ]);

  const removeToggle = (id: string) =>
    setToggles((prev) => prev.filter((t) => t.id !== id));

  const updateToggle = (
    id: string,
    field: "title" | "content",
    value: string
  ) => {
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const toggleOpen = (id: string) =>
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, open: !t.open } : t))
    );

  const handleTextareaInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    id: string
  ) => {
    updateToggle(id, "content", e.target.value);
    autoResize(e.target);
  };

  const saveTask = async () => {
    if (!taskTitle.trim()) return alert("Please enter a task title");
    setIsSaving(true);
    try {
      const learningNotes = JSON.stringify(
        toggles.map((t) => ({ title: t.title, content: t.content }))
      );
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, title: taskTitle, learningNotes } : t
        )
      );
      await new Promise((res) => setTimeout(res, 500));
      router.push("/");
    } catch {
      alert("Failed to save task. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <h1 className="text-xl font-bold">What I Learned</h1>
          </div>
          {syncStatus === "syncing" && (
            <span className="text-sm text-blue-600">Syncing...</span>
          )}
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Title
          </label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Enter task title..."
            className="w-full text-2xl font-bold p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Toggles Section */}
        <div className="space-y-2">
          <div className="flex justify-end mb-2">
            <Button variant="outline" size="sm" onClick={addToggle}>
              + Add Toggle Note
            </Button>
          </div>
          {toggles.map((t, idx) => (
            <Card key={t.id} className="border border-gray-300 p-3">
              <div className="flex items-center justify-between gap-2">
                <div
                  className="flex items-center cursor-pointer select-none flex-1 min-w-0"
                  onClick={() => toggleOpen(t.id)}
                >
                  <span
                    className={`mr-2 transition-transform text-gray-500 ${
                      t.open ? "rotate-90" : ""
                    }`}
                  >
                    ▶
                  </span>
                  <input
                    type="text"
                    placeholder={`Toggle ${idx + 1} title`}
                    value={t.title}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      updateToggle(t.id, "title", e.target.value)
                    }
                    className="flex-1 min-w-0 border-b border-gray-200 font-semibold focus:border-blue-500 p-1 outline-none bg-transparent"
                  />
                </div>
                <button
                  onClick={() => removeToggle(t.id)}
                  className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {t.open && (
                <textarea
                  ref={(el) => {
                    textareaRefs.current[t.id] = el;
                  }}
                  placeholder="Write notes here..."
                  value={t.content}
                  onChange={(e) => handleTextareaInput(e, t.id)}
                  className="w-full mt-3 p-2 bg-gray-50 rounded-md resize-none outline-none  min-h-[80px]"
                  style={{ overflow: "hidden" }}
                />
              )}
            </Card>
          ))}
        </div>

        <div className="flex justify-between gap-3 pt-6 border-t">
          <Button
            onClick={saveTask}
            className="gap-2 min-w-[120px]"
            disabled={isSaving || !taskTitle.trim()}
          >
            {isSaving ? <>Saving...</> : <>Save Task</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
