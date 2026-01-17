import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EllipsisVertical, Trash } from "lucide-react";

import type { ListType } from "@todo/api";

import { useTRPC } from "~/trpc/react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function ListCard({ list }: { list: ListType }) {
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
    <div className="flex rounded-lg border p-4 shadow-sm">
      <div className="flex grow flex-col">
        <h2 className="text-lg font-semibold">{list.name}</h2>
        <p className="text-sm text-gray-600">{list.description}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="icon">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => deleteList.mutate({ id: list.id })}>
            <Trash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
