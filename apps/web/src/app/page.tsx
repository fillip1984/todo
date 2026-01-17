"use client";

import { useQuery } from "@tanstack/react-query";

import CreateList from "~/components/list/CreateList";
import ListCard from "~/components/list/ListCard";
import { useTRPC } from "~/trpc/react";

export default function HomePage() {
  const trpc = useTRPC();
  const { data: lists } = useQuery(trpc.list.readAll.queryOptions());
  return (
    <div className="mx-auto flex w-full flex-col gap-4 md:w-180">
      {lists?.map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
      <CreateList />
      {/* <div className="flex w-full flex-col gap-2">
          <Input placeholder="New task..." />
          <Textarea placeholder="Task details..." />
          <Button>Add Task</Button>
        </div> */}
    </div>
  );
}
