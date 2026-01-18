import { View } from "react-native";
import { Link } from "expo-router";

import type { ListSummaryType } from "@todo/api";

import Typography from "./ui/typography";

export default function ListCard({ list }: { list: ListSummaryType }) {
  return (
    <Link href={`/lists/${list.id}`}>
      <View className="h-35 w-full rounded-lg border border-white p-2">
        <Typography variant={"heading"} className="line-clamp-1">
          {list.name}
        </Typography>
        <Typography variant={"muted"} className="line-clamp-2">
          {list.description}
        </Typography>
      </View>
    </Link>
  );
}
