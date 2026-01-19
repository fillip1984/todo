"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";

import type { TaskType } from "@todo/api";

import TextFieldEditInPlace from "~/components/my-ui/textFieldEditInPlace";
import { Checkbox } from "~/components/ui/checkbox";
import { useTRPC } from "~/trpc/react";

export default function TaskCard({ task }: { task: TaskType }) {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description ?? "");
  const [complete, setComplete] = useState(task.complete);

  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const updateTask = useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.list.pathFilter());
      },
    }),
  );
  const handleComplete = () => {
    const newState = !complete;
    setComplete(newState);
    updateTask.mutate({
      ...task,
      complete: newState,
    });
  };

  const deleteTask = useMutation(
    trpc.task.delete.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.list.pathFilter());
      },
    }),
  );
  const handleDeleteTask = () => {
    deleteTask.mutate({ id: task.id });
  };
  return (
    <div className="flex items-center gap-2 border-b py-2">
      <Checkbox
        checked={complete}
        onCheckedChange={handleComplete}
        className="h-6 w-6"
      />
      <div className="w-full">
        <p className={`font-semibold ${complete ? "line-through" : ""}`}>
          <TextFieldEditInPlace
            value={name}
            onChange={setName}
            onBlur={() => {
              updateTask.mutate({ ...task, name });
            }}
            className="min-h-0"
          />
        </p>
        <p className="text-muted-foreground text-sm">
          <TextFieldEditInPlace
            value={description}
            onChange={setDescription}
            onBlur={() => {
              updateTask.mutate({ ...task, description });
            }}
          />
        </p>
      </div>
      <Trash className="text-destructive" onClick={handleDeleteTask} />
    </div>
  );
}
