"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useTRPC } from "~/trpc/react";

export default function CreateList() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const queryCleint = useQueryClient();
  const trpc = useTRPC();
  const createList = useMutation(
    trpc.list.create.mutationOptions({
      onSuccess: () => {
        void queryCleint.invalidateQueries(trpc.list.pathFilter());
      },
    }),
  );
  const handleCreateList = () => {
    createList.mutate({
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
        placeholder="New list..."
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="List details..."
      />
      <Button onClick={handleCreateList} disabled={name.trim().length === 0}>
        Add List
      </Button>
    </div>
  );
}
