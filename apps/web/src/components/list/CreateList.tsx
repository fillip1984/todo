"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useTRPC } from "~/trpc/react";

export default function CreateList() {
  const queryCleint = useQueryClient();
  const trpc = useTRPC();
  const createList = useMutation(
    trpc.list.create.mutationOptions({
      onSuccess: () => {
        void queryCleint.invalidateQueries(trpc.list.pathFilter());
      },
    }),
  );
  return (
    <div className="flex w-full flex-col gap-2">
      <Input placeholder="New list..." />
      <Textarea placeholder="List details..." />
      <Button
        onClick={() =>
          createList.mutate({
            name: "New List",
            description: "List description",
          })
        }
      >
        Add List
      </Button>
    </div>
  );
}
