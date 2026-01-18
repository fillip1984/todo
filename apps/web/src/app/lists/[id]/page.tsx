"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowBigLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import CreateTask from "~/components/list/task/CreateTask";
import TaskCard from "~/components/list/task/TaskCard";
import Container from "~/components/my-ui/container";
import LoadingAndRetry from "~/components/my-ui/loadingAndRetry";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useTRPC } from "~/trpc/react";

export default function ListDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const trpc = useTRPC();
  const {
    data: list,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.list.readById.queryOptions({ id }));

  if (isLoading || isError) {
    return (
      <LoadingAndRetry
        isLoading={isLoading}
        isError={isError}
        retry={() => void refetch()}
      />
    );
  }

  if (!list) {
    return <div>List not found</div>;
  }

  return (
    <Container>
      <h5>{list.name}</h5>
      <p className="text-muted-foreground">{list.description}</p>
      <div className="flex items-center justify-between">
        <h5 className="mt-4">Tasks</h5>
        <Badge variant="secondary">{list.tasks.length} tasks</Badge>
      </div>
      <AnimatePresence>
        {list.tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              delayChildren: 0.2,
            }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </AnimatePresence>
      <CreateTask listId={list.id} />
      <Link href="/lists">
        <Button variant={"secondary"} className="w-fit">
          <ArrowBigLeft />
        </Button>
      </Link>
    </Container>
  );
}
