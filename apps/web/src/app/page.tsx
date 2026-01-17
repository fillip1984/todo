"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { List } from "lucide-react";

import CreateList from "~/components/list/CreateList";
import ListCard from "~/components/list/ListCard";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useTRPC } from "~/trpc/react";

export default function HomePage() {
  const trpc = useTRPC();
  const { data: lists } = useQuery(trpc.list.readAll.queryOptions());
  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {lists?.map((list) => (
          <ListCard key={list.id} list={list} />
        ))}
        <CreateList />
      </div>
      {/* <div className="flex w-full flex-col gap-2">
        <Input placeholder="New task..." />
        <Textarea placeholder="Task details..." />
        <Button>Add Task</Button>
      </div> */}
    </>
  );
}
