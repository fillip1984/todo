"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowBigLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { MdLocalMovies } from "react-icons/md";

import CreateTask from "~/components/list/task/CreateTask";
import TaskCard from "~/components/list/task/TaskCard";
import Container from "~/components/my-ui/container";
import LoadingAndRetry from "~/components/my-ui/loadingAndRetry";
import ProgressBadge from "~/components/my-ui/progress-badge";
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
      <Link href="/lists">
        <Button variant={"secondary"} className="w-fit">
          <ArrowBigLeft />
        </Button>
      </Link>

      <div className="rounded-xl bg-gray-800 p-4">
        <div className="flex items-center gap-2">
          <ProgressBadge progress={65} icon={<MdLocalMovies />} />
          <h5>{list.name}</h5>
        </div>
        <div className="rounded-lg border-2 px-1 py-4">
          <p className="text-muted-foreground">{list.description}</p>
        </div>
      </div>

      <div className="rounded-xl bg-gray-800 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h5>Tasks</h5>
          <Badge variant="secondary">
            {list.tasks.filter((t) => t.complete).length}/{list.tasks.length}{" "}
            tasks
          </Badge>
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
      </div>
    </Container>
  );
}
