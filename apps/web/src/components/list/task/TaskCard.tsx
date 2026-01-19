"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TaskType } from "@todo/api";

import { Checkbox } from "~/components/ui/checkbox";
import { useTRPC } from "~/trpc/react";

export default function TaskCard({ task }: { task: TaskType }) {
  const [complete, setComplete] = useState(task.complete);

  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const completeTask = useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.list.pathFilter());
      },
    }),
  );
  const handleComplete = () => {
    const newState = !complete;
    setComplete(newState);
    completeTask.mutate({
      ...task,
      complete: newState,
    });
  };
  return (
    <div className="flex items-center gap-2 border-b py-2">
      <Checkbox
        checked={complete}
        onCheckedChange={handleComplete}
        className="h-6 w-6"
      />
      <div>
        <p className={`font-semibold ${complete ? "line-through" : ""}`}>
          {task.name}
        </p>
        <p className="text-muted-foreground text-sm">{task.description}</p>
      </div>
    </div>
  );
}
