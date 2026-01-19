"use client";

import { useQuery } from "@tanstack/react-query";
import { SearchX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import CreateList from "~/components/list/CreateList";
import ListCard from "~/components/list/ListCard";
import Container from "~/components/my-ui/container";
import LoadingAndRetry from "~/components/my-ui/loadingAndRetry";
import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { useTRPC } from "~/trpc/react";

export default function HomePage() {
  const trpc = useTRPC();
  const {
    data: lists,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.list.readAll.queryOptions());

  // loading and error view
  if (isLoading || isError) {
    return (
      <>
        <Container>
          <div className="rounded-xl bg-gray-800 p-4">
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4].map((_, index) => (
                <ListSkeleton key={index} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-gray-800 p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-18 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Container>
        {/* Experimenting with skeletons */}
        <LoadingAndRetry
          isLoading={false}
          isError={isError}
          retry={() => void refetch()}
        />
      </>
    );
  }

  // empty view
  if (lists?.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>No Lists Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any lists yet. Get started by creating your
            first list.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex w-full flex-col gap-4">
            <CreateList />
            <Separator />
            <Button variant="outline">Import List</Button>
          </div>
        </EmptyContent>
      </Empty>
    );
  }

  // default view
  return (
    <Container>
      <div className="rounded-xl bg-gray-800 p-4">
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {lists?.map((list) => (
              <motion.div
                key={list.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  delayChildren: 0.2,
                }}
              >
                <ListCard list={list} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="rounded-xl bg-gray-800 p-4">
        <CreateList />
      </div>
    </Container>
  );
}

const ListSkeleton = () => {
  return (
    <div className="flex items-center gap-2 rounded-lg border p-2">
      <Skeleton className="h-22.5 w-22.5 rounded-full" />
      <div className="flex grow flex-col gap-2">
        <Skeleton className="h-4 w-62.5" />
        <Skeleton className="h-2 w-50" />
        <Skeleton className="h-2 w-50" />
      </div>
      <Skeleton className="h-8 w-8" />
    </div>
  );
};
