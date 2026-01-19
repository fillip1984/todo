import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Network from "expo-network";
import { Link, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  focusManager,
  onlineManager,
  QueryClientProvider,
} from "@tanstack/react-query";

import "react-native-reanimated";
import "~/styles/global.css";

import type { AppStateStatus } from "react-native";
import { useEffect, useState } from "react";
import { AppState, Platform, Text, View } from "react-native";
import { Button, ContextMenu, Host } from "@expo/ui/swift-ui";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { queryClient } from "~/utils/api";
import { authClient } from "~/utils/auth";

export default function RootLayout() {
  // refetch when network connection is restored
  onlineManager.setEventListener((setOnline) => {
    const eventSubscription = Network.addNetworkStateListener((state) => {
      setOnline(!!state.isConnected);
    });
    return () => eventSubscription.remove();
  });

  // refetch when app is made active again
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  //auth
  const { data: session } = authClient.useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    console.log("Session changed:", session);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(!!session?.user);
  }, [session]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <Stack>
          {/* unsecurred locations */}
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />

          {/* secured locations */}
          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen
              name="lists/index"
              options={{
                headerStyle: {
                  backgroundColor: "#000",
                },
                headerBackVisible: false,
                title: "",
                headerLeft: () => (
                  <Host
                    style={{
                      width: 40,
                      height: 40,
                    }}
                  >
                    <ContextMenu>
                      <ContextMenu.Items>
                        <Button
                          systemImage="rectangle.portrait.and.arrow.forward"
                          onPress={() => authClient.signOut()}
                        >
                          Sign out
                        </Button>
                      </ContextMenu.Items>
                      <ContextMenu.Trigger>
                        <Button variant="plain">
                          {/* TODO: having trouble centering icon inside of Button, involved a view to get it mostly correct */}
                          <View className="flex items-center justify-center py-1">
                            <Text className="py-2 text-white">PW</Text>
                          </View>
                        </Button>
                      </ContextMenu.Trigger>
                    </ContextMenu>
                  </Host>
                ),
                headerRight: () => (
                  <Link href={"/lists/CreateListModal"}>
                    <View className="px-4">
                      <FontAwesome6 name="plus" size={24} color="white" />
                    </View>
                  </Link>
                ),
              }}
            />
            <Stack.Screen
              name="lists/CreateListModal"
              options={{
                presentation: "modal",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="lists/[id]"
              options={{
                headerShown: false,
              }}
            />
          </Stack.Protected>
        </Stack>
        <StatusBar style="light" />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
