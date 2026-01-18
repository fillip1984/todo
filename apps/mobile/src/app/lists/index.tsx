import { ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import ListCard from "~/components/ListCard";
import LoadingAndRetry from "~/components/LoadingAndRetry";
import Container from "~/components/ui/container";
import { trpc } from "~/utils/api";

export default function ListsPage() {
  const {
    data: lists,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.list.readAll.queryOptions());

  if (isLoading || isError) {
    return (
      <LoadingAndRetry
        isLoading={isLoading}
        isError={isError}
        retry={refetch}
      />
    );
  }

  return (
    <Container>
      <ScrollView style={{ backgroundColor: "#000" }}>
        <View className="flex gap-2">
          {lists?.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </View>
      </ScrollView>
    </Container>
  );
}
