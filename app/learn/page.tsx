"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface Task {
  id: string
  title: string
  status: string
  date: string
  learningNotes?: string
}

export default function LearnPage() {
  const searchParams = useSearchParams()
  const taskId = searchParams.get("taskId")
  const [task, setTask] = useState<Task | null>(null)
  const [notes, setNotes] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const tasksData = localStorage.getItem("tasks")
    if (tasksData) {
      const tasks = JSON.parse(tasksData)
      const foundTask = tasks.find((t: Task) => t.id === taskId)
      if (foundTask) {
        setTask(foundTask)
        setNotes(foundTask.learningNotes || "")
      }
    }
  }, [taskId])

  const saveNotes = () => {
    if (!task) return

    const tasksData = localStorage.getItem("tasks")
    if (tasksData) {
      const tasks = JSON.parse(tasksData)
      const updatedTasks = tasks.map((t: Task) => (t.id === task.id ? { ...t, learningNotes: notes } : t))
      localStorage.setItem("tasks", JSON.stringify(updatedTasks))
      setTask({ ...task, learningNotes: notes })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  if (!task) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto p-4 md:p-8">
          <p className="text-muted-foreground">Task not found</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
        <Card className="p-6 bg-card border-2 border-primary/20">
          <h1 className="text-2xl font-bold text-foreground mb-2">{task.title}</h1>
          <p className="text-sm text-muted-foreground mb-6">Completed on {task.date}</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                What did you learn from this task?
              </label>
              <Textarea
                placeholder="Write down what you learned, key takeaways, and insights from completing this task..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-64 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={saveNotes} className="gap-2 flex-1">
                <Save className="w-4 h-4" />
                {saved ? "Saved!" : "Save Notes"}
              </Button>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Done
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
