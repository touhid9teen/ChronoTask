"use client";

import { useTaskManager } from "@/hooks/useTaskManager";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Trash2, ChevronRight, Plus, Save } from "lucide-react";
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
              open: idx === 0, // Open first one by default
            })
          );
          setToggles(blocks);
        } catch {
          setToggles([]);
        }
      } else {
        // If no notes exist, add an empty block to start
        setToggles([{ id: `toggle-${Date.now()}`, title: "", content: "", open: true }]);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="text-gray-500 hover:text-gray-900 gap-2 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            {syncStatus === "syncing" && (
              <span className="text-xs text-blue-500 font-medium animate-pulse">Saving...</span>
            )}
            <Button
              onClick={saveTask}
              disabled={isSaving || !taskTitle.trim()}
              className="bg-gray-900 hover:bg-gray-800 text-white gap-2 shadow-sm transition-all"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Saving" : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
        {/* Title Section */}
        <div className="space-y-2">
           <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
            Task Name
          </label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full text-3xl md:text-4xl font-bold bg-transparent border-none placeholder:text-gray-300 text-gray-900 focus:ring-0 px-0 py-2"
          />
        </div>

        {/* Toggles/Notes Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                What I Learned
                <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {toggles.length} notes
                </span>
             </h2>
          </div>

          <div className="grid gap-3">
            {toggles.map((t, idx) => (
              <Card 
                key={t.id} 
                className={`group border transition-all duration-200 overflow-hidden ${
                    t.open ? "border-blue-200 shadow-md ring-1 ring-blue-100" : "border-gray-200 shadow-sm hover:border-gray-300"
                }`}
              >
                {/* Accordion Header */}
                <div 
                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                        t.open ? "bg-blue-50/30" : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => toggleOpen(t.id)}
                >
                  <div className={`p-1 rounded-md transition-all duration-200 ${t.open ? "bg-blue-100 text-blue-600 rotate-90" : "text-gray-400 group-hover:text-gray-600"}`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Note Topic (e.g. 'Key Takeaways')"
                    value={t.title}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateToggle(t.id, "title", e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 font-medium text-gray-900 placeholder:text-gray-400 text-base p-0"
                  />

                  <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        removeToggle(t.id);
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Accordion Content */}
                <div 
                    className={`transition-all duration-200 ease-in-out ${
                        t.open ? "max-h-[800px] opacity-100 border-t border-blue-100" : "max-h-0 opacity-0 border-t-0"
                    }`}
                >
                  <div className="p-4 bg-white">
                    <textarea
                        ref={(el) => {
                            textareaRefs.current[t.id] = el;
                        }}
                        placeholder="Type your insights here..."
                        value={t.content}
                        onChange={(e) => handleTextareaInput(e, t.id)}
                        className="w-full min-h-[120px] bg-transparent resize-none border-none outline-none focus:ring-0 text-gray-600 leading-relaxed p-0 placeholder:text-gray-300"
                        style={{ overflow: "hidden" }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button 
            onClick={addToggle}
            variant="outline"
            className="w-full py-6 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-400 hover:text-blue-600 transition-all gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Another Note
          </Button>
        </div>
      </main>
    </div>
  );
}
