"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface Task {
  id: string
  title: string
  status: "not-completed" | "partially-completed" | "completed"
  date: string
  learningNotes?: string
}

export default function WhatILearned() {
  const searchParams = useSearchParams()
  const taskId = searchParams.get("taskId")
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [editingId, setEditingId] = useState<string | null>(taskId)
  const [editNotes, setEditNotes] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("tasks")
    if (stored) {
      setTasks(JSON.parse(stored))
      const task = JSON.parse(stored).find((t: Task) => t.id === taskId)
      if (task) {
        setEditNotes(task.learningNotes || "")
      }
    }
  }, [taskId])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const saveNotes = (id: string) => {
    setTasks((t) => t.map((task) => (task.id === id ? { ...task, learningNotes: editNotes } : task)))
    setEditingId(null)
  }

  const deleteTask = (id: string) => {
    setTasks((t) => t.filter((task) => task.id !== id))
  }

  const completedTasks = tasks.filter((t) => t.status === "completed" && t.date === selectedDate)

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">What I Learned</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <Card className="p-6 bg-card border-2 border-primary/20">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-6">
            <label className="text-sm font-medium text-foreground">Filter by date:</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
          </div>

          {completedTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No completed tasks for this date</p>
          ) : (
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <Card key={task.id} className="p-4 space-y-3 bg-background border-border">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{task.title}</h3>
                    <Button onClick={() => deleteTask(task.id)} variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {editingId === task.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Write what you learned from this task..."
                        className="w-full p-3 border border-border rounded-md bg-background text-foreground min-h-32 resize-none"
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => saveNotes(task.id)} className="flex-1 gap-2">
                          <Save className="w-4 h-4" />
                          Save Notes
                        </Button>
                        <Button onClick={() => setEditingId(null)} variant="outline" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {task.learningNotes ? (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm space-y-2">
                          <p className="font-medium text-blue-900 dark:text-blue-100">What I learned:</p>
                          <p className="text-blue-800 dark:text-blue-200 whitespace-pre-wrap">{task.learningNotes}</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">No notes added yet</p>
                      )}
                      <Button
                        onClick={() => setEditingId(task.id)}
                        variant="secondary"
                        size="sm"
                        className="mt-3 w-full"
                      >
                        {task.learningNotes ? "Edit Notes" : "Add Notes"}
                      </Button>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">{task.date}</p>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
