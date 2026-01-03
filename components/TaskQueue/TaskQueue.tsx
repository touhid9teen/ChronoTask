"use client";

import { useState } from "react";

import TimerCard from "./TimerCard";
import AddTaskCard from "./AddTaskCard";
import TaskQueueList from "./TaskQueueList";
import { useTaskManager } from "../../hooks/useTaskManager";
import HeaderBar from "./HeaderBar";
import CompletedTasks from "./ CompletedTasks";
import AppFooter from "./footer";
import { Card } from "@/components/ui/card";
import { ArrowDown, Clock, ListTodo, CheckCircle2, Sparkles } from "lucide-react";

export default function TaskQueue() {
  const { tasks, setTasks, queue, setQueue, isLoaded } = useTaskManager();
  const [view, setView] = useState<"home" | "completed">("home");
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  const hasNoTasks = queue.length === 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <HeaderBar view={view} setView={setView} />
      
      {view === "home" ? (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
          {/* Onboarding / How It Works - Only show when no tasks */}
          {hasNoTasks && (
            <Card className="p-5 bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-blue-100 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 md:border-r md:border-blue-100 md:pr-6">
                  <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="font-semibold text-gray-900">
                      Welcome to ChronoTask
                    </h2>
                    <p className="text-xs text-gray-500">
                      Productivity in 3 steps
                    </p>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-3 md:justify-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <span className="text-sm font-bold text-gray-400">1</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900 block">Add Task</span>
                      Create your queue
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:justify-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <span className="text-sm font-bold text-gray-400">2</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900 block">Focus</span>
                      20-min timer
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:justify-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <span className="text-sm font-bold text-gray-400">3</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900 block">Complete</span>
                      Move to next
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Timer and Add Task */}
            <div className="lg:col-span-2 space-y-6">
              {/* Section Label */}
              {!hasNoTasks && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Active Session</h3>
                    <p className="text-xs text-gray-500">Your current 20-minute focus task</p>
                  </div>
                </div>
              )}
              
              <TimerCard queue={queue} setQueue={setQueue} setTasks={setTasks} />
              
              {/* Add Task Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Add New Task</h3>
                    <p className="text-xs text-gray-500">Tasks you add will appear in the queue →</p>
                  </div>
                </div>
                <AddTaskCard
                  tasks={tasks}
                  setTasks={setTasks}
                  queue={queue}
                  setQueue={setQueue}
                />
              </div>
            </div>

            {/* Right Column - Queue */}
            <div className="lg:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ListTodo className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Your Queue</h3>
                  <p className="text-xs text-gray-500">Tasks in order of completion</p>
                </div>
              </div>
              <TaskQueueList
                queue={queue}
                setQueue={setQueue}
                setTasks={setTasks}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <CompletedTasks
            tasks={tasks}
            setTasks={setTasks}
            setQueue={setQueue}
          />
        </div>
      )}
      
      <AppFooter />
    </main>
  );
}
