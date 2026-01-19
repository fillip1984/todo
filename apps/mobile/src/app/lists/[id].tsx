import { useEffect, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import { Button, ContextMenu, Host, HStack, Spacer } from "@expo/ui/swift-ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ListDetailType, TaskType } from "@todo/api";

import Container from "~/components/ui/container";
import Typography from "~/components/ui/typography";
import { queryClient, trpc } from "~/utils/api";

export default function ListDetail() {
  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // init form (fetch data, and set fields)
  const params = useLocalSearchParams<"/lists/[id]">();
  const { data: list } = useQuery(
    trpc.list.readById.queryOptions({ id: params.id }),
  );
  useEffect(() => {
    if (list) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(list.name);
      setDescription(list.description ?? "");
    }
  }, [list]);

  // handle updates
  const queryClient = useQueryClient();
  const updateList = useMutation(
    trpc.list.update.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.list.pathFilter());
      },
    }),
  );

  const deleteList = useMutation(
    trpc.list.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.list.pathFilter());
        router.back();
      },
    }),
  );

  if (!list) {
    return (
      <Container>
        <Typography className="text-2xl">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Host matchContents>
        <HStack>
          <Button
            variant="glass"
            systemImage="chevron.left"
            controlSize="large"
            onPress={() => router.back()}
          />
          <Spacer />
          <ContextMenu>
            <ContextMenu.Items>
              <Button
                systemImage="trash"
                onPress={() => deleteList.mutate({ id: params.id })}
              >
                Delete
              </Button>
            </ContextMenu.Items>
            <ContextMenu.Trigger>
              <Button
                variant="glass"
                systemImage="ellipsis"
                controlSize="large"
              ></Button>
            </ContextMenu.Trigger>
          </ContextMenu>
        </HStack>
      </Host>
      <View className="mt-4 overflow-hidden rounded-2xl bg-zinc-700">
        <TextInput
          value={name}
          onChangeText={setName}
          onBlur={() => updateList.mutate({ id: params.id, name, description })}
          className="px-2 py-4 text-xl font-semibold text-white"
          placeholder="List name..."
          placeholderTextColor="#9ca3af"
        />
        <TextInput
          value={description}
          onChangeText={setDescription}
          onBlur={() => updateList.mutate({ id: params.id, name, description })}
          className="min-h-25 border-t px-2 text-lg text-white"
          placeholder="List description..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={3}
        />
      </View>
      <TaskSection list={list} />
    </Container>
  );
}

const TaskSection = ({ list }: { list: ListDetailType }) => {
  const [taskName, setTaskName] = useState("");

  const createTask = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.list.pathFilter());
        setTaskName("");
      },
    }),
  );

  return (
    <View className="mt-4">
      <Typography className="text-4xl">Tasks</Typography>
      <ScrollView contentContainerStyle={{ paddingBottom: 400 }}>
        {list.tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
        <View className="mt-4 overflow-hidden rounded-2xl bg-zinc-700">
          <TextInput
            value={taskName}
            onChangeText={setTaskName}
            className="border-t p-4 text-lg text-white"
            placeholder="Task name..."
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity
          className="mt-1 rounded-2xl bg-blue-600 px-4 py-3"
          onPress={() => createTask.mutate({ name: taskName, listId: list.id })}
        >
          <Typography className="text-center text-2xl font-bold text-white">
            Add Task
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const TaskRow = ({ task }: { task: TaskType }) => {
  const [complete, setComplete] = useState(task.complete);

  const completeTask = useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.list.pathFilter());
      },
    }),
  );
  return (
    <View className="mt-4 flex flex-row overflow-hidden rounded-2xl bg-zinc-700 px-4 py-3">
      <BouncyCheckbox
        isChecked={complete}
        fillColor="blue"
        onPress={(isChecked: boolean) => {
          setComplete(isChecked);
          completeTask.mutate({ ...task, complete: isChecked });
        }}
      />
      <Typography
        variant={complete ? "muted" : "default"}
        size="large"
        className={complete ? "line-through" : ""}
      >
        {task.name}
      </Typography>
    </View>
  );
};
