import { Pressable } from "react-native";
import { Link } from "expo-router";

import type { ListSummaryType } from "@todo/api";

import Typography from "./ui/typography";

export default function ListCard({ list }: { list: ListSummaryType }) {
  return (
    <Link href={`/lists/${list.id}`} asChild>
      <Pressable className="w-full rounded-lg border border-white p-2">
        <Typography variant={"heading"}>{list.name}</Typography>
        <Typography variant={"muted"}>{list.description}</Typography>
      </Pressable>
    </Link>
  );
}
