"use client";

import dynamic from "next/dynamic";

const TaskQueue = dynamic(() => import("@/components/TaskQueue/TaskQueue"), {
  ssr: false,
});

export default function Page() {
  return <TaskQueue />;
}
