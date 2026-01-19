import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BrushCleaning, EllipsisVertical, Trash } from "lucide-react";

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
      <div className="hover:bg-muted flex items-center rounded-lg border px-2 shadow-sm">
        <ProgressBadge progress={65} icon={<BrushCleaning />} />
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

const ProgressBadge = ({
  progress,
  icon,
}: {
  progress: number;
  icon: React.ReactNode;
}) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex h-22.5 w-22.5 items-center justify-center">
      <svg
        className="absolute -rotate-90"
        width="90"
        height="90"
        viewBox="0 0 112 112"
      >
        {/* radial progress empty bar */}
        <circle
          cx="56"
          cy="56"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-400"
        />
        {/* radial progress filled bar */}
        <circle
          cx="56"
          cy="56"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-green-500 transition-all"
        />
      </svg>

      {/* centered content showing icon and progress */}
      <div className="flex flex-col items-center justify-center gap-2 rounded-full">
        {icon}
        <span className="text-sm font-semibold">{progress}%</span>
      </div>
    </div>
  );
};
