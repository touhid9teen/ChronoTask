"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { Task } from "../../hooks/useTaskManager";
import { useRouter } from "next/navigation";

interface CompletedTasksProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setQueue: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function CompletedTasks({
  tasks,
  setTasks,
  setQueue,
}: CompletedTasksProps) {
  const router = useRouter();
  const tasksListRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    
    // Check if we are on a smaller screen (lg is 1024px)
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        tasksListRef.current?.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
      }, 100);
    }
  };

  // Get tasks count for each date
  const getTaskCountForDate = (dateStr: string) => {
    return tasks.filter(
      (t) => t.status === "completed" && t.date === dateStr
    ).length;
  };

  // Filter completed tasks by selected date
  const completed = tasks.filter(
    (t) => t.status === "completed" && t.date === selectedDate
  );

  const deleteTask = (id: string) => {
    setTasks((t) => t.filter((task) => task.id !== id));
    setQueue((q) => q.filter((task) => task.id !== id));
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 md:p-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Completed Tasks
            </h2>
            <p className="text-sm text-gray-600">
              Click on any date to view completed tasks
            </p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Section - Smaller Width */}
        <div className="lg:col-span-5 xl:col-span-4">
          <Card className="p-4 bg-white border border-gray-200 shadow-sm">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                {monthNames[month]} {year}
              </h3>
              <div className="flex gap-1">
                <Button
                  onClick={previousMonth}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={nextMonth}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] uppercase tracking-wider font-semibold text-gray-400 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const taskCount = getTaskCountForDate(dateStr);
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === today;

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(dateStr)}
                    className={`aspect-square relative flex items-center justify-center rounded-lg text-sm transition-all duration-200 ${
                      isSelected
                        ? "bg-gray-900 text-white shadow-md scale-105 z-10"
                        : isToday
                        ? "bg-blue-50 text-blue-600 font-semibold ring-1 ring-blue-200"
                        : taskCount > 0
                        ? "bg-green-50 text-green-700 font-medium hover:bg-green-100"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{day}</span>
                    
                    {/* Dots for tasks */}
                    {taskCount > 0 && !isSelected && (
                      <div className="absolute bottom-1.5 flex gap-0.5">
                        <div className={`w-1 h-1 rounded-full ${isToday ? "bg-blue-400" : "bg-green-400"}`} />
                      </div>
                    )}
                    
                    {/* Today indicator dot when selected */}
                    {isToday && isSelected && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-400 rounded-full border border-gray-900" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Compact Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100 text-[10px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-blue-50 ring-1 ring-blue-200 rounded-full"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-50 rounded-full"></div>
                <span>Completed</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Selected Date Tasks - Takes remaining width */}
        <div ref={tasksListRef} className="lg:col-span-7 xl:col-span-8 scroll-mt-6">
          <Card className="p-6 md:p-8 bg-white border border-gray-200 shadow-sm h-full min-h-[400px]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {completed.length} {completed.length === 1 ? "task" : "tasks"} completed
                </p>
              </div>
              {completed.length > 0 && (
                 <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                 </div>
              )}
            </div>

            {completed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center h-[300px] border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Trophy className="w-8 h-8 text-gray-300" />
                </div>
                <h4 className="text-gray-900 font-medium mb-1">No tasks completed</h4>
                <p className="text-sm text-gray-500 max-w-[200px]">
                  Tasks you complete on this day will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {completed.map((task, index) => (
                  <Card
                    key={task.id}
                    className="group p-4 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
                    onClick={() => router.push(`/tasks/${task.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 transition-colors duration-200">
                        <CheckCircle2 className="w-4 h-4 text-green-700 group-hover:text-white transition-colors duration-200" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            Task #{index + 1}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-green-700 transition-colors">
                          {task.title}
                        </p>
                      </div>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
