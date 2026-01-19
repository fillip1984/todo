import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
      <View className="flex flex-row items-center justify-between">
        <Typography className="text-4xl">Tasks</Typography>
        <View className="rounded-full bg-zinc-800 px-2 py-1">
          <Typography className="text-lg text-zinc-400">
            {list.tasks.filter((t) => !t.complete).length}/{list.tasks.length}{" "}
            task
            {list.tasks.length !== 1 ? "s" : ""}
          </Typography>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 400 }}
        showsVerticalScrollIndicator={false}
      >
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
  const [name, setName] = useState(task.name);
  const [isEditingName, setIsEditingName] = useState(false);

  const updateTask = useMutation(
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
          updateTask.mutate({ ...task, name, complete: isChecked });
        }}
      />

      {!isEditingName ? (
        <Pressable onPress={() => setIsEditingName(true)}>
          <Typography
            variant={complete ? "muted" : "default"}
            size="large"
            className={complete ? "line-through" : ""}
          >
            {name}
          </Typography>
        </Pressable>
      ) : (
        <TextInput
          value={name}
          onChangeText={setName}
          onBlur={() => {
            setIsEditingName(false);
            updateTask.mutate({ ...task, name });
          }}
          autoFocus
          className="flex-1 text-lg text-white"
        />
      )}
    </View>
  );
};
