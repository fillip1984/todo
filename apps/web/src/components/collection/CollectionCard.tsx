import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BrushCleaning, EllipsisVertical, Trash } from "lucide-react";
import { MdChecklist } from "react-icons/md";

import type { CollectionSummaryType } from "@todo/api";

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

export default function CollectionCard({ collection }: { collection: CollectionSummaryType }) {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const deleteCollection = useMutation(
    trpc.collection.delete.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.collection.pathFilter());
      },
    }),
  );

  return (
    <Link href={`/collections/${collection.id}`}>
      <div className="flex h-28 items-center gap-2 rounded-lg border px-2 shadow-sm transition-colors ease-in-out hover:bg-gray-700">
        <ProgressBadge
          progress={calculateProgress({
            completed: collection.completedTaskCount,
            total: collection.taskCount,
          })}
          icon={<BrushCleaning />}
        />

        <div className="flex h-full grow flex-col pt-2">
          <h2 className="line-clamp-1 text-lg font-semibold">{collection.name}</h2>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {collection.description && collection.description.trim().length > 0
              ? collection.description
              : "\u00A0"}
          </p>
          <div className="mt-auto flex pb-1">
            {collection.taskCount > 0 && (
              <Badge variant={"outline"} className="align-bottom">
                <MdChecklist />
                {collection.completedTaskCount}/{collection.taskCount}
              </Badge>
            )}
            {/* TODO: ideas for other badges */}
            {/* <Badge variant={"destructive"} className="ml-2 align-bottom">
              <Flag />
            </Badge>
            <Badge variant={"secondary"} className="ml-2 align-bottom">
              {collection.uncompletedHighPriorityTaskCount} High Priority
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
                deleteCollection.mutate({ id: collection.id });
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
