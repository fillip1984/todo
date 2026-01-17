"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";

import Container from "~/components/my-ui/container";
import LoadingAndRetry from "~/components/my-ui/loadingAndRetry";
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
      <p>{list.description}</p>
    </Container>
  );
}
