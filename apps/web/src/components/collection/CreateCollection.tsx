"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useTRPC } from "~/trpc/react";

export default function CreateCollection() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const createCollection = useMutation(
    trpc.collection.create.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.collection.pathFilter());
      },
    }),
  );
  const handleCreateCollection = () => {
    createCollection.mutate({
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
        placeholder="New collection..."
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Collection details..."
      />
      <Button onClick={handleCreateCollection} disabled={name.trim().length === 0}>
        Add Collection
      </Button>
    </div>
  );
}
