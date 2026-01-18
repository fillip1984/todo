import { View } from "react-native";
import { Link } from "expo-router";

import type { ListSummaryType } from "@todo/api";

import Typography from "./ui/typography";

export default function ListCard({ list }: { list: ListSummaryType }) {
  return (
    <View className="h-[100px] w-full rounded-lg border border-white p-2">
      <Link href={`/lists/${list.id}`}>
        {/* <Pressable className="w-full rounded-lg border border-white p-2"> */}
        <Typography variant={"heading"}>{list.name}</Typography>
        <Typography variant={"muted"}>{list.description}</Typography>
        {/* </Pressable> */}
      </Link>
    </View>
  );
}
