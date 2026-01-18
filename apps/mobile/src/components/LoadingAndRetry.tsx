import { ActivityIndicator, Button, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Container from "./ui/container";

export default function LoadingAndRetry({
  isLoading,
  isError,
  retry,
}: {
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}) {
  return (
    <Container>
      {isLoading && (
        <FontAwesome6 name="circle-notch" size={24} color="white" />
      )}

      {isError && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <View style={{ marginBottom: 10 }}>
            <ActivityIndicator size="small" color="#ff0000" />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Button title="Retry" onPress={retry} />
          </View>
        </View>
      )}
    </Container>
  );
}
