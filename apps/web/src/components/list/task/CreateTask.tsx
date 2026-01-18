"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useTRPC } from "~/trpc/react";

export default function CreateTask({ listId }: { listId: string }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const queryCleint = useQueryClient();
  const trpc = useTRPC();
  const createTask = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: () => {
        void queryCleint.invalidateQueries(trpc.list.pathFilter());
        void queryCleint.invalidateQueries(trpc.task.pathFilter());
      },
    }),
  );
  const handleCreateTask = () => {
    createTask.mutate({
      listId,
      name,
      description,
    });
    setName("");
    setDescription("");
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New task..."
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task details..."
      />
      <Button onClick={handleCreateTask} disabled={name.trim().length === 0}>
        Add Task
      </Button>
    </div>
  );
}
