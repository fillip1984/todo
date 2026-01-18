import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Button, Host } from "@expo/ui/swift-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Container from "~/components/ui/container";
import { trpc } from "~/utils/api";

export default function CreateListModal() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();
  const createList = useMutation(
    trpc.list.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.list.pathFilter());
        router.dismiss();
      },
    }),
  );
  const handleCreateList = () => {
    createList.mutate({ name, description });
  };

  return (
    <Container className="bg-zinc-700 px-1 pt-4">
      <View className="mx-4 mb-2 flex flex-row items-center justify-between">
        <Host
          style={{
            width: 40,
            height: 40,
          }}
        >
          <Button
            variant="glass"
            systemImage="xmark"
            controlSize="large"
            onPress={() => {
              router.back();
            }}
          />
        </Host>
        <Text className="text-2xl text-white">New List</Text>
        <Host
          style={{
            width: 50,
            height: 50,
          }}
        >
          <Button
            variant="glassProminent"
            systemImage="plus"
            controlSize="large"
            onPress={() => {
              handleCreateList();
            }}
            disabled={name.trim().length === 0}
          />
        </Host>
      </View>

      {/* <View className="h-full bg-zinc-800"> */}
      <View className="m-2 overflow-hidden rounded-lg">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="List Name..."
          className="bg-white p-2 text-xl text-black"
        />
        <TextInput
          value={description}
          multiline
          numberOfLines={3}
          onChangeText={setDescription}
          placeholder="Description..."
          className="border-t border-gray-300 bg-white p-2 text-lg text-black"
        />
      </View>
      {/* </View> */}
    </Container>
  );
}
