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
import { useTRPC } from "~/trpc/react";

export default function HomePage() {
  const trpc = useTRPC();
  const {
    data: lists,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.list.readAll.queryOptions());

  if (isLoading || isError) {
    return (
      <LoadingAndRetry
        isLoading={isLoading}
        isError={isError}
        retry={refetch}
      />
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
    <Container scrollToTopButton={true}>
      <div className="rounded-xl bg-gray-800 p-2">
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
