import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EllipsisVertical, Trash } from "lucide-react";

import type { ListSummaryType } from "@todo/api";

import { useTRPC } from "~/trpc/react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function ListCard({ list }: { list: ListSummaryType }) {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const deleteList = useMutation(
    trpc.list.delete.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.list.pathFilter());
      },
    }),
  );

  return (
    <Link href={`/lists/${list.id}`}>
      <div className="hover:bg-foreground/10 flex rounded-lg border p-4 shadow-sm">
        <div className="flex grow flex-col">
          <h2 className="line-clamp-2 text-lg font-semibold">{list.name}</h2>
          <p className="line-clamp-3 text-sm text-gray-600">
            {list.description}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => deleteList.mutate({ id: list.id })}
            >
              <Trash />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Link>
  );
}
