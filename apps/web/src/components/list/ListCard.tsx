import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BrushCleaning, EllipsisVertical, Trash } from "lucide-react";
import { MdChecklist } from "react-icons/md";

import type { ListSummaryType } from "@todo/api";

import { useTRPC } from "~/trpc/react";
import { calculateProgress } from "~/utils/progress-utils";
import ProgressBadge from "../my-ui/progressBadge";
import { Badge } from "../ui/badge";
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
      <div className="flex h-28 items-center gap-2 rounded-lg border px-2 shadow-sm transition-colors ease-in-out hover:bg-gray-700">
        <ProgressBadge
          progress={calculateProgress({
            completed: list.completedTaskCount,
            total: list.taskCount,
          })}
          icon={<BrushCleaning />}
        />

        <div className="flex h-full grow flex-col pt-2">
          <h2 className="line-clamp-1 text-lg font-semibold">{list.name}</h2>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {list.description && list.description.trim().length > 0
              ? list.description
              : "\u00A0"}
          </p>
          <div className="mt-auto flex pb-1">
            {list.taskCount > 0 && (
              <Badge variant={"outline"} className="align-bottom">
                <MdChecklist />
                {list.completedTaskCount}/{list.taskCount}
              </Badge>
            )}
            {/* TODO: ideas for other badges */}
            {/* <Badge variant={"destructive"} className="ml-2 align-bottom">
              <Flag />
            </Badge>
            <Badge variant={"secondary"} className="ml-2 align-bottom">
              {list.uncompletedHighPriorityTaskCount} High Priority
            </Badge>
            <Badge variant={"outline"} className="ml-2 align-bottom">
              <FaCalendarDay /> 10/1/26
            </Badge> */}
          </div>
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
