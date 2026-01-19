import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BrushCleaning, EllipsisVertical, Trash } from "lucide-react";

import type { ListSummaryType } from "@todo/api";

import { useTRPC } from "~/trpc/react";
import { calculateProgress } from "~/utils/progress-utils";
import ProgressBadge from "../my-ui/progress-badge";
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
      <div className="flex items-center rounded-lg border px-2 shadow-sm transition-colors ease-in-out hover:bg-gray-700">
        <ProgressBadge
          progress={calculateProgress({
            completed: list.completedTaskCount,
            total: list.taskCount,
          })}
          icon={<BrushCleaning />}
        />
        <div className="flex max-w-[75%] grow flex-col">
          <h2 className="line-clamp-1 text-lg font-semibold">{list.name}</h2>
          <p className="text-muted-foreground line-clamp-2 text-sm">
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
              onClick={(e) => {
                e.preventDefault();
                deleteList.mutate({ id: list.id });
              }}
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
