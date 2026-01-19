"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowBigLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { MdLocalMovies } from "react-icons/md";

import CreateTask from "~/components/list/task/CreateTask";
import TaskCard from "~/components/list/task/TaskCard";
import Container from "~/components/my-ui/container";
import LoadingAndRetry from "~/components/my-ui/loadingAndRetry";
import ProgressBadge from "~/components/my-ui/progressBadge";
import TextFieldEditInPlace from "~/components/my-ui/textFieldEditInPlace";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useTRPC } from "~/trpc/react";
import { calculateProgress } from "~/utils/progress-utils";

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

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    if (list) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(list.name);
      setDescription(list.description ?? "");
    }
  }, [list]);

  const queryClient = useQueryClient();
  const updateList = useMutation(
    trpc.list.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.list.pathFilter());
      },
    }),
  );

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
          <ProgressBadge
            progress={calculateProgress({
              completed: list.tasks.filter((t) => t.complete).length,
              total: list.tasks.length,
            })}
            icon={<MdLocalMovies />}
          />
          <h5 className="w-full">
            <TextFieldEditInPlace
              value={name}
              onChange={setName}
              onBlur={() => updateList.mutate({ ...list, name })}
            />
          </h5>
        </div>

        <p className="text-muted-foreground">
          <TextFieldEditInPlace
            value={description}
            onChange={setDescription}
            onBlur={() => updateList.mutate({ ...list, description })}
          />
        </p>
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
